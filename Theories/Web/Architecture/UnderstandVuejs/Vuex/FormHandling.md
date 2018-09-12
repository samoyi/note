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
