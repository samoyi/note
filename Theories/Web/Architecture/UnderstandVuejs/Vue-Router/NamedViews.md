# Named Views

1. Sometimes you need to display multiple views at the same time instead of
nesting them. This is where named views come in handy.
2. 例如路由在不同的用户之间切换，每个用户要显示三个模块，分别是 profile、article 和
album。当然你也可以只渲染一个包含这三个模块的大模块，但总是有需要独立渲染的场景。
3. 之前配置 routes 的时候，是一个 path 对应 一个 component，现在成了一个 path 对应三
个 component 了。就需要知道三个 component 分别要渲染到哪个 `route-view`。
4. 因此就和 slot 的情况一样，在默认 slot 的基础上又需要 named slot。


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

```html
<div id="app">
    <router-link to="/settings/emails">emails</router-link>
    <router-link to="/settings/profile">profile</router-link>

    <router-view></router-view>
</div>
```
```js
const UserSettings = {
    template: `<div>
                  <h1>User Settings</h1>
                  <nav-bar></nav-bar>
                  <router-view></router-view>
                  <router-view name="helper"></router-view>
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
        children: [
            {
                path: 'emails',
                component: UserEmailsSubscriptions,
            },
            {
                path: 'profile',
                components: {
                    default: UserProfile,
                    helper: UserProfilePreview,
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
