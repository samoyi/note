# Remove Middle Man

inverse of: Hide Delegate


<!-- TOC -->

- [Remove Middle Man](#remove-middle-man)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [References](#references)

<!-- /TOC -->


## 思想


## Motivation
1. In the motivation for *Hide Delegate*, I talked about the advantages of encapsulating the use of a delegated object. 
2. There is a price for this. Every time the client wants to use a new feature of the delegate, I have to add a simple delegating method to the server. 
3. After adding features for a while, I get irritated with all this forwarding. 于是进行 *Hide Delegate* 的逆操作
    ```js
    manager = aPerson.manager; // 客户代码
    class Person { // 服务商代码
        get manager () {
            return this.department.manager;
        }
    }
    ```
    变回
    ```js
    manager = aPerson.department.manager; // 客户代码
    ```
4. 但是改为直接访问对象，那还是存在那个结构变动的隐患。而且这时因为引用的更多，结构变动带来的改动成本会更大。
5. 那是不是可以对 `department` 这一层进行一个代理，这样当 `department` 发生改变时，用户也可以无感知
    ```js
    class Person { // 服务商代码
        get department () {
            return this.department;
        }
    }
    ```


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
