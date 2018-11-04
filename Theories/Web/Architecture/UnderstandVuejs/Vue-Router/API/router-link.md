# API

## `<router-link>`
1. 默认渲染成带有正确链接的`<a>`标签。
2. 当目标路由成功激活时，链接元素自动设置一个表示激活的 CSS 类名`'router-link-active'`

### `<router-link>` 比起写死的 <a href="..."> 会好一些：
* 无论是 HTML5 history 模式还是 hash 模式，它的表现行为一致，所以，当你要切换路由模式，
或者在 IE9 降级使用 hash 模式，无须作任何变动。
* 在 HTML5 history 模式下，`router-link`会守卫点击事件，让浏览器不再重新加载页面。
* 当你在 HTML5 history 模式下使用 base 选项之后，所有的`to`属性都不需要写(基路径)了。

### 将激活 class 应用在外层元素
1. 有时候我们要让激活 class 应用在外层元素，而不是`<a>`标签本身，那么可以用
`<router-link>`渲染外层元素，包裹着内层的原生`<a>`标签
    ```html
    <router-link tag="li" to="/foo">
        <a>/foo</a>
    </router-link>
    ```
2. 在这种情况下，`<a>`将作为真实的链接(它会获得正确的`href`)，而 激活时的 CSS 类名则设
置到外层的 <li>。

### `to`属性
表示目标路由的链接。当被点击后，内部会立刻把`to`的值传到`router.push()`，所以这个值可
以是一个字符串或者是描述目标位置的对象。
```html
<div id="app">
    <p>
        <router-link
            :to="{path: '/foo/hehe', query: {id: 22}}"
        >
            Go to Foo
        </router-link>
        <router-link
            :to="{name: 'bar', params: {param2: 'haha'}, query: {id: 33}}"
        >
            Go to Bar
        </router-link>
    </p>
    <router-view></router-view>
</div>
<script>
const Foo = { template: '<div>foo</div>' };
const Bar = { template: '<div>bar</div>' };

const routes = [
    { path: '/foo/:param1', component: Foo },
    { path: '/bar/:param2', component: Bar, name: 'bar' },
];

const app = new Vue({
    router: new VueRouter({routes}),
    updated(){
        console.log(this.$route.params.param1 || this.$route.params.param2);
        console.log(this.$route.query.id);
    },
}).$mount('#app');
</script>
```

### `replace`属性
设置`replace`属性的话，当点击时，会调用`router.replace()`而不是`router.push()`，于是
导航后不会留下 history 记录。
```html
<router-link :to="{ path: '/abc'}" replace></router-link>
```

### `append`属性
1. 使用字符串导航时，默认情况下相对路径也会作为绝对路径来使用
    ```html
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="./bar">Go to Bar</router-link>
    ```
    从第一个链接点击第二个链接时并不会跳转到`/foo/bar`，仍然是跳转到`/bar`
2. 但如果加上`append`属性，则会生效
    ```html
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="./bar" append>Go to Bar</router-link>
    ```
    现在从第一个链接点击第二个链接时就会跳转到`/foo/bar`
3. 但如果是绝对路径，则仍然是按照绝对路径的设置，而不会 append
    ```html
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar" append>Go to Bar</router-link>
    ```
    从第一个链接点击第二个链接时仍然是跳转到`/bar`

### `tag`属性
默认是渲染为，但通过该属性可以指定渲染为其他标签
```html
<router-link to="/foo" tag="li">foo</router-link>
<!-- 渲染结果 -->
<li>foo</li>
```

### `active-class`属性
表示当前`<router-link>`是激活状态的 CSS 类名默认值为`'router-link-active'`，通过这个
属性可以重新指定一个类名。


### `exact`属性
1. 表示一个`<router-link>`是否激活的逻辑是，当前路径是否包含该`<router-link>`设置的路
径。比如当前路径是`/a/b/c`，那么以下三个`<router-link>`都会是激活状态
    ```html
    <router-link to="/a/b/c">Go to Foo</router-link>
    <router-link to="/a/b">Go to Foo</router-link>
    <router-link to="/a">Go to Foo</router-link>
    ```
    也就是说三个`<a>`标签都会带上`router-link-active`类型。
2. 但是可以看到，只有第一个`<a>`标签还带有另一个类名`'router-link-exact-active'`。从
字面就可以看出来表示是精确匹配的激活状态。
3. 如果希望某个`<router-link>`不要使用这种激活模式，而是精确匹配激活，则应该加上
`exact`属性
    ```html
    <router-link to="/a/b/c">Go to Foo</router-link>
    <router-link to="/a/b" exact>Go to Foo</router-link>
    <router-link to="/a">Go to Foo</router-link>
    <!-- 在路径 /a/b/c 下渲染为 -->
    <a href="#/a/b/c" class="router-link-exact-active router-link-active">
        Go to Foo
    </a>
    <a href="#/a/b" class="">
        Go to Foo
    </a>
    <a href="#/a" class="router-link-active">
        Go to Foo
    </a>
    ```

### `event`属性
1. 声明可以用来触发导航的事件。可以是一个字符串或是一个包含字符串的数组。
2. 默认是`'click'`

```html
<router-link to="/foo" :event="['dblclick', 'mouseout']">Go to Foo</router-link>
<router-link to="/bar" event="mouseenter">Go to Bar</router-link>
```

### `exact-active-class`属性
1. 配置当链接被精确匹配的时候应该激活的 class。
2. 默认是`'router-link-exact-active'`
3. 注意默认值也是可以通过路由构造函数选项`linkExactActiveClass`进行全局配置的。
