# Replace Type Code with Subclasses

inverse of: Remove Subclass

<!-- TOC -->

- [Replace Type Code with Subclasses](#replace-type-code-with-subclasses)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [相比于单个类兼容多类型，创建多个子类可以将一个类里复杂的逻辑判断拆分为清晰简单的子类](#相比于单个类兼容多类型创建多个子类可以将一个类里复杂的逻辑判断拆分为清晰简单的子类)
        - [两种重构方式  TODO 不懂](#两种重构方式--todo-不懂)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
和 Replace Conditional with Polymorphism 的思想一样的。如果条件分支里要处理的逻辑比较复杂，不如直接抽出为独立的类。


## Motivation
### 相比于单个类兼容多类型，创建多个子类可以将一个类里复杂的逻辑判断拆分为清晰简单的子类
1. 一个类可以根据不同的传入的类型值呈现出不同的属性和行为。你需要在这个类里面，根据类型值进行不同的逻辑处理。
2. Most of the time, such a type code is all I need. But there are a couple of situations where I could do with something more, and that something more are subclasses. 
3. Subclasses allow me to use polymorphism to handle conditional logic. 
4. I find this most helpful when I have several functions that invoke different behavior depending on the value of the type code. 
5. With subclasses, I can apply *Replace Conditional with Polymorphism* to these functions.


### 两种重构方式  TODO 不懂
1. When using *Replace Type Code with Subclasses*, I need to consider whether to apply it directly to the class I’m looking at, or to the type code itself. 
2. Do I make engineer a subtype of employee, or should I give the employee an employee type property which can have subtypes for engineer and manager? 
3. Using direct subclassing is simpler, but I can’t use it for the job type if I need it for something else. I also can’t use direct subclasses if the type is mutable. 
4. If I need to move the subclasses to an employee type property, I can do that by using *Replace Primitive with Object* on the type code to create an employee type class and then using *Replace Type Code with Subclasses* on that new class.


## Mechanics
```js
// 从
function createEmployee (name, type) {
    return new createEmployee(name, type);
}

// 到
function createEmployee (name, type) {
    switch (type) {
        case 'engineer':
            return new Engineer(name);
        case 'salesman':
            return new Salesman(name);
        case 'manager':
            return new Manager(name);
    }
}
```

1. Self­-encapsulate the type code field. 
2. Pick one type code value. Create a subclass for that type code. Override the type code getter to return the literal type code value. 
3. Create selector logic to map from the type code parameter to the new subclass. 
    * With direct inheritance, use Replace Constructor with *Factory Function* and put the selector logic in the factory. With indirect inheritance, the selector logic may stay in the constructor.
4. Test. 
5. Repeat creating the subclass and adding to the selector logic for each type code value. Test after each change. 
6. Remove the type code field. 
7. Test. 
8. *Use Push Down Method* and *Replace Conditional with Polymorphism* on any methods that use the type code accessors. Once all are replaced, you can remove the type code accessors.


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
