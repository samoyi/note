# Misc

## methods 中的函数会被 bind 到当前实例
```html
<div id="components-demo">
    {{str}}
    <child-component></child-component>
</div>
```
```js
new Vue({
    el: '#components-demo',
    components: {
        'child-component': {
            template: `<p>{{str}}</p>`,
            data: function(){
                return {
                    str: 'child',
                };
            },
            created(){
                // 从子组件中调用父组件的方法
                this.$parent.say(); // "parent" 结果很合理，这是很明显的父组件方法调用
                let foo = this.$parent.say; // 直接引用父组件的函数
                // 这里已经不是方法调用了，但输出的仍然是父组件的 str
                foo();// "parent"
            },
        },
    },
    data: {
        str: 'parent',
    },
    methods: {
        say(){console.log(this.str);},
    },
});
```

Vue 源码中，有个`nativeBind`函数，查看该函数，可以看到对方法的绑定
```js
function nativeBind (fn, ctx) {
	console.log(fn); // ƒ say(){console.log(this.str);}
	console.log(ctx.$options.el); // #components-demo
	return fn.bind(ctx)
}
```


## 各种更新监听对各种更新的反应测试
* 三种更新监听：watcher、生命周期钩子、自定义指令钩子
* 四种更新方式：更新影响渲染的数据，更新不影响渲染的数据，同值更新，`$forceUpdate`

### 测试
```html
<div id="components-demo" v-_update v-_componentupdated>
    {{ name }}
</div>
```
```js
new Vue({
    el: '#components-demo',
    data: {
        name: '33',
        age: 22
    },
    directives: {
        _update: {
            update: function (el) {
                console.log('v-update');
            },
        },
        _componentupdated: {
            componentUpdated: function (el) {
                console.log('v-componentUpdated');
            },
        },
    },
    beforeUpdate(){
        console.log('beforeUpdate');
    },
    updated(){
        console.log('updated');
    },
    watch: {
        name(n){
            console.log('watch');
        },
        age(n){
            console.log('watch');
        },
    },
    mounted(){
        console.log('----更新影响渲染的数据----');
        this.name = '22'; // 会触发所有的监听

        setTimeout(()=>{
            console.log('\n-----更新不影响渲染的数据----');
            this.age = 33; // 只会触发 watcher 监听
        });

        setTimeout(()=>{
            console.log('\n-----同值更新影响渲染的数据----');
            this.name = '22'; // 不会触发任何监听
        });

        setTimeout(()=>{
            console.log('\n-----同值更新不影响渲染的数据----');
            this.age = 33; // 不会触发任何监听
        });

        setTimeout(()=>{
            console.log('\n-----$forceUpdate----');
            this.$forceUpdate(); // 除了 watcher 以外的监听都可以触发
        });
    },
});
```

输出为：
```
----更新影响渲染的数据----
watch
beforeUpdate
v-update
v-componentUpdated
updated

-----更新不影响渲染的数据----
watch

-----同值更新影响渲染的数据----

-----同值更新不影响渲染的数据----

-----$forceUpdate----
beforeUpdate
v-update
v-componentUpdated
updated
```

### 结论
* watcher 是用来监听数据变化的，只要数据没有实际变化就不会触发
* 自定义指令的钩子函数，文档写的比较明确，在 VNode 更新情况下才会触发，所以如果一个数据
不影响到 DOM，则不会触发
* 生命周期钩子函数也是要数据更新影响到 DOM 才会出发。
* `$forceUpdate`因为是重新渲染，所以也会影响到上述两种钩子函数。但因为不涉及数据变化，
所以不会触发 watcher。
* 所谓影响 DOM 更新，包括所有影响的情况，例如直接渲染出它的值、在某个影响更新的计算属性
中用到该属性、以该属性为标准进行`v-for`等等。
