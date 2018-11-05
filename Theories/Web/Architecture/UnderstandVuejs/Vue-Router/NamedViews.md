# Named Views

## 用途
1. 有时候想同时 (同级) 展示多个视图，而不是嵌套展示，例如创建一个布局，有 sidebar
(侧导航) 和 main (主内容) 两个视图。
2. 例如路由在不同的用户之间切换，每个用户要同时同级显示三个模块，分别是 profile、
article 和 album。当然你也可以只渲染一个包含这三个模块的大模块，但总是有需要独立渲染的
场景。
3. 之前配置 routes 的时候，是一个 path 对应 一个 component，现在成了一个 path 对应三
个 component 了。就需要知道三个 component 分别要渲染到哪个`route-view`。
4. 因此就和 slot 的情况一样，在默认 slot 的基础上又需要 named slot。


## 方法
1. 之前在设置 route 时，是`{path: '/', component: Foo}`，现在因为要渲染多个组件，所
以要把`component`改为`components`，并设置为一个对象。
2. 对象的键为路由出口名称，对应的值为路由组件。同样可以保留一个默认的不用命名的路由出口，
对应的键名为`default`.

```html
<div id="app">
    <!-- 两条路由 -->
    <router-link to="/user/22">user22</router-link>
    <router-link to="/user/33">user33</router-link>

    <!-- 每条路由渲染三个模块 -->
    <router-view></router-view> <!-- default 模块渲染到这里 -->
    <router-view name="article"></router-view> <!-- article 模块渲染到这里 -->
    <router-view name="album"></router-view> <!-- album 模块渲染到这里 -->
</div>
```
```js
const UserProfile = { template: '<p>User {{$route.params.username}} profile</p>' };
const UserArticle = { template: '<p>User {{$route.params.username}} article</p>' };
const UserAlbum = { template: '<p>User {{$route.params.username}} album</p>' };

const routes = [
    {
        // 一个 path 对应三个 component
        path: '/user/:username',
        components: {
            // 每个渲染出口和它对应的模块
            default: UserProfile,
            article: UserArticle,
            album: UserAlbum,
        },
    },
];

new Vue({
    el: '#app',
    router: new VueRouter({routes}),
});
```


## 嵌套路由结合命名视图
1. 看起来只是把两者结合起来从而更复杂了一些而已，并没有什么特殊的。
2. 下面的例子中，整体是一个`UserSettings`组件，对应最外层的路由出口。
3. 该组件有两个非路由子节点和两个路由子节点，两个路由子节点对应两个路由出口。
4. 之前讲到的嵌套路由是每个嵌套层只有一条子路由，这里只是变成了两个而已。
5. 因此`UserSettings`路由的`children`是两项，对应两条子路由。
6. 第一条子路由只有一个默认组件`UserEmailsSubscriptions`，因此会渲染到非命名的
`router-view`上（当然你也可以通过给这个组件设定命名使其渲染到`helper`视图上）；第二条
子路由有一个默认组件`UserProfile`和一个对应命名视图的组件`UserProfilePreview`，因此会
渲染到两个`router-view`上。

```html
<div id="app">
    <router-link to="/settings/emails">emails</router-link>
    <router-link to="/settings/profile">profile</router-link>

    <!-- UserSettings 的路由出口 -->
    <router-view></router-view>
</div>
```
```js
const UserSettings = {
    template: `<div>
                  <h1>User Settings</h1>
                  <nav-bar></nav-bar>
                  <!-- 两个嵌套路由出口 -->
                  <router-view></router-view>
                  <router-view name="preview"></router-view>
               </div>`,
    components: {
        'nav-bar': {
            template: `<ul>
                            <li>Nav1</li>
                            <li>Nav2</li>
                            <li>Nav3</li>
                        </ul>`,
        },
    },
};


const UserEmailsSubscriptions = {
    template: `<p>UserEmailsSubscriptions</p>`
};
const UserProfile = {
    template: `<p>UserProfile</p>`
};
const UserProfilePreview  = {
    template: `<p>UserProfilePreview </p>`
};


const routes = [
    {
        path: '/settings',
        component: UserSettings,
        // 两条嵌套路由
        children: [
            {
                path: 'emails',
                // 第一条嵌套路由渲染一个路由出口
                component: UserEmailsSubscriptions,
            },
            {
                path: 'profile',
                // 第二条嵌套路由渲染两个路由出口
                components: {
                    default: UserProfile,
                    preview: UserProfilePreview,
                },
            },
        ],
    },
];

new Vue({
    el: '#app',
    router: new VueRouter({routes}),
});
```
