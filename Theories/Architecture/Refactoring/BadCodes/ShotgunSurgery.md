# Shotgun Surgery


<!-- TOC -->

- [Shotgun Surgery](#shotgun-surgery)
    - [思想](#思想)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
1. Open–closed principle：software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification。
2. 一个设计良好的实体应该提供一个稳固的 API，用来应对外界的变化，这样外部的改变不会导致实体本身的变动。
3. 稍差一点的，为了应对外部的变化，实体内部只需要修改某一处确切的位置，其他部分不需要改变仍然可以正常运转。这唯一的一处修改的地方，实际上要做到既响应了外部变化，又让内部依赖它的部分都无感知。
4. 而最差的情况，就是这里所说的 Shotgun Surgery：外部发生一个变动，实体内部需要修改好几个地方。
5. 如果多个东西同时耦合于一个东西，当这个被耦合的对象逻辑发生修改时，就要去修改很多耦合于该对象的地方。
6. 应该尽可能的避免耦合，尤其是这种多对一的耦合。


## 重构方法参考
* Combine Functions into Class：相关联的数据及其相关方法封装为类
* Replace Primitive with Object：把数据约束为对象，这样就不用各处使用数据的各自对数据进行各种处理了。当数据逻辑改变的时候也只需要在数据对象中修改
* Combine Functions into Transform：把数据和相关操作都放到一起
* Inline Class：如果修改散落在好几个 class 里面，那也许这几个 class 逻辑上应该合并为一个。


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
