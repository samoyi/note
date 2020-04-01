# Pull Up Method

inverse of: Push Down Method

<!-- TOC -->

- [Pull Up Method](#pull-up-method)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [重复方法的危害](#重复方法的危害)
        - [重复的场景](#重复的场景)
        - [重构注意点——引用了当前环境的东西或者本身有些差异](#重构注意点引用了当前环境的东西或者本身有些差异)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
消除不必要的重复，统一管理。


## Motivation
### 重复方法的危害
1. Eliminating duplicate code is important. Two duplicate methods may work fine as they are, but they are nothing but a breeding ground for bugs in the future. 
2. Whenever there is duplication, there is risk that an alteration to one copy will not be made to the other. 

### 重复的场景
1. Usually, it is difficult to find the duplicates. The easiest case of using Pull Up Method is when the methods have the same body, implying there’s been a copy and paste. 
2. Of course it’s not always as obvious as that. I could just do the refactoring and see if the tests croak — but that puts a lot of reliance on my tests. 
3. I usually find it valuable to look for the differences — often, they show up behavior that I forgot to test for. 4. Often, Pull Up Method comes after other steps. I see two methods in different classes that can be parameterized in such a way that they end up as essentially the same method. 
4. In that case, the smallest step is for me to apply Parameterize Function separately and then Pull Up Method.

### 重构注意点——引用了当前环境的东西或者本身有些差异
1. The most awkward complication with Pull Up Method is if the body of the method refers to features that are on the subclass but not on the superclass. 
2. When that happens, I need to use Pull Up Field  and Pull Up Method on those elements first. 
3. If I have two methods with a similar overall flow, but differing in details, I’ll consider the Form Template Method [mf­-ft].


## Mechanics
1. Inspect methods to ensure they are identical.
    * If they do the same thing, but are not identical, refactor them until they have identical bodies.
2. Check that all method calls and field references inside the method body refer to features that can be called from the superclass.
3. If the methods have different signatures, use Change Function Declaration to get them to the one you want to use on the superclass.
4. Create a new method in the superclass. Copy the body of one of the methods over to it.
5. Run static checks.
6. Delete one subclass method.
7. Test.
8. Keep deleting subclass methods until they are all gone.


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
