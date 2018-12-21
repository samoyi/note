# @babel/plugin-transform-runtime

## 用途
1. Babel 提供了很多小的 helper 来实现语法转换。默认情况下，当一个模块需要一个 helper 时，babel 就会将需要的 helper 加入到该模块。
2. 这样的问题是重复注入。多个模块需要一个 helper 时，需要为每一个模块都注入该 helper。
3. `@babel/plugin-transform-runtime`的作用是，使得所有 helper 都可以通过`@babel/runtime`模块直接访问到，而不需要注入到每一个编译后的输出里。
4. 这个 runtime 会编译到你的项目构建里，然后在项目运行时就可以在这个 runtime 里面访问需要的 helper。


## 沙箱环境
1. 与`@babel/polyfill`不同，`@babel/plugin-transform-runtime`为你的代码创建了一个沙箱环境，它提供`Promise`、`Set`和`Map`等 API并不会污染全局环境。
2. Instance methods such as `"foobar".includes("foo")` will not work.
3. [具体原理](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html#regenerator-aliasing)不懂


## Usage
### Via `.babelrc` (Recommended)
1. Add the following line to your `.babelrc` file:
    * Without options:
        ```json
        {
            "plugins": ["@babel/plugin-transform-runtime"]
        }
        ```
    * With options (and their defaults):
        ```js
        {
            "plugins": [
                [
                    "@babel/plugin-transform-runtime",
                    {
                        "corejs": false,
                        "helpers": true,
                        "regenerator": true,
                        "useESModules": false
                    }
                ]
            ]
        }
        ```
2. The plugin defaults to assuming that all polyfillable APIs will be provided by the user. Otherwise the `corejs` option needs to be specified.

### Via CLI
```sh
babel --plugins @babel/plugin-transform-runtime script.js
```

### Via Node API
```js
require("@babel/core").transform("code", {
    plugins: ["@babel/plugin-transform-runtime"],
});
```


## Options
直接看[文档](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html#options)


## References
* [@babel/plugin-transform-runtime](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html)
