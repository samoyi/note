# Dynamic Module Registration

1. 在 store 创建之后，你可以使用`store.registerModule`方法注册模块
    ```js
    // store
    const moduleA = {
        state: {
            name: 'a',
        },
    };

    export default new Vuex.Store({
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
2. 你也可以使用`store.unregisterModule(moduleName)`来动态卸载模块，需要传入和创建时
同样的参数。注意，你不能使用此方法卸载静态模块（即创建 store 时声明的模块）。
    ```js
    this.$store.unregisterModule('b');
    this.$store.unregisterModule(['b', 'inner']);
    ```
3. 如果使用`preserveState`选项，则动态注册同名模块时，state 不会覆盖已有同名模块的 
state
    ```html
    <template>
        <div class="hello">
            {{ name }} <br />
            {{ age }} <br />
        </div>
    </template>
    <script>
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
    import {sleep} from '../libs/helper'

    export default {
        name: 'HelloWorld',
        computed: {
            ...mapState({
                name: state=>state.hello.name, // Hime
            }),
            age(){
                return this.$store.state.hello.age;
            },
        },
        async mounted(){
            await sleep(2000);
            this.$store.registerModule('hello', {
                state: {
                    age: 17,
                },
            }, { preserveState: true });
        }
    }
    </script>
    ```
    开始时页面只显示`Hime`，注册了同名模块`hello`后，如果不带`preserveState`，则新的
    state 对象会覆盖原模块的 state，导致页面上只显示`17`。加上该参数后，新注册的同名模
    块的 state 就不会被使用，即页面上仍然显示`Hime`。
4. 动态注册和卸载模块并不会在中体现，查看该 [issue](https://github.com/vuejs/vue-devtools/issues/282)
