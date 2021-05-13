# Refused Bequest


<!-- TOC -->

- [Refused Bequest](#refused-bequest)
    - [思想](#思想)
    - [现象](#现象)
        - [严格标准的继承语义——接收超类的所有特征](#严格标准的继承语义接收超类的所有特征)
        - [也许可以做出一些妥协](#也许可以做出一些妥协)
        - [不能妥协的地方——不支持超类的接口](#不能妥协的地方不支持超类的接口)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 继承有着明确的语义，你应该尽可能的遵守语义去使用继承，而不应该仅仅为了用到它的功能而违背语义的去使用。
2. 任何东西的名字或者外在表现，都是有助于人们对它的理解。如果一个东西的名字或者外在和它的内在不同，那就会对别人造成误解。


## 现象
### 严格标准的继承语义——接收超类的所有特征
1. Subclasses get to inherit the methods and data of their parents. 
2. But what if they don’t want or need what they are given? They are given all these great gifts and pick just a few to play with.
3. The traditional story is that this means the hierarchy is wrong. You need to create a new sibling class and use *Push Down Method* and *Push Down Field* to push all the unused code to the sibling. That way the parent holds only what is common. 
4. Often, you’ll hear advice that all superclasses should be abstract.

### 也许可以做出一些妥协
1. You’ll guess from our snide use of “traditional” that we aren’t going to advise this — at least not all the time. 
2. We do subclassing to reuse a bit of behavior all the time, and we find it a perfectly good way of doing business. There is a smell — we can’t deny it — but usually it isn’t a strong smell. 
3. So, we say that if the refused bequest is causing confusion and problems, follow the traditional advice. However, don’t feel you have to do it all the time. 
4. Nine times out of ten this smell is too faint to be worth cleaning.

### 不能妥协的地方——不支持超类的接口
1. The smell of refused bequest is much stronger if the subclass is reusing behavior but does not want to support the interface of the superclass. 
2. We don’t mind refusing implementations — but refusing interface gets us on our high horses. 
3. In this case, however, don’t fiddle with the hierarchy; you want to gut it by applying *Replace Subclass with Delegate* or *Replace Superclass with Delegate*.


## 重构方法参考
* Push Down Method
* Push Down Field
* Replace Superclass with Delegate
* Replace Subclass with Delegate


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
