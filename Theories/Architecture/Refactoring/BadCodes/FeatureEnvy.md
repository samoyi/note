# Feature Envy


<!-- TOC -->

- [Feature Envy](#feature-envy)
    - [思想](#思想)
    - [References](#references)

<!-- /TOC -->


## 思想
1. When we modularize a program, we are trying to separate the code into zones to maximize the interaction inside a zone and minimize interaction between zones. A classic case of Feature Envy occurs when a function in one module spends more time communicating with functions or data inside another module than it does within its own module. We’ve lost count of the times we’ve seen a function invoking half­a­dozen getter methods on another object to calculate some value. 
2. 看起来给人的感觉就是，一个公司里某个职位，它的工作需要频繁的去政府若干个部门办事。到A部门办完手续，拿着材料去B部门，办完后拿着A和B的材料再去C部门。
3. 那么能不能在政府里设置一个职位，它接收一次外部公司人员的申请，然后在内部流程对接ABC三个部门，最后把结果返回给外部公司人员。
4. 如果在政府内部流畅对接ABC的成本明显降低，成本降低的程度要大于新设一个职位的程度，那么就应该把主要的办事流程都移到政府这个对象内部，公司端只负责简单的对接。
5. 说到这里可以看出来，管理一个软件和管理一个公司乃至一个国家，也都是有某种共同之处的。


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
