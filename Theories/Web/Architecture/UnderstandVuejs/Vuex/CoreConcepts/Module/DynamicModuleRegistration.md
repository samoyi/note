# Dynamic Module Registration

1. 在 store 创建之后，你可以使用`store.registerModule`方法注册模块
    ```js
    // store
    const moduleA = {
        state: {
            name: 'a',
        },
    };

    export const store = new Vuex.Store({
        modules: {
            a: moduleA,
        },
    });
    ```
    ```js
    // vm
    export default {
        beforeCreate(){
            // 注册模块 b
            this.$store.registerModule('b', {
                state: {
                    name: 'b',
                },
            });

            // 给模块 b 再注册一个子模块 inner
            this.$store.registerModule(['b', 'inner'], {
                state: {
                    name: 'inner',
                },
            });
        },
        computed: {
            ...mapState({
                a_name: state=>state.a.name,
                b_name: state=>state.b.name,
                inner_name: state=>state.b.inner.name,
            }),
        },
    }
    ```
2. 你也可以使用`store.unregisterModule(moduleName)`来动态卸载模块。注意，你不能使用
此方法卸载静态模块（即创建 store 时声明的模块）。不懂为什么写在子模块会报错
    ```js
    this.$store.unregisterModule('inner');
    // TypeError: Cannot read property 'runtime' of undefined

    // this.$store.unregisterModule('b.inner'); // 一样报错
    ```
3. `preserveState` 不懂。
