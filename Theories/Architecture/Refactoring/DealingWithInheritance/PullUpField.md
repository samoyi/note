# Pull Up Field

inverse of: *Push Down Field*

<!-- TOC -->

- [Pull Up Field](#pull-up-field)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
消除不必要的重复，统一管理。


## Motivation
和 *Push Down Method* 同样的思路。


## Mechanics
1. Inspect all users of the candidate field to ensure they are used in the same way. 
2. If the fields have different names, use Rename Field to give them the same name.
3. Create a new field in the superclass.
    * The new field will need to be accessible to subclasses (protected in common languages).
4. Delete the subclass fields.
5. Test


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
