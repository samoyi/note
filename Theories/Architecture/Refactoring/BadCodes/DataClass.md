# Data Class


<!-- TOC -->

- [Data Class](#data-class)
    - [思想](#思想)
        - [控制写权限](#控制写权限)
    - [现象](#现象)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
### 控制写权限


## 现象
1. 这里说的纯数据类是指只有数据但类自身没有访问和修改数据的方法，然后数据被公开的暴露给客户，可以被随意的修改。
2. 在这种情况下，对数据的访问和修改就是不可监听和控制的，所以应该把数据设为隐藏的，然后在类里面添加访问和修改属性的方法，供给客户使用。


## 重构方法参考
* Extract Function：也许一个简单的工厂函数就能替代
* Encapsulate Record：也许一些对数据的读写操作可以放在该类里面
* Move Function


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
