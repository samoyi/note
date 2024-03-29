# Introduce Assertion


<!-- TOC -->

- [Introduce Assertion](#introduce-assertion)
    - [思想](#思想)
        - [语义化](#语义化)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
### 语义化
1. 条件分支的语义更倾向于正常的程序流程，而断言则是要发现程序错误。
2. 异常就是异常，而不是一种流程分支。
3. 使用断言可以让阅读者立刻看出来要干什么。


## Motivation
1. 这里说的断言不是用来处理用户的错误输入的，而是用来发现程序编写的错误的。
2. 例如一个功能要求输入的是数值类型，如果输入的数据是数值字符串，程序会给出提示，这样的程序是没有问题的。但如果程序没有检查，而接受了数值字符串类型，并进行了后续的操作，那之后可能就会发生某些问题。
3. 如果错误的输入会立刻被发现那没问题，但有时它并不会很容易的被发现，而只是留下了一个隐患。
4. 断言的作用就是就是防止这种情况，在这个例子中，它会明确的断言输入必须是数值类型，否则就会抛出错误。
5. 这种断言的功能当然可以使用逻辑分支来处理，例如
    ```js
    if (typeof n !== "number") {
        throw TypeError();
    }
    ```
6. 但使用专门的断言方法，语义会更明确一些
    ```js
    assert(typeof n === "number")
    ```
7. 条件分支的语义更偏向于处理不同的逻辑分支，它是为了引导程序的不同流程；而断言方法就是明确的要求检查错误了。对于阅读者来说，它可以一眼就看出来这里要求断言，而不是普通的逻辑分支。


## Mechanics
断言使用的详细说明 `/Theories/Architecture/DefensiveProgramming/Assertions.md`


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
