# Change Function Declaration

包含函数命名和参数设计


<!-- TOC -->

- [Change Function Declaration](#change-function-declaration)
    - [Motivation](#motivation)
        - [函数的重要性——程序的基本单元](#函数的重要性程序的基本单元)
        - [函数命名的重要性——概括函数的功能](#函数命名的重要性概括函数的功能)
        - [及时重命名，便于下次高效的阅读代码](#及时重命名便于下次高效的阅读代码)
        - [函数参数设计的重要性——参数定义了函数与外部交流的方式](#函数参数设计的重要性参数定义了函数与外部交流的方式)
            - [增加函数的通用性](#增加函数的通用性)
            - [对实参的解耦](#对实参的解耦)
            - [耦合也有好处](#耦合也有好处)
            - [耦合度的动态取舍——函数声明要不断进化](#耦合度的动态取舍函数声明要不断进化)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## Motivation
### 函数的重要性——程序的基本单元
1. Functions represent the primary way we break a program down into parts. 
2. Function declarations represent how these parts fit together — effectively, they represent the joints in our software systems. 
3. And, as with any construction, much depends on those joints. 
4. Good joints allow me to add new parts to the system easily, but bad ones are a constant source of difficulty, making it harder to figure out what the software does and how to modify it as my needs change. 
5. Fortunately, software, being soft, allows me to change these joints, providing I do it carefully.
6. 这里把函数必须为关节，但我觉得函数更像是基本单元而不是连接单元的东西，毕竟从英文名来说，“功能” 也更像是具体做事情的单元，而不是连接这些单元的东西。比如，可以比喻为细胞？

### 函数命名的重要性——概括函数的功能
1. The most important element of such a joint is the name of the function. 
2. A good name allows me to understand what the function does when I see it called, without seeing the code that defines its implementation. 

### 及时重命名，便于下次高效的阅读代码
1. However, coming up with good names is hard, and I rarely get my names right the first time. 
2. When I find a name that’s confused me, I’m tempted to leave it — after all, it’s only a name. 
3. This is the work of the evil demon *Obfuscatis*; for the sake of my program’s soul I must never listen to him. 
4. If I see a function with the wrong name, it is imperative that I change it as soon as I understand what a better name could be. 
5. That way, the next time I’m looking at this code, I don’t have to figure out again what’s going on. 
6. Often, a good way to improve a name is to write a comment to describe the function’s purpose, then turn that comment into a name.

### 函数参数设计的重要性——参数定义了函数与外部交流的方式
1. Similar logic applies to a function’s parameters. 
2. The parameters of a function dictate how a function fits in with the rest of its world. 
3. Parameters set the context in which I can use a function. 

#### 增加函数的通用性
1. If I have a function to format a person’s telephone number, and that function takes a person as its argument, then I can’t use it to format a company’s telephone number. 
2. If I replace the person parameter with the telephone number itself, then the formatting code is more widely useful.

#### 对实参的解耦
1. Apart from increasing a function’s range of applicability, I can also remove some coupling, changing what modules need to connect to others. Telephone formatting logic may sit in a module that has no knowledge about people. 
2. Reducing how much modules need to know about each other helps reduce how much I need to put into my brain
when I change something — and my brain isn’t as big as it used to be (that doesn’t say anything about the size of its container, though).

#### 耦合也有好处
1. Choosing the right parameters isn’t something that adheres to simple rules. 
2. I may have a simple function for determining if a payment is overdue, by looking at if it’s older
than 30 days. 
3. Should the parameter to this function be the payment object, or the due date of the payment? 
4. Using the payment couples the function to the interface of the payment object. 
5. But if I use the payment, I can easily access other properties of the payment, should the logic evolve, without having to change every bit of code that calls this function — essentially, increasing the encapsulation of the function.

#### 耦合度的动态取舍——函数声明要不断进化
1. The only right answer to this puzzle is that there is no right answer, especially over time. 
2. So I find it’s essential to be familiar with Change Function Declaration so the code can evolve with my understanding of what the best joints in the code need to be.


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
