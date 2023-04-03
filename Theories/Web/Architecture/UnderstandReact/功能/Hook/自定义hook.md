# 自定义hook


<!-- TOC -->

- [自定义hook](#自定义hook)
    - [提取自定义 hook](#提取自定义-hook)
    - [使用自定义 hook](#使用自定义-hook)
    - [References](#references)

<!-- /TOC -->


## 提取自定义 hook
1. 通过自定义 Hook，可以将组件逻辑提取到可重用的函数中。
2. 自定义 Hook 是一个函数，其名称以 “use” 开头，函数内部可以调用其他的 Hook。


## 使用自定义 hook
1. 感觉上就是组件本身只负责维护 state 数据和接收父级 prop 数据，然后根据数据做出不同的渲染。而如果还需要使用 prop 以外的外部数据，或者要处理一些其他的逻辑，那就交给自定义 hook。
2. 如果自定义 hook 会接受组件内的数据作为参数，当数据更新后，组件重新渲染，自定义 hook 接收新的参数重新调用。


## References
* [Building Your Own Hooks](https://legacy.reactjs.org/docs/hooks-custom.html)