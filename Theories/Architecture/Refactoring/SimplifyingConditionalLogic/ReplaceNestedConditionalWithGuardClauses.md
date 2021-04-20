# Replace Nested Conditional with Guard Clauses


<!-- TOC -->

- [Replace Nested Conditional with Guard Clauses](#replace-nested-conditional-with-guard-clauses)
    - [思想](#思想)
        - [语义化](#语义化)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
### 语义化
1. 这里的理念是，应该区分正常的分支流程判断和异常输入的判断。
2. Guard clause 实际上就是守卫正常的流程逻辑，禁止异常输入进入。
3. 异常逻辑和正常逻辑应该是做区分的。
4. 如果语义上是有区别的，那形式也应该有区别，这样才不会误导阅读者。


## Motivation
1. 条件表达式可以分为两种情况：一种是处理并列的逻辑分支的，一种是处理异常逻辑的。
2. 例如下面的三个分支，是并列的三种情况
    ```js    
    if (n > 0) {
        
    }
    else if (n == 0) {
        
    }
    else if (n < 0) {
        
    }    
    ```
    而下面新加的这个显然不能和其他三个并列，它并不是一种正常的逻辑分支，而只是为了守卫下面正常的逻辑            
    ```js
    if (n == NULL) {
        return NULL;
    }
    else if (n > 0) {

    }
    else if (n == 0) {
        
    }
    else if (n < 0) {
        
    } 
    ```
4. 既然这样的守卫条件分支在语义上是特殊的，那就应该让它在形式上也特殊，这样才符合语义化的要求
    ```js
    if (n == NULL) {
        return NULL;
    }
    
    if (n > 0) {

    }
    else if (n == 0) {
        
    }
    else if (n < 0) {
        
    } 
    ```    


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
