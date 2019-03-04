# Custom Events

key | value
--|--
源码版本 | 2.5.2
文件路径 | `src/core/instance/events.js`



## 绑定事件
1. 可以通过`v-on`指令在模板中绑定子组件的自定义事件，也可以在子组件中通过`$on`方法绑定自定义事件。
2. 前者同样会触发`$on`方法，第一个参数为字符串。后者的第一个参数可以是字符串或者字符串数组。
3. 注意这种为同一个事件绑定多个事件处理的情况时，通过实例方法才可以绑定绑定多个回调，而如果通过指令，则相同的事件名并不会重复绑定回调，只会保留第一次绑定的回调。
    ```html
    <div id="app">
        <child
            @from-child="vdHandle1"
            @from-child="vdHandle2"
        ></child>
    </div>
    ```
    ```js
    new Vue({
        el: '#app',
        components: {
          child: {
            template: `<p>ppp</p>`,
            created(){
                this.$on('from-child', ()=>{
                    console.log('vmHandle1');
                });
                this.$on('from-child', ()=>{
                    console.log('vmHandle2');
                });
            },
            mounted(){
                this.$emit('from-child');
            },
          },
        },
        methods: {
            ['vdHandle1'](){
                console.log('vdHandle1');
            },
            ['vdHandle2'](){
                console.log('vdHandle2');
            },
        },
    });
    ```
    打印输出为
    ```shell
    vdHandle1
    vmHandle1
    vmHandle2
    ```


## 解除绑定
注意这里只要找到一个就会跳出，所以给同一个事件多次绑定了同一个回调，或者分别进行了`$on`绑定和`$once` 绑定，则一次`$off`只能解除一个回调。
    ```js
    created(){
        this.$on('from-child1', this.handler1);
        this.$on('from-child1', this.handler1);
        this.$on('from-child2', this.handler2);
        this.$once('from-child2', this.handler2);
    },
    mounted(){
        this.$off('from-child1', this.handler1);
        this.$off('from-child2', this.handler2);
        this.$emit('from-child1');
        this.$emit('from-child2');
    },
    methods: {
        handler1(){
            console.log('handler1');
        },
        handler2(){
            console.log('handler2');
        },
    },
    ```
    因为只`$off`了一遍删除了相同回调中的一个，所以仍然会保留一次回调调用


## Hooks
1. 可以参考[这篇文章](https://alligator.io/vuejs/component-event-hooks/)
2. 示例
    ```js
    new Vue({
        el: '#app',
        components: {
          child: {
            template: `<p>{{age}}</p>`,
            data(){
                return {
                    age: 22,
                };
            },
            beforeCreate(){
                console.log('beforeCreate');

                this.$on('hook:beforeCreate', ()=>{
                    console.log('hook:beforeCreate');
                });
                this.$on('hook:created', ()=>{
                    console.log('hook:created');
                });
                this.$on('hook:beforeMount', ()=>{
                    console.log('hook:beforeMount');
                });
                this.$on('hook:mounted', ()=>{
                    console.log('hook:mounted');
                });
                this.$on('hook:beforeUpdate', ()=>{
                    console.log('hook:beforeUpdate');
                });
                this.$on('hook:updated', ()=>{
                    console.log('hook:updated');
                });
                this.$on('hook:beforeDestroy', ()=>{
                    console.log('hook:beforeDestroy');
                });
                this.$on('hook:destroyed', ()=>{
                    console.log('hook:destroyed');
                });
            },
            created(){
                console.log('created');
            },
            beforeMount(){
                console.log('beforeMount');
            },
            mounted(){
                console.log('mounted');

                this.age = 33;

                this.$nextTick(()=>{
                    this.$destroy();
                });
            },
            beforeUpdate(){
                console.log('beforeUpdate');
            },
            updated(){
                console.log('updated');
            },
            beforeDestroy(){
                console.log('beforeDestroy');
            },
            destroyed(){
                console.log('destroyed');
            },
          },
        },
    });
    ```
    输出为：
    ```shell
    beforeCreate
    hook:beforeCreate
    created
    hook:created
    beforeMount
    hook:beforeMount
    mounted
    hook:mounted
    beforeUpdate
    hook:beforeUpdate
    updated
    hook:updated
    beforeDestroy
    hook:beforeDestroy
    destroyed
    hook:destroyed
    ```
