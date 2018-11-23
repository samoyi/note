# Namespacing

1. 默认情况下，模块内部的 action、mutation 和 getter 是注册在全局命名空间的
2. 如果希望你的模块具有更高的封装度和复用性，你可以通过添加`namespaced: true`的方式使
其成为带命名空间的模块。
3. 当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整
命名。

```js
// store.js
const moduleA = {
    namespaced: true,
    state: { // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性不会对其产生影响
        age: 22, // -> state.a.age
    },
    getters: {
        isAdmin () { // -> getters['b/isAdmin']
            return 'a_isAdmin';
        },
    },
};

const moduleB = {
    namespaced: true,

    state: { // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性不会对其产生影响
        age: 33, // -> state.b.age
    },
    getters: {
        // 和 moduleA 的同名，但因为有命名空间所以不会冲突
        isAdmin () { // -> getters['b/isAdmin']
            return 'b_isAdmin';
        },
    },
    mutations: {
        increment (state) { // -> commit('b/increment')
            state.age++;
        },
    },
    actions: {
        increment ({commit}) { // -> dispatch('b/increment')
            commit('increment');
        },
    },

    // 嵌套模块
    modules: {
        // 继承父模块的命名空间
        myPage: {
            getters: {
                profile () { // -> getters['b/profile']
                    return 'myPage-profile';
                },
                // isAdmin () {}, // 这里不能重复定义
            },
        },

        // 进一步嵌套命名空间
        posts: {
            namespaced: true,

            getters: {
                isAdmin () { // 这里可以再定义同名的，因为又有了嵌套命名空间
                    return 'posts_isAdmin';
                },
            },
            mutations: {
                done () { // -> commit('b/posts/login')
                    console.log('done');
                },
            },
        },
    },
};

export default new Vuex.Store({
    modules: {
        a: moduleA,
        b: moduleB,
    },
});
```
```js
// index.js
import store from './store.js';

new Vue({
	store,
	el: '#app',
	computed: {
		aAge(){
			return this.$store.state.a.age;
		},
		bAge(){
			return this.$store.state.b.age;
		},
		aIsAdmin(){
			return this.$store.getters['a/isAdmin'];
		},
		bIsAdmin(){
			return this.$store.getters['b/isAdmin'];
		},
		myPageProfile(){
			return this.$store.getters['b/profile'];
		},
		postsIsAdmin(){
			return this.$store.getters['b/posts/isAdmin']
		},
	},
	mounted(){
		setTimeout(()=>{
			this.$store.dispatch('b/increment');
			this.$store.commit('b/posts/done');
		}, 2000);
	},
});
```


## Global getters
1. 在命名空间模块里，因为 getters 也变成局部的了，所以在 getter 的第二个参数以及
action 的`context.getters`也都是局部的了。
2. 如果要在命名空间模块里访问全局的 getter，这里有了和 root state 类似的 root
getters。可以通过 getter 的第四个参数以及 action 的`context.rootGetters`访问。
3. 和 root state 一样，root getters 不仅包括 root 中的 getter，也包括所有模块的
getter。
4. 下面四个`console.log`的输出都是
`["root_getter", "a/a_getter", "b/b_getter", "b/page_getter", "b/posts/posts_getter"]`
，顺序看起来也很合理。
    ```js
    const moduleA = {
        namespaced: true,
        getters: {
            a_getter(state, getters, rootState, rootGetters){
                console.log(Object.keys(rootGetters));
            },
        },
    };

    const moduleB = {
        namespaced: true,
        getters: {
            b_getter(state, getters, rootState, rootGetters){
                console.log(Object.keys(rootGetters));
            },
        },
        modules: {
            myPage: {
                getters: {
                    page_getter(state, getters, rootState, rootGetters){
                        console.log(Object.keys(rootGetters));
                    },
                },
            },

            // 进一步嵌套命名空间
            posts: {
                namespaced: true,
                getters: {
                    posts_getter(state, getters, rootState, rootGetters){
                        console.log(Object.keys(rootGetters));
                    },
                },
            },
        },
    };

    export default new Vuex.Store({
        modules: {
            a: moduleA,
            b: moduleB,
        },
        getters: {
            root_getter(state, getters, rootState, rootGetters){
                console.log(Object.keys(rootGetters));
            },
        },
    });
    ```


## 在带命名空间的模块注册全局 action
1. 若需要在带命名空间的模块注册全局 action，需要把这个 action 注册为一个对象类型，该对
象可添加属性`root: true`，并用`handler`定义 action 的处理函数。
2. 虽然是定义成了全局 action，但是参数 context 仍然是模块内的
    ```js
    const moduleB = {
        namespaced: true,
        state: {
            age: 23,
        },
        actions: {
            b_action: {
                root: true,
                handler(ctx){
                    console.log('global_action');
                    console.log(ctx.state.age); // 23
                },
            },
        },
    };

    export const store = new Vuex.Store({
        modules: {
            b: moduleB,
        },
        state: {
            age: 22,
        },
    });
    ```
3. 在组件实例里要通过全局的方式来 dispatch
    ```js
    this.$store.dispatch('b_action');
    ```
4. 不懂。为什么要注册为全局？通过命名空间的形式来 dispatch 有什么不方便吗？
5. 在不带命名空间的模块里也可以这样注册 action，但没什么意义


