# Split Variable



<!-- TOC -->

- [Split Variable](#split-variable)
    - [思想](#思想)
    - [涉及的 bad codes](#涉及的-bad-codes)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
* 命名要明确意图，不要造成误解。
* 不要为了通用性而失去语义。


## 涉及的 bad codes 
* Speculative Generality


## Motivation
1. 一个变量不应该不应该先后保存两个对象。
2. 首先，这种情况下这个变量名肯定是语义不明确的，它的名字要么只能准确描述其中一个对象，要么两个都不能准确描述。
3. 这种情况下很明显会对阅读者造成误导。
4. 例如下面的代码，只看名字你根本不知道 `result` 是什么的结果
    ```js
    let result = 2 * (height + width);
    console.log(result);
    result = height * width;
    console.log(result);
    ```
5. 所以应该改为
    ```js
    let perimeter = 2 * (height + width);
    console.log(perimeter);
    let area = height * width;
    console.log(area);
    ```   


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
