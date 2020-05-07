# Remove Setting Method
<!-- TOC -->

- [Remove Setting Method](#remove-setting-method)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [如果是获取值的 API，就不要留下多余的设置值的方法](#如果是获取值的-api就不要留下多余的设置值的方法)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想


## Motivation
### 如果是获取值的 API，就不要留下多余的设置值的方法
1. Providing a setting method indicates that a field may be changed. If I don’t want that field to change once the object is created, I don’t provide a setting method (and make the field immutable). 
2. That way, the field is set only in the constructor, my intention to have it not change is clear, and I usually remove the very possibility that the field will change. 


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
