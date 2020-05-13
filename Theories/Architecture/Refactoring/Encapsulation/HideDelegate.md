# Hide Delegate

inverse of: Remove Middle Man


<!-- TOC -->

- [Hide Delegate](#hide-delegate)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [多个客户们不要自己去委托一层层的关系，而是交给代理去做统一做](#多个客户们不要自己去委托一层层的关系而是交给代理去做统一做)
    - [References](#references)

<!-- /TOC -->


## 思想
1. Black box 封装就是让用户不需要了解内部是什么结构、怎么运作的，只需要无脑使用即可。
2. 而且还要求，如果内部发生了变化，用户也是要无感知的才行。


## Motivation
### 多个客户们不要自己去委托一层层的关系，而是交给代理去做统一做
1. 比如用户使用 `aPerson` 读取 `manager` 时，如果向下面这样直接读取，会依赖中间的 `department`
    ```js
    manager = aPerson.department.manager; // 客户代码
    ```
2. 假设 `aPerson` 的结构变了，不再是 `aPerson`-`department`-`manager`，那么这个用户也要相应的改变。
3. 而且如果好几个用户都引用 `manager`，那么所有的用户都要各自变动自己的引用结构。
4. 如果重构为下面的逻辑，`aPerson` 向用户隐藏中间的委托关系，`aPerson` 自己代理用户实现对 `department` 的委托，只返回给用户最终的 `manager`
    ```js
    manager = aPerson.manager; // 客户代码
    class Person { // 服务商代码
        get manager () {
            return this.department.manager;
        }
    }
    ```
5. 这样当中间的委托关系发生变化时，`aPerson` 只需要修改自己的代理委托函数 `get manager`，就可以重新建立新的结构，而所有的客户都是无感知的。


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
