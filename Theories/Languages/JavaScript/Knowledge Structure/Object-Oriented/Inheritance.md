# Inheritance





***
## Prototype Chaining
ECMAScript中描述了原型链的概念，并将原型链作为实现继承的主要方法。其基本思想是利用原型让一个引用类型继承另一个引用类型的属性和方法。简单回顾一下构造函数、原型和实例的关系：每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个指向原型对象的内部指针。What if the prototype were actually an instance of another type? That would mean the prototype itself would have a pointer to a different prototype that, in turn, would have a pointer to another constructor. If that prototype were also an instance of another type, then the pattern would continue, forming a chain between instances and prototypes.   
```
function SuperType()
{
    this.property = true;
}
SuperType.prototype.getSuperValue = function ()
{
    return this.property;
};
function SubType()
{
    this.subproperty = false;
}
//继承了SuperType
SubType.prototype = new SuperType();
SubType.prototype.getSubValue = function ()
{
    return this.subproperty;
};
var instance = new SubType();
console.log( instance.getSubValue() );     // false
console.log( instance.getSuperValue() );   // true
```

以上代码定义了两个类型：SuperType和SubType。每个类型分别有一个属性和一个方法。它们的主要区别是SubType继承了SuperType，而继承是通过创建SuperType的实例，并将该实例赋给SubType.prototype实现的。实现的本质是重写原型对象，代之以一个新类型的实例。换句话说，原来存在于SuperType的实例中的所有属性和方法，现在也存在于SubType.prototype中了。在确立了继承关系之后，我们给SubType.prototype添加了一个方法，这样就在继承了SuperType的属性和方法的基础上又添加了一个新方法。

在上面的代码中，我们没有使用 SubType 默认提供的原型，而是给它换了一个新原型；这个新原型 就是 SuperType 的实例。于是，新原型不仅具有作为一个 SuperType 的实例所拥有的全部属性和方法， 而且其内部还有一个指针，指向了 SuperType 的原型。最终结果就是这样的： instance 指向 SubType 的 原 型 ， SubType 的 原 型 又 指 向 SuperType 的 原 型 。 getSuperValue() 方 法 仍 然 还 在 SuperType.prototype 中，但 property 则位于 SubType.prototype 中。这是因为 property 是一个实例属性，而 getSuperValue()则是一个原型方法。既然 SubType.prototype 现在是 SuperType的实例，那么 property 当然就位于该实例中了。此外，要注意 instance.constructor 现在指向的是 SuperType，这是因为原来 SubType.prototype 中的 constructor 被重写了的缘故。实际上，不是 SubType 的原型的 constructor 属性被重写了，而是 SubType 的原型指向了另一个对象—— SuperType 的原型，而这个原型对象的 constructor 属性指向的是 SuperType。


#### 一. 原型链直到Object
事实上，前面例子中展示的原型链还少一环。我们知道，所有引用类型默认都继承了Object，而这个继承也是通过原型链实现的。大家要记住，所有函数的默认原型都是Object的实例，因此默认原型都会包含一个内部指针，指向Object.prototype。这也正是所有自定义类型都会继承toString()、valueOf()等默认方法的根本原因。所以，我们说上面例子展示的原型链中还应该包括另外一个继承层次。

SubType继承了SuperType，而SuperType了继承Object。当调用instance.toString()时，实际上调用的是保存在Object.prototype中的那个方法。


#### 二. 确定原型和实例的关系
```instanceof```操作符 和 ```isPrototypeOf()```方法
1. 虽然使用instanceof操作符时的对象构造函数而不是原型，但实际上并不是判断某个实例是否是该构造函数的实例，而是判断是否是该构造函数原型的实例。所以如果改变了构造函数的原型，也就不成立了
```
function Person(){} // constructor
let p = new Person();
console.log(Person.prototype); // Object {}. This is prototype of Person for now.
console.log( p instanceof Person ); // true. Because p is instance of Person.prototype, which is  Object {},

let proto = {}; // a new prototype object
Person.prototype = proto; // change the prototype of Person
console.log( p instanceof Person ); // false.  Because p is instance of Object {}, but not Person's prototype, which is proto

let p1 = new Person();
console.log( p1 instanceof Person ); // true. Because p1 is instance of Person.prototype, which is  proto
console.log( proto.isPrototypeOf( p1 )); // true
```

#### 三. 谨慎的定义方法
    感觉没说什么有价值的


#### 四. 原型链的问题
1.最主要的问题来自包含引用类型值的原型。想必大家还记得，我们前面介绍过包含引用类型值的原型属性会被所有实例共享；而这也正是为什么要在构造函数中，而不是在原型对象中定义属性的原因。在通过原型来实现继承时，原型实际上会变成另一个类型的实例。于是，原先的实例属性也就顺理成章地变成了现在的原型属性了。
function SuperType()
{
 this.colors = ["red", "blue", "green"];
}
function SubType()
{
}
//继承了SuperType
SubType.prototype = new SuperType();
var instance1 = new SubType();
instance1.colors.push("black");
alert(instance1.colors);        //"red,blue,green,black"
var instance2 = new SubType();
alert(instance2.colors);        //"red,blue,green,black"

