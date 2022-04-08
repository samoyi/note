# General


<!-- TOC -->

- [General](#general)
    - [设计思想](#设计思想)
        - [OCP](#ocp)
    - [概述](#概述)
    - [使用表驱动方法要解决两个问题](#使用表驱动方法要解决两个问题)
    - [References](#references)

<!-- /TOC -->


## 设计思想
### OCP 
1. 数据和执行环境分离，隔离变化。
2. 如果使用条件分支语句，就是把数据和执行环境写在一起了，每次数据修改时也要修改作为执行环境的分支语句。
3. 把数据保存在表之后，就是把数据从执行环境中分离，之后数据再发生变化就不需要修改执行环境了。
 

## 概述
1. 表驱动法是一种编程模式（scheme），它允许你从表中查找信息而不是使用逻辑语句（`if` 和 `case`）。
2. 实际上，任何你可以通过逻辑语句来选择的东西，都可以通过查表来选择。
3. 对于简单的选择情况，使用逻辑语句更简单直观。但是随着选择的情况越来越复杂，就越来越适合使用查表法。
4. 恰当的使用表驱动方法，代码会比使用逻辑语句的方法更简单，更容易修改，也更高效。


## 使用表驱动方法要解决两个问题
1. 第一个问题是，怎样从表中查询条目。查询方法分为以下三种：
    * 直接访问（direct access）
    * 索引访问（indexed access）
    * 阶梯访问（staire-step access）
2. 第二个问题是，应该在表里面存什么。有时表查询的结果是数据，那么就可以直接保存该数据；而有时表查询的结果是动作（action），这是可以保存描述该动作的代码，或者在有些语言里保存对改动的子程序的引用（例如对函数的引用）。


## References
* [*Code Complete 2*](https://book.douban.com/subject/1432042/)