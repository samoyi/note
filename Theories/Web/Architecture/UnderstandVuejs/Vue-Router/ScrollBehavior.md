# Scroll Behavior

```js
scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
}
```

1. 通过一个 route 的`scrollBehavior`方法，来定义每次路由后页面的滚动位置。
2. 通过返回值来设定进入路由是滚动的位置。
3. 要设定有效的滚动，可以让`scrollBehavior`返回以下两种形式对象：
    * `{ x: number, y: number }`
    * `{ selector: string, offset? : { x: number, y: number }}`
4. 在第二次进入一个路由的时候，`savedPosition`参数保存的是上次离开这个路由时的位置信息
。但这个参数只在使用`popstate`导航（通过浏览器的 前进/后退 按钮触发）时才有效，否则值就
是`null`。
5. 如果返回 falsy 值或空对象，则不会进行滚动。注意不滚动不是说滚动条在最上面，而是说在
导航过程中，滚动条位置不变。
5. 注意这个方法是注册在`new VueRouter()`的选项对象参数中的，也就是说它默认是作用域整个
router 而非某个单独的 route。
6. 但你可以通过给每个 route 的`meta`设定滚动信息，然后通过`scrollBehavior`方法的`to`
参数来获取到当前 route 的滚动信息，进而执行针对该 route 的滚动。

```html
<style>
    #app>div{
        height: 2000px;
        border: solid;
        /* position: relative; */
    }
    #app>div>div{
        height: 1000px;
        border: solid red;
        /* position: relative; */
    }
</style>
<div id="app">
    <router-link to="/login">login</router-link> <br />
    <router-link to="/profile">profile</router-link> <br /><br />
    <router-link to="/profile/detail">detail</router-link> <br /><br />

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
                    <router-view></router-view>
                </div>`,
};
const Detail = {
    template: `<div>
                    Profile detail
                </div>`,
};

const routes = [
    {
        path: '/login',
        component:  Login,
        name: 'login',
    },
    {
        path: '/profile',
        component:  Profile,
        name: 'profile',
        meta: {scrollTo: 100}, // 如果导航到 /profile 滚动到 Y 轴 100px
        children: [{
            path: 'detail',
            component: Detail,
            name: 'detail',
            meta: {scrollTo: 300}, // 如果导航到 /profile/detail 滚动到 Y 轴 300px
        }],
    },
];

const router = new VueRouter({
    routes,
    scrollBehavior (to, from, savedPosition) {
        const scrollTo = to.matched[to.matched.length-1].meta.scrollTo;
        if (scrollTo >= 0){
            return { x: 0, y: scrollTo };
        }
        else { // 如果 meta 没有设置 scrollTo，即这里的 /login，则维持当前滚动条位置
            return false;
        }
    }
});

new Vue({
    el: '#app',
    router,
});
```

7. 如果要实现滚动到锚点，则返回如下对象
    ```js
    {
      selector: to.hash
    }
    ```
8. 还可以通过返回 promise 来实现异步滚动

```html
<style>
    #app>div{
        height: 2000px;
        border: solid;
    }
    #app>div>div{
        height: 1000px;
        border: solid red;
    }
    #login-inner{
        margin-top: 300px;
    }
    #profile-inner{
        margin-top: 600px;
    }
</style>
<div id="app">
    <!-- 导航到带锚点的路由 -->
    <router-link to="/login#login-inner">login</router-link> <br />
    <router-link to="/profile#profile-inner">profile</router-link> <br /><br />

    <router-view></router-view>
</div>
```
```js
const Login = {
    template: `<div>
                    Login component
                    <p id="login-inner">Login p</p>
                </div>`,
};
const Profile = {
    template: `<div>
                    Profile component
                    <p id="profile-inner">Profile p</p>
                </div>`,
};

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
    scrollBehavior (to, from, savedPosition) {
        if (to.hash === '#login-inner'){
            // 滚动到 hash 中指定的锚点
            return {
                selector: to.hash,
            };
        }
        else if (to.hash === '#profile-inner'){
            // 异步滚动
            return new Promise((resolve, reject)=>{
                setTimeout(() => {
                    resolve({ selector: to.hash });
                }, 2000)
            });
        }
        else {
            return false;
        }
    },
});

new Vue({
    el: '#app',
    router,
});
```
