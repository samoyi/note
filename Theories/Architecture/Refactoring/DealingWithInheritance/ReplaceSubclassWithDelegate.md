# Replace Subclass with Delegate

<!-- TOC -->

- [Replace Subclass with Delegate](#replace-subclass-with-delegate)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [用子类实现相似对象的缺点](#用子类实现相似对象的缺点)
            - [只能用一个维度划分对象的不同](#只能用一个维度划分对象的不同)
            - [子类和父类耦合](#子类和父类耦合)
        - [使用委托的优点](#使用委托的优点)
        - [组合（委托）优于继承？](#组合委托优于继承)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
和 Replace Superclass with Delegate 重构的思想一样


## Motivation
### 用子类实现相似对象的缺点
1. If I have some objects whose behavior varies from category to category, the natural mechanism to express this is inheritance. 
2. I put all the common data and behavior in the superclass, and let each subclass add and override features as needed. 
3. Object­-oriented languages make this simple to implement and thus a familiar mechanism.

#### 只能用一个维度划分对象的不同
1. But inheritance has its downsides. 
2. Most obviously, it’s a card that can only be played once. If I have more than one reason to vary something, I can only use inheritance for a single axis of variation. 
3. So, if I want to vary behavior of people by their age category and by their income level, I can either have subclasses for young and senior, or for well­off and poor — I can’t have both.

#### 子类和父类耦合
1. A further problem is that inheritance introduces a very close relationship between classes. 
2. Any change I want to make to the parent can easily break children, so I have to be careful and understand how children derive from the superclass. 
3. This problem is made worse when the logic of the two classes resides in different modules and is looked after by different teams.
4. 如果出现这种情况，其实就说明了它们根本就不应该作为父子类的继承关系。比如灵长目作为哺乳纲的子类，肯定是哺乳纲有的特点灵长目也要有，而不能是只有哺乳纲的部分特点。
5. 合理的父子类继承，子类就应该无条件的接受父类的所有特征。子类可以在父类的基础上再扩展或改进，而不应该违背父类的基础。

### 使用委托的优点
1. Delegation handles both of these problems. 
2. I can delegate to many different classes for different reasons. 继承一次只能继承一个类，但委托就可以使用好几个类的功能。
3. Delegation is a regular relationship between objects — so I can have a clear interface to work with, which is much less coupling than subclassing. 继承就是一次继承了父类的全部属性，但委托就可以明确的选择使用一个类的哪些属性。

### 组合（委托）优于继承？
1. There is a popular principle: “Favor object composition over class inheritance” (where composition is effectively the same as delegation). 
2. Many people take this to mean “inheritance considered harmful” and claim that we should never use inheritance. 
3. Inheritance is a valuable mechanism that does the job most of the time without problems. So I reach for it first, and move onto delegation when it starts to rub badly. 
3. The principle was a reaction to the overuse of inheritance. 继承本身是很好的，它有很明确的含义。在一个规范的层级分类系统里，显然继承要比组合更合适。继承是规整而不灵活，组合是灵活而不规整。
4. 你如果就是要建模 “父类——子类” 的关系，那就使用继承；而如果只是想让一个类有其他类的某些属性，那就是用组合。


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
