# Implement Inheritance


<!-- TOC -->

- [Implement Inheritance](#implement-inheritance)
    - [大体思路](#大体思路)
    - [子类复制父类的实例属性](#子类复制父类的实例属性)
    - [子类继承原型属性](#子类继承原型属性)
    - [完善](#完善)
    - [References](#references)

<!-- /TOC -->


## 大体思路
1. 通过借用父类的构造函数（constructor stealing）复制父类实例上的属性 **副本** 到子类实例，从而让子类每个实例都有和父类 **同名但独立** 的实例属性。
2. 通过使用父类实例作为子类的原型，让子类有自己独立的原型对象，连接到原型链上继承父类的原型方法。


## 子类复制父类的实例属性
1. 父类和待实现的子类
    ```js
    function SuperType (name) {
        this.name = name;
    }
    SuperType.prototype.sayName = function () {
        console.log(this.name);
    };
    let superType = new SuperType("SuperType");
    superType.sayName(); // "SuperType"

    function SubType (name) {}
    ```
2. 实例属性就是子类自身的，不存在共享和继承，所以需要直接复制。
3. 添加实例属性的方法是调用构造函数，子类调用构造函数时为了复制父类的实例属性，也需要调用父类的构造函数。
4. 但直接调用父类构造函数只会把实例属性复制到父类实例（也就是父类的 `this`）上，但我们需要把它复制到子类实例（子类 `this`）上。
5. 所以调用父类的构造函数的时候就要把其中的 `this` 设置为子类实例
    ```js
    function SubType (name) {
        SuperType.call(this);
    }
    ```


## 子类继承原型属性
1. 有一个很方便的让子类 “使用” 父类原型方法的手段，就是让子类的原型属性直接引用父类原型对象
    ```js
    SubType.prototype = SuperType.prototype;
    let subType = new SuperType("SubType");
    subType.sayName(); // "SubType"
    ```
2. 但是这存在两个问题：
    * 语义化方面：JS 用原型链实现继承，继承的原理是子类的原型对象通过内部 `__proto__` 指针指向父类的原型。也就是说子类和父类都是有各自独立的原型对象的，而这里是直接使用了父类的原型对象。这就导致原型检测有异常
        ```js
        // 使用 instanceof 看不出问题，因为它查看的是原型链
        console.log(sub instanceof SuperType) // true
        console.log(sub instanceof SubType) // true
        // 但是使用 getPrototypeOf 查看直接原型就有问题了。
        // 合理的逻辑是 sub 的直接原型应该只能是 SubType.prototype
        console.log(Object.getPrototypeOf(sub) === SubType.prototype); // true
        console.log(Object.getPrototypeOf(sub) === SuperType.prototype); // true
        ```
    * 功能方面：子类没有自己的原型对象，子类想添加原型属性，就会直接添加到父类的原型对象上。这样不但影响了父类，还影响了父类的其他子类
        ```js
        // 这个子类本来只是想给自己添加一个原型方法
        SubType.prototype.subTypeMethod = function () {
            console.log("subTypeMethod");
        };

        // 创建另一个子类
        function AnotherSubType (name) {
            SuperType.call(this);
        }
        AnotherSubType.prototype = SuperType.prototype;
        let anotheSubType = new AnotherSubType("AnotherSubType");
        
        // 父类和另一个子类都有了这个方法
        subType.subTypeMethod();
        superType.subTypeMethod();
        anotheSubType.subTypeMethod();
        ```
3. 所以原型方法必须要通过真正的继承，而不是直接引用。
4. 所以，我们要给每个子类都创建一个独立的原型对象，然后这个原型对象要通过 `__proto__` 指针指向父类的原型。
5. 怎么实现呢？我们知道一个类的实例上面就有 `__proto__` 指针指向自己的原型，所以就可以用父类的实例作为子类的原型
    ```js
    // SubType.prototype = SuperType.prototype;
    SubType.prototype = new SuperType();
    ```
6. 这里有另一个缺点是，因为使用了父类实例作为原型，所以父类的实例属性也会出现在子类原型上。但普通情况下不会有问题，因为子类也有相同的实例属性，所以从子类实例访问实例属性的时候会先访问到自身的，而不是原型的。
7. 不过如果子类删除了自身的实力属性，则会访问到父类的实例属性
    ```js
    function SuperType (name) {
        this.name = name;
        this.type = "Super"
    }
    SuperType.prototype.sayType = function () {
        console.log(this.type);
    };


    function SubType (name) {
        SuperType.call(this);
        this.type = "Sub";
    }
    SubType.prototype = new SuperType();


    let subType = new SubType();
    subType.sayType(); // "Sub"
    delete subType.type;
    subType.sayType(); // "Super"
    ```
8. 也就是要，你要么直接用父类原型作为原型，那就要父类和所有子类共享原型；要么就使用父类实例作为原型，那就要保证不要删除子类实例中继承下来的属性。
9. 其实最合理的是使用父类原型对象作为原型创建一个对象来作为子类原型对象，但 ES5 并没有这样的机制，除非使用 ES6 的 `Object.create` 方法。


## 完善
1. 现在的实现是这样的
    ```js
    function SuperType (name) {
        this.name = name;
    }
    SuperType.prototype.sayName = function () {
        console.log(this.name);
    };

    function SubType (name) {
        SuperType.call(this);
    }
    SubType.prototype = new SuperType();

    let sub = new SubType();
    
    console.log(sub instanceof SuperType) // true
    console.log(sub instanceof SubType) // true
    console.log(Object.getPrototypeOf(sub) === SubType.prototype); // true
    console.log(Object.getPrototypeOf(sub) === SuperType.prototype); // false
    ```
2. 原型检测也正常了。但还有异常之处
    ```js
    console.log(sub.constructor === SubType); // false
    console.log(sub.constructor === SuperType); // true
    ```
    子类的实例居然是父类的构造函数构造出来的。
3. 因为 `constructor` 是对象的原型属性，所以 `sub.constructor` 访问的实际上是 `SubType.prototype.constructor`。而 `SubType.prototype` 又是父类的实例，所以最终访问的实际上是 `SuperType.prototype.constructor`，那肯定就是父类的构造函数了。
4. 根本的原因就是子类没有真正属于自己的原型，它要么直接使用父类的原型，要么使用父类的实例作为原型。而这两种情况下子类的 `constructor` 都是父类的 `constructor`。
5. 既然子类和父类的 `constructor` 只能有一个是对的，一般情况下子类创建的比较多用途更多，那就牺牲掉父类的，让父类的 `constructor` 指向子类的构造函数
    ```js
    SuperType.prototype.constructor = SubType;

    console.log(sub.constructor === SubType); // true
    console.log(sub.constructor === SuperType); // false
    console.log(SuperType.prototype.constructor === SuperType); // false
    ```
6. 完整实现如下
    ```js
    function SuperType (name) {
        this.name = name;
    }
    SuperType.prototype.sayName = function () {
        console.log(this.name);
    };

    function SubType (name) {
        SuperType.call(this);
    }
    SubType.prototype = new SuperType();
    SuperType.prototype.constructor = SubType;
    ```
7. 检测原型和构造函数
    ```js
    let sub = new SubType();

    console.log(sub instanceof SuperType) // true
    console.log(sub instanceof SubType) // true
    console.log(Object.getPrototypeOf(sub) === SubType.prototype); // true
    console.log(Object.getPrototypeOf(sub) === SuperType.prototype); // false

    console.log(sub.constructor === SubType); // true
    console.log(sub.constructor === SuperType); // false
    console.log(SuperType.prototype.constructor === SuperType); // false
    ```


## References
* [Professional JavaScript for Web Developers](https://book.douban.com/subject/7157249/)
