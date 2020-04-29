# Mutable Data


<!-- TOC -->

- [Mutable Data](#mutable-data)
    - [思想](#思想)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 这个缺点是和全局可见数据缺点共同作用的。
2. 如果一个对象没有被限定在很有限的作用域内，它就是被共享的。
3. 一旦被共享且可变，一个共享者对其进行修改后，无法保证其他共享者预期本次修改，所以就可能对其他人产生不良影响。


## 重构方法参考
* Extract Function：可以用一个函数返回永远一样的值
* Encapsulate Collection
* Combine Functions into Transform：只暴露源数据的副本
* Encapsulate Record：通过监听读写来控制可变数据的变化
* Replace Derived Variable with Query
* Change Reference to Value
* Separate Query from Modifier


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
