# Replace Derived Variable with Query



<!-- TOC -->

- [Replace Derived Variable with Query](#replace-derived-variable-with-query)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [用计算属性替代不应该被修改的变量](#用计算属性替代不应该被修改的变量)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
如果一个数据不应该被修改，那就让它不能被修改


## Motivation
### 用计算属性替代不应该被修改的变量
1. One of the biggest sources of problems in software is mutable data. 
2. Data changes can often couple together parts of code in awkward ways, with changes in one part leading to knock-­on effects that are hard to spot. 
3. One way I can make a big impact is by removing any variables that I could just as easily calculate. 
4. It is also protected from being corrupted when you fail to update the variable as the source data changes.       


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
