# Getter



# 功能
1. 基于应用的需求，某些 `state` 中的数据可能需要加工才能使用。
2. 如果只有一两个组件需要用到某个加工数据，则加工的工作可以丢给组件去做。但如果有更多的组件都要用到相同的加工数据，那最好还是在 store 里加工好直接提供给组件。


## 定义
1. Vuex 允许我们在 store 中定义 “getter”。getter 是 store 的计算属性，基于 `state` 中的数据。
2. Getter 接受 state 作为其第一个参数，也可以接受 `getters` 作为第二个参数
    ```js
    state: {
        name: '33',
        age: 22,
        friends: ['Hime', 'Hina'],
    },
    getters: {
        friends(state){
            return state.friends.join(' & ');
        },
        greeting(state, getters){
            return `Hi, I'm ${state.name}, ${state.age} years old.
                    I like ${getters.friends}`;
        },
    },
    ```
3. getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算，即响应依赖变化时自动重新调用。
4. 注意，这里所说的响应依赖，**依赖只是 state 和 getter**，而不包括其他内容。例如如果想根据路由来计算，则只会计算一次，之后路由变化并不会响应式的重新计算
    ```js
    isShowMenu (state, getters) {
        // 路由切换时，router.currentRoute.path 会变化，但这个 getter 不会被重新调用，因此不能响应路由变化
        pathsShouldShowMenu.includes(router.currentRoute.path);
    },
    ```


## 访问
Getter 会暴露为`store.getters`对象
```js
computed: {
    greeting(){
        return this.$store.getters.greeting;
    },
},
```


## 通过方法访问
1. 上面定义的 getter，实例在访问时的值都是确定的。
2. 你也可以通过让 getter 返回一个函数，来实现给 getter 传参。
    ```js
    // store
    state: {
        name: '33',
        age: 22,
    },
    getters: {
        greeting(state){
            return function(friends){
                return `Hi, I'm ${state.name}, ${state.age} years old.
                I like ${friends.join(' & ')}`;
            }
        },
    },
    ```
    ```js
    // vm
    computed: {
        greeting(){
            return this.$store.getters.greeting(['22', '33']);
        },
    },
    ```
3. getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果。


## 缓存策略
1. 以下 store 代码进行测试
    ```js
    let outerCount = 1;

    const store = new Vuex.Store({
        state: {
            count: 9
        },
        mutations: {
            increment(state) {
                state.count += 1;
            }
        },
        getters: {
            count(state) {
                debugger;
                return outerCount || state.count;
            }
        }
    });
    ```
2. getter `count` 内部会根据一个外部变量 `outerCount` 和 state 属性 `count` 来求值。
3. 但 `outerCount` 因为不是 state 属性或者 getter，因此不作为依赖。也就是说，它的变化并不会触发 `count` 更新缓存。

### 存在非依赖值时的缓存规则比较奇怪
1. 执行如下
    ```js
    console.log(store.getters.count) // 1    初次读取，触发一次求值

    store.commit('increment');

    console.log(store.getters.count) // 1   state.count 变了，但优先读取的是 outerCount
    console.log(store.state.count) // 10
    ```
2. 打印的结果没什么问题。但是，`outer` 只进行了一次求值。`state.count` 变化的时候，读取 `getters.count` 并没有触发重新求值。
3. 但是如果我把 `outerCount` 初始值设为 0，即 `let outerCount = 0;`，执行结果就不同了
    ```js
    console.log(store.getters.count) // 9    初次读取，触发一次求值

    store.commit('increment');

    console.log(store.getters.count) // 10   outerCount 是 0，所以会读取到 state.count
    console.log(store.state.count) // 10
    ```
4. 但是这次 `outer` 只进行了一次求值。
5. 看起来就像，第一次的时候 Vuex 知道 `outerCount` 是一个真值，所以 `state.count` 变了也没有用，所以不会触发第二次求值；而第二次的时候 Vuex 知道了 `outerCount` 是一个假值，所以 `state.count` 变化会生效，所以会触发第二次求值。
6. 还没有看源码，但 Vuex 是怎么实现这样的逻辑的？再此基础上，后面再加上以下四行代码验证一下
    ```js
    outerCount = 1;
    store.commit('increment')
    console.log(store.getters.count) // 1
    console.log(store.state.count) // 11
    ```
7. 现在，既然 `outerCount` 又变成了真值，那 Vuex 就知道 `state.count` 变化会生效，因此会触发第三次求值。事实上也确实触发了。
8. 发现这个问题是因为在实践项目中 getter 中出现了类似这样的情况，只不过不是使用的变量而是使用的 localStorage。
9. 总之尽量不要在 getter 中使用非依赖的数据。如果使用，就应该使用上面的方法访问，每次都进行函数调用进行求值，而不是使用缓存。


## `mapGetters`
1. 相比于 `mapState` 的对象字符串、对象函数和数组的三种形式，`mapGetters` 只支持对象字符串和数组的形式。
2. 不懂为什么不能和 `mapState` 一样设置为函数。要说是因为用处不大，但 `mapState` 中设为函数用处也没有比这里大吧

```js
...mapGetters({
    // 不能使用函数
    // is80s: ()=>true,
    // [vuex] unknown getter: function is80s() {
    //     return true;
    // }
}),
```