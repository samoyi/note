# Introduce Parameter Object



## 思想
收纳的意义不仅仅是把东西整理到一起，更重要的意义是理清事物之间的关系。


## Motivation
1. I often see groups of data items that regularly travel together, appearing in function after function. 
2. Such a group is a data clump, and I like to replace it with a single data structure.

### 形式上的好处
* It reduces the size of parameter lists for any function that uses the new structure. 
* It helps consistency since all functions that use the structure will use the same names to get at its elements. 

### 逻辑上的好处
1. It makes explicit the relationship between the data items. 
2. 本来它们只是作为分散的若干数据来对待，但当你尝试将他们组成为一个对象，它们就有了作为一个整体的意义。
3. 形式上，你组织了数据。但是内在的逻辑是，你收纳整理了数据背后的逻辑。


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
