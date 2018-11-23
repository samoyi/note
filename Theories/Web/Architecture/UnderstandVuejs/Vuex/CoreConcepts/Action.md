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
        myIncrement(){
            this.$store.dispatch('async_increment');
        },
    },
    ```
2. 当组件需要异步更新`count`时，不直接`commit('increment')`，而是通过代理的方法
`dispatch('async_increment')`。
3. `async_increment`在收到请求时，先执行异步操作，异步操作结束后，才真正的 commit 来
执行 mutation。
4. 如果是在 mutation 里进行异步操作，那顺序是：mutation —— 快照(快照这时记录的状态值
还没有发生改变) —— 异步操作 —— 一段时间后状态改变(其实应该在这里才进行快照)；而在
action 里执行异步操作的顺序是：action —— 异步操作 —— 一段时间后执行 mutation —— 状态
立刻改变 —— 快照。


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
        myIncrement(){
            this.$store.dispatch('async_increment', {n: 2});
        },
        // or
        myIncrement(){
            this.$store.dispatch({
                type: 'async_increment',
                n: 2,
            });
        },
    },
    ```
3. 同样，action 也可以通过`mapActions`将 action 定义为实例 method。方法也都是一样的，
即支持对象字符串形式和数组形式

    ```js
    // vm
    methods: {
        ...mapActions({
            myIncrement: 'async_increment',
        }),
    },
    ```
    ```html
    <div @click="myIncrement({n: 2})">
        {{count}}
    </div>
    ```


## 获取 action 完成通知
1. 假如你提交了一个付款的 action，你希望完成后收到通知进行一些其他操作比如提示付款成功。
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
    // store

    // 预先定义的 sleep 函数用来模拟异步
    // function sleep(ms){
    //     return new Promise((resolve)=>{
    //         setTimeout(resolve, ms);
    //     });
    // }

    actions: {
        async decrement({commit}, payload){
            await sleep(2000);
            commit('decrement', payload);
        },
        async increment({commit, dispatch}, payload){
            // 先执行 increment 的异步
            await sleep(2000);
            commit('increment', payload);
            // 返回结果后再 执行后续的 action
            await dispatch('decrement', {num: 22});
        },
    }
    ```
    ```js
    // vm
    async myIcrement(){
        await this.$store.dispatch('increment', {num: 100});
        console.log('完成！');
    },
    ```
6. 一个`store.dispatch`在不同模块中可以触发多个 action 函数。在这种情况下，只有当所有
触发函数完成后，返回的 Promise 才会执行。
    ```js
    // store
    modules: {
        hello: {
            actions: {
                async console(){
                    await sleep(2000);
                    console.log('hello');
                },
            },
        },
        world: {
            actions: {
                async console(){
                    await sleep(4000);
                    console.log('world');
                },
            },
        },
    }
    ```
    ```js
    // vm
    methods: {
        async myIcrement(){
            await this.$store.dispatch('console');
            console.log('hello world');
            // 两秒钟之后打印`"hello"`，四秒钟之后打印`"world"`，
            // 紧接着打印`"hello world"`
        }
    },
    ```
