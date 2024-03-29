# Data Class


<!-- TOC -->

- [Data Class](#data-class)
    - [思想](#思想)
        - [高内聚](#高内聚)
    - [现象](#现象)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
中层设计规则：高内聚


## 现象
1. 这里说的纯数据类是指：只有一些数据字段以及读写这些这些数据的函数，除此以外在没有其他操作。
2. 那么这个类本身就只是数据容器，并不会实例化为有意义的对象。
3. 这种情况下，这个类的对象一定会被其他地方进行其他操作，否则这个类就没有存在的意义。
4. 那么，那些在其他地方操作该类的对象的函数，很可能更适合作为这个类的方法。
5. 就好像有一个类来保存电话号，但里面只有读写区号和具体号的方法，不过在其他地方会有一个验证区号和具体号。那么这个验证的方法从语义上就应该是属于这个类的方法，所以应该移到该类中。


## 重构方法参考
* Move Function


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
