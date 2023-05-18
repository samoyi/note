# Basic


<!-- TOC -->

- [Basic](#basic)
    - [基本原理](#基本原理)
    - [基本用法](#基本用法)
    - [Matching Priority](#matching-priority)
    - [Named Routes](#named-routes)
    - [`$route.matched`](#routematched)
    - [Route Meta Fields](#route-meta-fields)

<!-- /TOC -->


## 基本原理
* 监听 URL 变化，使用动态组件方法在 `<router-view>` 上渲染不同的不同的组件
* 实现一个很简单的路由器插件：

```js
// MyRouter.js
function install (Vue) {
    Vue.mixin({
        // 添加两个全局组件 router-link 和 router-view
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
                        // 这个属性是当前要显示的组件
                        ViewComponent: null,
                    };
                },
                mounted(){
                    // 因为通过 vm 实例的 router 选项将路由器实例注入，所以这里可以
                    // 通过 this.$parent.$options.router 引用路由器实例
                    const routes = this.$parent.$options.router.routes;

                    // 刚加载页面时，根据当前 hash，设定要显示的组件
                    this.ViewComponent = routes[location.hash.slice(1)];

                    // 监听 hash 变化，改变显示的组件
                    window.addEventListener('hashchange', ()=>{
                        this.ViewComponent = routes[location.hash.slice(1)];
                    });
                },
                // 使用动态组件方法
                template: `<div :is="ViewComponent"></div>`,
            },
        },
    })
}

export default class MyRouter {
    // 实例化路由器时，接受 routes 设置，并将其保存为路由器实例的属性
    constructor(routes){
        this.routes = routes;
    }
}

MyRouter.install = install;
```

```html
<body>
	<div id="app">
	    <router-link to="/">home</router-link>
	    <router-link to="/about">about</router-link>
	    <router-link to="/user">user</router-link>

	    <router-view></router-view>
	</div>
</body>
<script src="./vue.js"></script>
<script type="module">

// 引用和使用路由器插件
import MyRouter from './MyRouter.js';
Vue.use(MyRouter);

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

// 实例化路由并注入 routes 设置
const router = new MyRouter(routes);

new Vue({
    el: '#app',
	// 通过 router 属性注入路由器实例
	router,
});
</script>
```


## 基本用法
1. 使用 Vue.js ，我们已经可以通过组合组件来组成应用程序，当你要把 Vue Router 添加进来，我们需要做的是，将组件 (components) 映射到路由 (routes)，然后告诉 Vue Router 在哪里渲染它们。这段描述其实和上面基本原理相同。
2. 通过注入路由器，我们可以在任何组件内通过 `this.$router` 访问路由器，也可以通过 `this.$route` 访问当前路由。
3. 示例
    ```html
    <div id="app">
        <h1>Hello App!</h1>
        <p>
            <!--使用 router-link 组件进行导航 -->
            <!--通过传递 `to` 来指定链接 -->
            <!--`<router-link>` 将呈现一个带有正确 `href` 属性的 `<a>` 标签-->
            <router-link to="/">Go to Home</router-link>
            <router-link to="/about">Go to About</router-link>
        </p>
        <!-- 路由出口 -->
        <!-- 路由匹配到的组件将渲染在这里 -->
        <router-view></router-view>
    </div>
    ```
    ```js
    import { createRouter, createWebHashHistory } from 'vue-router'
    
    // 1. 定义路由组件.
    // 也可以从其他文件导入
    const Home = { template: '<div>Home</div>' }
    const About = { template: '<div>About</div>' }

    // 2. 定义一些路由
    // 每个路由都需要映射到一个组件。
    // 我们后面再讨论嵌套路由。
    const routes = [
        { path: '/', component: Home },
        { path: '/about', component: About },
    ]

    // 3. 创建路由实例并传递 `routes` 配置
    // 你可以在这里输入更多的配置，但我们在这里
    // 暂时保持简单
    const router = VueRouter.createRouter({
        // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
        history: VueRouter.createWebHashHistory(),
        routes, // `routes: routes` 的缩写
    })

    // 5. 创建并挂载根实例
    const app = Vue.createApp({})
    //确保 _use_ 路由实例使
    //整个应用支持路由。
    app.use(router)

    app.mount('#app')
    ```
4. 通过调用 `app.use(router)`，我们会触发第一次导航且可以在任意组件中以 `useRouter` 使用它
    ```js
    import { useRouter } from 'vue-router'

    const router = useRouter();

    onMounted (() => {
        router.push('/about')
    })
    ```































    


## Matching Priority
有时多个 route 可能设置了相同的`path`，这种情况下的匹配优先级取决于设定的顺序：越早设定
的路由拥有更高的优先级
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
        声明式导航时，命名路由可以像下面这样设置动态路由匹配，比上面的的要麻烦，不过意
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
                this.$router.push('/user/33');
            }
            else {
                // 编程式导航时，相比于上面直接`push('/user/33')`也是更麻烦了，不过
                // 确实意思更明确
                this.$router.push({name: 'user', params: {username: '22'}});
            }
        }, 3000);
    },
});
```


## `$route.matched`
1. `routes`中的每个路由对象被称为一个路由记录（route record）。
2. 路由记录可以嵌套。因此当匹配到某个路由时，可能同时匹配到了好几个路由记录。
3. 这些所有匹配到的路由记录，以数组的形式暴露在组件`$route`对象和导航钩子路由对象的
`matched`属性中。
4. 一个 route record 对象保存的是关于路由设置的若干属性，而一个`route`对象保存的是路由
行为相关的属性。虽然两者会有重复的属性，但也有一些是根据其定位而独有的属性。例如前者会有
`redirect`属性，显然是只和路由设置有关的；而后者会有`query`属性，显然是只和实际路由行
为有关的。

```html
<div id="app">
    <router-link to="/login">login</router-link> <br />
    <router-link to="/profile/detail/setting">profile detail setting</router-link>
    <br /><br />

    <router-view></router-view>
</div>
```
```js
const Login = {
    template: `<div>
                    Login component
                </div>`,

};
const Profile = {
    template: `<div>
                    Profile component
                    <router-view name="detail1"></router-view>
                    <router-view name="detail2"></router-view>
                </div>`,
};
const Detail1 = {
    template: `<div>
                    detail1
                    <router-view></router-view>
                </div>`,
};
const Detail2 = {
    template: `<div>
                    detail2
                    <router-view></router-view>
                </div>`,
};
const Setting = {
    template: `<p>setting</p>`,
	mounted(){
		console.log('↓------从组件实例里读取 matched ----开始----------')
		console.log(this.$route.matched);
		console.log('↑------从组件实例里读取 matched ----结束----------\n\n')
	},
};

const routes = [
    {
        path: '/profile',
        component:  Profile,
        children: [
            {
                path: 'detail',
                components: {
                    detail1: Detail1,
                    detail2: Detail2,
                },
                children: [
                    {
                        path: 'setting',
                        component: Setting,
                        meta: {requiresAuth: true},
						name: 'setting',
                    }
                ],
                meta: ['Hime', 'Hina'],
            },
        ],
        meta: {name: '33'},
    },
    {
        path: '/login',
        component:  Login,
        meta: {age: 22},
    },
];

const router = new VueRouter({routes});

router.beforeEach((to, from, next)=>{
    // 路由至 Setting 组件时
	if (to.name === 'setting'){
		console.log('↓------从路由钩子里读取 matched ----开始----------')
		console.log(to.matched.length); // 3
		console.log(to.matched.map(route=>route.path));
		// ["/profile", "/profile/detail", "/profile/detail/setting"]
		console.log(JSON.stringify(to.matched.map(route=>route.meta), null, 4));
		// [
		//     {
		//         "name": "33"
		//     },
		//     [
		//         "Hime",
		//         "Hina"
		//     ],
		//     {
		//         "requiresAuth": true
		//     }
		// ]
		console.log('↑------从路由钩子里读取 matched ----结束----------\n\n')
	}
    next();
});


new Vue({
    el: '#app',
    router,
});
```

4. 上面的例子，当通过`/profile/detail/setting`路由至`Setting`组件时，当前 route 匹配
到了三条 route 记录


## Route Meta Fields
1. `$route.matched`的例子中，每个 route 都有一个`meta`属性，而且在`beforeEach`钩子中
输出了匹配到的每条 route 记录的`meta`。
2. 假设我们设定进入`Setting`组件时需要时登陆状态，那么就可以通过`beforeEach`钩子和
`/profile/detail/setting`路由的`meta`来实现鉴权
    ```js
    router.beforeEach((to, from, next) => {
        // 如果某条 route要求权限
        if (to.matched.some(route => route.meta.requiresAuth)) {
            if (!auth.loggedIn()) { // 如果没有登陆登陆
                next({ // 路由至登录页面
                    path: '/login',
                    query: { redirect: to.fullPath },
                });
            }
            else {
                next();
            }
        }
        else {
            next();
        }
    })
    ```
3. 如果没有设置`meta`，则默认为空对象。
