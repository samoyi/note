# Vue.use


## 设计思想
### SRP
具体的功能提取为单独的模块

### OCP
SRP 之后，修改功能时就只是在插件内部进行，对于调用的地方不需要变动

### 意图和实现分离
功能的实现对使用者透明，使用者只需要调用 `Vue.use` 即可


## 本质
1. 其实就是让用户可以在独立的模块（插件对象）中引用到全局 `Vue` 对象，然后可以在上面随便做点什么。
2. 而之所以可以引用到 `Vue` 对象，就是因为实现了 `Vue.use` 方法。这个方法接受插件对象，调用对象的 `install` 方法，把 `Vue` 对象作为参数传入。


## 环境
key | value
--|--
源码版本 | 2.5.21
文件路径 | `src/core/global-api/use.js`


## `use.js` 主要源码
```js
export function initUse (Vue: GlobalAPI) {
    // 在全局 Vue 对象上注册 use 方法
    // 该方法接受一个参数，类型为函数或对象。文档中是要求传入对象类型，函数类型也许是内部使用
    Vue.use = function (plugin: Function | Object) {
        // 获取或者创建已安装的插件列表，该列表注册在全局对象 Vue 上
        const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))

        // 如文档所说，会阻止多次注册相同插件
        if (installedPlugins.indexOf(plugin) > -1) {
            return this
        }

        // additional parameters
        // 获取第一个参数（插件对象或函数）之后的所有参数
        // 根据文档，可以传入第二个参数作为选项对象。所以一般情况下 args 数组只有一项，也就是这个选项对象
        // 当然也可以传入第三个或者更多的参数，只要在插件的 install 方法的形参中接收就行
        const args = toArray(arguments, 1)

        // 把全局对象 Vue 添加到参数列表首位，之后传递给插件的 install 方法
        // 因为，参考文档，插件的 install 方法的参数列表就是第一项为 Vue 对象，第二项为选项对象
        args.unshift(this)

        // 调用定义的插件中的 install 方法
        // 如果插件是定义为对象，那么 install 方法中的 this 就是指向该对象
        if (typeof plugin.install === 'function') {
            plugin.install.apply(plugin, args)
        } 
        else if (typeof plugin === 'function') {
            plugin.apply(null, args)
        }

        // 注册该插件
        installedPlugins.push(plugin)

        return this
    }
}
```


## References
* [文档](https://cn.vuejs.org/v2/guide/plugins.html)