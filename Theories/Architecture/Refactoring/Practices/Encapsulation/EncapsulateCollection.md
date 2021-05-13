# Encapsulate Collection


<!-- TOC -->

- [Encapsulate Collection](#encapsulate-collection)
    - [原则](#原则)
    - [场景](#场景)
        - [Vue 组件里生成 store 中的列表数据副本](#vue-组件里生成-store-中的列表数据副本)
    - [过度优化](#过度优化)
    - [References](#references)

<!-- /TOC -->


## 原则
集合数据不只在一个地方使用，不同的地方不应该共享修改。


## 场景
### Vue 组件里生成 store 中的列表数据副本
Vue 项目中接口请求到的列表数据保存在 store 里，组件如果要对数据进行修改后再渲染，则需要拷贝一份副本在修改。否则修改就会直接影响到 store 里的原始数据。


## 过度优化


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)

