# Browserslist

## 用途
1. 这个配置说明你的项目将运行在哪些浏览器中，用来告诉一些涉及兼容性前端工具在做兼容性处理时要考虑哪些浏览器。
2. 例如不需要兼容 IE、只需要兼容移动端浏览器、只兼容使用率超过 1% 的浏览器等。
3. 通过准确的设置要兼容的浏览器，可以让前端工具准确的编译代码。并尽可能的少做编译，能用现代代码就用现代代码，不仅可以减少编译打包后的文件体积，还能因为使用了现代代码而保持了较好的性能。
4. 除了指明浏览器，也可以指明兼容的 Node 环境。
5. 开发人员也可以通过该配置快速了解项目的兼容情况。


## 配置
### 配置位置
1. 可以在`package.json`或者单独的`.browserslistrc`文件里配置
    * `package.json`:
        ```json
        {
          "browserslist": [
            "last 1 version",
            "> 1%",
            "maintained node versions",
            "not dead"
          ]
        }
        ```
    * `.browserslistrc`
        ```sh
        # Browsers that we support

        last 1 version
        > 1%
        maintained node versions
        not dead
        ```
2. 还可以在[其他几个地方](https://github.com/browserslist/browserslist#queries)配置，但推荐是配置在`package.json`中。
3. 如果没有做配置，则使用默认配置：`> 0.5%, last 2 versions, Firefox ESR, not dead`。


### 配置规则
1. [完整的配置项列表](https://github.com/browserslist/browserslist#full-list)
2. 每个规则都可以添加`not`来使用其相反的情况
3. 多项配置是使用并集的规则来综合筛选。也就是说只要浏览器符合了配置中的多个规则中的一个就可以被兼容。
4. 所有配置的数据都是基于[Can I Use](https://caniuse.com/)。例如指定`> 0.5%, last 2 versions`，就会从 Can I Use 的数据库中搜索符合的浏览器。
5. 浏览器名称忽略大小写，并且有的还有别名。[浏览器列表](https://github.com/browserslist/browserslist#browsers)


### Best Practices
参考[官方文档](https://github.com/browserslist/browserslist#best-practices)中的说明，并结合自己项目的实际使用情况。


## 查看你的配置将兼容哪些浏览器
### 通过命令行
在项目目录下使用`npx browserslist`命令可以列出当前配置兼容哪些具体的浏览器

### 在线工具
1. 使用[在线工具](https://browserl.ist/)测试一条或多条配置支持的浏览器
2. 例如在输入框里输入`last 1 version`或`last 1 version, > 1%`


## 使用`browserslist`的前端工具
1. 可以直接看[官方文档](https://github.com/browserslist/browserslist-example)
2. 以如下配置为例说明，即该项目只运行于 Edge 16 浏览器
    ```json
    "browserslist": [
       "Edge 16"
    ]
    ```

### Autoprefixer
1. 根据`browserslist`中设定的浏览器类型，决定要给哪些样式加哪些浏览器前缀
2. 例如
    ```css
    body {
      user-select: none
    }
    ```
    会被转换为
    ```css
    body {
      -ms-user-select: none;
          user-select: none
    }
    ```
    因为不需要兼容其他浏览器，所以只加了`-ms-`前缀

### Babel
1. 根据`browserslist`中设定的浏览器类型，决定要给编译哪些 JS 语法
2. 例如
    ```js
    const array = [1, 2, 3];
    const [first, second] = array;
    ```
    会被 Babel 编译为
    ```js
    const array = [1, 2, 3];
    const first = array[0],
          second = array[1];
    ```
    只编译了结构赋值，因为 Edge 16 支持`const`

### ESLint
1. 根据`browserslist`中设定的浏览器类型，判断哪些 JS 用法是不支持的。
2. 例如使用`navigator.serviceWorker` 将会导致 ESLint 警告，因为 Edge 16 不支持 Service Workers。

### 其他几个工具    
`PostCSS Preset Env`、`PostCSS Normalize`和`Stylelint`，原理类似。


## References
* [官方文档](https://github.com/browserslist/browserslist)
* [Browserslist Example](https://github.com/browserslist/browserslist-example)
