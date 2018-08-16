# Implement Inheritance

严格继承时，优先使用 Parasitic Combination Inheritance，它的缺点是父类原型的
`constructor`指向子类构造函数；其次可以使用 Combination Inheritance，它的缺点是子类
的实例和原型都会拥有父类的实例属性。  
其他几种继承方法缺点更多，只适用于非严格继承的情况。


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
let proto = new SuperType();
SubType.prototype = proto;

let obj = new SubType();
console.log( obj.getName() ); // is SuperType
```
When executing `obj.getName()`:
1. Instance `obj` has neither property `name` nor method `getName`.
2. So check prototype by `obj`'s `[[prototype]]`.
3. The prototype is instance `proto`, which is also the instance of `SuperType`.
4. Similarly, `proto` has neither property `name` nor method `getName`.
5. Also, check `foo`'s prototype, get the property `name` nor method `getName`.

### Chain
1. The inheritance relationship above can be extended by adding any other
objects, but the end of the chain will always be `Object.prototype`.
2. Any a reference type data is derived from `Object`, and will inherit
properties and methods in `Object.prototype`.

### Problems with Prototype Chaining
**Reference properties in prototype chain**
1. Instances in prototype chain have not their own methods, they share same one
function, this is what we want.
2. But they also inherit the same reference properties, that means, if your
modify an inherited reference property in an instance, all this property in
other instances will be modified.

```js
function SuperType(){
    this.colors = ['red'];
    this.name = 'is SuperType';
}

function SubType(){}
SubType.prototype = new SuperType();

var instance1 = new SubType();
instance1.name = 'is instance1'; // add own property
instance1.colors.push('black'); // modify, not re-reference

var instance2 = new SubType();

console.log(instance1.name); // "is instance1"
console.log(instance2.name); // "is SuperType"

console.log(instance2.colors); // ['red', 'black']
console.log(instance1.colors === instance2.colors); // true
```


## by Constructor Stealing
Copy constructor properties of SuperType into SubType's constructor.

### Process of inheritance
1. 继承原理
```js
function SuperType(){
	this.colors = ["red"];
}
function SubType(){
	SuperType.call(this);
}

let foo = new SubType();
console.log(foo.colors); // ["red"]
console.log(foo.hasOwnProperty('colors')); // true
```
`SubType`作为构造函数被调用时，内部`this`指向被创建的对象（该对象随后赋值给`foo`）。
这个对象又作为`SuperType`的`this`，因此随后的`foo`之上就新加了`colors`属性。
2. 和 Prototype Chain 继承方法不同，这里是按照父类的 own 属性直接在子类实例上创建属性，
每个实例都有自己独立的属性，所以它解决了原型链继承时所有实例都拥有同一个引用类型的问题。
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

### 复制式继承和引用式继承
Prototype Chain 是引用时继承，即子类不拥有父类属性，需要查询属性值时直接去父类查询。
Constructor Stealing 是复制式继承，即把父类属性复制一份到自己这里。

### Problems with Constructor Stealing
**Can not inherit prototype properties and methods**
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


## by Combination Inheritance
### 有缺陷的组合继承
Put shared properties into prototype, put private properties into `SuperType`
constructor, set prototype in `SubType` constructor.
```js
function SuperType(){
	this.colors = ["red"];
}
SuperType.prototype.name = 33;

function SubType(){
	SuperType.call(this); // 继承实例属性
	// 下面这一行，与 Prototype Chain 继承方法不同，这里子类的原型没有指向父类的实例。
	// 因此只会继承父类的原型属性。
	// 父类的实例属性是通过上面一行的 Constructor Stealing 方法来继承的。
	this.__proto__ = SuperType.prototype; // 继承原型属性，和父类使用同样的原型
}

var instance1 = new SubType();
var instance2 = new SubType();
console.log(instance1.colors === instance2.colors); // false

instance1.colors.push("black");
console.log(instance1.colors); // [ 'red', 'black' ]
console.log(instance2.colors); // [ 'red' ]
console.log(instance1.name); // 33
console.log(instance2.name); // 33
instance2.name = 22;
console.log(instance1.name); // 33
console.log(instance2.name); // 22

// 以下是不合理的地方：
console.log(instance1 instanceof SubType); // false
console.log(instance1 instanceof SuperType); // true
console.log(instance1.__proto__.constructor);
// ƒ SuperType(){
// 	this.colors = ["red"];
// }
```
通过直接在`SubType`设定实例的原型引用，让实例可以引用到`SuperType`的原型，但这导致了
SubType 的实例原型和构造函数原型不一致的情况

### 完备的组合继承
通过 Constructor Stealing 继承实例属性，通过 Prototype Chain 继承原型属性。虽然在
Prototype Chain 继承时也会让子类的原型继承父类的实例属性，但原型中的父类实例属性会被实
例中的父类实例属性覆盖。
```js
function SuperType(name){
    this.colors = ['red'];
}

SuperType.prototype.name = 33;

function SubType(){
	// 与上面不同，这里的构造函数中只继承实例属性
    SuperType.call(this);
}

