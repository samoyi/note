# Move Field

inverse of: Extract Class


<!-- TOC -->

- [Move Field](#move-field)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [数据结构的重要性——模型越准确，使用越简单](#数据结构的重要性模型越准确使用越简单)
        - [应该及时修正错误的模型，及时降低模型的理解和使用成本](#应该及时修正错误的模型及时降低模型的理解和使用成本)
        - [具体移动动机——字段放错了地方，可能就会出现非正常耦合](#具体移动动机字段放错了地方可能就会出现非正常耦合)
        - [搬移可能是其他重构的相关操作](#搬移可能是其他重构的相关操作)
        - [封装良好的对象中的字段搬移起来更容易](#封装良好的对象中的字段搬移起来更容易)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 首先，组织的混乱带来理解的混乱，就和命名带来的混乱一样。一个不应该出现在这里的东西出现了，就会增加理解负担。
2. 更重要的是，你的组织结构和你要解决的问题不匹配。可能是少了一些功能，或者是多了一些副作用。结构的混乱也会带来交流的错乱和低效。


## Motivation
### 数据结构的重要性——模型越准确，使用越简单
1. 想想地心说的错误建模，就导致了各种本轮均轮，增加了各种补丁、增加了很多复杂度，才能反映现实的事物。
2. 数据结构是现实事物的模型。模型越准确，就越可以方便准确的描述现实事物，对数据的操作也就可以更准确的对应现实事物的变化。
3. 不准确的建模，就导致系统要花很多功夫来打补丁，弥合模型和现实的差距。
4. 这样，系统复杂度增加，理解和修改都变得更难，到最后甚至会看不出来这个模型到底是干什么用的。

### 应该及时修正错误的模型，及时降低模型的理解和使用成本
1. So, data structures are important — but like most aspects of programming they are hard to get right. 
2. In the process of programming, I learn more about the problem domain and my data structures. A design decision that is reasonable and correct one week can become wrong in another.
3. As soon as I realize that a data structure isn’t right, it’s vital to change it. 
4. If I leave my data structures with their blemishes, those blemishes will confuse my thinking and complicate my code far into the future.

### 具体移动动机——字段放错了地方，可能就会出现非正常耦合
1. I may seek to move data because I find I always need to pass a field from one record whenever I pass another record to a function. Pieces of data that are always passed to functions together are usually best put in a single record in order to clarify their relationship. 
2. Change is also a factor： if a change in one record causes a field in another record to change too, that’s a sign of a field in the wrong place. 
3. If I have to update the same field in multiple structures, that’s a sign that it should move to another place where it only needs to be updated once.

### 搬移可能是其他重构的相关操作
1. I usually do Move Field in the context of a broader set of changes. 
2. Once I’ve moved a field, I find that many of the users of the field are better off accessing that data through the target object rather than the original source. I then change these with later refactorings. 
3. Similarly, I may find that I can’t do Move Field at the moment due to the way the data is used. I need to refactor some usage patterns first, then do the move.

### 封装良好的对象中的字段搬移起来更容易
1. In my description so far, I’m saying “record,” but all this is true of classes and objects too. 
2. A class is a record type with attached functions — and these need to be kept healthy just as much as any other data. 
3. The attached functions do make it easier to move data around, since the data is encapsulated behind accessor methods. 
4. I can move the data, change the accessors, and clients of the accessors will still work. So, this is a refactoring that’s easier to do if you have classes.
5. If I’m using bare records that don’t support encapsulation, I can still make a change like this, but it is more tricky.


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
