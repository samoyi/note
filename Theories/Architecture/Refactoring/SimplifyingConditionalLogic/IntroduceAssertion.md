# Introduce Assertion


<!-- TOC -->

- [Introduce Assertion](#introduce-assertion)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 任何异常都不应该用表示正常程序流程的`if...else`绕过。
2. `if...else` 是表示正常的流程分支，而不是用来避免异常的。
3. 异常就是异常，而不是一种流程分支。


## Motivation
1. Often, sections of code work only if certain conditions are true. Such assumptions are often not stated but can only be deduced by looking through an algorithm. Sometimes, the assumptions are stated with a comment. 
2. A better technique is to make the assumption explicit by writing an assertion.
3. An assertion is a conditional statement that is assumed to be always true. Failure of an assertion indicates a programmer error. 
4. Assertion failures should never be checked by other parts of the system. 
5. Assertions should be written so that the program functions equally correctly if they are all removed; indeed, some languages provide assertions that can be disabled by a compile-­time switch.
6.  I often see people encourage using assertions in order to find errors. While this is certainly a Good Thing, it’s not the only reason to use them. 
7. I find assertions to be a valuable form of communication — they tell the reader something about the assumed state of the program at this point of execution. 
8. I also find them handy for debugging, and their communication value means I’m inclined to leave them in once I’ve fixed the error I’m chasing. 
8. Self­-testing code reduces their value for debugging, as steadily narrowing unit tests often do the job better, but I still like assertions for communication.


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
