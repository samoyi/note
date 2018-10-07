# Create Class


## Factory Pattern
```js
function createPerson(name, age, job){
    const o = new Object();
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function(){
        console.log(this.name);
    };
    return o;
}

const person1 = createPerson("Nicholas", 29, "Software Engineer");
const person2 = createPerson("Greg", 27, "Doctor");

console.log(person1 instanceof createPerson); // false
console.log(person1.sayName === person2.sayName); // false
```

### Cons
1. 工厂模式无法解决实例识别的问题，即第一个`false`。因为实例不是由工厂函数创建的。
2. 每次调用该函数，都要创建新函数`sayName`方法，意味着每个对象都有自己的`sayName`版本。
而事实上，每个对象都共享同一个函数。ECMAScript 中的函数是对象，因此每调用一次构造函数，
就会重新定义一个函数，也就是实例化了一个`Function`对象。如果对不同实例的同名方法进行比
较，也会得到`false`的结果。
3. 一般的实例化形式都要用到`new`才显得合乎语义。


## Constructor Pattern
```js
function Person(name, age, job){
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function(){
        console.log(this.name);
    };
}

const person1 = new Person("Nicholas", 29, "Software Engineer");
const person2 = new Person("Greg", 27, "Doctor");

console.log(person1 instanceof Person); // true
console.log(person1.sayName === person2.sayName); // false
```

### 使用`new`的内部过程
当`new Foo(...)`被执行，会发生以下的过程：
1. 创建一个新对象，继承`Foo.prototype`。（所以可以用`instanceof`）
2. 执行函数`Foo`，函数内部的`this`绑定到上一步新创建的对象上。
3. 除非`Foo`明确返回一个引用类型值，则`new Foo(...)`返回刚才新创建的对象。

### Cons
因为构造函数内部`this`指向实例，所以实例依然没有共享方法


## Prototype Pattern
1. Each function is created with a `prototype` property, which is an object
containing properties and methods that should be available to instances of a
particular reference type.
2. This object is literally a prototype for the object to be created once the
constructor is called.
3. The benefit of using the prototype is that all of its properties and methods
are shared among object instances. Instead of assigning object information in
the constructor, they can be assigned directly to the prototype.

```js
// 定义构造函数
function Person(){}

// 设定构造函数的原型
Person.prototype = {
    name: "Nicholas",
    age: 29,
    job: "Software Engineer",
    // friends: ['a', 'b', 'c'],
    getName(){
        return this.name;
    },
    rename(newName){
        this.name = newName;
    },
};

// 不能直接 Person.prototype.constructor = Person，因为 constructor 默认都是
// 不可枚举的
Object.defineProperty(Person.prototype, 'constructor', {
    value: Person,
});

const person1 = new Person();
const person2 = new Person();

console.log(person1 instanceof Person); // true
console.log(person1.rename === person2.rename); // true

console.log(person1.age === person2.age); // true
console.log(person1.getName() === person2.getName()); // true

person1.age = 22;
console.log(person1.age); // 22
console.log(person2.age); // 29

console.log(person1.getName()); // "Nicholas"
person1.rename('hehe');
console.log(person1.getName()); // "hehe"
console.log(person2.getName()); // "Nicholas"

// console.log(person1.friends); // ['a', 'b', 'c']
// person1.friends.push('d');
// console.log(person1.friends); // ['a', 'b', 'c', 'd']
// console.log(person2.friends); // ['a', 'b', 'c', 'd']
```

### 明显的问题
1. 先不看第三个和第四个`console.log`，这次的效果很好：前两个`false`的情况都变成`true`
了。
2. 不管是通过属性还是通过方法更改一个实例的信息都不会同时更改其他实例的，因为是直接修改
的实例属性而非原型属性，以及直接在实例上调用的方法，`this`指向实例。更改完之后，两个实
例也拥有个性化的信息。
3. 但现在再看看第三个和第四个 `console.log`，在实例创建之后，每个实例的属性信息是完全
相同的；想要对每个实例进行个性化的初始化，必须在创建之后更改它们的属性。
4. 但其实这没什么，因为可以再定义一个初始化方法，一次性对实例所有属性进行初始化。
5. 但如果把注释的5行代码打开，就会发现真正无法回避的问题了：`person1.friends`引用的是
原型上的数组，对其进行`push`，就是修改了原型的数组，所以每一个实例都可以共享这次修改。
6. 当然硬要绕过这个问题也有办法，就是不对引用类型进行修改，而是每次想修改时就直接用实例
的同名属性覆盖：`person1.friends = ['a', 'b', 'c', 'd'];`。但显然这样放弃的太多了。

### 对比一下构造函数模式和原型模式的缺点
* 构造函数模式是把所有属性和方法都定义到实例上，虽然实例不会共享引用类型属性，但也不能共
享实例方法。
* 原型模式是都定义到原型上，虽然实例可以共享原型上的方法，但同时也会共享原型上的引用类型
属性。


## Combination Constructor/Prototype Pattern
1. 上面的构造函数模式和原型模式各有利弊，下面要说的混合模式这是两者的结合，扬长避短。
2. 扬长避短的思路就是：不需要共享的属性用构造函数来定义，需要共享的方法用原型来定义。
3. 这种构造函数与原型混成的模式，是目前在 ES5 中使用最广泛、认同度最高的一种创建自定义
类型的方法。可以说，这是用来定义引用类型的一种默认模式。

```js
function Person(name, age, job){
    this.name = name;
    this.age = age;
    this.job = job;
    this.friends = ["Shelby", "Court"];
}

Person.prototype = {
    sayName(){
        console.log(this.name);
    }
}

Object.defineProperty(Person.prototype, 'constructor', {
    value: Person,
});


const person1 = new Person("Nicholas", 29, "Software Engineer");
const person2 = new Person("Greg", 27, "Doctor");

console.log(person1 instanceof Person); // true
console.log(person1.sayName === person2.sayName); // true

person1.friends.push("Van");
console.log(person1.friends);    // ["Shelby", "Court", "Van"]
console.log(person2.friends);    // ["Shelby", "Court"]
```


## References
* [Professional JavaScript for Web Developers](https://book.douban.com/subject/7157249/)