2.原型链的第二个问题是：在创建子类型的实例时，不能向超类型的构造函数中传递参数。实际上，应该说是没有办法在不影响所有对象实例的情况下，给超类型的构造函数传递参数。有鉴于此，再加上前面刚刚讨论过的由于原型中包含引用类型值所带来的问题，实践中很少会单独使用原型链。不懂





借用构造函数——————————————————
在解决原型中包含引用类型值所带来问题的过程中，开发人员开始使用一种叫做借用构造函数（constructor stealing）的技术（有时候也叫做伪造对象或经典继承）。这种技术的基本思想相当简单，即在子类型构造函数的内部调用超类型构造函数。别忘了，函数只不过是在特定环境中执行代码的对象，因此通过使用apply()和call()方法也可以在（将来）新创建的对象上执行构造函数
function SuperType()
{
 this.colors = ["red", "blue", "green"];
}
function SubType()
{
 //继承了SuperType
 SuperType.call(this);
}
var instance1 = new SubType();
instance1.colors.push("black");
alert(instance1.colors);    //"red,blue,green,black"
var instance2 = new SubType();
alert(instance2.colors);    //"red,blue,green"

代码中加背景的那一行代码“借调”了超类型的构造函数。通过使用call()方法（或apply()方法也可以），我们实际上是在（未来将要）新创建的SubType实例的环境下调用了SuperType构造函数。这样一来，就会在新SubType对象上执行SuperType()函数中定义的所有对象初始化代码。结果，SubType的每个实例就都会具有自己的colors属性的副本了。

一.传递参数
相对于原型链而言，借用构造函数有一个很大的优势，即可以在子类型构造函数中向超类型构造函数传递参数。
function SuperType(name)
{
 this.name = name;
}
function SubType()
{
 //继承了SuperType，同时还传递了参数
 SuperType.call(this, "Nicholas");
 //实例属性
 this.age = 29;
}
var instance = new SubType();
alert(instance.name);    //"Nicholas";
alert(instance.age);     //29
为了确保SuperType构造函数不会重写子类型的属性，可以在调用超类型构造函数后，再添加应该在子类型中定义的属性。

二.借用构造函数的问题
如果仅仅是借用构造函数，那么也将无法避免构造函数模式存在的问题——方法都在构造函数中定义，因此函数复用就无从谈起了。而且，在超类型的原型中定义的方法，对子类型而言也是不可见的，结果所有类型都只能使用构造函数模式。考虑到这些问题，借用构造函数的技术也是很少单独使用的。
不懂




组合继承————————————————————
组合继承（combination inheritance），有时候也叫做伪经典继承，指的是将原型链和借用构造函数的技术组合到一块，从而发挥二者之长的一种继承模式。其背后的思路是使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。这样，既通过在原型上定义方法实现了函数复用，又能够保证每个实例都有它自己的属性。

function SuperType(name)
{
 this.name = name;
 this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function ()
{
 console.log(this.name);
};
function SubType(name, age)
{
 //继承属性
 SuperType.call(this, name);
 this.age = age;
}
//继承方法
SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType; // 不懂这个有什么用
SubType.prototype.sayAge = function ()
{
 console.log(this.age);
};
var instance1 = new SubType("Nicholas", 29);
instance1.colors.push("black");
console.log(instance1.colors);      //"red,blue,green,black"
instance1.sayName();          //"Nicholas";
instance1.sayAge();           //29
var instance2 = new SubType("Greg", 27);
console.log(instance2.colors);      //"red,blue,green"
instance2.sayName();          //"Greg";
instance2.sayAge();           //27

优点：
1. 组合继承避免了原型链和借用构造函数的缺陷，融合了它们的优点，成为 JavaScript 中最常用的继 承模式。
2.  instanceof 和 isPrototypeOf()也能够用于识别基于组合继承创建的对象。

缺点：
无论什么情况下，都会调用两次超类型构造函数：一次是在创建子类型原型的时候，另一次是在子类型构造函数内部。


原型式继承————————————————————
function object(o)
{
 function F()
 {
 }
 F.prototype = o;
 return new F();
}
ECMAScript 5通过新增Object.create()方法规范化了原型式继承。该方法第二个参数中设置的属性会覆盖原型对象上的同名属性。
优点： 可以方便的实现简单的继承
缺点：实例仍然会共享引用类型的属性


寄生式继承————————————————————




寄生组合式继承————————————————————
不必为了指定子类型的原型而调用超类型的构造函数，我们所需要的无非就是超类型原型的一个副本而已。本质上，就是使用寄生式继承来继承超类型的原型，然后再将结果指定给子类型的原型。

function inheritPrototype(subType, superType)
{
     var prototype = Object(superType.prototype);       //创建对象
     prototype.constructor = subType;                   //增强对象
     subType.prototype = prototype;                     //指定对象
}

1. 在函数内部，第一步是创建超类型原型的一个副本。第二步是为创建的副本添加constructor属性，从而弥补因重写原型而失去的默认的constructor属性。最后一步，将新创建的对象（即副本）赋值给子类型的原型。
2. 开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。
