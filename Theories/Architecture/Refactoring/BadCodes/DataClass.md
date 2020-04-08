# Data Class


<!-- TOC -->

- [Data Class](#data-class)
    - [思想](#思想)
    - [现象](#现象)
    - [References](#references)

<!-- /TOC -->


## 思想


## 现象
1. hese are classes that have fields, getting and setting methods for the fields, and nothing else. 
2. Such classes are dumb data holders and are often being manipulated in far too much detail by other classes. 
3. Data classes are often a sign of behavior in the wrong place, which means you can make
big progress by moving it from the client into the data class itself.
4. 说起来，纯数据类本身并没有什么问题。但实际中，纯数据出现的场景可能是一些本来应该放在这个类里面的行为放在了外部。


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
