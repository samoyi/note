# Global API

## `Vue.extend( options )`
1. 使用基础 Vue 构造器，创建一个“子类”，即一个组件原型。
2. 参数是一个包含组件选项的对象。其中`data`属性必须是一个函数。

```html
<div id="app">
    <template id="girl1"></template>
    <template id="girl2"></template>
</div>
<!-- 渲染为
<div id="app">
    <p>22 33 girl</p>
    <p>33 22 girl</p>
</div> -->
```
```js
const Profile = Vue.extend({
    template: '<p>{{name}} {{age}} {{sex}}</p>',
    data: function () {
        return {
            name: '',
            age: 0,
            sex: 'girl',
        };
    },
})

// 创建两个根实例
let profile1 = new Profile();
let profile2 = new Profile();

profile1.name = '22';
profile1.age = 33;
profile2.name = '33';
profile2.age = 22;

profile1.$mount('#girl1');
profile2.$mount('#girl2');
```


## `Vue.nextTick( [callback, context] )`
1. 根据[文档](https://vuejs.org/v2/guide/reactivity.html#Async-Update-Queue)说的，
该方法再内部会优先 Promise 来实现，如果环境不支持，则使用`setTimeout(fn, 0)`。
    ```js
    new Vue({
        created(){
            this.$nextTick(()=>{
                console.log('nextTick');
            });
        }
    });
    ```
2. 如果没有提供回调且在支持 Promise 的环境中，则返回一个 Promise。resolve 的结果是
next tick 时的实例
    ```html
    <div id="app">{{age}}</div>
    ```
    ```js
    let vm = new Vue({
        el: '#app',
        data: {
            age: 22,
        },
        mounted(){
            this.age = 33;
            console.log(this.$el.textContent); // 22
            let p = this.$nextTick();
            p.then(res=>{
                console.log(res.$el.textContent); // 33
            });
        },
    });
    ```


## `Vue.delete( target, key )`
1. 访问器属性的删除并不会触发 setter 及其父级 setter，所以 Vue 提供了这个方法来监听属
性删除
2. 但即使直接删除，也有可能被检测到。下面的例子中，`delete this.profile.age`并不会触
发`profile.age`的 watcher。
3. 但之后通过`$delete`删除了`profile.name`，这一行为会触发`profile.name`的 watcher
和重渲染，同时也会触发`profile.age`的 watcher。
4. 但这种延迟删除检测必须要满足两点：后续的数据改变必须是删除，注释中的数据更新并不会触
发`profile.age`的 watcher；后续的数据改变必须会触发 DOM 更新，如果`profile.name`不涉
及 DOM，那么它的删除也不会触发`profile.age`的 watcher。
5. 可以看到，`profile.age`是否涉及 DOM 并不重要。
6. 另外，这种延迟删除检测的情况下，两个 watcher 谁先触发仍然是取决于 watcher 注册的顺
序。而并不是说`profile.name`的删除导致了`profile.age`的删除被发现所以会先触发
`profile.name`的 watcher，或者说因为先删除的`profile.age`所以先触发`profile.age`的
watcher
7. 和`Vue.set`一样，不能删除根数据对象

```html
<div id="app">
    {{profile.name}}
</div>
```
```js
new Vue({
    el: '#app',
    data: {
        profile: {
            name: '33',
            age: 22,
        },
    },
    watch: {
        'profile.age': function(n, o){ console.log('age watcher') },
        'profile.name': function(n, o){ console.log('name watcher') },
    },
    mounted(){
        setTimeout(()=>{
            delete this.profile.age;
            console.log('delete age');
            setTimeout(()=>{
                console.log('delete name');
                this.$delete(this.profile, 'name');
                // console.log('update name');
                // this.profile.name = '666';
            }, 2000);
        }, 2000);
    }
});
```


## Vue.version
Provides the installed version of Vue as a string.
