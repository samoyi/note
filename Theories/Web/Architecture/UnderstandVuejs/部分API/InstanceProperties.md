# Instance Properties
只收录部分不常见、不容易理解和存疑的

## vm.$options
1. The instantiation options used for the current Vue instance.
2. 但是看起来，应该是 Observer 对实例化传入的数据进行了改造，导致某些选项和传入是的不一
样。比如 `vm.$options.data` 变成了一个函数，而想要访问 `mounted` 的函数，必须要按照这
样的方法: `vm.$options.mounted[0]`。


## vm.$children
Note there’s no order guarantee for `$children`, and it is not reactive.


## vm.$slots
1. Used to programmatically access content distributed by slots.
2. Each named slot has its own corresponding property (e.g. the contents of
`slot="foo"` will be found at `vm.$slots.foo`).
3. The `default` property contains any nodes not included in a named slot.

模板 HTML
```html
<blog-post>
    <h1 slot="header">
        About Me
    </h1>
    <p>
        Here's some page content, which will be included in vm.$slots.default,
        because it's not inside a named slot.
    </p>
    <p slot="footer">
        Copyright 2016 Evan You
    </p>
    <p>
        If I have some content down here, it will also be included in vm.$slots.default.
    </p>.
</blog-post>
```

使用 `render` 来创建组件
```js
Vue.component('blog-post', {
    render(createElement) {
        const header = this.$slots.header;
        const body   = this.$slots.default;
        const footer = this.$slots.footer;
        return createElement('div', [
            createElement('header', header),
            createElement('main', body),
            createElement('footer', footer),
        ]);
    },
});
```

编译之后的 HTML
```html
<div>
    <header>
        <h1>About Me</h1>
    </header>
    <main>
        <p>
            Here's some page content, which will be included in vm.$slots.default, because it's not inside a named slot.
        </p>  
        <p>
            If I have some content down here, it will also be included in vm.$slots.default.
        </p>
    </main>
    <footer>
        <p>
            Copyright 2016 Evan You
        </p>
    </footer>
</div>
```
