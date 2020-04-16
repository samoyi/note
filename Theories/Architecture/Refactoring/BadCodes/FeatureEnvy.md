# Feature Envy


<!-- TOC -->

- [Feature Envy](#feature-envy)
    - [思想](#思想)
        - [增加内聚，完善语义](#增加内聚完善语义)
    - [现象](#现象)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
### 增加内聚，完善语义
1. 一个实体如果有义务提供某个功能，那就应该好好地提供。
2. 所谓好好地提供，应该是：接受一次请求，进行一些计算，返回一次服务。
3. 服务提供者应该在自己内部处理好该服务的组织工作，而不应该让请求者多次请求自己组织。比如像 API 设计就应该遵循这一点。
4. 不过这个 bad code 说的其实是相对的另一面。即，如果你想要的一个服务需要频繁的用到另一个实体里面的东西，那就说明，这个服务的大部分内部逻辑都是在那个实体里的，那就应该把完整的处理逻辑搬到那个实体里面。
5. 这样做一方面不用频繁跨实体，增强了内聚性；
6. 另一方面，把服务的逻辑放在服务提供者内部，从逻辑语义上也是更准确的——服务提供者当然要处理服务的内部逻辑。
       

## 现象
1. When we modularize a program, we are trying to separate the code into zones to maximize the interaction inside a zone and minimize interaction between zones. 
2. A classic case of Feature Envy occurs when a function in one module spends more time communicating with functions or data inside another module than it does within its own module. 
3. We’ve lost count of the times we’ve seen a function invoking half­ a ­dozen getter methods on another object to calculate some value. 
2. 看起来给人的感觉就是，一个公司里某个职位，它的工作需要频繁的去政府若干个部门办事。到 A 部门办完手续，拿着材料去 B 部门，办完后拿着 A 和 B 的材料再去 C 部门。
3. 那么能不能在政府里设置一个职位，它接收一次外部公司人员的申请，然后在内部流程对接 ABC 三个部门，最后把结果返回给外部公司人员。
4. 如果在政府内部流畅对接 ABC 的成本明显降低，成本降低的程度要大于新设一个职位的程度，那么就应该把主要的办事流程都移到政府这个对象内部，公司端只负责简单的对接。
5. 说到这里可以看出来，管理一个软件和管理一个公司乃至一个国家，也都是有某种共同之处的。


## 重构方法参考
* Inline Class


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
