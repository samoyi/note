# Global Data


<!-- TOC -->

- [Global Data](#global-data)
    - [思想](#思想)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 一个对象单纯的全局可见本身不会引起失控。问题在于这个对象全局可被修改，或者是对象的行为有副作用。
2. 当对象被全局中任何一个人修改时，无法保证其他读取该对象的人会预期这一次的修改；同样，对象的行为产生副作用时，也无法保证其他读取该对象的人会预期这一次的副作用。


## 重构方法参考
* Encapsulate Variable


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
