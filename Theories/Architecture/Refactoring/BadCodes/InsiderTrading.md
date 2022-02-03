# Insider Trading


## 思想
### 意图和实现分离
1. 不同模块之间应该尽量少的交流，当然交流不可避免。
2. 重要的一点是，交流的渠道应该是明确和显而易见的，而不应该隐晦的不容易被注意到。
3. 比如修改另一个对象的属性时，最好是有一个明确命名的方法，而不是直接引用并修改。虽然内部实现还是要引用并修改，但是通过封装修改方法，就有了明确的意图。
4. 对于创建者来说可以更好的监控交流，对于使用者来说可以更明确、规范的进行交流。


## 重构方法参考
* Hide Delegate：内幕交易是客户端直接通过一层层的委托关系（`groups.top.leader.info.basic.name`）来访问数据，现在用代理封装委托关系，只返回给客户端需要的数据
* Encapsulate Record：通过明确的读写函数来操作数据
* Encapsulate Collection：明确的修改
* Replace Subclass with Delegate：不期望而继承了一个类的特征
* Replace Superclass with Delegate：不期望而继承了一个类的特征


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
