# Preserve Whole Object

<!-- TOC -->

- [Preserve Whole Object](#preserve-whole-object)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [耦合和方便之间的权衡](#耦合和方便之间的权衡)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
耦合和方便之间的权衡


## Motivation
### 耦合和方便之间的权衡
1. If I see code that derives a couple of values from a record and then passes these values into a function, I like to replace those values with the whole record itself, letting the function body derive the values it needs. 
2. Passing the whole record handles change better should the called function need more data from the whole in the future — that change would not require me to alter the parameter list. 
3. It also reduces the size of the parameter list, which usually makes the function call easier to understand. 
4. If many functions are called with the parts, they often duplicate the logic that manipulates these parts — logic that can often be moved to the whole. 
5. The main reason I wouldn’t do this is if I don’t want the called function to have a dependency on the whole — which typically occurs when they are in different modules. 


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
