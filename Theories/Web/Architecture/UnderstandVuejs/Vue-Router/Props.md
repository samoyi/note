# Props

1. Using `$route` in your component creates a tight coupling with the route
which limits the flexibility of the component as it can only be used on certain
URLs.
    ```js
    // 这个组件和 URL 中的 id 耦合了
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
2. To decouple this component from the router use option `props`.
    ```js
    const User = {
        props: ['id'],
        template: '<div>User {{ id }}</div>',
    };
    const routes = [
        {
            path: '/user/:id',
            component: User,
            props: false
        },
    ];
    ```
3. 现在，`id`可以通过 props 传入。如果不传值进去，则`User`模板中的`{{ id }}`就不会渲
染。这样就实现了组件和 URL 中`id`的解耦，而不是像耦合状态下`{{ $route.params.id }}`
肯定要渲染的情况。


## 有三种方式来控制是否传值进去
### Boolean mode
上面例子中是 Boolean mode，如果路由设置中的`props`设置为`true`，`id`才会传入，组件内
部`{{ id }}`才会渲染。设为`false`或不设置都不会传入`id`.

### Object mode
`props`如果是对象，则对象属性都会作为组件的 prop 传入
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
            id: 'Hime',
            anohterProp: 'Hina',
        },
    },
];
```

### Function mode


## 对于包含命名视图的路由，你必须分别为每个命名视图添加 `props` 选项
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
