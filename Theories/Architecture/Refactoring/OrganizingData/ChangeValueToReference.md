# Change Value to Reference

inverse of: Change Reference to Value


<!-- TOC -->

- [Change Value to Reference](#change-value-to-reference)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 中层设计规则：DRY
2. 和 Change Reference to Value 相反，如果你希望其他人共同修改一份数据，那你分发对数据的引用（修改权限），这样所有使用该数据的人都可以同步修改该数据。
3. 但你可能也需要控制一些对数据的修改权限，避免用户对其进行非预期的修改。


## Motivation
1. 如果一个对象的属性值是不变的，那么把这个对象作为值传递也行，和作为引用传递区别不大，只是麻烦一点。
2. 但如果这个对象的属性值是可变的，那就需要所有地方该对象的地方都同步改变。这个时候按值传递就很麻烦了，要修改所有地方的该对象。


## Mechanics
1. Changing a value to a reference results in only one object being present for an entity, and it usually means I need some kind of repository where I can access these objects. 
2. I then only create the object for an entity once, and everywhere else I retrieve it from the repository.


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
