# Plugins


1. Vuex 插件就是一个函数，它接收 store 作为唯一参数。其中的`subscribe`方法是任何一次
mutation 的钩子。不懂为什么插件的功能只局限于 mutation 的回调里面
    ```js
    const myPlugin = store => {
        // 当 store 初始化后调用

        store.subscribe((mutation, state) => {
            // 每次 mutation 之后调用
            // mutation 的格式为 { type, payload }
        })
    }
    ```
2. 编写好的插件，可以注册到 store 中，通过 store 的`plugins`选项。该选项是一个数组，
可以接收若干个插件。
3. 在插件中不允许直接修改状态 —— 类似于组件，只能通过提交 mutation 来触发变化。通过提
交 mutation，插件可以用来同步数据源到 store。

```js
// store
const plugin1 = store => {
    console.log('注册插件 plugin1');

    store.subscribe((mutation, state) => {
        if (mutation.type === 'FOR_PLUGIN1'){
            state.num1 = mutation.payload.num;
        }
    })
}
const plugin2 = store => {
    console.log('注册插件 plugin2');

    store.subscribe((mutation, state) => {
        if (mutation.type === 'FOR_PLUGIN2'){
            state.num2 = mutation.payload.num;
        }
    })
}

export const store = new Vuex.Store({
    state: {
        num1: 0,
        num2: 0,
    },
    mutations: {
        FOR_PLUGIN1(){},
        FOR_PLUGIN2(){},
    },
    plugins: [plugin1, plugin2],
});
```
```js
// vm
computed: {
    ...mapState(['num1', 'num2']),
},
mounted(){
    setTimeout(()=>{
        this.$store.commit('FOR_PLUGIN1', {num: 22});
        this.$store.commit('FOR_PLUGIN2', {num: 33});
    }, 2000);
},
```
