# Combine Functions into Transform


<!-- TOC -->

- [Combine Functions into Transform](#combine-functions-into-transform)
    - [原则](#原则)
    - [场景](#场景)
        - [Vue 计算属性](#vue-计算属性)
    - [过度优化](#过度优化)

<!-- /TOC -->


## 原则
需要对一个数据对象中的数据进行转换变形，如果转换变形的函数不存在复用，那与其让使用者自己实现变形函数，或者提供给使用者变形函数，不如直接把数据变形好，然后返回给使用者这个变形后的数据对象。


## 场景
### Vue 计算属性
Vue 组件中使用计算属性对 store 中的原始数据进行加工，转换为组件需要的形式。


## 过度优化