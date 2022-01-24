# Direct Access Tables


<!-- TOC -->

- [Direct Access Tables](#direct-access-tables)
    - [设计思想](#设计思想)
    - [直接访问](#直接访问)
    - [更复杂的例子](#更复杂的例子)
    - [References](#references)

<!-- /TOC -->


## 设计思想
 

## 直接访问
1. 直接访问就是可以通过条件语句映射关系的起始值来查询到表项。
2. 例如为了输出一年中每个月的天数，当然可以用下面的条件分支语句
    ```js
    if (month == 1) {
        return 31;
    }
    else if (month == 2) {
        return 28;
    }
    ...
    ```
3. 但显然更好的方法是使用一个映射关系的表，从月份映射到天数。这个表可以直接用数组实现
    ```js
    [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    ```
    这样就可以从映射的起始值月份直接查到对应的表项进而找到该月的天数。


## 更复杂的例子


## References
* [*Code Complete 2*](https://book.douban.com/subject/1432042/)
