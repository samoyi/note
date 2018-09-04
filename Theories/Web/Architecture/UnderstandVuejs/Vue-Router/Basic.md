# Basic

## 基本原理
* 监听 URL 变化，使用动态组件方法在`<router-view>`上渲染不同的不同的组件
* 实现一个简单的路由。想做成插件但是没有成功，在插件里定义的 mixin 都是全局的，这导致任
何一个实例都会有`router-link`和`router-view`子组件。

```html
<div id="app">
    <router-link to="/">home</router-link>
    <router-link to="/about">about</router-link>
    <router-link to="/user">user</router-link>

    <router-view></router-view>
</div>
```
```js
// 这个 mixin 将为实例添加路由功能
// 内部会定义两个组件，一个是路由链接 router-link，一个是路由出口 router-view
const MyRouteMixin = {
    components: {
        'router-link': {
            // 和 VueRouter 一样，用 to 表示设置路由路径
            props: ['to'],
            // 渲染为一个链接，将路径添加进 href 特性
            template: `<a :href='"#" + to'><slot></slot></a>`,
        },
        'router-view': {
            data(){
                return {
                    // 这是属性是当前要显示的组件
                    ViewComponent: null,
                };
            },
            mounted(){
                // 刚加载页面时，根据当前 hash，设定要显示的组件
                this.ViewComponent = this.$parent.routes[location.hash.slice(1)];

                // 监听 hash 变化，改变显示的组件
                window.addEventListener('hashchange', ()=>{
                    this.ViewComponent = this.$parent.routes[location.hash.slice(1)];
                });
            },
            // 使用动态组件方法
            template: `<div :is="ViewComponent"></div>`,
        },
    },
};

// 待渲染的组件
const Home = { template: '<p>Home page</p>' };
const User = { template: '<p>User page</p>' };
const About = { template: '<p>About page</p>' };

// 路由映射
// 不同的 URL hash 对应渲染不同的组件
const routes = {
    '/': Home,
    '/about': About,
    '/user': User,
};

new Vue({
    el: '#app',
    data: {
        routes, // 将路由设置添加到实例
    },
    mixins: [MyRouteMixin],
});
```


## 基本用法
1. With Vue.js, we are already composing our application with components. When
adding Vue Router to the mix, all we need to do is map our components to the
routes and let Vue Router know where to render them. 这段描述其实和上面基本原理相同
2. By injecting the router, we get access to it as `this.$router` as well as the
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


## Matching Priority
Sometimes the same URL may be matched by multiple routes. In such a case the
matching priority is determined by the order of route definition: the earlier a
route is defined, the higher priority it gets.
```html
<div id="app">
    <!-- 渲染为 “先定义” -->
    <router-view></router-view>
</div>
```
```js
const routes = [
    {
        path: '/',
        component: {template: `<p>先定义</p>`}
    },
    {
        path: '/',
        component: {template: `<p>后定义</p>`}
    },
];

new Vue({
    el: '#app',
    router: new VueRouter({routes}),
});
```


## Named Routes
给路由添加一个`name`属性，有时在导航的时候会直观一些。

```html
<div id="app">
    <router-link to="/user/33">user33</router-link>
    <!--
        声明式导航时，命名路由可以向下面这样设置动态路由匹配，比上面的的要麻烦，不过意
        思更明确一些
    -->
    <router-link :to="{ name: 'user', params: { username: '22' }}">User22</router-link>

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
        setInterval(()=>{
            if (this.$route.params.username === '22'){
                this.$router.push('33');
            }
            else {
                // 编程式导航时，相比于上面直接`push('33')`也是更麻烦了，不过确实意思
                // 更明确
                this.$router.push({name: 'user', params: {username: '22'}});
            }
        }, 3000);
    },
});
```


## $route.matched


## Route Meta Fields
