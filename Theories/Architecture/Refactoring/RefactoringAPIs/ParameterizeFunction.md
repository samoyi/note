# Parameterize Function

<!-- TOC -->

- [Parameterize Function](#parameterize-function)
    - [思想](#思想)
    - [Motivation —— Command-Query Separation](#motivation--command-query-separation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想


## Motivation —— Command-Query Separation
1. If I see two functions that carry out very similar logic with different literal values, I can remove the duplication by using a single function with parameters for the different values. 
2. This increases the usefulness of the function, since I can apply it elsewhere with different values.
3. 好像没说个啥
    ```js
    // 从
    function tenPercentRaise (aPerson) {
        aPerson.salary = aPerson.salary.multiply(1.1);
    }
    function fivePercentRaise (aPerson) {
        aPerson.salary = aPerson.salary.multiply(1.05);
    }

    // 到
    function raise (aPerson, factor) {
        aPerson.salary = aPerson.salary.multiply(1 + factor);
    }
    ```



## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
