# Remove Dead Code



<!-- TOC -->

- [Remove Dead Code](#remove-dead-code)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [看似无害却有害——这也是断舍离的意义](#看似无害却有害这也是断舍离的意义)
        - [担心还有用](#担心还有用)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
* 断舍离
* 即使是理工科的工作，培养美学也是很基础很必要的。只要不是纯机械的活动，都需要美学、需要灵感。


## Motivation
### 看似无害却有害——这也是断舍离的意义
1. When we put code into production, even on people’s devices, we aren’t charged by weight. 
2. A few unused lines of code don’t slow down our systems nor take up significant memory; indeed, decent compilers will instinctively remove them. 
3. But unused code is still a significant burden when trying to understand how the software works. It doesn’t carry any warning signs telling programmers that they can ignore this function as it’s never called any more, so they still have to spend time understanding what it’s doing and why changing it doesn’t seem to alter the output as they expected.

### 担心还有用
1. Once code isn’t used any more, we should delete it. I don’t worry that I may need it sometime in the future; should that happen, I have my version control system so I can always dig it out again. 
2. If it’s something I really think I may need one day, I might put a comment into the code that mentions the lost code and which revision it was removed in — but, honestly, I can’t remember the last time I did that, or regretted that I hadn’t done it. 
3. Commenting out dead code was once a common habit. This was useful in the days before version control systems were widely used, or when they were inconvenient. Now, when I can put even the smallest code base under version control, that’s no longer needed.


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
