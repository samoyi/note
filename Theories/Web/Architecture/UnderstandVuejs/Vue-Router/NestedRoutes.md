# Nested Routes

## 三层嵌套路由示例
URL: `/user/33/profile/career`

```html
<div id="app">
    <!-- 顶级路由出口 渲染 User 模块-->
    <router-view></router-view>
</div>
```
```js
const User = {
    template: `<div>
                    这是 {{$route.params.username}} 的页面
                    <!-- User 模块内嵌路由出口 渲染 Profile 模块-->
                    <router-view></router-view>
                </div>`,
};
const Profile = {
    template: `<div>
                    这里显示 {{$route.params.username}} 的 profile
                    <!-- Profile 模块内嵌路由出口 渲染 Career 模块-->
                    <router-view></router-view>
                </div>`,
};
const Career = {
    template: `<div>这里显示 {{$route.params.username}} 的 career</div>`,
};

const routes = [
    {
        path: '/user/:username',
        component: User,
        children: [
            {
                path: 'profile',
                component: Profile,
                children: [{
                    path: 'career',
                    component: Career,
                }],
            },
        ],
    },
];

const router = new VueRouter({routes});

new Vue({
    el: '#app',
    router,
});
```
