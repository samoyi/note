# Temporary Field

<!-- TOC -->

- [Temporary Field](#temporary-field)
    - [思想](#思想)
        - [关于特殊情况的处理方式](#关于特殊情况的处理方式)
    - [现象](#现象)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
### 关于特殊情况的处理方式
1. 如果一个模块的功能，可能会遇到不多见的某些特殊情况。应该如何处理？
2. 一种思路是，在模块里建立一个逻辑分支，用来处理特殊情况；
3. 另一种思路是，在这个模块的父级，建立逻辑判断，正常的还是走现在的模块，特殊的交给另一个模块。
4. 第一种思路少了一个模块，但增加了这个模块的复杂度；第二种思路没有增加模块的复杂多，但增加了父级的复杂度。
5. 哪个更好？具体情况具体分析吧。


## 现象
1. Sometimes you see a class in which a field is set only in certain circumstances. 
2. Such code is difficult to understand, because you expect an object to need all of its fields.
3. Trying to understand why a field is there when it doesn’t seem to be used can drive you nuts.


## 重构方法参考
* Extract Class


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
