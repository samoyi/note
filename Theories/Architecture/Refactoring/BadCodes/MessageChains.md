# Message Chains


<!-- TOC -->

- [Message Chains](#message-chains)
    - [思想](#思想)
    - [现象](#现象)
    - [References](#references)

<!-- /TOC -->


## 思想
中间商不仅会赚差价，还可能会坑你。


## 现象
1. You see message chains when a client asks one object for another object, which the client then asks for yet another object, which the client then asks for yet another another object, and so on. 
2. You may see these as a long line of getThis methods, or as a sequence of temps. 
3. Navigating this way means the client is coupled to the structure of the navigation. Any change to the intermediate relationships causes the client to have to change.


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
