# Vue组件通信


<!-- TOC -->

- [Vue组件通信](#vue组件通信)
    - [组件通信方式](#组件通信方式)
        - [prop 和 emit](#prop-和-emit)
        - [slot](#slot)
    - [References](#references)

<!-- /TOC -->


## 组件通信方式
### prop 和 emit 
* 通信对象：父子组件
* 通信方向：双向通信
* 是否响应式：父组件通过 prop 响应式传递数据，子组件根据需求随时 emit 事件
* 可以传递的数据类型：JavaScript 数据类型
* 是否有默认值：有
* 其他特点：数据校验

### slot
* 通信对象：父子组件
* 通信方向：从父组件到子组件的单向通信
* 是否动态：响应式
* 可以传递的数据类型：JavaScript 数据类型、HTML、其他组件
* 是否有默认值：有



## References
* [Vue.js](https://v3.vuejs.org/)
