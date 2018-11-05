# Nested Routes

1. 根组件包含一个`<router-view>`，对应若干条 route。同样，一个路由组件内也可以包含自己
的路由出口`<router-view>`，并且根据子一级的路径设置若干条 route，来加载若干子一级的路
由组件。
2. 在配置 routes 时，这种关系要通过一个 route 的`children`属性来体现。该属性为一个数
组，结构和顶级 routes 数组类似，包含若干个 route 配置。


## 三层嵌套路由示例
1. 根组件路由出口只匹配一个路径`/user/:username`，路由至一个组件`User`
2. 其子级组件`User`内部也有自己的一个路由出口，也是只匹配了一个路径`profile`，路由至组
件`Profile`
3. `Profile`组件内部也有自己的一个路由出口，但这个`<router-view>`匹配了两个路径，分别
是`info`和`career`，分别路由至`Info`组件和`Career`组件。
4. 当路径为`/user/33`，就会路由至用户 33 的用户组件；当路径为`/user/33/profile`时，会
路由至用户 33 的用户组件并且在其内部有路由至子组件`Profile`；同样，在此基础上，
`/user/33/profile/info`和`/user/33/profile/career`将在 33 的`Profile`组件上路由显
示子组件`Info`和`Career`。

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
                    这是 {{$route.params.username}} 的 profile
                    <!-- Profile 模块内嵌路由出口 渲染 Career 模块-->
                    <router-view></router-view>
                </div>`,
};
const Info = {
    template: `<div>这是 {{$route.params.username}} 的 info</div>`,
};
const Career = {
    template: `<div>这是 {{$route.params.username}} 的 career</div>`,
};

const routes = [
    {
        path: '/user/:username',
        component: User,
        children: [
            {
                path: 'profile',
                component: Profile,
                children: [
                    {
                        path: 'career',
                        component: Career,
                    },
                    {
                        path: 'info',
                        component: Info,
                    },
                ],
            },
        ],
    },
];
```
