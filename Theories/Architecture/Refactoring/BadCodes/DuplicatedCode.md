# Duplicated Code


<!-- TOC -->

- [Duplicated Code](#duplicated-code)
    - [思想](#思想)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
1. Duplication means that every time you read these copies, you need to read them carefully to see if there’s any
difference. If you need to change the duplicated code, you have to find and catch each duplication.
2. 重复不仅仅意味着重复的工作量，更危险的是，不统一所带来的混乱。


## 重构方法参考
* Extract Function
* Extract Variable
* Encapsulate Collection：在对象里面封装好，读取集合的各个地方就不用自己拷贝副本了
* Replace Primitive with Object：在对象里面封装好各种方法，读取数据的各个地方就不用自己检查和处理了
* Combine Functions into Transform：如果有好几个地方都对一组数据有相同的一组操作
* Replace Temp with Query：如果好几个地方都进行了同样的计算
* Move Statements into Function
* Change Value to Reference
* Introduce Special Case
* Replace Parameter with Query：如果各个计算者都要计算同一个参数
* Replace Query with Parameter：提取不同部分作为参数，就可以复用函数
* Pull Up Method
* Pull Up Field
* Pull Up Constructor Body

## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
