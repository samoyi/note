# Implement Inheritance
What inheritance achieves is that a class of objects have the same properties
and methods as another class of objects, or another object.


***
## by Prototype Chain
SubType's `prototype` property reference SuperType's instance, so SubType's
instance gets properties in SuperType's constructor and prototype.

### Process of inheritance
```js
function SuperType(){}

SuperType.prototype.name = 'is SuperType';
SuperType.prototype.getName = function(){
	return this.name
};

function SubType(){}
SubType.prototype = new SuperType();

let instance = new SubType();
console.log( instance.getName() ); // is SuperType
```
When executing `bar.getName()`:
1. Instance `bar` has neither property `name` nor method `getName`.
2. So check prototype by `bar`'s `[[prototype]]`.
3. The prototype is instance `foo`, which is also the instance of `Foo`.
4. Similarly, `foo` has neither property `name` nor method `getName`.
5. Also, check `foo`'s prototype, get the property `name` nor method `getName`.

### Chain
1. The inheritance relationship above can be extended by adding any other
objects, but the end of the chain will always be `Object.prototype`.
2. Any a reference type data is derived from `Object`, and will inherit
properties and methods in `Object.prototype`.

### Reference properties in prototype chain
1. Instances in prototype chain have not their own methods, they share same one
function, this is what we want.
2. But they also inherit the same reference properties, that means, if your
modify a inherited reference property in a instance, all this property in other instances will be modified.

```js
function SuperType(){
    this.colors = ['red'];
}

function SubType(){}

SubType.prototype = new SuperType();

var instance1 = new SubType();
instance1.colors.push('black'); // modify, not re-reference

var instance2 = new SubType();
console.log(instance2.colors); // ['red', 'black']

console.log(instance1.colors === instance2.colors); // true
```



***
## by Constructor Stealing
Copy constructor properties of SuperType into SubType's constructor

### Process of inheritance
```js
function SuperType(){
	this.colors = ["red"];
}
function SubType(){
	SuperType.call(this);
}

var instance1 = new SubType();
var instance2 = new SubType();
console.log(instance1.colors === instance2.colors); // false

instance1.colors.push("black");
console.log(instance1.colors); // [ 'red', 'black' ]
console.log(instance2.colors); // [ 'red' ]
```
Defferent from Prototype Chain, by this method, `SubType` inherits `colors` by
generating it own properties which are same as `SuperType`'s.


### Can not inherit prototype properties and methods
This method actually is not really inheritance, it's just copy properties and
methods only from `SuperType` constructor, but not from `SuperType`' prototype.
```js
function SuperType(){
	this.colors = ["red"];
}
function SubType(){
	SuperType.call(this);
}

SuperType.prototype.name = 33;

var instance = new SubType();
console.log(instance.colors); // [ 'red' ]
console.log(instance.name); // undefined
```



***
## by Combination Inheritance

### 有缺陷的组合继承
Put shared properties into prototype, put private properties into `SuperType` constructor, set prototype in `SubType` constructor.

```js
function SuperType(){
	this.colors = ["red"];
}
SuperType.prototype.name = 33;

function SubType(){
	SuperType.call(this);
	this.__proto__ = SuperType.prototype;
}

var instance1 = new SubType();
var instance2 = new SubType();
console.log(instance1.colors === instance2.colors); // false

instance1.colors.push("black");
console.log(instance1.colors); // [ 'red', 'black' ]
console.log(instance2.colors); // [ 'red' ]
console.log(instance1.name); // 33

console.log(instance1 instanceof SubType); // false
console.log(instance1.__proto__.constructor === SubType); // false
```
通过直接在`SubType`设定实例的原型引用，让实例可以应用到`SuperType`的原型，但这导致了
SubType的实例原型和构造函数原型不一致的情况

### 完备的组合继承
```js
function SuperType(name){
    this.colors = ['red'];
}

SuperType.prototype.name = 33;

function SubType(){
	// 从构造函数中继承不共享的属性
    SuperType.call(this);
}

// 通过原型继承SuperType构造函数和原型的属性
// 虽然SubType实例的原型中依然有共享的colors属性，但因为上面通过构造函数直接实例本身拥
// 有了colors属性，所以不会用到原型里面的colors属性，因此每个实例都拥有独立的colors属性
SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;

let instance1 = new SubType();
let instance2 = new SubType();

console.log(instance1.colors); // ['red']
console.log(instance1.name); // 33

instance2.colors.push("black");

console.log(instance1.colors); // ['red']   私有

// 删除实例中的colors属性
delete instance1.colors;
delete instance2.colors;

// 现在这两个实例会从原型中读取colors
console.log(instance1.colors); // ['red'] 读取原型属性
console.log(instance2.colors); // ['red'] 读取原型属性

instance2.colors.push("green"); // 修改原型属性
console.log(instance1.colors); // ['red', 'green']  共享原型属性

console.log( instance1 instanceof SubType); // true
```


***
## by Prototypal Inheritance
Create objects using a object as prototype

```js
Object.create()
```
Like the way in Prototype Chain method, every created instance shared the same
reference properties in prototype object.



***
## by Parasitic Inheritance
1. Create a function that does the inheritance, augments the object in some way,
and then returns the object.
2. The Prototypal Inheritance method's logic is set a object as new objects'
prototype, while this method's logic is just modifying the proto object and
return it. So, every returned object is actually just the same one object.

```js
function createAnother(original){
    var clone = Object(original);    //通过调用函数创建一个新对象
	clone.age = 32;
    clone.sayAge = function(){        //以某种方式来增强这个对象
        console.log( this.age );
    };

    return clone;
}

var person = {
    name: 'Nicholas',
    friends: ['Shelby', 'Court', 'Van']
};

var anotherPerson1 = createAnother(person);
var anotherPerson2 = createAnother(person);

console.log( anotherPerson1 === anotherPerson2); // true

console.log( anotherPerson1.name ); // 'Nicholas'
console.log( anotherPerson1.friends ); // ['Shelby', 'Court', 'Van']
console.log( anotherPerson1.age ); // 32
anotherPerson1.sayAge(); // 32

anotherPerson1.name = 33;
anotherPerson1.age = 22;
anotherPerson1.friends = [];

console.log( anotherPerson2.name ); // 33
console.log( anotherPerson2.friends ); // []
console.log( anotherPerson2.age ); // 22
anotherPerson2.sayAge(); // 22
```



***
## by Parasitic Combination Inheritance
不必为了指定子类型的原型而调用超类型的构造函数，我们所需要的无非就是超类型原型的一个副本而已。本质上，就是使用寄生式继承来继承超类型的原型，然后再将结果指定给子类型的原型。

function inheritPrototype(subType, superType)
{
     var prototype = Object(superType.prototype);       //创建对象
     prototype.constructor = subType;                   //增强对象
     subType.prototype = prototype;                     //指定对象
}

1. 在函数内部，第一步是创建超类型原型的一个副本。第二步是为创建的副本添加constructor属性，从而弥补因重写原型而失去的默认的constructor属性。最后一步，将新创建的对象（即副本）赋值给子类型的原型。
2. 开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。
