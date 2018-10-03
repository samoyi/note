# Hot Reloading

不懂。按照文档上的例子，可以监听到模块的修改并获得新模块，但是在通过`store.hotUpdate`
更新时就会重载
```js
if (module.hot) {
    module.hot.accept(['./stores/foo.js', './stores/bar.js'], ()=>{
        const newFoo = require('./stores/foo.js').default;
        const newBar = require('./stores/bar.js').default;

        console.log(newFoo);
        console.log(newBar);

        // 这里会触发重载
        store.hotUpdate({
            modules: {
                foo: newFoo,
                bar: newBar,
            },
        });
    });
}
```
