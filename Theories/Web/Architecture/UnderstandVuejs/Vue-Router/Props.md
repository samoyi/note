# Props

## 用途
1. 在组件中使用`$route`会使之与其对应路由形成高度耦合，从而使组件只能在某些特定的 URL
上使用，限制了其灵活性
    ```js
    const User = {
        template: '<div>User {{ $route.params.id }}</div>',
    };
    const routes: [
        {
            path: '/user/:id',
            component: User,
        },
    ];
    ```
2. 上面的`User`组件的写法，因为内部会用到路由参数，所以这个组件只能用于路由组件。那假如
我想把它当做一个普通组件，接收父组件直接传进来的`id`，那我就还需要加上`props`属性，而且
还要判断一下当前是作为普通组件还是路由组件
    ```js
    const User = {
        props: ['id'],
        template: '<div>User {{ id || $route.params.id }}</div>',
    };
    ```
3. 虽然上面这种和路由解耦并兼容普通组件场景的方法行得通，但 vue-router 提供了更方便的
方法，那就是在路径设置中使用`props`属性进行解耦
    ```js
    const User = {
        props: ['id'],
        template: '<div>User {{ id }}</div>',
    };
    const routes = [
        {
            path: '/user/:id',
            component: User,
            props: true
        },
    ];
    ```
3. 现在，`User`组件作为普通组件肯定是没有问题的。而作为路由组件时，因为在路由设置中使用
了`props`属性，路由参数也可以通过 props 传入。


## 有三种方式来控制是否传值进去
### Boolean mode
上面例子中是 Boolean mode，如果路由设置中的`props`设置为`true`，`id`才会传入，设为
`false`或不设置都不会传入`id`。

### Object mode
1. `props`如果是对象，则对象属性都会作为组件的 prop 传入，而 URL 中的参数会被忽略
2. 下面的例子中，如果 URL 路径为`user/33`，虽然路径参数是`"33"`，但该参数会被忽略，只
会传递`props`对象里的参数，所以组件里获得的`id`是`"Hime"`。
3. 即使`props`对象里没有`id`属性，路径参数里的`id`也不会被传入组件。

```js
const User = {
    props: ['id', 'anohterProp'], // 预期接收 id 和 anohterProp
    template: '<div>User {{ id }} {{anohterProp ? "& "+anohterProp : ""}}</div>',
};
const routes = [
    {
        path: '/user/:id',
        component: User,
         // 传入 id 和 anohterProp
        props: {
             // 如果这里没有 id 属性，组件内的 id 值也不是 33，而是 undefined
            id: 'Hime',
            anohterProp: 'Hina',
        },
    },
];
```

### Function mode
1. 上面的对象模式，发现了一个问题，就是`props`对象中的`id`是静态的，但大多数时候我们希
望该`id`的值就是路径参数中的`id`值。
2. 可以将`props`设置为一个函数，该函数接收一个参数引用当前 route 的参数，并返回上面对
象模式中的对象。
    ```js
    props(route){
		return {
			id: route.params.id, // 这样就引用了路径参数中的 id
			anohterProp: 'Hina',
		};
    },
    ```
3. 而且通过`route`参数，还可以获得当前路径的其他信息，可以一起传入组件内
    ```js
    const User = {
        props: ['id', 'friend'],
        template: `<div>{{id}}'s friend is {{friend}}</div>`,
    };
    const routes = [
        {
            path: '/user/:id',
            component: User,
            props(route){
                return {
                    id: route.params.id,
                    friend: route.query.friend, // 获取查询参数
                };
            },
        },
    ];
    当路径为`/user/Hime?friend=Hina`时，渲染结果为`Hime's friend is Hina`
    ```
4. 不懂。请尽可能保持`props`函数为无状态的，因为它只会在路由发生变化时起作用。如果你需
要状态来定义`props`，请使用包装组件，这样 Vue 才可以对状态变化做出反应。


## 对于包含命名视图的路由，你必须分别为每个命名视图添加`props`选项
```html
<div id="app">
    <router-link to="/user/22">22</router-link>
    <br />
    <router-link to="/user/33">33</router-link>
    <br />
    <br />
    <router-view name="profile"></router-view>
    <router-view name="article"></router-view>
</div>
```
```js
const Profile = {
    props: ['id'],
    template: '<div>Profile {{id}}</div>',
};
const Article = {
    props: ['id'],
    template: '<div>Article {{id}}</div>',
};
const routes = [
    {
        path: '/user/:id',
        components: {
            profile: Profile,
            article: Article,
        },
        props: {
            profile: true,
            article: true,
        },
    },
];
new Vue({
    el: '#app',
    router: new VueRouter({routes}),
});
```
