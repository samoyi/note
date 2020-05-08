# Replace Superclass with Delegate

<!-- TOC -->

- [Replace Superclass with Delegate](#replace-superclass-with-delegate)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [不能仅仅因为想用一个类的部分功能就认人做父](#不能仅仅因为想用一个类的部分功能就认人做父)
        - [甚至用了一个类的全部功能，也不能仅仅因为功能就认人做父](#甚至用了一个类的全部功能也不能仅仅因为功能就认人做父)
        - [委托的优点——只是使用功能，但没有继承关系](#委托的优点只是使用功能但没有继承关系)
        - [其他](#其他)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 这个重构是要解决一个很常见的错误模式，即，仅仅为了使用某些功能而去使用一个类型，进而导致语义不明、难以理解，还有可能导致后续的出错。
2. 例如在 HTML，仅仅为了让一行字又大又粗，你就使用了 h1 标签。虽然表面看起来是一样的，但是增加了之后的理解难度。而且万一之后 h1 修改了样式标准，你的这行字也就显示错误了。
3. 所以，除非迫不得已，都应该保持一个东西外在表现和内在功能的统一。
4. 其实关于正确命名的重构，也是这个思想。


## Motivation
### 不能仅仅因为想用一个类的部分功能就认人做父
1. One of the classic examples of mis-­inheritance from the early days of objects was making a stack be a subclass of list. 
2. The idea that led to this was reusing of list’s data storage and operations to manipulate it. 
3. While it’s good to reuse, this inheritance had a problem: All the operations of the list were present on the interface of the stack, although most of them were not applicable to a stack. 
4. 不知道这样有没有性能问题，但理解上肯定会比较奇怪。在逻辑上，子类肯定是要以父类为基础的，即父类有的功能子类也要有。比如灵长目作为哺乳纲的子类，肯定是哺乳纲有的特点灵长目也要有，而不能是只有哺乳纲的部分特点。
5. A better approach is to make the list into a field of the stack and delegate the necessary operations to it.
6. This is an example of one reason to use *Replace Superclass with Delegate* — if functions of the superclass don’t make sense on the subclass, that’s a sign that I shouldn’t be using inheritance to use the superclass’s functionality.

### 甚至用了一个类的全部功能，也不能仅仅因为功能就认人做父
1. As well as using all the functions of the superclass, it should also be true that every instance of the subclass is an instance of the superclass and a valid object in all cases where we’re using the superclass. 
2. If I have a car model class, with things like name and engine size, I might think I could reuse these features to represent a physical car, adding functions for VIN number and manufacturing date. 
3. This is a common, and often subtle, modeling mistake which I’ve called the type­-instance homonym [mf-­tih]. 
4. 这里虽然汽车用到了车模类的所有功能，但显然车模也不能作为汽车的父类。同样，功能上好像没什么问题，但是理解起来就很奇怪。

### 委托的优点——只是使用功能，但没有继承关系
1. These are both examples of problems leading to confusion and errors — which can be easily avoided by replacing inheritance with delegation to a separate object. 
2. Using delegation makes it clear that it is a separate thing — one where only some of the functions carry over.

### 其他
1. 书上还说到另一种不应该使用继承的情况是父子耦合过强，父类的变化很容易破坏子类功能。
2. 但我觉得，如果是这样不合理的耦合，那就证明它们当初本来就不应该作为父子类。因为子类就应该无条件的接受父类的所有特征。子类可以在父类的基础上再扩展或改进，而不应该违背父类的基础。
3. *Replace Subclass with Delegate* 中说到的子类和父类耦合的缺点其实也是这种情况。


## Mechanics
1. Create a field in the subclass that refers to the superclass object. Initialize this delegate reference to a new instance. 
    1. from
    ```js
    class List {}
    class Stack extends List {}
    ```
    2. to
    ```js
    class List {}
    class Stack {
        constructor () {
            this._storage = new List();
        }
    }
    ```
2. For each element of the superclass, create a forwarding function in the subclass that forwards to the delegate reference. Test after forwarding each consistent group.
3. When all superclass elements have been overridden with forwarders, remove the inheritance link.
    

## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
