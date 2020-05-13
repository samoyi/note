# Inline Class 

inverse of: Extract Class


<!-- TOC -->

- [Inline Class](#inline-class)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [如果一个类的功能已经所剩无几](#如果一个类的功能已经所剩无几)
        - [先融合，再重组](#先融合再重组)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 如果一个结构存在的成本已经大于收益，那就解散它。
2. TODO  “先融合，再重组” 能抽象出什么思想？


## Motivation
### 如果一个类的功能已经所剩无几
1. I use *Inline Class* if a class is no longer pulling its weight and shouldn’t be around any more. 
2. Often, this is the result of refactoring that moves other responsibilities out of the class so there is little left. 
3. At that point, I fold the class into another — one that makes most use of the runt class. 

### 先融合，再重组
1. Another reason to use *Inline Class* is if I have two classes that I want to refactor into a pair of classes with a different allocation of features. 
2. I may find it easier to first use *Inline Class* to combine them into a single class, then *Extract Class* to make the new separation. 
3. This is a general approach when reorganizing things: sometimes, it’s easier to move elements one at a time from one context to another, but sometimes it’s better to use an inline refactoring to collapse the contexts together, then use an extract refactoring to separate them into different elements.
4. 比如一个类里面有功能 a/d/e，另一个类由功能 b/c/f，你最终想重组为 a/b/c 和 d/e/f。
5. 如果你开始不融合，直接搬运功能的话，每次搬运一个功能，可能都要处理一次环境变动引起的问题。
6. 不如先一股脑融合到一起，一次性处理好环境问题，再拆分。


## Mechanics
1. In the target class, create functions for all the public functions of the source class. These functions should just delegate to the source class. 
2. Change all references to source class methods so they use the target class’s delegators instead. Test after each change.
3. Move all the functions and data from the source class into the target, testing after each move, until the source class is empty. 
4. Delete the source class and hold a short, simple funeral service


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
