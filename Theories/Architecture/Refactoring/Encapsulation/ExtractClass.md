# Extract Class

inverse of: Inline Class 


<!-- TOC -->

- [Extract Class](#extract-class)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [一个类开始的设计也许是 SRP，但随着修改也许就不是了](#一个类开始的设计也许是-srp但随着修改也许就不是了)
        - [需要进行提取的迹象——需要提取出一类个的部分通常具有内聚性和耦合性](#需要进行提取的迹象需要提取出一类个的部分通常具有内聚性和耦合性)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
1. SRP 思想在类中的应用。
2. 如果发现一个类内部负责了两个类的功能，或者是一个类里面产生了一个功能相对独立的部分，那就分离出来一个新的类。


## Motivation
### 一个类开始的设计也许是 SRP，但随着修改也许就不是了
1. You’ve probably read guidelines that a class should be a crisp abstraction, only handle a few clear responsibilities, and so on. 
2. In practice, classes grow. You add some operations here, a bit of data there. 
3. You add a responsibility to a class feeling that it’s not worth a separate class — but as that responsibility grows and breeds, the class becomes too complicated. 
4. Imagine a class with many methods and quite a lot of data. 
5. A class that is too big to understand easily. You need to consider where it can be split — and split it. 

### 需要进行提取的迹象——需要提取出一类个的部分通常具有内聚性和耦合性
1. A good sign is when a subset of the data and a subset of the methods seem to go together. 
2. Other good signs are subsets of data that usually change together or are particularly dependent on each other. 
3. A useful test is to ask yourself what would happen if you remove a piece of data or a method. What other fields and methods would become nonsense? 
4. One sign that often crops up later in development is the way the class is sub­typed. 
5. You may find that subtyping affects only a few features or that some features need to be subtyped one way and other features a different way. 当你想以这个类再定义子类型时，也许会发现你想定义的子类型只希望使用这个类一部分的东西。那么你这个类可能就是有了两部分东西，而不是一个独立完整的整体。


## Mechanics
1. Decide how to split the responsibilities of the class. 先明确哪一部分可以独立出单独的功能体
2. Create a new child class to express the split-­off responsibilities.
3. If the responsibilities of the original parent class no longer match its name, rename the parent.
4. Create an instance of the child class when constructing the parent and add a link from parent to child.
5. Use Move Field on each field you wish to move. Test after each move.
6. Use Move Function to move methods to the new child. Start with lower-­level methods (those being called rather than calling，先把基础的铺好). Test after each move.
7. Review the interfaces of both classes, remove unneeded methods, change names to better fit the new circumstances.
8. Decide whether to expose the new child. If so, consider applying Change Reference to Value to the child class.


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
