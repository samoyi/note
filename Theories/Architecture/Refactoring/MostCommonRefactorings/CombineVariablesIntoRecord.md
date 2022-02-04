# Combine Variables Into Record

<!-- TOC -->

- [Combine Variables Into Record](#combine-variables-into-record)
    - [思想](#思想)
        - [语义化](#语义化)
    - [Motivation](#motivation)
        - [有内在联系且具有和外部的边界的几个变量，就可以组合到一起](#有内在联系且具有和外部的边界的几个变量就可以组合到一起)
        - [更易于扩展](#更易于扩展)
    - [References](#references)

<!-- /TOC -->


## 思想
中层设计规则：高内聚、语义化

### 语义化
1. 数据结构应该尽可能的反映真实数据的逻辑关系，这样才能更好的模拟真实世界，也使得数据结构更容易理解。
2. 如果一组数据在真实的世界里，在一般人的理解中是一个整体，那么反映它们的数据结构也应该是一个整体。


## Motivation
### 有内在联系且具有和外部的边界的几个变量，就可以组合到一起
1. 比如下面单独定义的三个变量
    ```js
    let selectedYear = null;
    let selectedMonth = null;
    let selectedDay = null;
    ```
2. 年月日显然是有内在联系的，而且同属于日期这个集合，所以它们是一个完整的整体。
3. 既然是一个整体，那就可以组合为一个整体。
    ```js
    let selectedDate = {
        year: null,
        month: null,
        month: null,
    };
    ```
4. 当然也不是必须要组成。只是如果它们所处的环境如果比较复杂的话，把它们收纳到一起，是很方便访问和管理的。

### 更易于扩展
1. 之后，可能要求还要记录选择的时分秒。如果没有组合为记录，则只能这样
    ```js
    let selectedYear = null;
    let selectedMonth = null;
    let selectedDay = null;
    let selectedHour = null;
    let selectedMinute = null;
    let selectedSecond = null;
    ```
2. 显然这时，还是下面的形式更好
    ```js
    let selectedDate = {
        year: null,
        month: null,
        month: null,
        hour: null,
        minute: null,
        second: null,
    };
    ```
3. 当然，从这个例子也可以看出来，其实不一定一开始就要组合。如果开始还算简单，那独立的写也没什么。但如果以后扩展的多了，那就应该组合为整体。


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
