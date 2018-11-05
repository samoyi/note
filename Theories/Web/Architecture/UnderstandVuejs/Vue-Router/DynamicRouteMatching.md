# Dynamic Route Matching

## 功能
1. 通过 URL 向组件传参，只不过这里的组件是动态组件`router-view`。
2. 从理论上来说，也可以通过 prop 给`router-view`传参，例如写成
`<router-view :id="456"></router-view>`。但因为`<router-view>`是一个多个组件公用的
渲染出口，你为了给其中一个组件传参，就在这个公共出口上加一个属性显然不合适。而且如果多个
组件都需要参数，那就要在`<router-view>`写一大堆属性。
3. 而且还有一个明显的好处是，参数在 URL 里就可以保存下来，可以直接访问当前参数对应的页
面。


## 路由参数
### 路径的写法
1. 例如`/user`路径将路由至 User 组件，那么可以通过`/user/username1`、
`/user/username2`的形式给 User 组件传参。
2. 上述带参数的路径都会路由至 User 组件，而组件内部会接收到不同的用户名，以此来请求和显
示针对当前用户的内容。

### 路由的写法
1. 导向 User 组件的路由写法比如是：`{ path: '/user', component: User }`。
2. 为了能够让`path`属性接受参数，需要使用`:`来指示参数
    ```js
    { path: '/user/:username', component: User }
    ```
3. 这样，路径中的参数就会匹配到路由`path`属性中的`username`

### 组件内部获得参数
1. 现在，组件内部需要获得`username`的值，可以通过`this.$route.params`找到路径参数。即
`this.$route.params.username`

### 多路由参数的形式
1. 上面是显示某个用户的页面。比如现在想显示某个用户页面的同时还要显示它的某一篇文章，现
在就需要两个参数：用户名和文章 ID。
2. 路径的写法要变成比如`/user/username1/post/12`，即显示 username1 的第12篇文章。
3. 路由的写法就需要对应两个参数
    ```js
    { path: '/user/:username/post/:id', component: User }
    ```
4. 组件内部出了还是通过`this.$route.params.username`来获得用户名外，还要通过
`this.$route.params.id`来获得文章 ID。


## 组件内路由时的问题
1. 当使用路由参数时，例如从`/user/foo`导航到`/user/bar`，原来的组件实例会被复用。因为
两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。
2. 不过，这也意味着组件的生命周期钩子不会再被调用。
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

    new Vue({
        router: new VueRouter({routes}),
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

### 可以通过 watcher 和 Navigation Guards 两种方法来监听参数变化。
#### watcher 方法
1. 相比于`update`钩子函数会响应组件的所有更新，watch `$route`就只是监听当前组件的路由
变化。
2. The route object is immutable. Every successful navigation will result in a
fresh route object.
    ```js
    const User = {
        template: `<div>
                        {{$route.params.username}}的页面
                    </div>`,
        watch: {
            $route(to, from){
                console.log(`从${from.params.username}的页面
                                切换到了${to.params.username}的页面`);
            },
        },
    };
    const Post = {
        template: `<div>
                        {{$route.params.username}}的第{{$route.params.id}}篇文章
                    </div>`,
        watch: {
            $route(to, from){
                console.log(`从${from.params.username}的第${from.params.id}篇文章
                        切换到了${to.params.username}的第${to.params.id}篇文章`);
            },
        },
    };
    ```
2. 不过因为只是 watch 当前组件路由的更新，所以在组件间切换的时候，组件实例会重建，所以
`$route`并不存在变化。
3. 但你如果给`<router-view></router-view>`加上`<keep-alive>`，从而使得组件间切换的时
候组件实例不会被销毁，那么组件间切换时，每个组件的`$route`就能出现更新。虽然可以，但并
不应该用这种方法。

#### Navigation Guards
1. 使用组件内的路由钩子函数`beforeRouteUpdate`，也可以监听到组件内的路由更新
```js
const User = {
    template: `<div>
                    {{$route.params.username}}的页面
                </div>`,
    beforeRouteUpdate (to, from, next) {
        console.log(`从${from.params.username}的页面
                    切换到了${to.params.username}的页面`);
        next();
    },
};
const Post = {
    template: `<div>
                    {{$route.params.username}}的第{{$route.params.id}}篇文章
                </div>`,
    beforeRouteUpdate (to, from, next) {
        console.log(`从${from.params.username}的第${from.params.id}篇文章`
                    `切换到了${to.params.username}的第${to.params.id}篇文章`);
        next();
    },
};
```
2. 看起来这个方法的语义化比 watcher 方法更好


## Advanced Matching Patterns
