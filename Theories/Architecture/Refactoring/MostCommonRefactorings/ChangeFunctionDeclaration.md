# Change Function Declaration

包含函数命名和参数设计


<!-- TOC -->

- [Change Function Declaration](#change-function-declaration)
    - [思想](#思想)
        - [意图与实现分离](#意图与实现分离)
        - [命名是重要的第一印象](#命名是重要的第一印象)
    - [Motivation](#motivation)
        - [函数命名的重要性——意图与实现分离](#函数命名的重要性意图与实现分离)
        - [函数参数设计的重要性——参数定义了函数与外部交流的方式](#函数参数设计的重要性参数定义了函数与外部交流的方式)
            - [增加函数的通用性——解耦](#增加函数的通用性解耦)
            - [增加耦合也有好处——提高了封装性](#增加耦合也有好处提高了封装性)
            - [耦合度的动态取舍——函数声明要不断进化](#耦合度的动态取舍函数声明要不断进化)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
### 意图与实现分离

### 命名是重要的第一印象
1. 名字是认识一个对象的第一印象。
2. 好的命名可以准确的传达出它所指代的事物的本质。而坏的命名则很容易让人引起误解，或者让人花更多的时间去重新认识事物并努力更新之前错误的第一印象。


## Motivation
### 函数命名的重要性——意图与实现分离

### 函数参数设计的重要性——参数定义了函数与外部交流的方式
#### 增加函数的通用性——解耦
1. 如果有一个格式化手机号的函数，开始时参数可能接受 `person`，然后从 `person` 里面提取手机号。
2. 但如果是另一个对象也想格式化它的手机号，那这个对象就必须和 `person` 拥有相同的结构。甚至，在强类型语言中，根本不能传递其他类型的对象作为参数。
3. 知道的越少，耦合度越低。

#### 增加耦合也有好处——提高了封装性
但有时确实要对一类对象的若干属性进行操作，那么这时就只能耦合于这类对象。

#### 耦合度的动态取舍——函数声明要不断进化
1. The only right answer to this puzzle is that there is no right answer, especially over time. 
2. So I find it’s essential to be familiar with *Change Function Declaration* so the code can evolve with my understanding of what the best joints in the code need to be.


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
