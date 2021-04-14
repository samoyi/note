# Decompose Conditional

inverse of: *Consolidate Conditional Expression*


<!-- TOC -->

- [Decompose Conditional](#decompose-conditional)
    - [原则](#原则)
    - [场景](#场景)
        - [复杂的条件表达式，中间的临时结果也可以封装](#复杂的条件表达式中间的临时结果也可以封装)
    - [过度优化](#过度优化)
    - [References](#references)

<!-- /TOC -->


## 原则


## 场景
### 复杂的条件表达式，中间的临时结果也可以封装
1. 之前有一个条件判断是这样的，完全眼花，很难看明白要干什么
    ```js
    return rootGetters['common/isWeixin'] && (!urlParams.token) && (!urlParams.code && !sessionStorage.getItem('last_code'));
    ```
2. 重构成下面的样子，很容易就看懂要判断什么了
    ```js
    const isWeixin = rootGetters['common/isWeixin'];
    const noParamToken = !urlParams.token;
    const noCode = !urlParams.code && !sessionStorage.getItem('last_code');
    return isWeixin && noParamToken && noCode;
    ```


## 过度优化


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
