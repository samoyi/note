# Implement Inheritance


<!-- TOC -->

- [Implement Inheritance](#implement-inheritance)
    - [by Prototype Chain](#by-prototype-chain)
        - [继承过程](#继承过程)
        - [Chain](#chain)
        - [原型链继承的问题](#原型链继承的问题)
    - [by Constructor Stealing](#by-constructor-stealing)
        - [继承过程](#继承过程-1)
        - [复制式继承和引用式继承](#复制式继承和引用式继承)
        - [Constructor Stealing 的问题](#constructor-stealing-的问题)
    - [Prototype Chain 继承和 Constructor Stealing 继承的对比](#prototype-chain-继承和-constructor-stealing-继承的对比)
    - [by Combination Inheritance](#by-combination-inheritance)
        - [有缺陷的组合继承](#有缺陷的组合继承)
        - [完备的组合继承](#完备的组合继承)
        - [Problems with Combination Inheritance](#problems-with-combination-inheritance)
    - [by Prototypal Inheritance](#by-prototypal-inheritance)
    - [by Parasitic Inheritance](#by-parasitic-inheritance)
    - [by Parasitic Combination Inheritance](#by-parasitic-combination-inheritance)
        - [和上面有缺陷的组合继承很相似](#和上面有缺陷的组合继承很相似)
        - [Problems with Parasitic Combination Inheritance](#problems-with-parasitic-combination-inheritance)
    - [References](#references)

<!-- /TOC -->


1. 严格继承时，优先使用 Parasitic Combination Inheritance。它使用借用构造函数方式继承实例属性，并通过把子类原型指向父类原型的共享原型方式继承原型属性。因为只有一个原型，那么该原型的 `constructor` 就只能指向一个构造函数，一般是牺牲父类，让 `constructor` 指向子类构造函数。
2. 其次可以使用 Combination Inheritance。它也是使用借用构造函数方式继承实例属性；继承父类原型属性的方法是，将子类的原型指向父类的实例。这样子类的原型就同时继承了父类的原型属性和实例属性。也就是说，子类的实例和原型上都有父类的实力属性。而这也是它的缺点，虽然平时因为子类实例上的实例属性会遮蔽原型上的实例属性，但如果删除了实例上的实例属性，原型上的实例属性就会暴露出来。
3. 其他几种继承方法缺点更多，只适用于非严格继承的情况。


## by Prototype Chain
子类构造函数的 `prototype` 属性指向父类的实例，这样子类的实例就会获得父类构造函数和原型中的属性

### 继承过程
```js
function SuperType(){
	this.name = 'is SuperType';
}

SuperType.prototype.getName = function(){
	return this.name;
};

function SubType(){}
let proto = new SuperType();
SubType.prototype = proto;

let obj = new SubType();
console.log( obj.getName() ); // is SuperType
```

当执行 `obj.getName()` 时：
1. 实例 `obj` 本身既没有 `name` 属性也没有 `getName` 方法。
2. 所以需要检查 `obj` 的 `[[prototype]]` 来查看原型。
3. 原型是 `proto`，同时是 `SuperType` 的实例。
4. `proto` 只有 `name` 属性而没有 `getName` 方法
5. 所以继续查找 `proto` 的原型，获得了 `getName` 方法。

### Chain
1. 上面的继承关系链可以通过不断的添加对象来被不断延长，但链的端点总是 `Object.prototype`。
2. 任何引用类型都派生自 `Object`，因此都会继承 `Object.prototype` 的属性和方法。

### 原型链继承的问题
和使用原型方法创建对象一样，实例会共享原型的引用类型属性。

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
将父类构造函数中的属性赋值到子类构造函数中

### 继承过程
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
2. `SubType` 作为构造函数被调用时，内部 `this` 指向被创建的对象（该对象随后赋值给 `foo`）。这个对象又作为 `SuperType` 的 `this`，因此随后的 `foo` 之上就新加了 `colors` 属性。
3. 和 Prototype Chain 继承方法不同，这里是按照父类的 own 属性直接在子类实例上创建属性，每个实例都有自己独立的属性，所以它解决了原型链继承时所有实例都拥有同一个引用类型的问题。
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
* Prototype Chain 是引用式继承，即子类不拥有父类属性，需要查询属性值时直接去父类查询。
* Constructor Stealing 是复制式继承，即把父类属性复制一份到自己这里。

### Constructor Stealing 的问题
从这个方法的名字可以看出来，它只是窃取了父类构造函数中的属性，所以父类原型中的属性也就无法获得了
```js
function SuperType(){
	this.colors = ["red"];
}
function SubType(){
	SuperType.call(this);
}

SuperType.prototype.name = '33';

var instance = new SubType();
console.log(instance.colors); // [ 'red' ]
console.log(instance.name); // undefined
```


## Prototype Chain 继承和 Constructor Stealing 继承的对比
* Prototype Chain： 直接继承父类实例，所以会继承实例属性和原型的属性，但所有的实例会继承相同的引用类型属性。
* Constructor Stealing： 子类会在构造函数里调用父类构造函数，因此会创建并继承独立的实例属性，但无法继承父类原型中的属性。


## by Combination Inheritance
### 有缺陷的组合继承
1. 把不想实例共享的属性放进父类构造函数，把想要实例共享的属性放进父类原型。
2. 通过 Constructor Stealing 继承父类构造函数中的属性，通过把实例的原型指向父类原型来继承父类原型中的属性。
    ```js
    function SuperType(){
        this.colors = ["red"];
    }
    SuperType.prototype.name = 33;

    function SubType(){
        SuperType.call(this); // 继承实例属性
        // 下面这一行，与 Prototype Chain 继承方法不同，这里子类的原型没有指向父类的实例，因此只会继承父类的原型属性。
        // 父类的实例属性是通过上面一行的 Constructor Stealing 方法来继承的。
        // 继承原型属性，和父类使用同样的原型
        Object.setPrototypeOf(this, SuperType.prototype);
    }

    let instance1 = new SubType();
    let instance2 = new SubType();
    console.log(instance1.colors === instance2.colors); // false

    instance1.colors.push("black");
    console.log(instance1.colors); // [ 'red', 'black' ]
    console.log(instance2.colors); // [ 'red' ]

    console.log(instance1.name); // 33
    console.log(instance2.name); // 33

    instance2.name = 22; // 实例属性覆盖原型属性
    console.log(instance1.name); // 33
    console.log(instance2.name); // 22

    // 以下是不合理的地方：
    console.log(instance1 instanceof SubType); // false
    console.log(instance1 instanceof SuperType); // true
    console.log(Object.getPrototypeOf(instance1).constructor);
    // ƒ SuperType(){
    // 	this.colors = ["red"];
    // }
    ```
3. 通过直接在 `SubType` 设定实例的原型引用，让实例可以引用到 `SuperType` 的原型，但这导致了 `SubType` 的实例原型和构造函数原型不一致的情况。

### 完备的组合继承
1. 现在继承实例属性依然通过 Constructor Stealing，但继承原型属性不是把子类圆形指向父类原型，而是像 Prototype Chain 继承那样，指向父类实例。
2. 这样，虽然在 Prototype Chain 继承时，子类的原型会继承父类的实例属性，但因为进行了 Constructor Stealing 继承，所以子类的实例页会继承父类的父类实例属性，实例中的会覆盖原型中的。
    ```js
    function SuperType(name){
        this.colors = ['red'];
    }

    SuperType.prototype.name = 33;

    function SubType(){
        // 与上面不同，这里的构造函数中只继承实例属性
        SuperType.call(this);
    }

    // 通过 Prototype Chain 继承 SuperType 构造函数和原型的属性。
    // 虽然 SubType 实例的原型中依然有共享的 colors 属性，但因为上面通过构造函数直接实例本身拥有了 colors 属性，
    // 所以不会用到原型里面的 colors 属性，因此每个实例都拥有独立的colors 属性。
    // 重要的是，这里的子类原型不再使用父类的原型，而是有了自己独立的原型。
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
1. 实例和原型拥有相同的父类实例属性，进行下面操作的时候就会出现问题：
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
2. 而且，因为子类的原型是继承的父类实例，所以考察子类原型的时候就会出现问题
    ```js
    function SuperType(name){
        this.colors = ['red'];
    }

    SuperType.prototype.name = 33;

    function SubType(){
        SuperType.call(this);
    }

    let prototype = new SuperType();
    SubType.prototype = prototype;
    SubType.prototype.constructor = SubType;

    let instance = new SubType();

    // 这两个还没问题，因为虽然 SubType 和 SuperType 都不是 instance 的直接原型，
    // 但都在 instance 的原型链上，所以 instanceof 并不会看出异常
    console.log(instance instanceof SubType); // true
    console.log(instance instanceof SuperType); // true

    // 但使用 Object.getPrototypeOf 直接获取原型的时候就有问题了
    console.log(Object.getPrototypeOf(instance) === SubType); // false
    console.log(Object.getPrototypeOf(instance) === SuperType); // false
    console.log(Object.getPrototypeOf(instance) === prototype); // true
    ```


## by Prototypal Inheritance
和 Prototype Chain 方法一样，每个创建的实例都共享相同的引用类型属性。
```js
let proto = {
	age: 22,
	friends: ['Hime', 'Hima'],
};

let obj1 = Object.create(proto);
let obj2 = Object.create(proto);
console.log(obj1.friends === obj2.friends);
```


## by Parasitic Inheritance
1. Create a function that does the inheritance, augments the object in some way, and then returns the object. 可以理解为，寄生在原对象上。
2. The Prototypal Inheritance method's logic is set an object as new objects' prototype, while this method's logic is just modifying the proto object and return it. So, every returned object is actually just the same one object.

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
1. 和组合继承一样使用构造函数窃取继承父类构造函数的属性作为实例属性。
2. 和组合继承不同的是，这个方法不是用原型链来继承父类的原型属性，而是直接将子类构造函数的 `prototype` 属性指向父类原型。
    ```js
    // 把不共享的属性定义到构造函数里
    function SuperType(name){
        this.name = name;
        this.colors = ["red", "blue", "green"];
    }

    // 把共享的属性定义到原型里
    SuperType.prototype.sayName = function(){
        console.log(this.name);
    };

    // 通过构造函数窃取继承父类的构造函数属性作为实例属性
    function SubType(name){
        SuperType.call(this, name);
    }

    // 直接将子类构造函数的 prototype 属性指向父类原型来继承父类原型属性
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
前面有缺陷的组合继承也是子类原型指向父类原型，但子类构造函数的 `prototype` 却没有指向父类，导致 `instance instanceof SubType` 为 `false` 的情况。只要按照这个思路修改，就成了这里的 Parasitic Combination Inheritance
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
1. 因为继承原型时不是 Combination Inheritance 那样通过父类实例，所以子类原型中不会拥有父类实例属性。
2. 但因为这里直接引用父类原型，即两个构造函数共用一个原型，导致父类原型的 `constructor` 要么指向子类构造函数要么指向父类构造函数，而这里是选择将其指向了子类构造函数，从而出现了上面不正常的情况。


## References
* [Professional JavaScript for Web Developers](https://book.douban.com/subject/7157249/)
