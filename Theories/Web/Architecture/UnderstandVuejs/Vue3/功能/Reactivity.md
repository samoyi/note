# Reactivity


## shallowReactive



## 响应式代理 vs. 原始对象
1. `reactive()` 返回的是一个原始对象的 Proxy，它和原始对象是不相等的
    ```js
    const raw = {}
    const proxy = reactive(raw)

    console.log(proxy === raw) // false
    ```
2. 只有代理对象是响应式的，更改原始对象不会触发更新。因此，使用 Vue 的响应式系统的最佳实践是仅使用你声明对象的代理版本。
3. 为保证访问代理的一致性，对同一个原始对象调用 `reactive()` 会总是返回同样的代理对象
    ```js
    const proxy1 = reactive(raw)
    const proxy2 = reactive(raw)

    console.log(proxy1 == proxy2) // true
    ```
4. 而对一个已存在的代理对象调用 `reactive()` 会返回其本身
    ```js
    const proxy1 = reactive(raw)
    const proxy2 = reactive(proxy1)

    console.log(proxy1 == proxy2) // true
    ```
5. 这个规则对嵌套对象也适用。依靠深层响应性，响应式对象内的嵌套对象依然是代理
    ```js
    const proxy = reactive({})

    const raw = {}
    // 新添加了一个属性，并引用一个对象。但引用的不是 raw 本身，而是 raw 的代理
    // 新添加的嵌套的引用类型属性也会自动的使用 proxy 实现响应式
    proxy.nested = raw

    console.log(proxy.nested === raw) // false
    ```

### 选项式 API 看起来更费解
```js
export default {
  data() {
    return {
      someObject: {}
    }
  },
  mounted() {
    const newObject = {}
    this.someObject = newObject

    console.log(newObject === this.someObject) // false
  }
}
```
当你在赋值后再访问 `this.someObject`，此值已经是原来的 `newObject` 的一个响应式代理。看起来是在这个赋值操作时进行了 proxy 代理。TODO


## 用 `ref()` 定义响应式变量
1. 因为 Proxy 只能应用于引用类型
    ```js
    const proxy = reactive(22) // Warn: value cannot be made reactive: 22
    proxy = 33; // TypeError: Assignment to constant variable.
    ```
2. 这就很自然的导致当传递响应式对象的基础类型属性时，就将失去响应性
    ```js
    const state = reactive({ count: 0 })

    // n 是一个局部变量，同 state.count
    // 失去响应性连接
    let n = state.count
    // 不影响原始的 state
    n++
    ```
    ```js
    const state = reactive({ count: 0 })

    // count 也和 state.count 失去了响应性连接
    let { count } = state
    // 不会影响原始的 state
    count++
    ```
    ```js
    const state = reactive({ count: 0 })

    // 该函数接收一个普通数字，并且将无法跟踪 state.count 的变化
    callSomeFunction(state.count)
    ```
3. 为了解决这个问题，Vue3 定义了 `ref()` 函数，把基础类型包装为引用类型
    ```js
    const num = ref(22)

    onMounted (() => {
        setTimeout(() => {
            num.value = 33;
        }, 2222)
    })
    ```
    ```html
    <!-- 渲染的时候不需要访问 .value -->
    <h1>{{ num }}</h1>
    ```
4. 如果 `ref` 的参数是引用类型，则内部还是会用 `reactive`。而且，此时的 ref.value 如果引用另一个对象，则该对象也会是响应式的
    ```js
    const objectRef = ref({ count: 0 })

    // 这是响应式的替换
    objectRef.value = { num: 1 }

    onMounted (() => {
    setTimeout(() => {
        objectRef.value.num = 22;
    }, 2222)
    })
    ```
    ```html
    <h1>{{ objectRef.num }}</h1>
    ```

### ref 在模板中的解包（Unwrapping）
1. 当一个 ref 被嵌套在一个响应式对象中，作为属性被访问或更改时，它会自动解包，因此会表现得和一般的属性一样
    ```js
    const count = ref(0)
    const state = reactive({
        count
    })

    console.log(state.count) // 0

    state.count = 1
    console.log(count.value) // 1
    ```
2. 只有当嵌套在一个深层响应式对象内时，才会发生 ref 解包。当其作为浅层响应式对象的属性被访问时不会解包。

### 数组和集合类型的 ref 解包​
跟响应式对象不同，当 ref 作为响应式数组或像 Map 这种原生集合类型的元素被访问时，不会进行解包。
```js
const books = reactive([ref('Vue 3 Guide')])
console.log(books[0].value) // Vue 3 Guide

const map = reactive(new Map([['count', ref(0)]]))
console.log(map.get('count').value) // 0
```


## 选项式 API 时的有状态方法​
1. 在某些情况下，我们可能需要动态地创建一个方法函数，比如创建一个预置防抖的事件处理器
    ```js
    import { debounce } from 'lodash-es'

    export default {
        methods: {
            // 使用 Lodash 的防抖函数
            click: debounce(function () {
                // ... 对点击的响应 ...
            }, 500)
        }
    }
    ```
2. 不过这种方法对于被重用的组件来说是有问题的，因为这个预置防抖的函数是有状态的：它在运行时维护着一个内部状态。如果多个组件实例都共享这同一个预置防抖的函数，那么它们之间将会互相影响。
3. 要保持每个组件实例的防抖函数都彼此独立，我们可以改为在 `created` 生命周期钩子中创建这个预置防抖的函数，这样每个组件实例都会在该生命周期是创建自己的防抖函数到自己的实例上
    ```js
    export default {
        created() {
            // 每个实例都有了自己的预置防抖的处理函数
            this.debouncedClick = _.debounce(this.click, 500)
        },
        unmounted() {
            // 最好是在组件卸载时
            // 清除掉防抖计时器
            this.debouncedClick.cancel()
        },
        methods: {
            click() {
                // ... 对点击的响应 ...
            }
        }
    }
    ```


## References
* [响应式基础](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html)