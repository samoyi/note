# Getter

1. `getters`是 store 的计算属性，基于`state`中的数据。
2. 基于应用的需求，某些`state`中的数据可能需要加工才能使用。
3. 如果只有一两个组件需要用到某个加工数据，则加工的工作可以丢给组件去做。但如果有更多的
组件都要用到相同的加工数据，那最好还是在 store 里加工好直接提供给组件。


## 定义
1. Vuex 允许我们在 store 中定义“getter”。就像计算属性一样，`getter` 的返回值会根据它
的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。
2. Getter 接受 state 作为其第一个参数，也可以接受其他 getter 作为第二个参数
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
1. 上面的定义的 getter，实例在访问时的值都是确定的。
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


## `mapState`
和`state`中的`mapState`用法一样
