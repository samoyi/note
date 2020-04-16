# Comments


<!-- TOC -->

- [Comments](#comments)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
如果脚臭，那就洗脚，别在车里喷香水。


## Motivation
When you feel the need to write a comment, first try to refactor the code so that any comment becomes superfluous.



## 重构方法参考
* Extract Function：将比较复杂需要注释的一段代码封装为一个函数，起一个好理解的名字
* Extract Variable：给一行复杂的计算赋值一个名字有意义的函数，就不需要注释说明这一长串是计算什么了
* Change Function Declaration：用有意义的名字代替注释
* Rename Variable：起个一目了然的名字吧


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
