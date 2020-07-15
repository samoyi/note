# ES6 Inheritance


<!-- TOC -->

- [ES6 Inheritance](#es6-inheritance)
    - [1. 和 ES5 继承的不同](#1-和-es5-继承的不同)
    - [2. `super`关键字](#2-super关键字)
        - [2.1 作为函数调用时](#21-作为函数调用时)
        - [2.2 作为对象时](#22-作为对象时)
            - [1.2.1 必须以 `super.IdentifierName` 的形式出现，不能单独使用 `super` 对象](#121-必须以-superidentifiername-的形式出现不能单独使用-super-对象)
            - [2.2.2 在普通方法中](#222-在普通方法中)
            - [2.2.3 在静态方法中](#223-在静态方法中)
            - [2.2.4 `super` 方法调用内部的 `this`](#224-super-方法调用内部的-this)
    - [3. 类的 `prototype` 属性和 `__proto__` 属性](#3-类的-prototype-属性和-__proto__-属性)
        - [3.1 属性指向](#31-属性指向)
        - [3.2 实现原理](#32-实现原理)
    - [4. Misc](#4-misc)
        - [4.1 子类实例化时，父类的 `new.target` 会返回子类](#41-子类实例化时父类的-newtarget-会返回子类)
        - [4.2 父类的静态方法，也会被子类继承](#42-父类的静态方法也会被子类继承)
    - [References](#references)

<!-- /TOC -->


## 1. 和 ES5 继承的不同
1. ES5 中的继承，如果使用 Combination Inheritance，则子类原型会包含父类的实例属性；如果使用 Parasitic Combination Inheritance，子类会和父类共享原型。
2. 但是 ES6 的继承这两个问题都不会出现
    ```js
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    class ColorPoint extends Point {
        constructor(x, y, color) {
            super(x, y);
            this.color = color;
            this.color = color;
        }
    }

    let cp = new ColorPoint(25, 8, 'green');

    console.log(ColorPoint.prototype.x); // undefined
    console.log(ColorPoint.prototype === Point.prototype); // false
    ```
3. 另外，ES6 构造函数的运行机制方式也和 ES5 不同。ES5 是先创造子类的实例对象 `this`，然后再将父类的方法添加到 `this` 上面（`Parent.apply(this)`）。ES6 的继承机制完全不同，子类自己的 `this` 对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。因为这样，所在在子类的构造函数中必须要先调用 `super` 方法，才能使用 `this` 对象。
    ```js
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    class ColorPoint extends Point {
        constructor(x, y, color) {
            this.color = color; // ReferenceError
            super(x, y);
        }
    }
    ```



## 2. `super`关键字
既可以当作函数使用，也可以当作对象使用

### 2.1 作为函数调用时
1. 作为函数时，`super` 只能用在子类的构造函数之中。
2. `super` 代表父类的构造函数，但返回的是子类的实例，即 `super` 内部的 `this` 指的是子类构造函数中的 `this`。类似于 Constructor Stealing。
    ```js
    class A {
        constructor() {
            this.x = 1;
        }
    }

    class B extends A {
        constructor() {
            // 类似于 Constructor Stealing，把父类的实例属性复制到子类，里面的 this 是子类实例
            super();
            console.log(this.hasOwnProperty('x')); // true
        }
    }

    new B();
    ```
3. 可以给 `super()` 传参，将使用这些参数调用父类构造函数
    ```js
    class Foo {
        constructor(name){
            this.name = name;
        }
    }

    class Bar extends Foo {
        constructor(name){
            super(name);
            
        }
    }

    let bar = new Bar('33');
    console.log(bar.name); // "33"
    ```

### 2.2 作为对象时
阮一峰的讲解不清晰，看 [这个回答](https://www.zhihu.com/question/38292361/answer/105183980)

#### 1.2.1 必须以 `super.IdentifierName` 的形式出现，不能单独使用 `super` 对象
```js
class A {}

class B extends A {
    foo () {
        console.log(super); // SyntaxError: 'super' keyword unexpected here
    }
}
```

#### 2.2.2 在普通方法中
1. 读取属性时 `super` 指向父类的原型对象；设置属性时指向当前 `this` ，即实例。
2. 但如果通过 `super` 引用了父类原型方法并调用，方法内部的 `this` 并不指向父类原型，详见稍后的说明
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
3. 以上规则也适用于对象字面量中的 `super`：
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

#### 2.2.3 在静态方法中
1. 读取属性时 `super` 指向父类（父构造函数），设置属性时指向当前 `this`，即当前类（构造函数）
2. 但如果通过 `super` 引用了父类静态方法并调用，方法内部的 `this` 并不指向父类（父构造函数），详见稍后的说明
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
            super.foo(); // 11   读取属性时 super 指向父类（父构造函数 Point）
            super.x = 3; // 设置属性时指向当前 this —— ColorPoint
            console.log(super.x); // "PointX"   读取属性时 super 指向 Point
            console.log(this.x); // 3
        }
    }

    ColorPoint.bar();
    let cp = new ColorPoint();
    console.log(ColorPoint.x); // 3
    ```

#### 2.2.4 `super` 方法调用内部的 `this`
1. 先看一个矛盾的情况。上面说到，在普通方法中，`super` 指向父类原型对象，所以看下面的代码：
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
            // super 指向父类原型对象，所以看起来是一个父类原型对象的方法调用，
            // print 内部的 this 也应该指向父类原型对象。如果不仔细想，觉得应该输出 1
            super.print();
        }
    }

    let b = new B();
    b.m() // 2
    ```
2. 但只要仔细看上面注释中的分析，就会发现问题：如果 `this` 指向父类原型对象，`this.x` 也不会是 `1`。因为 `x` 定义在 `A` 的`constructor` 中，它是 `A` 的实例属性而非原型属性。
3. 所以即使 `this` 指向父类原型对象，`this.x` 也是 `undefined` (`A.prototype.x`)。
4. 其实这里的逻辑和前面说的把 `super` 作为函数调用以及 constructor stealing 的情况一样，虽然调用的是父类原型方法/父类构造函数，但是 `this` 绑定的是当前 `this`/当前构造函数。
4. 规则：
    * **子类普通方法中通过 `super` 调用父类的方法时，方法内部的 `this` 指向当前的子类实例。** 
    * **子类的静态方法中通过 `super` 调用父类的方法时，方法内部的 `this` 指向当前的子类（构造函数）。**  
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
5. **实际上是执行了 `Parent.prototype.someMethod.call(this)`**
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


## 3. 类的 `prototype` 属性和 `__proto__` 属性
Class 作为构造函数的语法糖，同时有 `prototype` 属性和 `__proto__` 属性，因此同时存在两条继承链。

### 3.1 属性指向
* 子类的 `__proto__` 属性，表示构造函数的继承，总是指向父类。
* 子类 `prototype` 属性的 `__proto__` 属性，表示方法的继承，总是指向父类的 `prototype` 属性。
* 因为 `B.prototype.__proto__ === A.prototype` ，所以子类实例的 `__proto__` 等于父类实例的 `__proto__` 。

```js
class A {}

class B extends A {}

console.log(B.__proto__ === A); // true
console.log(B.prototype.__proto__ === A.prototype); // true
```

### 3.2 实现原理
1. 类的继承是按照下面的模式实现的：
    ```js
    class A {}

    class B {}

    // 从这里以及子类必须调用 super() 来看，类似于 Parasitic Combination Inheritance 模式
    // 下面继承构造函数，应该是为了继承静态属性和方法
    Object.setPrototypeOf(B.prototype, A.prototype);

    Object.setPrototypeOf(B, A);
    ```
2. 而 `Object.setPrototypeOf` 的实现原理如下：
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
    

## 4. Misc
### 4.1 子类实例化时，父类的 `new.target` 会返回子类
1. 示例
    ```js
    class Shape {
        constructor() {
            console.log(new.target.name);
        }
    }

    class Rectangle extends Shape {}

    new Rectangle();
    // Rectangle
    ```
2. 利用这个特点，可以写出不能独立使用、必须继承后才能使用的类：
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
3. 注意，经过 babel 转义后，父类的 `new.target` 会是 `undefined`。看到 [这里](https://segmentfault.com/q/1010000018078891) 说 babel 会把子类的 `super()` 替换为 `Parent.constructor.call()`
    ```js
    class Shape {
        constructor() {
            console.log(new.target)
        }
    }

    class Rectangle extends Shape {
        constructor() {
            super();
        }
    }

    new Shape(); // Shape 类
    new Rectangle(); // undefined
    ```

### 4.2 父类的静态方法，也会被子类继承
```js
class A {
    static hello() {
        console.log('hello world');
    }
}

class B extends A {
}

B.hello()  // hello world
```


## References
* [ECMAScript 6 入门](https://es6.ruanyifeng.com/#docs/class-extends)
* [知乎](https://www.zhihu.com/question/38292361/answer/105183980)
* [segmentfault](https://segmentfault.com/q/1010000018078891) 