# Introduce Special Case


<!-- TOC -->

- [Introduce Special Case](#introduce-special-case)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
其实也没啥，就是相同的部分抽出只处理一遍。


## Motivation
1. A common case of duplicated code is when many users of a data structure check a specific value, and then most of them do the same thing. 
2. If I find many parts of the codebase having the same reaction to a particular value, I want to bring that reaction into a single place.
3. A good mechanism for this is the Special Case pattern where I create a special­-case element that captures all the common behavior. This allows me to replace most of the special-­case checks with simple calls.
4. A special case can manifest itself in several ways. 
5. If all I’m doing with the object is reading data, I can supply a literal object with all the values I need filled in. 
6. If I need more behavior than simple values, I can create a special object with methods for all the common behavior. The special-­case object can be returned by an encapsulating class, or inserted into a data structure with a transform.


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
