# Parameterize Function

<!-- TOC -->

- [Parameterize Function](#parameterize-function)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想


## Motivation
就是很常见的复用
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
