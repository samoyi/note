# package.json 文件


## `name`
1. `name`和`version`两者字段结合起来，决定了一个 package 及其版本的唯一性。
2. 对一个 package 进行的更新，也必须同时更新`version`，这样才能和旧版本区分开来。
3. 如果打算将这个 package 发布，那这两个字段是必须的。否则则是可选的。
4. A name can be optionally prefixed by a scope, e.g. @myorg/mypackage. See npm-scope for more detail.
4. 名字可以添加一个 scope 前缀，例如`@myorg/mypackage`。参考[npm-scope](https://docs.npmjs.com/misc/scope)

### 规则
* 不超过214个字符，包括 scoped package 名称中的 scope 字符串。
* 不能以`.`和`_`开头
* 不能包含大写字母
* 名字将作为 URL 的一部分，以及命令行参数和文件夹名称，所以名字不能包含任何
non-URL-safe 字符。

### 一些提示
* 不要和 Node 核心模块重名
* Don't put "js" or "node" in the name. It's assumed that it's js, since you're
writing a package.json file, and you can specify the engine using the "engines"
field. (See below.)
* 名字可能会作为`require()`的参数，所以应该做到简洁明了
* 预先在 npm registry 里看看是否已经有同名 package


## `files`
1. 可选的`files`字段指定如果你的 package 被作为依赖安装，将包括里面的哪些文件，以及排
除哪些文件。
2. 默认值是`["*"]`，表示除了一些特殊的文件以外，其他文件都会包括。
3. 不管`files`字段怎么设置，上面所说的那些特殊的文件中，一些是一定会包括的（例如
`package.json`），另一些是一定会被排除的（例如`.git`）。
4. 参考`sass-loader`的源码，它的`files`设置为`["lib"]`，所以这个包在安装的时候，就不
会安装源码根目录的`test`文件夹。


## `main`
1. 这个字段应该被设置为你的 package 中的一个模块文件。
2. 以`sass-loader`为例，它的`main`字段设定为`"lib/loader.js"`。当一个程序通过
`require('sass-loader')`加载`sass-loader`时，将返回`lib/loader.js`中输出的模块。
3. 这个字段中的路径是相对于 package 的根目录的。


## `bin`
不懂


## `man`
不懂


## `directories`
不懂


## `scripts`
1. 具体参考[这里](https://docs.npmjs.com/misc/scripts)
2. 有些类似于钩子函数，提供了很多生命周期事件。
3. 看一下下面的例子。我在`sass-loader`的`package.json`的`scripts`字段里添加了一条：
    ```js
    "postuninstall": "echo 66666666666666"
    ```
    当我卸载完成`sass-loader`，就会执行`echo 66666666666666`并打印。
4. 除了自带的生命周期事件外，也可以自己定义事件，并通过`npm run 事件名`来触发事件。比如
最常见的`"dev": "webpack-dev-server"`


## `config`
1. A `config` object can be used to set configuration parameters used in package
scripts that persist across upgrades.
2. 感觉是设置环境变量的感觉。比如如下设置时：
    ```js
    "config": {
        "port": "8081"
    },
    ```
    现在我在 package 的脚本里就可以通过`process.env.npm_package_config_port`引用到
    设置的`8081`
3. 例如在 Vue-cli 2 中，`webpack-dev-server`的端口号要在`config/index.js`中设置。
如果在开发过程中需要若干次变更端口号，可以直接像上面那样设置一个`port`环境变量，然后把
`config/index.js`设置为`process.env.npm_package_config_port`，就可以方便的在
`package.json`中修改端口号了。


## `dependencies`和`devDependencies`
1. `dependencies`字段指定了项目运行所依赖的模块，`devDependencies`指定项目开发所需要
的模块。
2. 它们都指向一个对象。该对象的各个成员，分别由模块名和对应的版本要求组成，表示依赖的模
块及其版本范围。
3. 对应的版本可以加上各种限定，主要有以下几种：
    * 指定准确版本：比如`1.2.2`，遵循“大版本.次要版本.小版本”的格式规定，安装时只安装
        指定版本。
    * 波浪号（tilde）+指定版本：比如`~1.2.2`，表示安装`1.2.x`的最新版本（不低于
        `1.2.2`），但是不安装`1.3.x`，也就是说安装时不改变大版本号和次要版本号。
    * 插入号（caret）+指定版本：比如`ˆ1.2.2`，表示安装`1.x.x`的最新版本（不低于
        `1.2.2`），但是不安装`2.x.x`，也就是说安装时不改变大版本号。需要注意的是，如果
        大版本号为`0`，则插入号的行为与波浪号相同，这是因为此时处于开发阶段，即使是次要
        版本号变动，也可能带来程序的不兼容。
    * `latest`：安装最新版本。


## `peerDependencies`
1. 比如你现在想针对 Webpack 开发一个插件模块，你的这个插件本身用不到 Webpack，但是这个
插件必须要在 Webpack 的环境里里才能运行。
2. 例如`webpack-dev-server`，这个插件本身不需要 Webpack，因为这个插件本身的功能不涉及
打包之类的。
3. 所以`webpack-dev-server`的`dependencies`和`devDependencies`里都没有Webpack。也
就是说，在你安装`webpack-dev-server`的时候，不会自动安装 Webpack。
4. 但很显然，你想用这个插件，你必须要安装 Webpack。
5. 所以`webpack-dev-server`的`peerDependencies`里面指明了依赖 Webpack。告诉你必须有
Webpack 才能用我。
6. 简而言之，`peerDependencies`的意思是：我这个 package 的功能本身不依赖这些模块，但
是你要用我这个 package，你就要安装我指定的模块的指定版本。
7. 与`dependencies`和`devDependencies`不同，`peerDependencies`里的模块并不会自动安
装，你必须要确保你的项目里已经安装了这些模块。


## `bundledDependencies`/`bundleDependencies`
1. 这个字段通过一个数组指定了若干个 package，这些 package 会在你发布你的当前 package
的时候一并打包。
2. 看起来的意思是，`dependencies`和`devDependencies`的依赖是在你的 package 被安装的
时候从 npm registry 里远程下载，而`bundledDependencies`指定的依赖会直接包含在你的
package 的安装包里面。
3. 可能的用途，比如你自己开发了当前 package 的依赖，但你不想发布，你就可以通过这种方法
添加为依赖；又或者你担心依赖的某个 package 以后会被其作者删除之类的问题，那你这里就通过
`bundledDependencies`保存一个本地拷贝。[参考](https://stackoverflow.com/q/11207638)
4. 不懂具体的操作方法。


## `optionalDependencies`
1. 如果 npm 在安装依赖时，没有找到或者没有成功安装`optionalDependencies`中的依赖，并
不会出错而是会继续进行其他的安装。
2. 你需要在你的程序里判断`optionalDependencies`中依赖是否安装成功并作出相应的后续操作
。
3. 如果在`dependencies`和`optionalDependencies`指定了同名依赖，则后者会覆盖前者。


## `engines`
1. 用来指定你的 package 适用的 node 和 npm 版本。
2. 除非你使用了`engine-strict` flag，否则你这里指定的版本只是建议性的，只有当你的
package 在作为依赖安装时才有可能会因为版本不对而出现警告。但是`engine-strict` flag 已
经在 npm 3.0.0 中移除了，所以说`engines`永远都只是建议性的而不会实际给出警告了？


## `os` `cpu`
1. 可以通过白名单或（和）黑名单的方式指明你的 package 适用的操作系统和 cpu 架构。
2. 操作系统通过`process.platform`来判断，cpu 架构通过`process.arch`来判断。


## `private`
1. 设定私有 package，保证不会被意外发布。
2. 如果你喜欢这个 package 只发布到特定的 registry，比如一个内部 registry，那么可以通
过`publishConfig`字段来指定。


## `publishConfig`
1. 该字段设置一组用于 publish-time 的配置值。
2. 比如你不希望你的包发布到公共 registry，而是你的一个私人 npm 服务器，那可以类似于下
面这样的设置
    ```json
    "publishConfig":{
        "registry":"https://your-repo.registry.nodejitsu.com"
    }
    ```
3. 还有[很多其他选项](https://docs.npmjs.com/misc/config)


## 其他字段直接看文档
* `version`
* `description`
* `keywords`
* `homepage`
* `bugs`
* `license`
* `author`
* `contributors`
* `browser`
* `repository`


## DEFAULT VALUES
npm will default some values based on package contents.

### `"scripts": {"start": "node server.js"}`
If there is a `server.js` file in the root of your package, then npm will
default the `start` command to `node server.js`.

### `"scripts":{"install": "node-gyp rebuild"}`
If there is a `binding.gyp` file in the root of your package and you have not
defined an `install` or `preinstall` script, npm will default the `install`
command to compile using node-gyp.

### `"contributors": [...]`
1. If there is an `AUTHORS` file in the root of your package, npm will treat
each line as a `Name <email> (url)` format, where email and url are optional.
2. Lines which start with a `#` or are blank, will be ignored.


## References
* [官网文档](https://docs.npmjs.com/files/package.json)
* [官网文档翻译](https://www.cnblogs.com/nullcc/p/5829218.html)
* [阮一峰](http://javascript.ruanyifeng.com/nodejs/packagejson.html)
* [Using a private npm repository for your project](https://stevenlu.com/posts/2014/08/01/using-a-private-npm-repository-for-your-project/)
