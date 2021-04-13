# Extract Class

inverse of: Inline Class 


<!-- TOC -->

- [Extract Class](#extract-class)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
SRP 思想在类中的应用。


## Motivation
 一个类开始的设计是 SRP，但随着修改也许就不是了。


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
