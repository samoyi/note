# Slide Statements


<!-- TOC -->

- [Slide Statements](#slide-statements)
    - [原则](#原则)
    - [场景](#场景)
        - [同层级的方法按照逻辑分组](#同层级的方法按照逻辑分组)
    - [过度优化](#过度优化)
    - [References](#references)

<!-- /TOC -->


## 原则


## 场景
### 同层级的方法按照逻辑分组
1. Vuex 中如果有比较大的模块，里面可能会有很多的 mutation、action 或者 getter，它们在同一个模块里都是不能再分层的。
2. 这时如果写的不注意的话，就会是十几甚至几十个方法一个挨着一个，看起来很不明确。
3. 但其实比如说 mutation，很可能是好几个方法在逻辑上是一组的，那就应该让同组的挨着，组间的话空一行
    ```js
    setFoo_a(){},
    setFoo_b(){},
    setFoo_c(){},

    setBar_a(){},
    setBar_b(){},

    setQux_a(){},
    setQux_b(){},
    ```


## 过度优化


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
