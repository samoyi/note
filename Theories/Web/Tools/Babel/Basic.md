# Basic

## `babel-core` 模块
它提供若干个通用的转换（transform）API，但具体要怎么转换，则要通过指定的各种转换插件
（transform pulgins）组成的`options`来决定。以下是
[官方文档](https://github.com/babel/babel/tree/master/packages/babel-core)
中一个API的例子，看起来运行的原理就是根据你不同的配置而生成不同的`options`，进而生成相应
的转换后代码。
    ```js
    babel.transform("code();", options, function(err, result) {
        result.code;
        result.map;
        result.ast;
    });
    ```

## Transform Plugins
如果你只是用Transform Plugins，会发现很多ES6、ES7的东西并不会被转换，仍然不能兼容本来就
不兼容的环境。转换以下代码：
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
同样是ES6的特性，块级作用域和`let`就可以被转换，但`Array.from`就不会被转换。  
因为Transform Plugins只转换语法，不转换语言API，更不转换环境API。  
所以像`promise`、`Array.from`这样的ES API不会被转换，像`fetch`这样的DOM API更不会被转
换。  
想要转换API，需要找相应的polyfill来实现。


## preset
1. 因为有很多ES6、ES7一起其他的新语法，所以就有
[很多Transform Plugins](https://babeljs.io/docs/plugins/#transform-plugins)。
2. 把他们全部打包成一个虽然简单，但是显然过于庞大，冗余巨大。然而每次都要根据自己的需求一
个个引入也是相当麻烦。
3. 因此Babel将这些插件分类打包成
[若干个preset](https://babeljs.io/docs/plugins/#official-presets)，每次可以根据自己
的需求引入特定的preset。

### Stage-X (Experimental Presets)
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


## Babel自带的polifill模块
1. The `babel-polyfill` and `transform-runtime` modules are used to serve the
same function in two different ways. Both modules ultimately serve to emulate an
ES2015+ environment with two things: a slew of polyfills as provided by
[core-js](https://github.com/zloirock/core-js), as well as a complete
[regenerator runtime](https://github.com/facebook/regenerator).
2. `babel-polyfill`的方法是直接在全局环境下添加对象和方法，以及直接在built-in对象的原
型上添加方法，所以它只适合应在封闭的应用中，而不适合用于供他人使用的库或工具里，否则有可
能会和他人的使用环境冲突。
3. `transform-runtime`不会污染全局环境，但也不能polyfill实例方法。不懂原理。

## References
* [Clearing up the Babel 6 Ecosystem](https://medium.com/@jcse/clearing-up-the-babel-6-ecosystem-c7678a314bf3)
* [babel/packages/babel-core/](https://github.com/babel/babel/tree/master/packages/babel-core)
* [The Six Things You Need To Know About Babel 6](http://jamesknelson.com/the-six-things-you-need-to-know-about-babel-6/)
