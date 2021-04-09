# Combine Functions Into Class

<!-- TOC -->

- [Combine Functions Into Class](#combine-functions-into-class)
    - [思想](#思想)
        - [收纳整理](#收纳整理)
        - [约束数据共享的范围](#约束数据共享的范围)
        - [广义的 class](#广义的-class)
    - [Motivation](#motivation)
        - [语义化](#语义化)
        - [共享环境](#共享环境)
        - [复用](#复用)
        - [其他类似的方法](#其他类似的方法)
            - [*Combine Functions into Transform*](#combine-functions-into-transform)
            - [Nested function](#nested-function)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
隔离、共享、复用

### 收纳整理
1. 设想你有一个工具间，里面有各种工具。肯定有很多工具都是做一件事情时会一起用到的，或者说是成套的。
2. 当然你把所有工具都散乱摆放也没问题，但用的时候就找起来很不方便。所以一般人都会把一类工具放在一起，这是很自然的事情。
3. 这种思想运用到编程，其实最基础的也就是这里说到的方便。
4. 另外，你可能要把一类工具拿到其他地方去使用，这是你就必须收纳了。这就算是编程中的复用。
5. 当然这里还是只单纯的工具使用，还不涉及数据，没有数据封装。很多时候，

### 约束数据共享的范围
1. 多个方法操作一组数据，数据的传递需要使用共同的作用域。
2. 如果没有对这些方法进行封装，而是和其他方法混杂在一起，那么其他方法也会触及到这些它们不该触及的数据。

### 广义的 class
1. 任何的这种一些方法操作共同数据的情况，都可以组合为一个抽象的类。
2. 比如像 Vue 的组件也可以算作是类：有一些方法，有共享的数据。而 React 就是直接把组件定义成了类。


## Motivation
### 语义化
1. 如果若干个函数在逻辑上属于一个对象的行为，并且操作着同样的一组数据，那么在形式上就应该组成为一个整体的对象。
2. 语义上，将若干个函数组合为一个类可以明确的表示出它们在逻辑上是一个整体。

### 共享环境
1. 之前这些函数之间处理公共数据时，需要有外部的公开数据，或者函数之间明确的通过参数传递。
2. 封装为一个类之后，公共的数据就只能让类的方法来访问，而且页不需要在相互传参。

### 复用
复用一个封装好的类比复用一组函数和数据要简单得多。

### 其他类似的方法
Which one to use depends more on the broader context of the program. 

#### *Combine Functions into Transform*
1. Another way of organizing functions together is *Combine Functions into Transform*. 
2. One significant advantage of using a class is that it allows clients to mutate the core data of the object, and the derivations remain consistent. Transform 会对源数据进行拷贝。
3. 不过我觉得最重要的区别是，transform 并没有类型和对象的思想，它只是关于数据的转换，也并没有什么 “对象行为” 这种概念。

#### Nested function
1. As well as a class, functions like this can also be combined into a nested function. 
2. Usually I prefer a class to a nested function, as it can be difficult to test functions nested within another. 
3. Classes are also necessary when there is more than one function in the group that I want to expose to collaborators.
4. Languages that don’t have classes as a first-­class element, but do have first-­class functions，often use the *Function As Object* [mf-­fao] to provide this capability.


## Mechanics
1. Apply *Encapsulate Record* to the common data record that the functions share.
    * If the data that is common between the functions isn’t already grouped into a record structure, use *Introduce Parameter Object* to create a record to group it together.
2. Take each function that uses the common record and use Move Function to move it into the new class.
3. Any arguments to the function call that are members can be removed from the argument list.
4. Each bit of logic that manipulates the data can be extracted with Extract Function and then moved into the new class.


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
