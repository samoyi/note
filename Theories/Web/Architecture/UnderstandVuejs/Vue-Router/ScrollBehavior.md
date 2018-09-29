# Scroll Behavior


## 用法
1. 当创建一个 Router 实例时，可以提供一个`scrollBehavior`方法，该方法的返回值会决定进
入路由时滚动的位置。
    ```js
    const router = new VueRouter({
        routes: [...],
        scrollBehavior (to, from, savedPosition) {
            // return 期望滚动到哪个的位置
        }
    })
    ```
2. 要设定有效的滚动，可以让`scrollBehavior`返回以下两种形式对象：
    * `{ x: number, y: number }`
    * `{ selector: string, offset? : { x: number, y: number }}`
3. 在第二次进入一个路由的时候，`savedPosition`参数保存的是上次离开这个路由时的位置信息
。但这个参数只在使用`popstate`导航（通过浏览器的 前进/后退 按钮触发）时才有效，否则值就
是`null`。
4. 如果返回 falsy 值或空对象，则不会进行滚动。注意不滚动不是说滚动条在最上面，而是说在
导航过程中，滚动条位置不变。
5. 注意这个方法是注册在`new VueRouter()`的选项对象参数中的，也就是说它默认作用域是整个
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
		console.log(savedPosition);

		// 通过 to.matched[to.matched.length-1] 获得要导航到的路径的路由记录
		// 然后再获得它的 meta 上记录的需要滚动的位置
        const scrollTo = to.matched[to.matched.length-1].meta.scrollTo;
        if (scrollTo >= 0){
            return { x: 0, y: scrollTo };
        }
        else { // 如果 meta 没有设置 scrollTo，即这里的 /login，则维持当前滚动条位置
            return false;
        }
    },
});

new Vue({
    el: '#app',
    router,
});
```


## 滚动到锚点
1. 默认情况下，即使在 URL 通过 hash 指定了锚点，路由之后也不会滚动到指定的元素
2. 如果要实现滚动到锚点，`scrollBehavior`返回的对象要有`selector`属性，属性值要设置为
锚点字符串，如`"#anchor"`
3. 下面的例子中，点击链接会的导航路径是带锚点的。但是如果你不设置`scrollBehavior`，那
么导航之后是不会自动滚动到锚点的。
```html
<style>
    #app>div{
        height: 2000px;
        border: solid;
    }
	#anchor, #anchor1{
		position: relative; top: 600px;
	}
	#anchor1{
		top: 700px;
	}
</style>
<div id="app">
    <router-link to="/foo#anchor">Foo</router-link> <br />
    <router-view></router-view>
</div>
```
```js
const Foo = {
    template: `<div>
                    <h1>Foo</h1>
					<div id="anchor">anchor</div>
					<br /><br /><br /><br /><br />
					<div id="anchor1">anchor1</div>
                </div>`,
};

const routes = [
    {
        path: '/foo',
        component:  Foo,
    },
];

const router = new VueRouter({
    routes,
    scrollBehavior (to, from, savedPosition) {
		// 这里直接把锚点设置为了 URL中的 hash
        // 当然也可以设置为页面上任意一个元素，比如设置为 #anchor1
		return {selector: to.hash};
    },
});

new Vue({
    el: '#app',
    router,
});
```


## 异步滚动
还可以通过返回 promise 来实现异步滚动

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
