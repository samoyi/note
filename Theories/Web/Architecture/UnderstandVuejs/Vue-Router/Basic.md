# Basic

## Basic
1. 根据不同的 URL 渲染不同的内容。看起来和动态组件很像，而且也可以用`<keep-alive>`，不
知道同样的实现原理
```js
const NotFound = { template: '<p>Page not found</p>' };
const Home = { template: '<p>home page</p>' };
const About = { template: '<p>about page</p>' };

const routes = {
    '/': Home,
    '/about': About,
};

new Vue({
    el: '#app',
    data: {
        currentRoute: window.location.pathname,
    },
    computed: {
        ViewComponent () {
            return routes[this.currentRoute] || NotFound;
        },
    },
    render (h) { return h(this.ViewComponent) },
});
```
2. With Vue.js, we are already composing our application with components. When
adding Vue Router to the mix, all we need to do is map our components to the
routes and let Vue Router know where to render them.
3. By injecting the router, we get access to it as `this.$router` as well as the
current route as `this.$route` inside of any component
```html
<div id="app">
    <p>
        <!-- use router-link component for navigation. -->
        <!-- specify the link by passing the `to` prop. -->
        <!-- `<router-link>` will be rendered as an `<a>` tag by default -->
        <router-link to="/foo">Go to Foo</router-link>
        <router-link to="/bar">Go to Bar</router-link>
    </p>
    <!-- route outlet -->
    <!-- component matched by the route will render here -->
    <router-view></router-view>
</div>
```
```js
// 0. If using a module system (e.g. via vue-cli), import Vue and VueRouter
// and then call `Vue.use(VueRouter)`.

// 1. Define route components.
// These can be imported from other files
const Foo = { template: '<div>foo</div>' };
const Bar = { template: '<div>bar</div>' };

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
const routes = [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar },
];

// 3. Create the router instance and pass the `routes` option
const router = new VueRouter({
    routes,
});

// 4. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
const app = new Vue({
    router,
    created(){
        console.log(this.$router);
    },
    updated(){
        console.log(this.$route);
    },
}).$mount('#app');
```


## Dynamic Route Matching
1. One thing to note when using routes with params is that when the user
navigates from `/user/foo` to `/user/bar`, the same component instance will be
reused.
2. Since both routes render the same component, this is more efficient than
destroying the old instance and then creating a new one. However, this also
means that the lifecycle hooks of the component will not be called.

```html
<div id="app">
    <p>
        <router-link to="/user/user1">Go to User1</router-link>
        <router-link to="/user/user2">Go to User2</router-link>
        <router-link to="/user/user1/post/2">User1第二篇文章</router-link>
        <router-link to="/user/user2/post/4">User2第四篇文章</router-link>
    </p>
    <router-view></router-view>
</div>
```

```js
const User = {
    template: '<div>{{$route.params.username}}的页面</div>' ,
    created(){
        console.log('User created');
    },
};
const Post = {
    template: '<div>{{$route.params.username}}的第{{$route.params.id}}篇文章</div>' ,
    created(){
        console.log('Post created');
    },
};

const routes = [
    {
        path: '/user/:username',
        component: User
    },
    {
        path: '/user/:username/post/:id',
        component: Post
    },
]

const router = new VueRouter({
    routes
})

const app = new Vue({
    router,
    updated(){
        console.log(this.$route.params);
    },
}).$mount('#app')
```
3. 这个例子中，在两个 User 之间切换或者在两个 Post 之间切换的时候，不会重新创建组件实例
，不会触发`created`钩子函数。只有在 User 和 Post 之间切换的时候，才会触发重新创建组件
实例。
4. 在同一个组件内切换时，因为有数据更新，所以组件及其父级都可以正常的触发`updated`。但
是，不能使用`updated`来监听路由参数变化，因为其他变化也有可能触发`updated`。
5. 可以通过 watcher 和 Navigation Guards 两种方法来监听参数变化。
```js
// watcher 方法
const User = {
    template: '<div>{{$route.params.username}}的页面</div>',
    watch: {
        $route(to, from){
            console.log(`从${from.params.username}的页面切换到了${to.params.username}的页面`);
        },
    },
};
const Post = {
    template: '<div>{{$route.params.username}}的第{{$route.params.id}}篇文章</div>',
    watch: {
        $route(to, from){
            console.log(`从${from.params.username}的第${from.params.id}篇文章` +
                `切换到了${to.params.username}的第${to.params.id}篇文章`);
        },
    },
};
```
```js
// avigation Guards 方法
const User = {
    template: '<div>{{$route.params.username}}的页面</div>',
    beforeRouteUpdate (to, from, next) {
        console.log(`从${from.params.username}的页面切换到了${to.params.username}的页面`);
        next();
    },
};
const Post = {
    template: '<div>{{$route.params.username}}的第{{$route.params.id}}篇文章</div>',
    beforeRouteUpdate (to, from, next) {
        console.log(`从${from.params.username}的第${from.params.id}篇文章` +
            `切换到了${to.params.username}的第${to.params.id}篇文章`);
        next();
    },
};
```
