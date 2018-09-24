# Basic

## `babel-core` 模块
* [文档](https://babeljs.io/docs/core-packages/)

### Transform API
`babel-core`提供若干个通用的转换（transform）API，用来转换代码或文件。例如
```js
var result = babel.transform("code();", options);
result.code;
result.map;
result.ast;
```
* Transforms the passed in code. Returning an object with the generated code,
source map, and AST.
* 这是个通用的转换API，具体的转换规则是通过`options`来设定的。不同的转换插件
（transform pulgins），会设定不同的`options`。


## Transform Plugins
### preset
1. 因为有很多ES6、ES7一起其他的新语法，所以就有
[很多Transform Plugins](https://babeljs.io/docs/plugins/#transform-plugins)。
2. 把他们全部打包成一个虽然简单，但是显然过于庞大，冗余巨大。然而每次都要根据自己的需求一
个个引入也是相当麻烦。
3. 因此Babel将这些插件分类打包成[若干个preset](https://babeljs.io/docs/en/presets)，
每次可以根据自己的需求引入特定的 preset。

#### Stage-X (Experimental Presets)
1. Any transforms in stage-x presets are changes to the language that haven’t
been approved to be part of a release of Javascript.
2. The TC39 categorizes proposals into the following stages:
    * Stage 0 - Strawman: just an idea, possible Babel plugin.
    * Stage 1 - Proposal: this is worth working on.
    * Stage 2 - Draft: initial spec.
    * Stage 3 - Candidate: complete spec and initial browser implementations.
    * Stage 4 - Finished: will be added to the next yearly release.
3. Vue-cli默认的安装的是`babel-preset-stage-3`，即其中的语法虽然不在当前正式发布的规范
中，但已经在未来的规范中制定完成，开始有环境支持。


## 仍然需要 polyfill
### 问题
1. 如果你只是用 Transform Plugins，会发现很多 ES6、ES7 的东西并不会被转换，仍然不能兼
容本来就不兼容的环境。
2. 转换以下代码：
    ```js
    {
      let arr = Array.from('123');
    }
    console.log(arr);
    ```
    得到的结果是：
    ```js
    {
      var _arr = Array.from('123');
    }
    console.log(arr);
    ```
    同样是 ES6 的特性，块级作用域和`let`就可以被转换，但`Array.from`就不会被转换。  
2. 因为 Transform Plugins 只转换语法，不转换语言 API，更不转换环境 API。  
3. 所以像`promise`、`Array.from`这样的 ES6 API 不会被转换，像`fetch`这样的DOM API更
不会被转换。`async`函数也需要 polyfill 才能使用，可能也是属于 ES6 API 。
想要转换API，需要找相应的 polyfill 来实现。

### 解决
1. Babel 自带的`babel-polyfill`和`transform-runtime`两个模块可以实现上述需要的功能，
但是是以不同的方式。
2. 两个模块都会使用[core-js](https://github.com/zloirock/core-js)提供一系列的
polyfill，并提供一个完整的[regenerator runtime](https://github.com/facebook/regenerator)。
3. 不同之处在于，`babel-polyfill`的方法是直接在全局环境下添加对象和方法，以及直接在
built-in 对象的原型上添加方法，所以它只适合应在封闭的应用中，而不适合用于供他人使用的库
或工具里，否则有可能会和他人的使用环境冲突。而`transform-runtime`不会污染全局环境，不
会在 built-in 对象上添加方法，所以不会引发上述冲突。但也因此不能 polyfill 实例方法。
4. 使用`babel-polyfill`需要手动引入，具体用法看[文档](https://babeljs.io/docs/en/babel-polyfill)


## References
* [Clearing up the Babel 6 Ecosystem](https://medium.com/@jcse/clearing-up-the-babel-6-ecosystem-c7678a314bf3)
* [babel/packages/babel-core/](https://github.com/babel/babel/tree/master/packages/babel-core)
* [The Six Things You Need To Know About Babel 6](http://jamesknelson.com/the-six-things-you-need-to-know-about-babel-6/)
