# Lazy Loading Routes

1. 当打包构建应用时，Javascript 包会变得非常大，影响页面加载。如果我们能把不同路由对应
的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。
2. 需要把组件定义为一个函数，该函数返回一个 promise，该 promise 的解析结果应该是组件选
项对象。
3. 结合 webpack，完整的代码如下：

* `src\index.js`
    ```js
    import Vue from 'vue'
    import VueRouter from 'vue-router'

    Vue.use(VueRouter)

    const Login = {
        template: `<div>
                        Login 组件
                    </div>`,
    };

    // Profile 异步加载，将其定义为一个返回 promise 的函数
    const Profile = ()=>import('./Profile.vue');

    const routes = [
        {
            path: '/login',
            component:  Login,
        },
        {
            path: '/profile',
            component:  Profile,
        },
    ];

    const router = new VueRouter({
        routes,
    });

    new Vue({
        el: '#app',
        router,
    });
    ```
* `src\Profile.vue`
    ```html
    <template>
        <div>
            Profile 组件
        </div>
    </template>
    ```
* `webpack.config.js`
    ```js
    const path = require('path');
    const VueLoaderPlugin = require('vue-loader/lib/plugin')

    module.exports = {
        entry: './src/index.js',
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist'),
        },
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
            },
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                },
            ],
        },
        plugins: [
            new VueLoaderPlugin()
        ],
    };
    ```
* `dist\index.html`
    ```html
    <!doctype html>
    <html>
    <head>
        <title>异步路由</title>
        <meta charset="utf-8">
    </head>
    <body>
        <h1>异步路由</h1>
        <div id="app">
            <router-link to="/login">login</router-link> <br />
            <router-link to="/profile">profile</router-link> <br /><br />

            <router-view></router-view>
        </div>
        <script src="bundle.js"></script>
    </body>
    </html>
    ```


## Grouping Components in the Same Chunk
1. 现在比如，上面的异步路由组件 Profile 里面还有一个子路由。`src\Profile.vue`文件：
    ```html
    <template>
        <div>
            Profile 组件
            <router-view></router-view>
        </div>
    </template>
    ```
2. 假如这个子路由对应子组件`Detail`。你可以把这个子路由组件定义成同步的，也可以定义成异
步的。
    ```js
    // const Detail = () => import('./Detail.vue') // 异步
    const Detail = { // 同步
        template: `<div>
            Profile Detail 组件
        </div>`
    }
    ```
3. 如果定义成同步的，`Detail`并不会打包进其父级`Profile`组件的 JS 文件里，而是会打包进
`dist\bundle.js`。也就是说在页面刚加载的时候就会加载这个可能用不到的组件。
4. 所以`Detail`也要定义成异步的，即上面中注释的那样。所以现在有了两个父子异步组件：
    ```js
    const Profile = () => import('./Profile.vue')
    const Detail = () => import('./Detail.vue')
    ```
5. 在 Webpack 打包时，分别输出为单独的 JS 文件。默认名为`1.bundle.js`和`2.bundle.js`
6. 当路由至`/profile`时，会加载`1.bundle.js`；再路由至`/profile/detail`时，再加载
`2.bundle.js`；或者直接路由至`/profile/detail`时，会同时加载`1.bundle.js`和
`2.bundle.js`。
7. 这样其实挺好，在用户只打算去`/profile`而不打算去`/profile/detail`时，就省去了加载
`2.bundle.js`。
8. 但如果`Detail`组件并没有多大，那么把这两个组件打包成一个文件，可以减少省去一次请求时
间，而且会更整齐一些。想象如果`Profile`不止一个`Detail`组件，它还有其他好几个后代组件，
那就会打包生成一堆小文件。
9. 通过设定被打包组件的 chunk name，相同 chunk name 的组件会被打包到一起
    ```js
    const Profile = () => import(/* webpackChunkName: "group-profile" */ './Profile.vue')
    const Detail = () => import(/* webpackChunkName: "group-profile" */ './Detail.vue')
    ```
10. 这样打包后，`Profile`和`Detail`会合并生成一个文件`1.bundle.js`。在初次路由至
`/profile`或`/profile/detail`时，会加载`1.bundle.js`，从而把`Profile`及其子组件一起
加载。
11. 上面虽然设定了 chunk name 为`"group-profile"`，但输出的文件名还是`1.bundle.js`。
因为还没有在`webpack.config.js`配置`chunkFilename`，配置之后，打包输出的文件名就是
`group-profile.js`。下面是完整的代码：

* `src\index.js`
    ```js
    import Vue from 'vue'
    import VueRouter from 'vue-router'

    Vue.use(VueRouter)

    const Login = {
        template: `<div>
                        Login 组件
                    </div>`,
    };

    const Profile = () => import(/* webpackChunkName: "group-profile" */ './Profile.vue')
    const Detail = () => import(/* webpackChunkName: "group-profile" */ './Detail.vue')

    const routes = [
        {
            path: '/login',
            component:  Login,
        },
        {
            path: '/profile',
            component:  Profile,
            children: [
                {
                    path: 'detail',
                    component: Detail,
                },
            ],
        },
    ];

    const router = new VueRouter({
        routes,
    });

    new Vue({
        el: '#app',
        router,
    });
    ```
* `src\Profile.vue`
    ```html
    <template>
        <div>
            Profile 组件
            <router-view></router-view>
        </div>
    </template>
    ```
* `src\Detail.vue`
    ```html
    <template>
        <div>
            Profile Detail 组件
        </div>
    </template>
    ```
* `webpack.config.js`
    ```js
    const path = require('path');
    const VueLoaderPlugin = require('vue-loader/lib/plugin')

    module.exports = {
        entry: './src/index.js',
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist'),
            chunkFilename: '[name].js', // 输出的文件名是 webpackChunkName 设定的
        },
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
            },
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                },
            ],
        },
        plugins: [
            new VueLoaderPlugin()
        ],
    };
    ```
* `dist\index.html`
    ```html
    <!doctype html>
    <html>
    <head>
        <title>异步路由</title>
        <meta charset="utf-8">
    </head>
    <body>
        <h1>异步路由</h1>
        <div id="app">
            <router-link to="/login">login</router-link> <br />
            <router-link to="/profile">profile</router-link> <br />
            <router-link to="/profile/detail">detail</router-link> <br /><br />

            <router-view></router-view>
        </div>
        <script src="bundle.js"></script>
    </body>
    </html>
    ```
