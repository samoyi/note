# Inline Class

inverse of: Extract Class


<!-- TOC -->

- [Inline Class](#inline-class)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 中层设计规则：高内聚。
2. TODO  “先融合，再拆分” 能抽象出什么思想？


## Motivation
1. 如果一个类的功能已经所剩无几，那就内联到另一个合适的类里面。
2. 还有一个可以内联的场景是，如果现在有两个类，你想重构它们，重新在它们之间分配功能，那么先内联到一起再分配会更好。
4. 比如一个类里面有功能 a/d/e，另一个类由功能 b/c/f，你最终想重组为 a/b/c 和 d/e/f。
5. 如果你开始不融合，直接搬运功能的话，每次搬运一个功能，可能都要处理一次环境变动引起的问题。
6. 不如先一股脑融合到一起，一次性处理好环境问题，再拆分。
7. 在重构两个函数、模块等对象时，也可以按照这样的思路先融合再拆分。


## Mechanics
1. In the target class, create functions for all the public functions of the source class. These functions should just delegate to the source class. 
2. Change all references to source class methods so they use the target class’s delegators instead. Test after each change.
3. Move all the functions and data from the source class into the target, testing after each move, until the source class is empty. 
4. Delete the source class and hold a short, simple funeral service


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
