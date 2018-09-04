# Navigation Guards

1. As the name suggests, the navigation guards provided by vue-router are
primarily used to guard navigations either by redirecting it or canceling it. 与
其说是 guarding，倒不如说是 controlling。
2. There are a number of ways to hook into the route navigation process:
globally, per-route, or in-component.
3. Remember that params or query changes won't trigger enter/leave navigation
guards. You can either watch the `$route` object to react to those changes, or
use the `beforeRouteUpdate` in-component guard.


## Global Guards
1. You can register global before guards using `router.beforeEach`.
2. Global before guards are called in creation order, whenever a navigation is
triggered.
3. Guards may be resolved asynchronously, and the navigation is considered
pending before all hooks have been resolved. 类似于`Promise.all`的感觉，不知道源码
是怎么实现的。不懂
4. 下面的例子中，在进行导航是，会立刻依次输出`"first"`和`"second"`，然后在三秒钟之后，
进行实际的组件切换，并且 URL 发生变化。
    ```html
    <div id="app">
        <router-link to="/profile">profile</router-link>
        <br />
        <router-link to="/article">article</router-link>
        <br />
        <br />
        <router-view></router-view>
    </div>
    ```
    ```js
    const Profile = {
        template: '<div>Profile component</div>',
    };
    const Article = {
        template: '<div>Article component</div>',
    };
    const routes = [
        {
            path: '/profile',
            component:  Profile,
        },
        {
            path: '/article',
            component:  Article,
        },
    ];

    const router = new VueRouter({routes});

    router.beforeEach((to, from, next) => {
        console.log('first');
        next();
    });

    router.beforeEach((to, from, next) => {
        console.log('send');
        setTimeout(function(){
            next();
        }, 3000);
    });

    new Vue({
        el: '#app',
        router,
    });
    ```

### `next` 参数
1. 一定要调用该方法来 resolve 这个钩子。看起来就像`Promise.all`中每个实例的`resolve`
方法。
2. 导航执行效果依赖`next`方法的调用参数
    * `next()`: 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是
        confirmed。所有钩子都执行完了，所以可以确定该如何处理导航了。
    * `next(false)`: 中断当前的导航，URL 不会发生变化。如果浏览器的 URL 改变了 (可能
        是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到`from`路由对应的地址。
        ```js
        router.beforeEach((to, from, next) => {
            console.log('开始尝试导航');
            setTimeout(function(){
                next(false);
                console.log('导航失败');
            }, 3000);
        });
        ```
    * `next('/')` 或者 `next({ path: '/' })`: 跳转到一个不同的地址。当前的导航被中断
        ，然后进行一个新的导航。你可以向`next`传递任意位置对象，且允许设置诸如
        `replace: true`、`name: 'home'`之类的选项以及任何用在`router-link`的 `to`
        prop 或 `router.push` 中的选项。
        ```js
        router.beforeEach((to, from, next) => {
            // 如果是想要导航到 profile 组件，则最终会导航到 login 组件
            if (to.path === '/profile'){
                next('/login');
            }
            else {
                next();
            }
        });
        ```
    * `next(error)`: 如果传入`next`的参数是一个`Error`实例，则导航会被终止且该错误会
        被传递给`router.onError()`注册过的回调。


## Global Resolve Guards
1. You can register a global guard with `router.beforeResolve`. This is similar
to `router.beforeEach`, with the difference that resolve guards will be called
right before the navigation is confirmed, after all in-component guards and
async route components are resolved.
2. 上面说到，管道中全部的钩子执行完了，导航的状态才会变成 confirmed。所以
`router.beforeResolve`会在`router.beforeEach`之后执行。

```js
// 先立刻依次输出 "beforeEach" 和 "beforeResolve"，三秒钟后切换组件变更 URL
router.beforeEach((to, from, next) => {
    console.log('beforeEach');
    next();
});
router.beforeResolve((to, from, next)=>{
    console.log('beforeResolve');
    setTimeout(()=>{
        next();
    }, 3000);
});
```


## Global After Hooks
因为是后置的，在导航结束后才出发，所以不接受`next`
```js
router.beforeResolve((to, from, next)=>{
    console.log('beforeResolve');
    setTimeout(()=>{
        next();
    }, 3000);
});
router.afterEach((to, from)=>{
    // 三秒之后，实际导航触发，然后触发该函数
    console.log('afterEach');
});
```


## Per-Route Guard
1. 不是 router 的 guard，而是每个 route 的 guard，进入（enter）每条路由时会触发。

```js
const routes = [
    {
        path: '/profile',
        component:  Profile,
        beforeEnter(to, from, next){
            console.log('beforeEnter');
            next();
        },
    },
    {
        path: '/login',
        component:  Login,
        beforeEnter(to, from, next){
            console.log('beforeEnter');
            next();
        },
    },
];

// ...

router.beforeEach((to, from, next) => {
    console.log('beforeEach');
    next();
});
router.beforeResolve((to, from, next)=>{
    console.log('beforeResolve');
});
```

2. `beforeEach`是路由器每次开始路由时触发，开始路由时，要确定路由线路，要查看选定的路由
内部是否有`beforeEnter`钩子，有的话就触发。所以`beforeEnter`是在`beforeEach`之后触发。
上面的输出顺序为：
```
beforeEach
beforeEnter
beforeResolve
```


## In-Component Guards