// 通过 Prototype Chain 继承 SuperType 构造函数和原型的属性
// 虽然 SubType 实例的原型中依然有共享的 colors 属性，但因为上面通过构造函数直接实例本
// 身拥有了 colors 属性，所以不会用到原型里面的 colors 属性，因此每个实例都拥有独立的
// colors 属性
// 重要的是，这里的子类原型不再使用父类的原型，而是有了自己独立的原型
SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;

let instance1 = new SubType();
let instance2 = new SubType();

console.log(instance1.colors); // ['red']
console.log(instance1.name); // 33

instance2.colors.push("black");

console.log(instance1.colors); // ['red']   私有

// 删除实例中的 colors 属性
delete instance1.colors;
delete instance2.colors;

// 现在这两个实例会从原型中读取 colors
console.log(instance1.colors); // ['red'] 读取原型属性
console.log(instance2.colors); // ['red'] 读取原型属性

instance2.colors.push("green"); // 修改原型属性
console.log(instance1.colors); // ['red', 'green']  共享原型属性
```

### Problems with Combination Inheritance
实例和原型拥有相同的父类实例属性，进行下面操作的时候就会出现问题：
```js
function SuperType(name){
    this.colors = ['red'];
}

function SubType(){
    SuperType.call(this);
}

SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;

let instance = new SubType();

console.log(instance.colors); // ["red"]
instance.colors.push('green');
console.log(instance.colors); // ["red", "green"]
delete instance.colors; // 删除了实例中的属性
console.log(instance.colors); // ["red"]
```


## by Prototypal Inheritance
Create objects using an object as prototype
```js
Object.create()
```
Like the way in Prototype Chain method, every created instance shared the same
reference properties in prototype object.


## by Parasitic Inheritance
1. Create a function that does the inheritance, augments the object in some way,
and then returns the object.  
2. The Prototypal Inheritance method's logic is set an object as new objects'
prototype, while this method's logic is just modifying the proto object and
return it. So, every returned object is actually just the same one object.

```js
function createAnother(original){
	// augments original object
	original.age = 32;
    original.sayAge = function(){        
        console.log( this.age );
    };
    return original;
}

var person = {
    name: 'Nicholas',
    friends: ['Shelby', 'Court', 'Van']
};

var anotherPerson1 = createAnother(person);
var anotherPerson2 = createAnother(person);

console.log( anotherPerson1 === anotherPerson2); // true。这根本不是继承

console.log( anotherPerson1.name ); // 'Nicholas'
console.log( anotherPerson1.age ); // 32
console.log( anotherPerson1.friends ); // ['Shelby', 'Court', 'Van']
anotherPerson1.sayAge(); // 32

anotherPerson1.name = '33';
anotherPerson1.age = 22;
anotherPerson1.friends = [];

console.log( anotherPerson2.name ); // '33'
console.log( anotherPerson2.age ); // 22
console.log( anotherPerson2.friends ); // []
anotherPerson2.sayAge(); // 22
```


## by Parasitic Combination Inheritance
1. Like Combination Inheritance, use Constructor Stealing to inheritance private
 properties from SuperType's consturctor
2. Unlike Combination Inheritance, this method doesn't use Prototype Chain to
inheritance SuperType's prototype properties, but just makes a copy of
SuperType's prototype, augments this copy, and uses it as SubType's prototype.

子类使用 Constructor Stealing 继承父类实例属性，并把子类构造函数的`prototype`指向父类
`prototype`：
```js
function SuperType(name){
    this.name = name;
    this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function(){
    console.log(this.name);
};

function SubType(name){
    SuperType.call(this, name);
}

function inheritPrototype(subType, superType){
	let prototype = superType.prototype;
    prototype.constructor = subType; // 父类原型构造函数指向子类构造函数
    subType.prototype = prototype; // 子类原型指向父类原型
}
inheritPrototype(SubType, SuperType);

let instance1 = new SubType(33);
let instance2 = new SubType(22);

instance1.sayName(); // 33
instance2.sayName(); // 22

console.log(SubType.prototype.constructor === SubType); // true 正常
console.log(SuperType.prototype.constructor === SuperType); // false 不正常
```

### 和上面有缺陷的组合继承很相似
前面有缺陷的组合继承也是子类原型指向父类原型，但子类构造函数的原型却没有指向父类，导致
`instance instanceof SubType`为`false`的情况。只要按照这个思路修改，就成了这里的
Parasitic Combination Inheritance
```js
function SuperType(){
	this.colors = ["red"];
}
SuperType.prototype.name = 33;

function SubType(){
	SuperType.call(this);
}

SubType.prototype = SuperType.prototype;
SuperType.prototype.constructor = SubType;
```

### Problems with Parasitic Combination Inheritance
因为继承原型时不是 Combination Inheritance 那样通过父类实例，所以子类原型中不会拥有父
类实例属性。但因为这里直接引用父类原型，即两个构造函数共用一个原型，导致父类原型的
`constructor`要么指向子类构造函数要么指向父类构造函数，而这里是选择将其指向了子类构造函
数，从而出现了上面不正常的情况。


## References
* [Professional JavaScript for Web Developers](https://book.douban.com/subject/7157249/)