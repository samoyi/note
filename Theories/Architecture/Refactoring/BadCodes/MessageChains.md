# Message Chains


<!-- TOC -->

- [Message Chains](#message-chains)
    - [思想](#思想)
        - [意图和实现分离](#意图和实现分离)
    - [现象](#现象)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
### 意图和实现分离
1. 我想获取一个值，但我没必要知道是怎么获取的。代理负责获取的实现，然后满足我的意图。
2. 分离之后，实现可以随意变化，但只要意图不变，那我得到的结果就应该是相同的。
3. 使用者使用起来更方便和安全，创建者更容易监控和修改。


## 现象
1. 和 Middle Man 相反。
2. 对需要查询对象中一个值的时候，可能会用到长长的查询链，最常见的情况就是查询一个对象很深的属性时，例如 `groups.top.leader.info.basic.name`。
3. 这样的查询显然就依赖了这个多层的结构，结构中任意一层发生变化都会导致查询失败。特别是很多人都在使用这个对象的时候，就会导致集体失效。
4. 对象应该是黑箱的，不应该向使用者暴露复杂的内部结构，这既不安全又不方便。
5. 所以对象应该提供一个代理，让访问者通过代理来访问这样的属性。例如
    ```js
    getTopLeaderName () {
        return groups.top.leader.info.basic.name;
    }
    ```
6. 特别是当多个访问者都要访问这样数据时候，代理就很有必要了。
    

## 重构方法参考
* Extract Function：代理多层或复杂结构
* Hide Delegate：用代理封装耦合的消息链
* Encapsulate Record


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
