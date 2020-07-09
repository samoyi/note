# Command


<!-- TOC -->

- [Command](#command)
    - [适用场景](#适用场景)
    - [要点](#要点)
    - [使用场景](#使用场景)
        - [Vue 插件](#vue-插件)
        - [第三方插件管理功能](#第三方插件管理功能)
        - [JS 中宏命令很普遍](#js-中宏命令很普遍)
    - [References](#references)

<!-- /TOC -->


## 适用场景
1. 一个对象想使用若干种功能。
2. 这些功能除了被这个对象用，也可能被其他对象使用
2. 这个对象不需要知道功能具体怎么实现，但要方便的使用功能。
3. 如果添加的功能还支持动态撤回，或者支持按顺序执行。


## 要点


## 使用场景
### Vue 插件
1. 可以实现各种功能的插件，插件的逻辑就是命令的功能，插件名就是命令名。
2. 每个插件都需要实现一个 `install` 方法，用于装载该插件（命令）时使用。
3. 根据具体的场景，根据需求使用 `Vue.use` 方法加载不同的插件（命令）。

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
4. 现在在 `main.js` 只需要声明式的注册需要的插件即可。
5. 在这里，插件名就相当于命令名，而 `usePlugins` 的调用就相当于加载命令，具体的插件注册就由 `@/plugins` 来实现。


### JS 中宏命令很普遍
至少对于 JS 来说，如果没有撤销命令的需求，那么直接使用函数封装若干个其他函数调用就算是宏命令模式了


## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)