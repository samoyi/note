# Remove Flag Argument

<!-- TOC -->

- [Remove Flag Argument](#remove-flag-argument)
    - [思想](#思想)
        - [SRP](#srp)
        - [参数的语义](#参数的语义)
    - [Motivation](#motivation)
        - [Flag Argument 意义不明](#flag-argument-意义不明)
        - [Flag 参数增加单一函数复杂性](#flag-参数增加单一函数复杂性)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
### SRP
还是 SRP。你做的东西不 SRP，你自己理解起来困难，别人用起来也困难。

### 参数的语义
1. 参数是用来设定行为的属性的，而不应该用来改变切换不同的行为。
2. 比如说 “踢球” 这个行为，参数可以是 “力度”，“力度” 是行为的属性。
3. 但不应该设定一个参数 `type`，取值 “用脚踢” 后者 “用头顶”，然后把 `type` 参数传给 “踢球”，这是直接改变 “踢球” 这个行为了。
4. 为了使用 “头球” 的行为，你应该重新第一一个名为 “头球” 的行为。


## Motivation
### Flag Argument 意义不明
1. 工作中对接后端接口时，有些接口就会有这样的 flag 参数。有时丧心病狂的一个 flag 字段有 1、2、3、4 四个选项，对应请求不同的东西。
2. 而且在编写函数逻辑的时候，需要为这样的参数编写条件分支。因为这种参数值是完全没有语义的，所以这时常常还要加上注释才行
    ```js
    if (flag == 1) { // 等于 1 时表示……

    }
    else if (flag == 2) { // 等于 2 时表示……
        
    }
    else if (flag == 3) { // 等于 3 时表示……

    }
    else if (flag == 4) { // 等于 4 时表示……

    }
    ```
3. 在使用函数的时候，我也必须要看函数体里面的注释才能知道要怎么传，只看形参看不出来应该怎么用
    ```js
    function getPhotoList (flat) { // 完全不知道应该传什么

    }
    ```
4. 然后在看一个函数调用时，我从函数传递的参数依然看不出来是要干什么，必须看函数体的逻辑才能知道每个值对应什么意思
    ```js
    getPhotoList(2); // 根本不知道 2 是要干啥
    ```
5. 所以还是拆分为若干个函数比较好。并不会有什么性能损耗，但是逻辑上就清晰多了。
6. 如果接口就是这么设计，那我也应该再封装为四个函数，并使用有意义的命名
    ```js
    function getPhotoList_typeFoo () {
        getPhotoList(1);
    }
    function getPhotoList_typeBar () {
        getPhotoList(2);
    }
    function getPhotoList_typeBaz () {
        getPhotoList(3);
    }
    function getPhotoList_typeQux () {
        getPhotoList(4);
    }
    ```
    
### Flag 参数增加单一函数复杂性
1. 函数应该 SRP，不应该一个函数处理好几个功能，如果有不同的功能，那就拆分为不同的函数。
2. 而且就算是像上面的 `getPhotoList` 处理同一个大功能的不同类别，也会因为复杂的条件分支而让函数内部的逻辑变得复杂。
3. 即使你的 `getPhotoList` 的实现也是像上面那样进行了封装，但是对于调用者来说，还是很难理解和使用。



## Mechanics
* 使用 *用常量代替基础类型值* 这条重构原则也可以解决这个问题，只不过是不同的方向。


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
