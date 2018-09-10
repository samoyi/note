# Action


## 功能
1. Mutation 只适用于同步状态变更，action 实际上相当于 mutation 的代理。
    ```js
    // store
    mutations: {
        increment (state) {
            state.count++;
        },
    },
    actions: {
        async_increment(context){
            setTimeout(()=>{
                context.commit('increment');
            }, 2000);
        },
    },
    ```
    ```js
    // vm
    methods: {
        increment(){
            this.$store.dispatch('async_increment');
        },
    },
    ```
2. 当组件需要异步更新`count`时，不直接`commit('increment')`，而是通过代理的方法
`dispatch('async_increment')`。
3. `async_increment`在收到请求时，先执行异步操作，异步操作结束后，才真正的 commit 来
执行 mutation。
4. 如果是在 mutation 里进行异步操作，那顺序是：mutation —— 快照 —— 异步操作 —— 一段时
间后状态改变；而在 action 里执行异步操作的顺序是：action —— 异步操作 —— 一段时间后执行
mutation —— 状态立刻改变 —— 快照。


## 定义
1. Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用
`context.commit`提交一个 mutation，或者通过`context.state`和`context.getters`来获
取 state 和 getters。
2. context 对象不是 store 实例本身。
3. 实践中，我们会经常用到参数解构来简化代码（特别是我们需要调用 commit 很多次的时候）
    ```js
    actions: {
        async_increment({commit, state, getters, dispatch}){
            setTimeout(()=>{
                commit('increment');
            }, 2000);
        },
    },
    ```


## 分发 Action
1. 上面的例子展示了直接通过`dispatch`来无载荷分发的方法。
2. 同样也可以带上载荷
    ```js
    // store
    mutations: {
        increment (state, payload) {
            state.count += payload.n;
        },
    },
    actions: {
        async_increment(context, payload){
            setTimeout(()=>{
                context.commit('increment', payload);
            }, 2000);
        },
    },
    ```
    ```js
    // vm
    methods: {
        increment(){
            this.$store.dispatch('async_increment', {n: 2});
        },
        // or
        increment(){
            this.$store.dispatch({
                type: 'async_increment',
                n: 2,
            });
        },
    },
    ```
3. 同样，action 也可以通过`mapActions`将 action 定义为实例 method。方法也都是一样的。
    ```js
    // vm
    methods: {
        ...mapActions({
            increment: 'async_increment',
        }),
    },
    ```
    ```html
    <div @click="increment({n: 2})">
        {{count}}
    </div>
    ```


## 获取 action 完成通知
1. 加入你提交了一个付款的 action，你希望完成后收到通知进行一些其他操作比如提示付款成功。
2. 上面的例子中，只能在 action 的异步回调进行 store 状态更改，组件并不能加入回调机制。
3. 实际上，`dispatch`方法可以返回一个 Promise 实例，这样，组件就可以在 method 里加入
回调
    ```js
    // store
    actions: {
        increment({commit}){
            return new Promise((resolve, reject)=>{
                setTimeout(()=>{
                    commit('increment');
                    resolve();
                }, 1000);
            });
        },
    },
    ```
    ```js
    // vm
    methods: {
        increment(){
            this.$store.dispatch('increment')
            .then(()=>{
                console.log('Action done');
            });
        }
    },
    ```


## 组合 Action
1. 有时存在两个或多个异步行为，必须按顺序完成。即一个异步提交完成后才能进行下一个。
2. 既然有机会在一个 action 完成时使用回调，那在这个回调里就可以进行下一个 action，从而
形成组合 action。
3. 在上面的例子中，直接把`then`回调里面的`console.log`换成下一个 dispatch，就可以组合
两个有顺序要求的异步操作。
4. 还可以使用下面这种嵌套式的组合 action
    ```js
    actions: {
        actionB ({ dispatch, commit }) {
            return dispatch('actionA').then(() => {
                commit('someOtherMutation')
            })
        }
    }
    ```
    假设要先执行完成 actionA 中的异步操作，完成后才能执行 actionB 中的操作。现在组件里
    提交了 actionB，但在内部会首先执行 actionA，在其完成的回调里，才会执行后续操作，完
    成 actionB。
5. 使用`async`/`await`可以更有条例的定义组合 action
    ```js
    // 假设 getData() 和 getOtherData() 返回的是 Promise

    actions: {
        async actionA ({ commit }) {
            commit('gotData', await getData())
        },
        async actionB ({ dispatch, commit }) {
            await dispatch('actionA') // 等待 actionA 完成
            commit('gotOtherData', await getOtherData())
        }
    }
    ```
6. 文档中最后的一段话不懂：It's possible for a `store.dispatch` to trigger
multiple action handlers in different modules. In such a case the returned value
will be a Promise that resolves when all triggered handlers have been resolved.
`store.dispatch` 可以像上面的例子一样链式的触发多个多个 action 可以理解，但是怎么在不
同的模块中触发？看起来不像是说下面这种情况：
    ```js
    // store
    actions: {
        actionA(){
            return new Promise((resolve)=>{
                setTimeout(()=>{
                    resolve();
                }, 1000);
            });
        },
        actionB({dispatch}){
            return new Promise((resolve)=>{
                dispatch('actionA').then(()=>{
                    setTimeout(()=>{
                        resolve();
                    }, 3000);
                });
            });
        },
    },
    ```
    ```js
    // vm
    methods: {
        increment(){
            this.$store.dispatch('actionB')
            .then(()=>{
                console.log('4秒钟之后输出');
            });
        }
    },
    ```
