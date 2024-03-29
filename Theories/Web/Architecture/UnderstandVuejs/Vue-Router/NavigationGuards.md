# Navigation Guards

1. `vue-router` 提供的导航守卫主要用来通过跳转或取消的方式守卫导航。与其说是 guarding，倒不如说是 controlling。
2. 有多种机会植入路由导航过程中：全局(路由器级别)的, 单个路由独享的, 或者组件内的。
3. 参数或查询的改变并不会触发进入/离开的导航守卫。你可以通过 watch `$route`对象来应对这些变化，或使用`beforeRouteUpdate`的组件内守卫。


<!-- TOC -->

- [Navigation Guards](#navigation-guards)
    - [分类一下](#分类一下)
    - [`router.beforeEach`](#routerbeforeeach)
        - [`next` 参数](#next-参数)
    - [`router.beforeResolve`](#routerbeforeresolve)
    - [`router.afterEach`](#routeraftereach)
    - [Per-Route Guard   `beforeEnter`](#per-route-guard---beforeenter)
    - [组件内的路由钩子](#组件内的路由钩子)
        - [`beforeRouteLeave`](#beforerouteleave)
        - [`beforeRouteEnter`](#beforerouteenter)
        - [`beforeRouteUpdate`](#beforerouteupdate)
    - [触发顺序](#触发顺序)
        - [完整的导航解析流程](#完整的导航解析流程)
        - [组件间导航](#组件间导航)
        - [组件内导航](#组件内导航)
        - [组件间导航时，与组件生命周期钩子的关系](#组件间导航时与组件生命周期钩子的关系)

<!-- /TOC -->


## 分类一下
* 路由器级别的：
    * `router.beforeEach`
    * `router.beforeResolve`
    * `router.afterEach`
* 路由级别的
    * `beforeEnter`
* 组件内的
    * `beforeRouteEnter`
    * `beforeRouteUpdate`
    * `beforeRouteLeave`


## `router.beforeEach`
1. 开始任何一次路由时（包括组件内路由），都会触发该钩子函数。
2. 在所有的路由钩子函数里，只有组件间导航时的 `beforeRouteLeave` 是在它之前被触发。看来逻辑是只有导航离开一个组件，才能开始下一次路由。
3. 如果创建了多个该方法，则按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于等待中。类似于 `Promise.all` 的感觉，不知道源码是怎么实现的。不懂
4. 下面的例子中，在进行导航时，会立刻依次输出 `"first"` 和 `"second"`，然后在三秒钟之后，进行实际的组件切换，并且 URL 发生变化。
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
        console.log('second');
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
1. 一定要调用该方法来 resolve 这个钩子。看起来就像 `Promise.all` 中每个实例的 `resolve` 方法。
2. 导航执行效果依赖 `next` 方法的调用参数
    * `next()`: 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed。所有钩子都执行完了，所以可以确定该如何处理导航了。
    * `next(false)`: 中断当前的导航，URL 不会发生变化。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 `from` 路由对应的地址。
        ```js
        router.beforeEach((to, from, next) => {
            console.log('开始尝试导航');
            setTimeout(function(){
                next(false);
                console.log('导航失败');
            }, 3000);
        });
        ```
    * `next('/')` 或者 `next({ path: '/' })`: 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。你可以向 `next` 传递任意位置对象，且允许设置诸如 `replace: true`、`name: 'home'`之类的选项以及任何用在 `router-link` 的 `to` prop 或 `router.push` 中的选项。
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
    * `next(error)`: 如果传入 `next` 的参数是一个 `Error` 实例，则导航会被终止且该错误会被传递给 `router.onError()` 注册过的回调。


## `router.beforeResolve`
这和 `router.beforeEach` 类似，区别是在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被调用。
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


## `router.afterEach`
1. 和 `router.beforeEach` 对应，结束任何一次路由时（包括组件内路由），都会触发该钩子函数。
2. 在组件内路由时，这个方法是所有类型钩子中的最后一个。在组件间路由时，这个钩子是路由结束的标志。之后会创建新组件实例，触发组件实例的 `beforeCreate`。
3. 因为是路由结束后才触发，所以不接受 `next`。

```js
const routes = [
    {
        path: '/foo',
        component: {
            template: `<p>This is foo</p>`,
            beforeCreate(){
                console.log('foo beforeCreate');
            },
        },
    },
    {
        path: '/bar',
        component: {
            template: `<p>This is bar1</p>`,
            beforeCreate(){
                console.log('bar beforeCreate');
            },
        },
    },
];

const router = new VueRouter({routes});

router.beforeEach((to, from, next)=>{
    console.log(`beforeEach: ${from.path} -> ${to.path}`);
    next();
});
router.afterEach((to, from)=>{
    console.log(`afterEach: ${from.path} -> ${to.path}`);
});
```


## Per-Route Guard   `beforeEnter`
1. 不是 router 的 guard，而是每个 route 的 guard
2. 进入（enter）每条路由前会触发。
3. 下面的两个 route 对应两个组件，在组件间导航时，每次都会从一条 route 进入另一条 route，每次进入前，就会触发被进入 route 的 `beforeEnter` 方法。
4. 在 `router.beforeResolve` 之前被触发

```js
const routes = [
    {
        path: '/foo',
        component: {
            template: `<p>This is foo</p>`,
            // beforeCreate(){
            //     console.log('foo beforeCreate');
            // },
        },
        beforeEnter(to, from, next){
            console.log('foo beforeEnter');
            next();
        },
    },
    {
        path: '/bar',
        component: {
            template: `<p>This is bar1</p>`,
            // beforeCreate(){
            //     console.log('bar beforeCreate');
            // },
        },
        beforeEnter(to, from, next){
            console.log('bar beforeEnter');
            next();
        },
    },
];

const router = new VueRouter({routes});

router.beforeEach((to, from, next)=>{
    console.log(`beforeEach: ${from.path} -> ${to.path}`);
    next();
});
router.beforeResolve((to, from, next)=>{
    console.log(`beforeResolve: ${from.path} -> ${to.path}`);
    next();
});
router.afterEach((to, from)=>{
    console.log(`afterEach: ${from.path} -> ${to.path}`);
});
```


## 组件内的路由钩子
对于 router 来说，可能会需要在不同的路由阶段进行不同的操作。而对于一个组件来说，它本身可能也需要针对路由情况做出某些操作，而不关心自己所处的路由系统。例如一个公共组件，如果它需要路由逻辑，但它并不知道自己所处的路由系统逻辑，因为它可能被用在任何地方任何路由逻辑中。所以组件内也需要一些路由钩子。

### `beforeRouteLeave`
1. 导航离开该组件的对应路由时调用
2. 在组件间路由时，这个钩子是最先被调用的，之后才是 `router.beforeEach`。看来逻辑是先要离开这个组件才能进行下一次路由。
3. 可以访问组件实例 `this`
4. 这个离开守卫通常用来禁止用户在还未保存修改前突然离开。该导航可以通过 `next(false)` 来取消。
    ```js
    beforeRouteLeave (to, from, next) {
        const answer = window.confirm('Do you really want to leave?')
        if (answer) {
            next()
        }
        else {
            next(false)
        }
    }
    ```

### `beforeRouteEnter`
1. 在渲染该组件的对应 route 被 confirm 前调用。先要进入当前 route，解析当前 route 后最后才能 confirm 当前 route，然后才能 confirm 本次导航。所以先触发 route 的 `beforeEnter`，再触发 `beforeRouteEnter`，然后是触发 `router.beforeResolve`。
2. 注意，这个钩子是在 confirm route 之前，而 `router.beforeResolve` 是在 confirm 导航之前。
3. 不能获取组件实例 `this`，因为这是在进入当前 route 之前，组件实例还没被创建。实际上组件的创建要直到 `afterEach` 钩子之后，因为只有路由完了才能确定要构建哪个组件。
4. 不过，你可以通过传一个回调给 `next` 来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数。
    ```js
    beforeRouteEnter (to, from, next) {
        next(vm => {
            // 通过 `vm` 访问组件实例
        })
    }
    ```
5. 在生命周期上，因为实在 enter 之前，所以 `beforeRouteEnter` 函数本身会在 `beforeCreate` 钩子函数之前被调用；而 `next` 回调会在 `mounted` 之后被调用。

### `beforeRouteUpdate`
1. 在当前路由改变，但是该组件被复用时调用。因为这是 In-Component Guard，所以这里的 `beforeRouteUpdate` 肯定是组件内的更新而不是跨组件的更新，而组件内的路由更新也就是类似于路由参数变动这样不会切换组件的更新。
2. 举例来说，对于一个带有动态参数的路径 `/foo/:id`，在 `/foo/1` 和 `/foo/2` 之间跳转的时候，由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
3. 可以访问组件实例 `this`。


## 触发顺序
### 完整的导航解析流程
1. Navigation triggered.
2. Call `beforeRouteLeave` guards in deactivated components.
3. Call global `beforeEach` guards.
4. Call `beforeRouteUpdate` guards in reused components.
5. Call `beforeEnter` in route configs.
6. Resolve async route components.
7. Call `beforeRouteEnter` in activated components.
8. Call global `beforeResolve` guards.
9. Navigation confirmed.
10. Call global `afterEach` hooks.
11. DOM updates triggered.
12. Call callbacks passed to `next` in `beforeRouteEnter` guards with
instantiated instances.

```html
<div id="app">
    <router-link to="/login">login</router-link> <br />
    <router-link to="/profile/22">22 profile</router-link> <br />
    <router-link to="/profile/33">33 profile</router-link> <br /><br />

    <router-view></router-view>
</div>
```
```js
let bUpdate = false;

const Login = {
    template: '<div>Login component</div>',
    beforeRouteEnter (to, from, next) {
        console.log('beforeRouteEnter');
        next();
    },
    beforeRouteUpdate (to, from, next) {
        bUpdate = true;
        console.log('beforeRouteUpdate');
        next();
    },
    beforeRouteLeave (to, from, next) {
        console.log('beforeRouteLeave');
        next();
    },
    beforeCreate(){
        console.log('beforeCreate');
    },
    created(){
        console.log('created');
    },
    beforeDestroy(){
        console.log('beforeDestroy');
    },
    destroyed(){
        console.log('destroyed');
        if (!bUpdate){
            console.log('---------------');
        }
    },
};
const Profile = {
    template: '<div>Profile component {{$route.params.username}}</div>',
    beforeRouteEnter (to, from, next) {
        console.log('beforeRouteEnter');
        next();
    },
    beforeRouteUpdate (to, from, next) {
        bUpdate = true;
        console.log('beforeRouteUpdate');
        next();
    },
    beforeRouteLeave (to, from, next) {
        console.log('beforeRouteLeave');
        next();
    },
    beforeCreate(){
        console.log('beforeCreate');
    },
    created(){
        console.log('created');
    },
    beforeDestroy(){
        console.log('beforeDestroy');
    },
    destroyed(){
        console.log('destroyed');
        if (!bUpdate){
            console.log('---------------');
        }
    },
};

const routes = [
    {
        path: '/profile/:username',
        component:  Profile,
        beforeEnter(to, from, next){
            bUpdate = false;
            console.log('beforeEnter');
            next();
        },
    },
    {
        path: '/login',
        component:  Login,
        beforeEnter(to, from, next){
            bUpdate = false;
            console.log('beforeEnter');
            next();
        },
    },
];

const router = new VueRouter({routes});

router.beforeEach((to, from, next) => {
    console.log('beforeEach');
    next();
});
router.beforeResolve((to, from, next)=>{
    console.log('beforeResolve');
    next();
});
router.afterEach((to, from)=>{
    console.log('afterEach');
    if (bUpdate){
        console.log('---------------');
    }
});

new Vue({
    el: '#app',
    router,
});
```

### 组件间导航
```
beforeRouteLeave
beforeEach
beforeEnter
beforeRouteEnter
beforeResolve
afterEach
beforeCreate
created
beforeDestroy
destroyed
```

### 组件内导航
```
beforeEach
beforeRouteUpdate
beforeResolve
afterEach
```

### 组件间导航时，与组件生命周期钩子的关系
1. `router.afterEach` 之后触发 `beforeCreate` 和 `created` 这很好理解。
2. 但旧组件的 `beforeDestroy` 和 `destroyed` 居然是在最后才触发的。不懂
