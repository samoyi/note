# Programmatic Navigation

* 除了使用`<router-link>`创建`<a>`标签来定义导航链接，我们还可以借助 router 的实例方
法，通过编写代码来实现。
* 对 URL 的处理方法，可以参考[Manipulating the browser history](https://developer.mozilla.org/en-US/docs/Web/API/History_API)


## `router.push(location, onComplete?, onAbort?)`
1. 想要导航到不同的 URL，则使用`router.push`方法。
2. 这个方法会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，则回到之
前的 URL。
3. 当你点击`<router-link>`时，这个方法会在内部调用。所以说，点击
`<router-link :to="...">`等同于调用`router.push(...)`。
4. 该方法的参数可以是一个字符串路径，或者一个描述地址的对象。
5. 地址对象的`path`属性可以是绝对地址，也可以是相对地址。不过最好写绝对地址，容易理解。
6. 地址对象的`params`属性中的值如果是数字，不会自动变成字符串，这样之后判断当前路由的
param 时，仍然是数字类型。所以最好设定的时候即使是数字也写成字符串形式。
6. 如果提供了`path`，`params`会被忽略。因为`path`本来就是包含完整的路径的，也包括
`params`在内。而在使用`name`时，`name`只是指定了组件，还需要加上`params`才是完整路径。

```html
<div id="app">
    <router-view></router-view>
</div>
```
```js
const User = { template: '<p>User {{$route.params.username}} page</p>' };

const routes = [
    {
        path: '/user/:username',
        name: 'user',
        component: User,
    },
];

new Vue({
    el: '#app',
    router: new VueRouter({routes}),
    mounted(){
        setTimeout(()=>{
            this.$router.push('/user/11');
        }, 1000);

        setTimeout(()=>{
			this.$router.push({ path: '/user/22' }); // / 开头的绝对地址
            // this.$router.push({ path: './22' }); // . 开头的相对地址
			// this.$router.push({ path: '22' }); // 省略 . 的相对地址
            // this.$router.push({ path: '../user/22' }); // 虽然没必要但这样也可以
			// 下面这样不行，少了开头的 / ，就成了相对地址了。路由路径为 /user/user/22
            // this.$router.push({ path: 'user/22' });
        }, 2000);
        // 上面这两种 push 方法效果一样

        // 下面这种 push 方法可以明确的指明 route 和参数，而不用像 push('/user/11')
        // 这样混在一起
        setTimeout(()=>{
            this.$router.push({ name: 'user-route', params: { username: '33' }})
            console.log(this.$route.params.username === '33'); // true
            console.log(this.$route.params.username === 33) // false
			// 如果 { username: 33 }，那就是数字类型了
        }, 3000);

        // 还可以 push 带查询的
        setTimeout(()=>{
            this.$router.push({ path: '/user/44', query: { id: 'xyz' }})
        }, 4000);

        // 如果提供了 path ，params 会被忽略，因此会路由到 55 的 user 组件
        setTimeout(()=>{
            this.$router.push({ path: '/user/55', params: { username: '66' }})
        }, 5000);
    },
});
```

## `router.replace(location, onComplete?, onAbort?)`
跟`router.push`很像，唯一的不同就是，它不会向 history 添加新记录，而是替换掉当前的
history 记录。


## `onComplete` and `onAbort`
`onComplete`会在导航成功完成 (在所有的异步钩子被解析之后)时调用，`onAbort`会在导航终止
 (导航到相同的路由、或在当前导航完成之前导航到另一个不同的路由)

```js
this.$router.push('/user', ()=>{
    // 导航成功
    console.log('complete');
    console.log(this.$route.path);
});
this.$router.push('/user', ()=>{}, ()=>{
    // 重复导航
    console.log('abort');
    console.log(this.$route.path);
});
```


## `router.go(n)`
这个方法的参数是一个整数，意思是在 history 记录中向前或者后退多少步，类似
`window.history.go(n)`。
