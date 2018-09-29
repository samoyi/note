# Redirect and Alias










## Redirect
1. 通过路由配置的`redirect`属性来设置重定向
2. 如果要设置静态的重定向路径，`redirect`的值可以是路径字符串或者是命名路由对象。

```html
<div id="app">
    <router-link to="/user">试图跳转到不存在 user 组件，然后会被重定向到 home 组件</router-link>
    <br />
    <router-view></router-view>
</div>
```
```js
const Home = {
    template: `<div>Home</div>`
};

const routes = [
    {
        path: '/',
        component: Home,
        name: 'home',
    },
    {
        path: '/user',
        redirect: '/'
        // redirect: { name: 'home' }, // 也可以设置为命名路由对象
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

### 默认路由
下面的例子，在路径匹配不到任何一条设定的路由时，会重定向至指定的路由
```js
{path: '*', redirect: '/'}
```


## Alias
1. `redirect`的作用是访问`/b`时重定向到`/a`；`alias`的作用是访问`/b`时显示`/a`对应
的组件。前者是路径的重定向，后者是组件的共用。
3. 所以使用`redirect`时`/b`会变成`/a`，但使用`alias`是 URL 仍然是`/b`。
