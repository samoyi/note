# Insider Trading


## 思想
1. 不同模块之间应该尽量少的交流，当然交流不可避免。
2. 重要的一点是，交流的渠道应该是明确和显而易见的，而不应该隐晦的不容易被注意到。
3. 比如修改另一个对象的属性时，最好是有一个明确命名的方法，而不是直接引用并修改。


## 重构方法参考
* Encapsulate Collection：明确的修改
* Hide Delegate：内幕交易是客户端直接通过委托关系来访问数据，现在用代理封装委托关系，只返回给客户端需要的数据
* Encapsulate Record：通过明确的读写函数来操作数据


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)