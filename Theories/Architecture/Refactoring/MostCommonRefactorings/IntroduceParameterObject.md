# Introduce Parameter Object

inverse of *Split Parameter Object*


## 思想
### 语义化
收纳的意义不仅仅是把东西整理到一起，更重要的意义是理清事物之间的关系。

### 高内聚
相同的东西整理到一起


## Motivation
1. 如果这些参数项在语义上属于一个整体，那就可以考虑把它们组成一个整体。
2. 本来它们只是作为分散的若干数据来对待，但当你尝试将他们组成为一个对象，它们就有了作为一个整体的意义。
3. 形式上，你组织了数据。但是内在的逻辑是，你收纳整理了数据背后的逻辑。


## 过度优化
不要为了图方便而传整个对象。如果接收方实际上只需要对象中的少部分属性，那传整个对象就没有必要。


## Mechanics
1. If there isn’t a suitable structure already, create one.
    * I prefer to use a class, as that makes it easier to group behavior later on. I usually like to ensure these structures are value objects [mf-­vo].
2. Test.
3. Use *Change Function Declaration* to add a parameter for the new structure.
4. Test.
5. Adjust each caller to pass in the correct instance of the new structure. Test after each one.
6. For each element of the new structure, replace the use of the original parameter with the element of the structure. Remove the parameter. Test


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
