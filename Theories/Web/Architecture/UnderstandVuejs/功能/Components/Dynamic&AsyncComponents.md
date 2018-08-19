# Dynamic & Async Components

## Dynamic Components
1. 有时一个组件位置，可能你会期望它可以在不同的组件之间切换。比如一个登陆控件，你
可能希望它在邮箱登录组件和手机号登陆组件之间切换。
2. 那么你可以在当前位置随便放一个标签，然后为其添加`is`特性。`is`的值设定为哪个组
件名，当前就会显示哪个组件：
```html
<div id="components-demo">
    <any-name :is="currentComponentName"></any-name>
    <input type="button" value="switch" @click="switchComponent" />
</div>
```
```js
new Vue({
    el: '#components-demo',
    components: {
        'child-component1': {
            template: `<p>
                            <h2>使用邮箱登录</h2>
                            <input type="email" placeholder="输入邮箱" />
                        </p>`,
            created(){ // 先不用管这里
                console.log('child-component1 has been created');
            },
        },
        'child-component2': {
            template: `<p>
                            <h2>使用手机号登录</h2>
                            <input type="tel" placeholder="输入手机号" />
                        </p>`,
            created(){ // 先不用管这里
                console.log('child-component2 has been created');
            },
        },
    },
    data: {
        currentComponentName: 'child-component1',
    },
    methods: {
        switchComponent(){
            if (this.currentComponentName === 'child-component1'){
                this.currentComponentName = 'child-component2';
            }
            else {
                this.currentComponentName = 'child-component1';
            }
        }
    },
});
```
3. `is`特性除了可以设定为组件名以外，也可以设定为组件的选项对象。直接看[这个例子](https://jsfiddle.net/chrisvfritz/b2qj69o1/)

### 维持组件状态
1. 在使用上的登陆控件时，可能会发现一个问题。组件内部的输入在切换回来的时候就不存
在了。
2. 现在再看那两个`console.log`，能看出来，每次切换都是重新创建组件实例。
3. 只要给组件标签外面再加上`<keep-alive>`就可以维持状态，只在最开始创建一次实例
```html
<div id="components-demo">
    <keep-alive>
        <any-name :is="currentComponentName"></any-name>
    </keep-alive>
    <input type="button" value="switch" @click="switchComponent" />
</div>
```
4. Note that `<keep-alive>` requires the components being switched between
to all have names, either using the `name` option on a component, or
through local/global registration.



## Async Components
### 将组件定义为`new Promise()`参数的形式
1. 把组件定义为一个函数，该函数在 Vue 内部将用作`new Promise()`的参数，函数的形式就是
`new Promise()`的参数函数。
2. 该函数内部异步成功的话，也是调用其参数函数`resolve`。`resolve`的参数是组件选项对象。
3. 如果异步失败，则是调用其参数函数`reject`。参数是失败原因。
4. `resolve`调用之后，该组件才会被渲染。
```html
<div id="components-demo">
    <!-- 在组件异步加载完成之前，不会被渲染 -->
    <async-component></async-component>
</div>
```
```js
new Vue({
    el: '#components-demo',
    components: {
        'async-component': (resolve, reject)=>{
            // 这里指定三秒后再加载组件，加载完成后会进行渲染
            setTimeout(() => {
                resolve({
                    template: '<div>I am {{ name }}</div>',
                    data(){
                        return {name: '33'};
                    },
                })
            }, 3000)
        },
    },
});
```
5. 文档中说可以直接提供一个返回 Promise 的函数，但我试了没什么效果，不懂

### 实际的异步加载例子
```js
// main.js
new Vue({
    el: '#components-demo',
    components: {
        'async-component': (resolve, reject)=>{
            let p = import('./component.js');
            p.then(res=>{
                resolve(res.config);
            })
            .catch(err=>{
                console.error(err);
            });
        },
    },
    created(){
        console.log('父实例创建')
    },
    mounted(){
        console.log('父实例挂载')
    },
});

console.log('当前事件循环');
```
```js
// component.js
export let config = {
    template: '<div>I am {{ name }}</div>',
    data(){
        return {name: '33'};
    },
    beforeCreate(){
        console.log('组件实例 beforeCreate');
    },
};
```
1. 如果是普通的同步组件，四个`console.log`的顺序是：
```
"父实例创建"
"组件实例 beforeCreate"
"父实例挂载"
"当前事件循环"
```
2. 但因为这里的组件会异步加载，所以现在的顺序是：
```
"父实例创建"
"父实例挂载"
"当前事件循环"
"组件实例 beforeCreate"
```

### 处理加载状态
不懂怎么用
