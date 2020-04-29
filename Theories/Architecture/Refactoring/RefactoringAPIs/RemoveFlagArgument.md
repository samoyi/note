# Remove Flag Argument

<!-- TOC -->

- [Remove Flag Argument](#remove-flag-argument)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [Flag Argument 增加单一函数复杂性](#flag-argument-增加单一函数复杂性)
        - [Flag Argument 意义不明](#flag-argument-意义不明)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 还是 SRP。
2. 你做的东西不 SRP，你自己理解起来困难，别人用起来也困难。


## Motivation
### Flag Argument 增加单一函数复杂性
1. A flag argument is a function argument that the caller uses to indicate which logic the called function should execute. 
2. I may call a function that looks like this:
    ```js
    function bookConcert(aCustomer, isPremium) {
        if (isPremium) {
            // logic for premium booking
        } else {
            // logic for regular booking
        }
    }
    ```
3. To book a premium concert, I issue the call like so:
    ```js
    bookConcert(aCustomer, true);
    ```
4. I dislike flag arguments because they complicate the process of understanding what function calls are available and how to call them. 

### Flag Argument 意义不明
1. Once I select a function, I have to figure out what values are available for the flag arguments. 
2. 工作中对接后端接口时，有些接口就会有这样的 flag。有时丧心病狂的一个 flag 字段有 1、2、3、4 四个选项，对应请求不同的东西。我必须要用注释记下来四个值的意义，其他人看到这个请求的时候也需要去查看文档或者问相关的人才能知道意义。
3. Boolean flags are even worse since they don’t convey their meaning to the reader — in a function call, I can’t figure out what `true` means. 
4. It’s clearer to provide an explicit function for the task I want to do. 所以还是拆分为若干个函数比较好。并不会有什么性能损耗，但是逻辑上就清晰多了。


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
