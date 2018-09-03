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
const MyRouteMixin = {
    components: {
        'router-link': {
            props: ['to'],
            template: `<a :href='"#" + to'><slot></slot></a>`,
        },
        'router-view': {
            props: ['routes'],
            data(){
                return {
                    ViewComponent: null,
                };
            },
            mounted(){
                this.ViewComponent = this.$parent.routes[location.hash.slice(1)];
                window.addEventListener('hashchange', ()=>{
                    this.ViewComponent = this.$parent.routes[location.hash.slice(1)];
                });
            },
            template: `<div :is="ViewComponent"></div>`,
        },
    },
};


const Home = { template: '<p>Home page</p>' };
const User = { template: '<p>User page</p>' };
const About = { template: '<p>About page</p>' };

const routes = {
    '/': Home,
    '/about': About,
    '/user': User,
};

new Vue({
    el: '#app',
    data: {
        routes,
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
