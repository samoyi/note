# Comments


<!-- TOC -->

- [Comments](#comments)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
如果一个对象需要增加某些辅助措施才能更好的使用时，那先考虑一下是不是对象本身还不够好。


## Motivation
1. 如果脚臭，那就洗脚，别在车里喷香水。
2. 如果代码容易理解，那就不需要注释。
3. 如果一段代码需要注释，那就先看看是不是因为代码的易读性不高才需要注释。如果是的话那就修改代码而不是用注释来凑合掩盖问题。
4. 如果已经不能再让代码变得更易读但仍然觉得不容易理解时才有必要使用注释。


## 重构方法参考
* Extract Function：将比较复杂需要注释的一段代码封装为一个函数，起一个好理解的名字。
* Extract Variable：给一行复杂的计算赋值一个名字有意义的函数，就不需要注释说明这一长串是计算什么了。
* Change Function Declaration：用有意义的名字代替注释。
* Rename Variable：起个一目了然的名字吧。
* Consolidate Conditional Expression：如果要为一组复杂的串并联条件表达式写注释，不如封装为一个函数。
* Introduce Assertion
* Remove Flag Argument


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
