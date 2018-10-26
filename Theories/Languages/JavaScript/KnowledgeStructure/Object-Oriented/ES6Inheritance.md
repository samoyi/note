# ES6 Inheritance


## `super`关键字
既可以当作函数使用，也可以当作对象使用

### 作为函数调用时
* 作为函数时，`super()`只能用在子类的构造函数之中。
* `super`代表父类的构造函数，但返回的是子类的实例，即`super`内部的`this`指的是子类构造
函数中的`this`。类似于 Constructor Stealing。
    ```js
    class A {
        constructor() {
            this.x = 1;
        }
    }

    class B extends A {
        constructor() {
            // 类似于 Constructor Stealing，把父类的实例属性复制到子类
            super();
            console.log(this.hasOwnProperty('x')); // true
        }
    }

    new B();
    ```
* 可以给`super()`传参，将使用这些参数调用父类构造函数
    ```js
    class Foo {
        constructor(name){
            this.name = name;
        }
    }

    class Bar extends Foo {
        constructor(profile){
            super(profile.name);
            console.log(profile.age); // 22
        }
    }

    let bar = new Bar({age: 22, name: '33'});
    console.log(bar.name); // "33"
    ```

### 作为对象时
阮一峰的讲解不清晰，看[这个回答](https://www.zhihu.com/question/38292361/answer/105183980)

#### 必须以`super.IdentifierName`的形式出现，不能单独使用`super`对象
```js
class A {
}

class B extends A {
    foo(){
        console.log(super); // SyntaxError: 'super' keyword unexpected here
    }
}
```

#### 在普通方法中：读取属性时`super`指向父类的原型对象；设置属性时指向当前`this`，即实例
**但如果通过`super`引用了父类原型方法并调用，方法内部的`this`并不指向父类原型**，详见稍后的说明
```js
class A {
    constructor() {
        this.x = 1;
    }

    foo(){
        console.log('foo');
    }
}

class B extends A {
    constructor() {
        super();
        super.foo(); // "foo"  读取属性时 super 指向父类的原型对象
        this.x = 2;
        super.x = 3; // 设置属性时指向当前 this，因此相当于 this.x = 3，并没有给父类原型对象设置 x 属性
        console.log(super.x); // undefined   读取属性时 super 指向父类的原型对象
        console.log(this.x); // 3
    }

    bar(){
        console.log(this.x + 2); // 5
    }
}

let b = new B();
b.bar();
```

以上规则也适用于对象字面量中的 `super`：
```js
let obj1 = {
    method1() {
        console.log('method 1');
    }
}

let obj2 = {
    method2() {
        super.name = 22;
        super.method1();
    }
}

Object.setPrototypeOf(obj2, obj1);
obj2.method2(); // "method 1"
console.log(obj2.name); // 22
console.log(obj1.name); // undefined
```

#### 在静态方法中：读取属性时`super`指向父类（父构造函数），设置属性时指向当前`this`，即当前类（构造函数）
**但如果通过`super`引用了父类静态方法并调用，方法内部的`this`并不指向父类（父构造函数）**，详见稍后的说明
```js
class Point {
    constructor(color) {
        this.color = color;
    }

    static foo() {
        console.log(11);
    }
}
Point.x = 'PointX';

class ColorPoint extends Point {
    static bar(){
        super.foo(); // 11   读取属性时`super`指向父类（父构造函数 Point）
        super.x = 3; // 设置属性时指向当前 this —— ColorPoint
        console.log(super.x); // "PointX"   读取属性时`super`指向 Point
        console.log(this.x); // 3
    }
}

ColorPoint.bar();
let cp = new ColorPoint();
console.log(ColorPoint.x); // 3
```

#### `super`方法调用内部的`this`
先看一个矛盾的情况:
1. 上面说到，在普通方法中，`super`指向父类原型对象，所以看下面的代码：
    ```js
    class A {
        constructor() {
            this.x = 1;
        }
        print() {
            console.log(this.x);
        }
    }

    class B extends A {
        constructor() {
            super();
            this.x = 2;
        }
        m() {
            // `super`指向父类原型对象，所以看起来是一个父类原型对象的方法调用，print
            // 内部的 this 也应该指向父类原型对象。如果不仔细想，觉得应该输出 1
            super.print();
        }
    }

    let b = new B();
    b.m() // 2
    ```
2. 但只要仔细看上面注释中的分析，就会发现问题：如果`this`指向父类原型对象，`this.x`也不
会是`1`。因为`x`定义在`A`的`constructor`中，它是`A`的实例属性而非原型属性。所以即使
`this`指向父类原型对象，`this.x`也是`undefined`(`A.prototype.x`)。
3. 其实这里的逻辑和前面说的把`super`作为函数调用以及 constructor stealing 的情况一样，
虽然调用的是父类原型方法/父类构造函数，但是`this`绑定的是当前`this`/当前构造函数。

**子类普通方法中通过`super`调用父类的方法时，方法内部的`this`指向当前的子类实例。**  
**子类的静态方法中通过super调用父类的方法时，方法内部的this指向当前的子类（构造函数）。**  

```js
class A {
    constructor() {
        this.x = 1;
    }
    static print() {
        console.log(this.x);
    }
}
A.x = 3;

class B extends A {
    constructor() {
        super();
        this.x = 2;
    }
    static m() {
        super.print();
    }
}

B.x = 4;
B.m() // 4
```

**实际上是执行了`Parent.prototype.someMethod.call(this)`**
```js
class A {}

class B extends A {
    constructor() {
        super();
        console.log(super.valueOf() instanceof B); // true
        console.log(A.prototype.valueOf.call(this) instanceof B); // true
        console.log(A.prototype.valueOf.call(this) === super.valueOf()); // true
    }
}

let b = new B();
```


## 继承语法
### 子类必须在`constructor`方法中调用`super`方法
* 用来继承父类`constructor`中的属性，相当于 contructor stealing
* 之前说过，如果没有定义`constructor`，也会自动添加一个空的`constructor`。这里又因为子
类`constructor`必须要调用`super`，所以实际上的效果看起来是，子类自动添加的
`constructor`内部也会自动调用`super`，并且会把实例化时接收到的参数全部传给`super`。
    ```js
    class Point {
        constructor(color) {
            console.log(this); // ColorPoint {}
            console.log(arguments[1]); // 22
            this.color = color;
        }

        foo() {
            console.log(555);
        }
    }

    class ColorPoint extends Point {
    }

    let cp = new ColorPoint('red', 22);
    console.log(cp.color); // "red"
    cp.foo(); // 555
    ```


## 类的`prototype`属性和`__proto__`属性
Class 作为构造函数的语法糖，同时有`prototype`属性和`__proto__`属性，因此同时存在两条继承链：

### 属性指向
* 子类的`__proto__`属性，表示构造函数的继承，总是指向父类。
* 子类`prototype`属性的`__proto__`属性，表示方法的继承，总是指向父类的`prototype`属
性。

```js
class A {}

class B extends A {}

console.log(B.__proto__ === A); // true
console.log(B.prototype.__proto__ === A.prototype); // true
```

### 实现原理
1. 类的继承是按照下面的模式实现的：
```js
class A {}

class B {}

// 从这里以及子类必须调用 super() 来看，类似于 Parasitic Combination Inheritance 模式
// 下面继承构造函数，应该是为了继承静态属性和方法
Object.setPrototypeOf(B.prototype, A.prototype);

Object.setPrototypeOf(B, A);
```
2. 而`Object.setPrototypeOf`的实现原理如下：
```js
Object.setPrototypeOf = function (obj, proto) {
    obj.__proto__ = proto;
    return obj;
}
```
3. 所以实际继承的方法如下：
```js
B.prototype.__proto__ = A.prototype;
B.__proto__ = A;
```

### 实例的`__proto__`属性
因为`B.prototype.__proto__ === A.prototype`，所以子类实例的`__proto__`等于父类实例的
`__proto__`。


## 子类`new.target`会返回子类
```js
class Rectangle {
    constructor() {
        console.log(new.target.name);
    }
}

class Square extends Rectangle {}

new Rectangle();
// Rectangle
```
利用这个特点，可以写出不能独立使用、必须继承后才能使用的类：
```js
class Shape {
    constructor() {
        if (new.target === Shape) {
            throw new Error('本类不能实例化');
        }
        console.log('实例化');
    }
}

class Rectangle extends Shape {
    constructor(length, width) {
        super();
    }
}

let y = new Rectangle(3, 4); // "实例化"
let x = new Shape();  // Error: 本类不能实例化
```
