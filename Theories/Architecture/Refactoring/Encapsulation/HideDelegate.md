# Hide Delegate

inverse of: Remove Middle Man


<!-- TOC -->

- [Hide Delegate](#hide-delegate)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [References](#references)

<!-- /TOC -->


## 思想
1. Black box 封装就是让用户不需要了解内部是什么结构、怎么运作的，只需要无脑使用即可。
2. 而且还要求，如果内部发生了变化，用户也是要无感知的才行。


## Motivation
1. One of the keys — if not the key — to good modular design is encapsulation. Encapsulation means that modules need to know less about other parts of the system. Then, when things change, fewer modules need to be told about the change — which makes the change easier to make.
2. When we are first taught about object orientation, we are told that encapsulation means hiding our fields. As we become more sophisticated, we realize there is more that we can encapsulate. 
3. If I have some client code that calls a method defined on an object in a field of a server object, the client needs to know about this delegate object. 
4. If the delegate changes its interface, changes propagate to all the clients of the server that use the delegate. 
5. I can remove this dependency by placing a simple delegating method on the server that hides the delegate. Then any changes I make to the delegate propagate only to the server and not to the clients.
6. 比如用户使用 `aPerson` 读取 `manager` 时，如果向下面这样直接读取，会依赖中间的 `department`
    ```js
    manager = aPerson.department.manager; // 客户代码
    ```
7. 假设 `aPerson` 的结构变了，不再是 `aPerson`-`department`-`manager`，那么这个用户也要相应的改变。
8. 而且如果好几个用户都引用 `manager`，那么所有的用户都要各自变动自己的引用结构。
9. 如果重构为下面的逻辑，`aPerson` 向用户隐藏中间的委托关系，`aPerson` 自己代理用户实现对 `department` 的委托，只返回给用户最终的 `manager`
    ```js
    manager = aPerson.manager; // 客户代码
    class Person { // 服务商代码
        get manager () {
            return this.department.manager;
        }
    }
    ```
10. 这样当中间的委托关系发生变化时，`aPerson` 只需要修改自己的代理委托函数 `get manager`，就可以重新建立新的结构，而所有的客户都是无感知的。


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
