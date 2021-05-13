# Replace Command with Function

inverse of: Replace Function with Command


<!-- TOC -->

- [Replace Command with Function](#replace-command-with-function)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想


## Motivation
1. Command objects provide a powerful mechanism for handling complex computations. 
2. They can easily be broken down into separate methods sharing common state through the fields; 
3. They can be invoked via different methods for different effects; 
4. They can have their data built up in stages. 
5. But that power comes at a cost. 
6. Most of the time, I just want to invoke a function and have it do its thing. 
7. If that’s the case, and the function isn’t too complex, then a command object is more trouble than its worth and should be turned into a regular function.


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
