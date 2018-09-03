# Programmatic Navigation

* Aside from using `<router-link>` to create anchor tags for declarative
navigation, we can do this programmatically using the router's instance methods.
* 对 URL 的处理方法，可以参考[Manipulating the browser history](https://developer.mozilla.org/en-US/docs/Web/API/History_API)


## `router.push(location, onComplete?, onAbort?)`
1. To navigate to a different URL, use `router.push`.
2. This method pushes a new entry into the history stack, so when the user
clicks the browser back button they will be taken to the previous URL.
3. This is the method called internally when you click a `<router-link>`, so
clicking `<router-link :to="...">` is the equivalent of calling
`router.push(...)`.
4. The argument can be a string path, or a location descriptor object.
5. `params`中的值如果是数字，不会自动变成字符串，这样之后判断当前路由的 param 时，仍然
是数字类型。所以最好设定的时候即使是数字也写成字符串形式。
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
        // 需要从根路径进入页面

        setTimeout(()=>{
            this.$router.push('user/11');
        }, 1000);
        setTimeout(()=>{
            this.$router.push({ path: '22' });
        }, 2000);
        // 上面这两种 push 方法效果一样

        // 下面这种 push 方法可以明确的知名组件和参数，而不用像 push('user/11') 这样
        // 混在一起
        setTimeout(()=>{
            this.$router.push({ name: 'user', params: { username: '33' }})
            console.log(this.$route.params.username === '33'); // true
            console.log(this.$route.params.username === 33) // false
        }, 3000);

        // 还可以 push 带查询的
        setTimeout(()=>{
            this.$router.push({ path: '44', query: { id: 'xyz' }})
        }, 4000);

        // 如果提供了 path ， params 会被忽略，因此会路由到 55 的 user 组件
        setTimeout(()=>{
            this.$router.push({ path: '/user/55', params: { username: '66' }})
        }, 5000);
    },
});
```

### `onComplete` and `onAbort`
`onComplete`会在导航成功完成 (在所有的异步钩子被解析之后)时调用，`onAbort`会在导航终止
 (导航到相同的路由、或在当前导航完成之前导航到另一个不同的路由)

```js
// 假设从根路径（`/`）开始路由
this.$router.push('user', ()=>{
    // 导航成功
    console.log('complete');
    console.log(this.$route.path);
});
this.$router.push('user', ()=>{}, ()=>{
    // 重复导航
    console.log('abort');
    console.log(this.$route.path);
});
```


## `router.replace(location, onComplete?, onAbort?)`


## `router.go(n)`