## Binding Helpers with Namespace
1. 默认情况下，对带有命名空间的模块使用 Binding Helpers 有些复杂，在组件里的每一次引用
都要带上完整的路径
    ```js
    // store
    const moduleB = {
        namespaced: true,
        state: {
            b_age: 23,
        },
        getters: {
            b_getter(){
                return 'b_getter';
            },
        },
        mutations: {
            b_mutation(state, payload){
                console.log(payload.name); // "b_mutation"
            },
        },
        actions: {
            b_action(ctx, payload){
                console.log(payload.name); // "b_action"
            },
        },
        modules: {
            inner: {
                state: {
                    inner_age: 24,
                },
            },
            inner_ns: {
                namespaced: true,
                state: {
                    inner_ns_age: 25,
                },
            },
        },
    };

    export default new Vuex.Store({
        modules: {
            b: moduleB,
        },
        state: {
            root_age: 22,
        },
    })
    ```
    ```html
    <!-- template -->
    <div id="app">
        <p>
            <input type="button" value="b_mutation"
                @click="b_mutation({name: 'b_mutation'})" />
            <input type="button" value="b_action"
                @click="foo({name: 'b_action'})" />
        </p>
        <p>
            {{root_age}}      <!-- 22 -->
            {{b_age}}         <!-- 23 -->
            {{inner_age}}     <!-- 24 -->
            {{inner_ns_age}}  <!-- 25 -->
            {{b_getter}}      <!-- b_getter -->
        </p>
	</div>
    ```
    ```js
    // vm
    new Vue({
    	store,
    	el: '#app',
    	computed: {
            ...mapState({
                root_age: 'root_age',
                // 不能这样，这是命名空间的方式，而 state 和命名空间无关
                // b_age: 'b/b_age',
                b_age: state=>state.b.b_age,
                inner_age: state=>state.b.inner.inner_age,
                inner_ns_age: state=>state.b.inner_ns.inner_ns_age,
            }),
            ...mapGetters({
                b_getter: 'b/b_getter',
            }),
        },
        methods: {
            ...mapMutations({
                b_mutation: 'b/b_mutation',
            }),
    		// 你甚至还可以用数组的方法，只不过现在注册的方法名是 b/b_action
    		// 而这个方法名看起来好像没办法在 html 里调用，只能放到下面的 foo 方法里调用
            ...mapActions(['b/b_action']),
    		foo(payload){
    			this['b/b_action'](payload);
    		},
            // 不过还是下面的方法更合适
            // ...mapActions({
            //     b_action: 'b/b_action',
            // }),
        },
    });
    ```
2. 把路径字符串中的**命名空间路径**作为第一个参数传给 Binding Helpers，之后的所有引用
时就都不需要带路径。
3. 注意，只能是命名空间路径，不带命名空间的子模块的模块名不能被提取出来。例如
`state.b.inner.inner_age`，只能提取出公共路径`'b'`，而不能提取出`'b/inner'`，因为
`inner`模块没有命名空间；而`state.b.inner_ns.inner_ns_age`就可以提取出`'b/inner_ns'`
    ```js
    computed: {
        ...mapState(['root_age']),
        ...mapState({
            b_age: state=>state.b.b_age,
        }),
        // 虽然上面在读取命名空间中的 state 时不能使用命名空间的`/`表示法，不过这里的
        // 命名空间的 state 却可以使用提取命名空间的方法
        ...mapState('b', {
            inner_age: state=>state.inner.inner_age,
        }),
        ...mapState('b/inner_ns', {
            inner_ns_age: state=>state.inner_ns_age,
        }),
        ...mapGetters('b/', {
            b_getter: 'b_getter',
        }),
    },
    methods: {
        ...mapMutations('b/', {
            b_mutation: 'b_mutation',
        }),
        ...mapActions('b/', {
            b_action: 'b_action',
        }),
    },
    ```
4. 除了这种定义参数的方法以外，还可以在 import 这些 map 函数时就直接定义一个统一的路径
    ```js
    import { mapState } from 'vuex'
    // import { mapGetters } from 'vuex'
    // import { mapMutations } from 'vuex'
    // import { mapActions } from 'vuex'

    import { createNamespacedHelpers } from 'vuex'
    // 以下三个函数会自动设定路径，而通过常规方法 import 的 mapState 不受影响
    const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers('b/');

    export default {
        computed: {
            ...mapState(['root_age']),
            ...mapState({
                b_age: state=>state.b.b_age,
            }),
            ...mapState('b', {
                inner_age: state=>state.inner.inner_age,
            }),
            ...mapState('b/inner_ns', {
                inner_ns_age: state=>state.inner_ns_age,
            }),
            ...mapGetters({
                b_getter: 'b_getter',
            }),
        },
        methods: {
            ...mapMutations({
                b_mutation: 'b_mutation',
            }),
            ...mapActions({
                b_action: 'b_action',
            }),
        },
    }
    ```


## Caveat for Plugin Developers
如果你开发的插件（Plugin）提供了模块并允许用户将其添加到 Vuex store，可能需要考虑模块
的空间名称问题。对于这种情况，你可以通过插件的参数对象来允许用户指定空间名称
```js
// 通过插件的参数对象得到空间名称
// 然后返回 Vuex 插件函数
export function createPlugin (options = {}) {
    return function (store) {
        // 把空间名字添加到插件模块的类型（type）中去
        const namespace = options.namespace || ''
        store.dispatch(namespace + 'pluginAction')
    }
}
```
