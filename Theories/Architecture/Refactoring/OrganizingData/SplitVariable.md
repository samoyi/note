# Split Variable



<!-- TOC -->

- [Split Variable](#split-variable)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
* 命名要明确意图，不要造成误解。
* 不要为了通用性而失去语义。


## Motivation
1. Any variable with more than one responsibility should be replaced with multiple variables, one for each responsibility. 
2. Using a variable for two different things is very confusing for the reader.
    ```js
    let result = 2 * (height + width);
    console.log(result);
    result = height * width;
    console.log(result);
    ```
3. 变量的名称应该是意义明确的，上面 `result` 本身就不明确，而且还被保存了两种数据。可以改成这样
    ```js
    let perimeter = 2 * (height + width);
    console.log(perimeter);
    let area = height * width;
    console.log(area);
    ```


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
