# Dynamic Route Matching

1. One thing to note when using routes with params is that when the user
navigates from `/user/foo` to `/user/bar`, the same component instance will be
reused.
2. Since both routes render the same component, this is more efficient than
destroying the old instance and then creating a new one. However, this also
means that the lifecycle hooks of the component will not be called.

```html
<div id="app">
    <p>
        <router-link to="/user/user1">Go to User1</router-link>
        <router-link to="/user/user2">Go to User2</router-link>
        <router-link to="/user/user1/post/2">User1第二篇文章</router-link>
        <router-link to="/user/user2/post/4">User2第四篇文章</router-link>
    </p>
    <router-view></router-view>
</div>
```

```js
const User = {
    template: '<div>{{$route.params.username}}的页面</div>' ,
    created(){
        console.log('User created');
    },
};
const Post = {
    template: '<div>{{$route.params.username}}的第{{$route.params.id}}篇文章</div>' ,
    created(){
        console.log('Post created');
    },
};

const routes = [
    {
        path: '/user/:username',
        component: User
    },
    {
        path: '/user/:username/post/:id',
        component: Post
    },
]

const router = new VueRouter({
    routes
})

const app = new Vue({
    router,
    updated(){
        console.log(this.$route.params);
    },
}).$mount('#app')
```
3. 这个例子中，在两个 User 之间切换或者在两个 Post 之间切换的时候，不会重新创建组件实例
，不会触发`created`钩子函数。只有在 User 和 Post 之间切换的时候，才会触发重新创建组件
实例。
4. 在同一个组件内切换时，因为有数据更新，所以组件及其父级都可以正常的触发`updated`。但
是，不能使用`updated`来监听路由参数变化，因为其他变化也有可能触发`updated`。


## Reacting to Params Changes
可以通过 watcher 和 Navigation Guards 两种方法来监听参数变化。
```js
// watcher 方法
const User = {
    template: '<div>{{$route.params.username}}的页面</div>',
    watch: {
        $route(to, from){
            console.log(`从${from.params.username}的页面切换到了${to.params.username}的页面`);
        },
    },
};
const Post = {
    template: '<div>{{$route.params.username}}的第{{$route.params.id}}篇文章</div>',
    watch: {
        $route(to, from){
            console.log(`从${from.params.username}的第${from.params.id}篇文章` +
                `切换到了${to.params.username}的第${to.params.id}篇文章`);
        },
    },
};
```
```js
// Navigation Guards 方法
const User = {
    template: '<div>{{$route.params.username}}的页面</div>',
    beforeRouteUpdate (to, from, next) {
        console.log(`从${from.params.username}的页面切换到了${to.params.username}的页面`);
        next();
    },
};
const Post = {
    template: '<div>{{$route.params.username}}的第{{$route.params.id}}篇文章</div>',
    beforeRouteUpdate (to, from, next) {
        console.log(`从${from.params.username}的第${from.params.id}篇文章` +
            `切换到了${to.params.username}的第${to.params.id}篇文章`);
        next();
    },
};
```


## Advanced Matching Patterns
