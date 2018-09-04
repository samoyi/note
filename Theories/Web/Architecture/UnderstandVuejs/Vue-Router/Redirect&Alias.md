# Redirect and Alias

## Redirect
```html
<div id="app">
    <router-link to="/about">跳转到 about 组件</router-link> <br />
    <router-link to="/user">试图跳转到不存在 user 组件，然后会被重定向到 home 组件</router-link>
    <br />
    <router-view></router-view>
</div>
```
```js
const Home = {
    template: `<div>Home</div>`
};
const About = {
    template: `<div>About</div>`
};


const routes = [
    {
        path: '/',
        component: Home,
        name: 'home',
    },
    {
        path: '/about',
        component: About,
    },
    {
        path: '/user',
        redirect: '/'
        // The redirect can also be targeting a named route
        // redirect: { name: 'home' },
    },
];

new Vue({
    el: '#app',
    router: new VueRouter({routes}),
});
```

### 动态重定向
1. `redirect`除了可以是路径字符串或命名路由对象以外，还可以是一个函数，用来动态设定重定
向。
2. 函数接受一个参数作为路由目标，返回重定向的路径字符串或命名路由对象。

```html
<div id="app">
    <router-link to="/about">跳转到 about 组件</router-link>
    <br />
    <router-link to="/user/22">跳转到 user 组件，username 是 22，重定向到 about 组件</router-link>
    <br />
    <router-link to="/user/33">跳转到 user 组件，username 是 33，重定向到 home 组件</router-link>
    <br />
    <br />
    <router-view></router-view>
</div>
```
```js
const Home = {
    template: `<div>Home</div>`
};
const About = {
    template: `<div>About</div>`
};

const routes = [
    {
        path: '/',
        component: Home,
        name: 'home',
    },
    {
        path: '/about',
        component: About,
    },
    {
        path: '/user/:username',
        redirect(to){
            // 试图跳转到 user 页面时会发生重定向，这里根据 username 参数确定分别重
            // 定向到哪里
            const username = to.params.username;
            if (username === '22'){
                return '/about';
            }
            if (username === '33'){
                return {name: 'home'};
            }
        },
    },
];

new Vue({
    el: '#app',
    router: new VueRouter({routes}),
});
```


## Alias
和 redirect 有些像，都是访问不同的路径但是路由至同一个组件。但 alias 的设定是多个路径
对应同一个组件；而 redirect 的设定是，试图访问 B 组件时，由于某些原因不能实现访问，重定
向至 A 组件。
