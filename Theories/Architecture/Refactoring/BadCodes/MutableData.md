# Mutable Data


<!-- TOC -->

- [Mutable Data](#mutable-data)
    - [思想](#思想)
        - [OCP](#ocp)
        - [和 *Global Data* 结合起来危害才明显](#和-global-data-结合起来危害才明显)
    - [解决思路](#解决思路)
        - [创建副本](#创建副本)
        - [缩减可见范围](#缩减可见范围)
        - [收紧修改权限](#收紧修改权限)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 这个缺点是和全局可见数据缺点共同作用的。
2. 如果一个对象没有被限定在很有限的作用域内，它就是被共享的。
3. 一旦被共享且可变，一个共享者对其进行修改后，无法保证其他共享者预期本次修改，所以就可能对其他人产生不良影响。

### OCP
**变化是危险的**，**尽可能的隔离变化**。


### 和 *Global Data* 结合起来危害才明显
随处可见，谁都能修改


## 解决思路
### 创建副本
1. 如果一个数据不是只被使用一次，那如果要修改格式之类的话，就考虑使用副本。
2. 之后每次使用这个数据都是取原始的副本。

### 缩减可见范围
在小范围内可变就相对好控制一些

### 收紧修改权限
只允许通过特定的方法修改


## 重构方法参考
* Encapsulate Variable：只允许通过特定的方法修改
* Extract Function：可以用一个函数返回永远一样的值
* Encapsulate Collection
* Combine Functions into Class：缩减可见范围，只有类中的特定方法有权改变数据
* Combine Functions into Transform：只暴露源数据的副本
* Encapsulate Record：通过监听读写来控制可变数据的变化
* Replace Derived Variable with Query
* Change Reference to Value
* Separate Query from Modifier
* Remove Setting Method


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
