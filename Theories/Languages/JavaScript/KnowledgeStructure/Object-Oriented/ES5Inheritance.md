# Implement Inheritance


<!-- TOC -->

- [Implement Inheritance](#implement-inheritance)
    - [大体思路](#大体思路)
    - [通过原型链继承父类原型方法](#通过原型链继承父类原型方法)
    - [通过借用父类构造函数复制父类实例属性](#通过借用父类构造函数复制父类实例属性)
    - [组合使用上面两种方法实现继承](#组合使用上面两种方法实现继承)
    - [存在的问题](#存在的问题)
    - [References](#references)

<!-- /TOC -->


## 大体思路
1. 通过原型链（Prototype Chain）继承父类原型上的方法，从而让子类所有的实例都 **引用** 相同的父类方法；
2. 通过借用父类的构造函数（constructor stealing）复制父类实例上的属性 **副本** 到子类实例，从而让子类每个实例都有和父类 **同名但独立** 的实例属性。


## 通过原型链继承父类原型方法
1. 子类构造函数的 `prototype` 属性指向父类的实例，这样子类的实例就能 **访问到** 父类原型中的方法
    ```js
    // 父类
    function SuperType(){
        this.name = 'SuperType';
    }
    SuperType.prototype.getName = function(){
        return this.name;
    };

    // 子类
    function SubType(){}

    // 子类继承父类原型方法
    SubType.prototype = SuperType.prototype;

    let obj = new SubType();
    // 子类只继承了父类原型方法，但没有继承父类实例属性
    console.log( obj.getName() ); // undefined

    // 子类实例定义自己的实例属性
    obj.name = 'SubType';
    console.log( obj.getName() ); // SubType
    ```
2. 现在，所有的子类实例都引用相同的父类原型方法，而不是由各自的方法
    ```js
    let instance1 = new SubType();
    let instance2 = new SubType();

    console.log(instance1.getName === instance2.getName); // true
    console.log(instance2.getName === SubType.prototype.getName); // true
    ```
3. 如果你想让所有的子类实例也共享某个属性，那就可以把这个属性也加到原型里面
    ```js
    function SuperType(){}
    SuperType.prototype.names = [22, 33];

    function SubType(){}

    SubType.prototype = SuperType.prototype;


    let instance1 = new SubType();
    let instance2 = new SubType();

    console.log(instance1.names === instance2.names); // true
    console.log(instance2.names === SubType.prototype.names); // true

    instance1.names.push(450);

    console.log(instance1.names); // [22, 33, 450]
    console.log(instance2.names); // [22, 33, 450]
    console.log(SubType.prototype.names); // [22, 33, 450]
    ```
4. 总之，通过原型链继承继承的方法和属性，默认都是所有子类实例共享的。当然也可以在子类实例中重写这些方法和属性来覆盖父类原型上的。


## 通过借用父类构造函数复制父类实例属性
1. 将父类构造函数中的属性 **复制到** 子类构造函数中
    ```js
    function SuperType(){
        this.name = 'SuperType';
    }
    SuperType.prototype.getName = function(){
        return this.name;
    };

    function SubType(){
        // 把父类实例属性复制到子类实例上
        SuperType.call(this);
    }


    let obj = new SubType();
    // 子类只复制了父类的实例属性，但没有继承父类的原型方法
    console.log( obj.getName ); // undefined
    console.log( obj.name ); // SuperType
    ```
2. `SubType` 作为构造函数被调用时，内部 `this` 指向被创建的对象（该对象随后赋值给 `obj`）。这个对象又作为 `SuperType` 的 `this`，因此随后的 `obj` 之上就新加了 `name` 属性。
3. 和原型链方法不同，这里是按照父类的实例属性直接在子类实例上创建属性，每个实例都有自己独立的属性。


## 组合使用上面两种方法实现继承
```js
function SuperType(){
    this.name = 'SuperType';
}
SuperType.prototype.getName = function(){
    return this.name;
};

function SubType(){
    SuperType.call(this);
}
SubType.prototype = SuperType.prototype;

let obj = new SubType();
console.log( obj.getName() ); // SuperType
```


## 存在的问题
1. 因为子类和父类共享了原型对象，所以在考察原型对象和构造函数的时候，会有些不自然
    ```js
    function SuperType(){}
    SuperType.prototype.getName = function(){};

    function SubType(){
        SuperType.call(this);
    }
    SubType.prototype = SuperType.prototype;

    let obj = new SubType();
    console.log( Object.getPrototypeOf(obj) === SubType.prototype);   // true         // 这里没问题
    console.log( Object.getPrototypeOf(obj) === SuperType.prototype); // true         // 这里不太自然
    console.log( SubType.prototype.constructor.name);                 // SuperType    // 这里不太自然
    console.log( SuperType.prototype.constructor.name);               // SuperType    // 这里没问题
    ```
2. 可以看出来，考察子类原型对象的时候显示正常，但考察子类构造函数的时候就不正常。因为子类用了父类的原型对象，所以原型对象的构造函数也是父类的。
3. 如果是子类使用的比较频繁，那为了让子类更加自然，可以修改原型对象的 `constructor` 属性，让它指向子类的构造函数
    ```js
    function SuperType(){}
    SuperType.prototype.getName = function(){};

    function SubType(){
        SuperType.call(this);
    }
    SubType.prototype = SuperType.prototype;
    SuperType.prototype.constructor = SubType; // 修改的原型对象的构造函数

    let obj = new SubType();
    // console.log( Object.getPrototypeOf(obj) === SubType.prototype);   // true         // 这里没问题
    // console.log( Object.getPrototypeOf(obj) === SuperType.prototype); // true         // 这里不太自然
    // console.log( SubType.prototype.constructor.name);                 // SuperType    // 这里不太自然
    // console.log( SuperType.prototype.constructor.name);               // SuperType    // 这里没问题
    console.log( Object.getPrototypeOf(obj) === SubType.prototype);   // true       // 这里没问题
    console.log( Object.getPrototypeOf(obj) === SuperType.prototype); // true       // 这里不太自然
    console.log( SubType.prototype.constructor.name);                 // SubType    // 这里没问题
    console.log( SuperType.prototype.constructor.name);               // SubType    // 这里不太自然
    ```


## References
* [Professional JavaScript for Web Developers](https://book.douban.com/subject/7157249/)
