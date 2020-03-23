# Move Field

inverse of: Extract Class


<!-- TOC -->

- [Move Field](#move-field)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [数据结构的重要性](#数据结构的重要性)
        - [具体移动动机](#具体移动动机)
        - [搬移时的可访问性考虑以及封装的优点](#搬移时的可访问性考虑以及封装的优点)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 组织的混乱带来理解的混乱，就和命名带来的混乱一样。
2. 而且，组织的混乱也会带来交流的错乱和低效。


## Motivation
### 数据结构的重要性
1. Programming involves writing a lot of code that implements behavior — but the strength of a program is really founded on its data structures. 
2. If I have a good set of data structures that match the problem, then my behavior code is simple and straightforward. 
3. But poor data structures lead to lots of code whose job is merely dealing with the poor data. And it’s not just messier code that’s harder to understand; it also means the data structures obscure what the program is doing. 
4. So, data structures are important — but like most aspects of programming they are hard to get right. In the process of programming, I learn more about the problem domain and my data structures. A design decision that is reasonable and correct one week can become wrong in another.
5. As soon as I realize that a data structure isn’t right, it’s vital to change it. If I leave my data structures with their blemishes, those blemishes will confuse my thinking and complicate my code far into the future.

### 具体移动动机
1. I may seek to move data because I find I always need to pass a field from one record whenever I pass another record to a function. Pieces of data that are always passed to functions together are usually best put in a single record in order to clarify their relationship. 
2. Change is also a factor： if a change in one record causes a field in another record to change too, that’s a sign of a field in the wrong place. 
3. If I have to update the same field in multiple structures, that’s a sign that it should move to another place where it only needs to be updated once.

### 搬移时的可访问性考虑以及封装的优点
1. I usually do Move Field in the context of a broader set of changes. 
2. Once I’ve moved a field, I find that many of the users of the field are better off accessing that data through the target object rather than the original source. I then change these with later refactorings. 
3. Similarly, I may find that I can’t do Move Field at the moment due to the way the data is used. I need to refactor some usage patterns first, then do the move.
4. In my description so far, I’m saying “record,” but all this is true of classes and objects too. A class is a record type with attached functions — and these need to be kept healthy just as much as any other data. 
5. The attached functions do make it easier to move data around, since the data is encapsulated behind accessor methods. I can move the data, change the accessors, and clients of the accessors will still work. So, this is a refactoring that’s easier to do if you have classes.
6. If I’m using bare records that don’t support encapsulation, I can still make a change like this, but it is more tricky.


## Mechanics
1. Ensure the source field is encapsulated.
2. Test.
3. Create a field (and accessors) in the target.
4. Run static checks.
5. Ensure there is a reference from the source object to the target object.
    * An existing field or method may give you the target. If not, see if you can easily create a method that will do so. Failing that, you may need to create a new field in the source object that can store the target. This may be a permanent change, but you can also do it temporarily until you have done enough refactoring in the broader context.
6. Adjust accessors to use the target field.
    * If the target is shared between source objects, consider first updating the setter to modify both target and source fields, followed by Introduce Assertion to detect inconsistent updates. Once you determine all is well, finish changing the accessors to use the target field.（这一段的翻译：如果源类的所有实例对象都共享对目标对象的访问，那么可以考虑先更新源类的设值函数，让它修改源字段时，对目标对象上的字段做同样的修改。然后再通过引入断言，当检测到源字段与目标字段不一致时抛出错误。一旦你确定改动没有引入任何可观察的行为变化，就可以放心的让访问函数直接使用目标对象的字段了。）
7. Test.Remove the source field.
8. Test.


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
