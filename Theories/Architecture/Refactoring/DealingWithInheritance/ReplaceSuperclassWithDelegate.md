# Replace Superclass with Delegate

<!-- TOC -->

- [Replace Superclass with Delegate](#replace-superclass-with-delegate)
    - [思想](#思想)
        - [语义化](#语义化)
    - [Motivation](#motivation)
        - [不能仅仅因为想用一个类的部分功能就认人做父](#不能仅仅因为想用一个类的部分功能就认人做父)
        - [委托的优点——只是使用功能，但没有继承关系](#委托的优点只是使用功能但没有继承关系)
        - [其他](#其他)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
### 语义化
1. 这个重构是要解决一个很常见的错误模式，即，仅仅为了使用某些功能而去使用一个类型，进而导致语义不明、难以理解，还有可能导致后续的出错。
2. 例如在 HTML，仅仅为了让一行字又大又粗，你就使用了 `<h1></h1>` 标签。虽然表面看起来是一样的，但是增加了之后的理解难度。而且万一之后 h1 修改了样式标准，你的这行字也就显示错误了。
3. 所以，除非迫不得已，都应该保持一个东西外在表现和内在功能的统一。
4. 其实关于正确命名的重构，也是这个思想。


## Motivation
### 不能仅仅因为想用一个类的部分功能就认人做父
1. 有一个经典的误用继承的例子，就是让栈继承列表以获得列表类数据存储和操作的能力。
2. 首先，这个继承在语义上就有问题。在语义上栈并不是列表的子类型，这里的继承只是想用到列表的一些功能而已。
3. 另一个问题是，既然是继承，你就要继承父类的所有属性和方法。但其实列表的很多属性和方法对于栈来说是没用的。 
4. 即使一个类可以用到另一个类的所有属性和方法，也不一定就能使用继承。例如虽然汽车用到了车模类的所有功能，但显然车模也不能作为汽车的父类。功能上好像没什么问题，但是理解起来就很奇怪。原因同样是语义化的，因为它俩根本就是两类东西。


### 委托的优点——只是使用功能，但没有继承关系
1. 从语义上可以表明两者不是一类东西，可以避免理解的混乱。
2. 从功能上可以避免继承不需要的属性和方法。

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
