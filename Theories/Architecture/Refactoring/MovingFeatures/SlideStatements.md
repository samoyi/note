# Slide Statements



<!-- TOC -->

- [Slide Statements](#slide-statements)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [相关的代码收纳到一起](#相关的代码收纳到一起)
        - [按照逻辑顺序放置代码](#按照逻辑顺序放置代码)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 归类，收纳，美学。
2. 本来代码就是不容易理解的东西，所以更应该遵照易于阅读和理解的方式来书写。


## Motivation
### 相关的代码收纳到一起
1. Code is easier to understand when things that are related to each other appear together. 
2. If several lines of code access the same data structure, it’s best for them to be together rather than intermingled with code accessing other data structures.
3. A very common case of this is declaring and using variables. Some people like to declare all their variables at the top of a function. I prefer to declare the variable just before I first use it.
4. Putting related code into a clearly separated function is a better separation than just moving a set of lines together, but I can’t do the Extract Function unless the code is together in the first place.

### 按照逻辑顺序放置代码
1. 除了把相关的代码放在一起方便查看以外，我还喜欢按照逻辑顺序放置代码。
2. 比如一个方法是获取手机号 `getPhone`，获取手机号之后要调用发送手机号的方法 `sendPhone`。那么，我喜欢把这两个方法写在一起，且 `getPhone` 在上面，`sendPhone` 在下面。
    ```js
    // 其他方法

    getPhone () {}

    sendPhone () {}

    // 其他方法
    ```js
3. 或者颠倒过来也行，只要保证统一一个习惯的顺序就好。这样阅读代码的时候就是按照舒服的思维顺序。


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
