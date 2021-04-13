# Move Field

inverse of: Extract Class


<!-- TOC -->

- [Move Field](#move-field)
    - [思想](#思想)
        - [模型准确的重要性](#模型准确的重要性)
        - [语义化](#语义化)
    - [Motivation](#motivation)
        - [数据结构的重要性——模型越准确，使用越简单](#数据结构的重要性模型越准确使用越简单)
        - [具体移动动机——字段放错了地方，可能就会出现非正常耦合](#具体移动动机字段放错了地方可能就会出现非正常耦合)
        - [封装良好的对象中的字段搬移起来更容易](#封装良好的对象中的字段搬移起来更容易)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
### 模型准确的重要性
1. 数据结构是现实对象的抽象模型，数据结构的组织结构应该反映出现实对象的组织结构。
2. 数据结构组织的混乱带来理解的混乱，就和命名带来的混乱一样（命名也可以看成是对被命名对象的一种高度抽象）。一个不应该出现在这里的东西出现了，就会增加理解负担。
3. 更重要的是，你的组织结构和你要解决的问题不匹配。可能是少了一些功能，或者是多了一些副作用。结构的混乱也会带来交流的错乱和低效。

### 语义化
字段在语义上应该放在哪那就放在哪，不要为了图方便就乱放。


## Motivation
### 数据结构的重要性——模型越准确，使用越简单
1. 想想地心说的错误建模，就导致了各种本轮均轮，增加了各种补丁、增加了很多复杂度，才能反映现实的事物。
2. 数据结构是现实事物的模型。模型越准确，就越可以方便准确的描述现实事物，对数据的操作也就可以更准确的对应现实事物的变化。
3. 不准确的建模，就导致系统要花很多功夫来打补丁，弥合模型和现实的差距。
4. 这样，系统复杂度增加，理解和修改都变得更难，到最后甚至会看不出来这个模型到底是干什么用的。
5. 因此，应该及时修正错误的模型，及时降低模型的理解和使用成本

### 具体移动动机——字段放错了地方，可能就会出现非正常耦合
1. 两个字段虽然没有放在一个地方，但是在使用某些功能时，这两个字段却经常出现，那就说明它们可能应该放在一起。
2. 或者我修改某些功能的时候，总是要修改不同地方的不同字段，那也说明这些字段可能在逻辑上属于一个地方。

### 封装良好的对象中的字段搬移起来更容易
如果数据已经用函数进行了封装，或者直接是作为对象的属性，那搬移起来就会更方便，因为访问者并不关心数据实际放在哪里，只要封装的函数对使用者来说还表现的和以前一样就行。


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
