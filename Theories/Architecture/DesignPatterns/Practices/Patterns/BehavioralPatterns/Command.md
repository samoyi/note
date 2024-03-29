# Command


<!-- TOC -->

- [Command](#command)
    - [适用场景](#适用场景)
    - [使用场景](#使用场景)
        - [通用的 toast 组件](#通用的-toast-组件)
        - [Vue 插件](#vue-插件)
        - [第三方插件管理功能](#第三方插件管理功能)
        - [JS 中宏命令很普遍](#js-中宏命令很普遍)
    - [References](#references)

<!-- /TOC -->


## 适用场景
1. 一个对象想要使用若干种功能，并不一定是一次全部使用，也可以是根据情况每次使用其中的一部分。
2. 而且这些功能除了被这个对象使用，也可能被其他对象使用。
3. 然后，从分工的角度来讲，这个对象本身并不适合自己实现这些功能，但是它需要方便的告知自己需要哪些功能。
4. 每个功能对应一个命令，这个对象通过指定命令来选择需要的功能。
5. 一个命令如果有不同的执行方式，那这也是命令模式的特点之一。
6. 而且如果还希望命令支持撤回功能，或者是命令的执行具有队列功能，那就更合适命令模式了。


## 使用场景
### 通用的 toast 组件
1. 各个角色：
    * 命令发起者：调用 toast 的组件
    * 命令模板：不同类型的 toast，例如如下四种：success、fail、warn 和 error，它们实现为 4 个组件，例如 SuccessToast、FailToast、WarnToast 和 WarnToast 四个组件。每个组件的元素、样式各有不同。
    * 命令执行者：传入调用方法的参数对象，例如可以包括文字信息、显示时间。这里的 “执行” 并不是某种行为，而是使命令真正实现的东西。
    * 命令实例：传入参数对象后的 toast 组件
    * 命令发起接口：调用 toast 的方法
2. 例如一次调用是如下代码
    ```js
    let options = {
        "msg": "保存成功",
        "during": 2
    };
    this.toast("success", options)
    ```
3. 这里的命令发起接口是 `this.toast` 方法，`toast` 方法中会根据参数 `"success"` 选择 SuccessToast 命令模板，把 `options` 传入，然后渲染出具体的组件实例。

### Vue 插件
1. 各个角色：
    * 命令发起者：调用 `Vue.use` 的模块
    * 命令模板：没有，`Vue.use` 直接接收作为命令执行者的插件模块
    * 命令执行者：具体编写的插件模块
    * 命令实例：没有，因为没有命令模板，所以也不存在实例的概念
    * 命令发起接口：`Vue.use` 方法
2. 虽然没有面向对象模式下那么标准的命令模式，但这里也有命令发起者和命令执行者的解耦，然后通过绑定接口建立关系。
3. 根据不同的需求实现不同的插件（命令执行者），根据不同的场景选择不同的插件，然后通过 `Vue.use`（命令发起接口）进行绑定。

### 第三方插件管理功能
1. 一个项目，开始的时候，使用各种插件是直接写在 `main.js` 里面的
    ```js
    // main.js

    import MintUI from 'mint-ui'
    import 'mint-ui/lib/style.min.css'
    Vue.use(MintUI);

    import VConsole from "vconsole"
    if (needVConsole) {
        new VConsole();
    }

    import { Slider  } from 'vant';
    import { DropdownMenu, DropdownItem } from 'vant';
    import 'vant/lib/index.css';
    Vue.use(Slider);
    Vue.use(DropdownMenu);
    Vue.use(DropdownItem);
    ```
2. 意图和实现没有问题。我们是要在 `main.js` 里注册插件，但注册的实现就没必要写在这里的。
3. 改造之后的插件引用方法
    ```js
    // main.js
    
    import usePlugins from '@/plugins'
    usePlugins(['vant', 'mint']);
    ```
4. `usePlugins` 内部有如下实现
    ```js
    pluginNameList.forEach(name=>{
        // 每个第三方插件模块的输出对象实现一个 use 方法，进行 Vue.use 及其他安装操作
        pluginMap[name] && pluginMap[name].use(Vue);
    });
    ```    
    通过 `pluginMap[name]` 引用具体的插件，这些插件都实现了一个 `use` 方法，会实现实际的注册。
5. 现在在 `main.js` 只需要声明式的注册需要的插件即可，`usePlugins` 会根据插件名引用插件并使用 `Vue.use` 注册。
6. 各个角色：
    * 命令发起者：`main.js`
    * 命令模板：可以说是上面 `usePlugins` 的内部实现，它要求命令实例实现 `use` 方法
    * 命令执行者：具体编写的插件模块，需要实现 `use` 方法
    * 命令实例：相当于 `pluginMap[name].use(Vue)`
    * 命令发起接口：`usePlugins` 方法


### JS 中宏命令很普遍
至少对于 JS 来说，如果没有撤销命令的需求，那么直接使用函数封装若干个其他函数调用就算是宏命令模式了


## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)