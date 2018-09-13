# Form Handling

1. 当在严格模式中使用 Vuex 时，在属于 Vuex 的 state 上使用 v-model 会比较棘手。
2. 下面的例子中，当用户输入时，`v-model`会直接修改`obj.input`，而非通过 commit。
    ```js
    // store
    export const store = new Vuex.Store({
        // strict: true,
        state: {
            obj: {
                input: '',
            },
        },
    });
    ```
    ```html
    <!-- html -->
    <input type="text" v-model="obj.input" /> {{obj.input}}
    ```
    ```js
    // vm
    computed: {
        ...mapState(['obj']),
    },
    ```
3. 解决方法之一是手动实现`v-model`
    ```js
    // store
    export const store = new Vuex.Store({
        strict: true,
        state: {
            obj: {
                input: '',
            },
        },
        mutations: {
            input(state, payload){
                state.obj.input = payload.value;
            },
        },
    });
    ```
    ```html
    <!-- html -->
    <input type="text"
        :value="obj.input"
        @input="input"
        @compositionstart="compositionstart"
        @compositionend="compositionend"
    />
    {{obj.input}}
    ```
    ```js
    // vm
    data(){
        return {
            bCompositionstart: false,
        };
    },
    computed: {
        ...mapState(['obj']),
    },
    methods: {
        compositionstart(){
            this.bCompositionstart = true;
        },
        input(ev){
            if (!this.bCompositionstart){
                this.$store.commit('input', {value: ev.target.value});
            }
        },
        compositionend(ev){
            this.bCompositionstart = false;
            this.$store.commit('input', {value: ev.target.value});
        },
    },
    ```
4. 更好的解决方法是实现双向绑定的计算属性。
5. 前面遇到的问题是，`v-model`在修改数据时，会直接修改。但是，这个数据是访问器属性，所
以你就可以自定义对它的修改。之前居然没想到可以这样！
    ```js
    // store
    export const store = new Vuex.Store({
        strict: true,
        state: {
            obj: {
                input: '',
            },
        },
        mutations: {
            input(state, payload){
                state.obj.input = payload.value;
            },
        },
    });
    ```
    ```js
    // vm
    computed: {
        input: {
            get(){
                return this.$store.state.obj.input;
            },
            set(value){
                this.$store.commit('input', {value})
            },
        },
    },
    ```
