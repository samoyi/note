# Computed Properties

本篇分析和 demo 实现都是基于[这篇文章](https://skyronic.com/blog/vuejs-internals-computed-properties)
。但文章中并没有实现缓存，这里加上了缓存。


## 计算属性的特点
### 依赖
* 可以依赖`data`的属性，也可以依赖其他的计算属性。而且和顺序没有关系
    ```js
    new Vue({
        el: '#components-demo',
        computed: {
            total(){
                return this.temp + 1;
            },
            temp(){
                return this.num1 + this.num2;
            },
        },
        data: {
            num1: 22,
            num2: 33,
        },
    });
    ```

### 基于依赖的缓存
* 计算属性的函数类似于计算属性的 getter 函数，但又不完全相同。因为计算属性可以缓存结果。


## 实现原理
```js
new Vue({
    el: '#example',
    data: {
        message: 'Hello'
    },
    computed: {
        reversedMessage: function () {
            return this.message.split('').reverse().join('')
        }
    }
})
```

### 依赖的实现
1. 创建实例的时候，Vue 会发现参数中有`computed`属性，进而发现有一个`reversedMessage`，
知道它是一个计算属性。
2. 但是 Vue 是怎么知道`reversedMessage`依赖谁的？虽然可以一眼看出来依赖的是`message`,
但程序并不能做到。
3. 但 Vue 不关心在这里`reversedMessage`依赖的是谁，它可能依赖任何一个属性。
4. 当一个计算属性被访问的时候，它也不知道自己依赖的是谁。但是它会放出去一个更新函数，这
个函数的作用是：如果我的依赖项更新了，就用这个函数把新值传给我。
5. 现在的问题是，它所依赖的数据`message`怎么知道自己是被`reversedMessage`依赖的。
6. 实际上`message`也不知道自己被依赖了。但`reversedMessage`的计算属性函数会触发
`message`的 getter。
7. `message`现在被访问了，但不能立刻知道这是直接访问还是通过其他的计算属性访问。
8. 它要看看外面有没有某个被放出的更新函数，如果有的话，那就证明这是一次计算属性访问，并
且知道自己需要用这个更新函数去更新某个不知道是谁的计算属性。
9. 它会在返回自己的值之前把这个更新函数收藏起来，当自己的值发生变化时，会在 setter 里调
用这个更新函数通知依赖自己的计算属性。
9. `reversedMessage`获得了`message`的返回之后，就把刚才放出去到公共区域的更新函数删除
，不影响其他计算属性的更新函数放出，也不影响非计算属性的直接访问。
10. 这样，就完成了依赖的绑定。

### 缓存的实现
1. 第一次访问`reversedMessage`肯定无缓存可用，必须要计算。然后就可以把计算的结果缓存起
来。
2. 如果`message`没有更新，那下次访问`reversedMessage`，它返回的缓存依然是正确的。
3. 如果`message`更新了，即执行了 setter，`reversedMessage`的那个更新函数就会被执行，
`reversedMessage`的缓存值就会发生变化。
4. 下一次访问`reversedMessage`，它返回的缓存就是更新之后的了。


## 根据前述文章的实现
### 先实现一个最简陋的计算属性
```js
function defineComputed (obj, key, computeFunc) {
    function onDependencyUpdated(){
        // 如果实现，这里会刷新计算属性缓存
    }

    Object.defineProperty (obj, key, {
        get: function(){
            return computeFunc();
        },
    })
}
```
1. `defineComputed`会在`obj`上定义个名为`key`的计算属性，当对`obj.key`求值时，会调用
`computeFunc`，`computeFunc`里会包含至少一个`obj.key`所依赖的值。`computeFunc`的返
回值作为`obj.key`的值。
2. 计算属性的定义和使用就是这个逻辑。
3. `obj.key`的依赖更新时，`onDependencyUpdated`会被调用，对计算属性缓存重新求值。不过
这里暂时没有实现缓存功能。
4. 实际使用以下这个函数定义一个计算属性：
    ```js
    function computeFunc(){
        if (person.age < 18) {
            return 'minor';
        }
        else {
            return 'adult';
        }
    }

    let person = {age: 22};
    defineComputed(person, 'status', computeFunc);

    console.log (person.status); // adult
    person.age = 17;
    console.log (person.status); // minor
    ```
5. 可以看到，`age`的变化将影响计算属性`status`的变化。
6. 和真正的计算属性相比，还差缓存的功能。

### 实现缓存
1. 上面没有用到的`onDependencyUpdated`是用来通知计算属性依赖是否有变化的，所以当依赖发
生变化时，需要在依赖的 setter 里调用这个函数，来通知计算属性更新值。
2. 这就需要两点：把依赖也变成访问器属性，在依赖的 setter 里也能访问到所有依赖它的计算属
性的`onDependencyUpdated`。
3. 在外部设置一个依赖管理器，用来把计算属性的`onDependencyUpdated`传递给依赖的属性
```js
let Dep = {
  target: null
};
```
4. 当第一次访问一个计算属性时，要先把它的`onDependencyUpdated`通过依赖管理器`Dep`传递
给它所依赖的属性
    ```js
    function defineComputed(obj, key, computeFunc){
        let cache; // 计算属性的缓存值
        let bInitRead = true; // 是否是第一次访问该计算属性

        // 这个函数就是依赖更新时要执行的，用来通知计算属性更新它缓存的值
        function onDependencyUpdated(){
            cache = computeFunc();
        }
        Object.defineProperty(obj, key, {
            get: function(){
                // 只有在第一次访问该计算属性的时候才需要提交依赖关系
                if (bInitRead){
                    Dep.target = onDependencyUpdated; // 先传给 Dep，
                    // computeFunc 是计算属性的方法，里面会访问依赖的属性
                    // 访问依赖的属性时，其 getter 会从 Dep 读取到 onDependencyUpdated
                    // 依赖的属性会保存下来这个 onDependencyUpdated，当属性值发生变化时，
                    // 调用这个 onDependencyUpdated，通知其对应的计算属性
                    cache = computeFunc();
                    // 当一个计算属性提交完它的 onDependencyUpdated 之后，就清空 Dep，
                    // 供下一次其他计算属性提交 onDependencyUpdated
                    Dep.target = null;

                    bInitRead = false;
                }

                return cache;
            },
        })
    }
    ```
5. 上一步保证了一个计算属性提交了自己的更新函数，下面看看依赖属性是怎么接收计算属性的更
新函数的。为了接收更新函数，以及为了属性值变化时可以执行更新函数，依赖属性也要变成访问器
属性
```js
// 这个函数将依赖属性定义为访问器属性
function defineReactive (obj, key, val) {
    // deps 会记录若干个计算属性提交的 onDependencyUpdated，因为一个属性可能被好几个
    // 计算属性依赖
    let deps = [];

    Object.defineProperty (obj, key, {
        get: function () {
            // 计算属性只有在第一次被访问的时候才会提交 onDependencyUpdated，那这里
            // 的 deps.indexOf(Dep.target) === -1 是不是就没什么必要了
            if (Dep.target && deps.indexOf(Dep.target) === -1) {
                // 将新的更新函数记下来
                deps.push(Dep.target);
            }
            return val;
        },
        set: function (newValue) {
            // 依赖的属性值发生了改变
            if (newValue !== val){
                val = newValue;
                // 需要通知所有依赖该属性的计算属性
                for (let i = 0; i < deps.length; i++) {
                    deps[i]();
                }
            }
        }
    })
}
```
6. 测试
    ```js
    var person = {};
    defineReactive (person, 'age', 16);

    defineComputed (person, 'status', function () {
        console.log('没有使用缓存'); // 测试是否使用了缓存
        if (person.age > 18) {
            return 'Adult'
        }
        else {
            return 'Minor'
        }
    });

    // 四次访问，只有第一次和依赖更新后没使用缓存
    console.log(person.status);
    console.log(person.status);
    console.log(person.status);
    person.age = 22;
    console.log(person.status);
    ```


## References
* [Vue.js Internals: How computed properties work](https://skyronic.com/blog/vuejs-internals-computed-properties)
