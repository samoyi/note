# Primitive And Reference Values


## Misc
1. ECMAScript 变量松散类型的本质，决定了它只是在特定时间用于保存特定值的一个名字而已。
由于不存在定义某个变量必须要保存何种数据类型值的规则，变量的值及其数据类型可以在脚本的生
命周期内改变。
2. 在很多语言中，字符串以对象的形式表示，因此被认为是引用类型。ECMAScript 放弃了这一传
统。


### 基本类型和引用类型
1. ECMAScript 变量可能包含两种不同数据类型的值：基本类型值和引用类型值。基本类型值指的
是简单的数据段，引用类型值指那些可能由多个值构成的对象。在将一个值赋给变量时，解析器必须
确定这个值是基本类型值还是引用类型值。
2. 基本数据类型是按值访问的，因为可以操作保存在变量中的实际的值。
3. 引用类型的值是保存内存中的对象。与其他语言不同，ECMAScript 不允许直接访问内存中的位
置，也就是说不能直接操作对象的内存空间。在操作对象时，实际上是在操作对象的引用而不是实际
的对象。为此，引用类型的值是按引用访问的。
4. 因此你只能直接删除基本类型的值，而不能直接删除引用类型的值。
    ```js
    let n = 2;
    n = undefined;
    ```
    上面是直接把保存着`2`的那个内存清空了。

    ```js
    let o = {};
    o = null;
    ```
    而这里，并不是把保存着对象的内存清空了，只是让`o`取消引用这一块内存。真正清空这一块
    内存的，是随后运行的垃圾回收机制。


### 复制变量值
* 如果从一个变量向另一个变量复制基本类型的值，会在变量对象上创建一个新值，然后把该值复制
到为新变量分配的位置上。两个变量里的值是完全独立的。此后，这两个变量可以参与任何操作而不
* 当从一个变量向另一个变量复制引用类型的值时，同样也会将存储在变量中的值复制一份放到为新
变量分配的空间中。不同的是，这个值实际上是一个指针，而这个指针指向存储在堆内存中的一个对
象，复制的是指针而不是引用类型本身。复制操作结束后，两个变量实际上将引用同一个对象。

### 传递参数
1. ECMAScript 中所有函数的参数都是按值传递的，即把函数外部的值复制给函数内部的参数。
2. 基本类型值的传递如同基本类型变量的复制一样，而引用类型值的传递，则如同引用类型变量的
复制一样，即拷贝一份指针传给新的变量。
3. 在向参数传递基本类型的值时，被传递的值会被复制给一个局部变量（即命名参数，或者用
ECMAScript 的概念来说，就是 arguments 对象中的一个元素）。
4. 在向参数传递引用类型的值时，会把这个值在内存中的地址复制给一个局部变量，因此这个局部
变量的变化会反映在函数的外部，因为两个指针引用的是同一个对象。
5. 传参都是按值传递，但在内部访问时，基本类型是按值访问，引用类型仍然是按引用访问。


## 能用`let`/`const`就别用`var`
### 块级作用域
1. `let`会生成块级作用域
    ```js
    {
        let n = 2;
    }
    console.log(typeof n); // undefined
    ```
2. `var`因为没有块级作用域而臭名昭著的问题
    ```js
    let arr = [];
    for (var i = 0; i < 3; i++) {
        arr[i] = function () {
            console.log(i);
        };
    }
    arr[1](); // 3
    ```
    相当于：
    ```js
    let arr = [];

    {
        var i = 0;
        {
            arr[i] = function () {
                console.log(i);
            };
        }
    }
    {
        var i = 1;
        {
            arr[i] = function () {
                console.log(i);
            };
        }
    }
    {
        var i = 2;
        {
            arr[i] = function () {
                console.log(i);
            };
        }
    }
    {
        var i = 3;
    }

    arr[1](); // 3
    ```
    三个函数的父级作用域其实是同一个作用域，也只有一个`i`。在函数调用时，`i`已经是4了
3. 如果使用`let`进行`for`循环，展开后相当于：
    ```js
    let arr = [];

    {
        let i = 0;
        {
            arr[i] = function () {
                console.log(i);
            };
        }
    }
    {
        let i = 1;
        {
            arr[i] = function () {
                console.log(i);
            };
        }
    }
    {
        let i = 2;
        {
            arr[i] = function () {
                console.log(i);
            };
        }
    }
    {
        let i = 3;
    }

    arr[1](); // 1
    ```
    三个函数的父级作用域都是分别独立的，而且`i`各不相同。
4. `{}`的必要性
    ```js
    if (false)
    let a = 2;
    // SyntaxError: Lexical declaration cannot appear in a single-statement context
    ```
    块级作用域（使用`{}`）的出现，就使得省略`{}`的情况不一定安全。在块级作用域出现之前，
    这里的`{}`是可有可无的，但因为块级作用域要求必须使用`{}`，所以这里就会出错。同样的
    情况在严格模式下声明函数时也会出现。

### 声明提升
1. `let`声明的变量不会被提升
    ```js
    console.log(i); // ReferenceError: i is not defined
    let i = 0;
    ```
    这很合理直观，因为`console.log(i)`的时候还没有定义`i`
2. `var`变量声明会被提前。不过变量初始化并不会
    ```js
    console.log(i); // undefined
    var i = 0;
    ```
    其实相当于：
    ```js
    var i; // 声明提升
    console.log(i);
    i = 0; // 初始化没有被提升
    ```
3. 一个因为提升而反直觉的例子
    ```js
    var x = 22;

    function foo(){
        console.log(x);
        var x = 33; // 声明了一个局部作用域的 x，并提升到局部作用域顶部
    };

    foo(); // undefined
    ```
    最舒服的直觉，应该打印`22`或`33`。函数内部相当于如下顺序：
    ```js
    var x;
    console.log(x);
    x = 33;
    ```
    如果使用`let`，则根本不会给你反直觉的机会，直接就报错了
    ```js
    function foo(){
        console.log(x); // ReferenceError: x is not defined
        let x = 33;
    };
    ```

### 重复声明
1. `var`声明的变量可以再次用`var`重复声明
    ```js
    var n = 2;
    var n = 3;
    ```
2. 只要有`let`参与的声明，在整个作用域的任何地方(不管之前还是之后)都不能重复声明
    ```js
    // 之后的情况
    let n = 0;
    var n = 2; // SyntaxError: Identifier 'n' has already been declared
    // 可以理解为 let 不允许自己声明的变量被重新声明

    // 之前的情况
    var n = 2;
    let n = 0; // SyntaxError: Identifier 'n' has already been declared
    // 可以理解为 let 不会去声明别人已经声明过的变量
    ```

### TDZ(Temporal Dead Zone)
1. 好像因为`let`的出现，又要学习 TDZ 这个“新概念”。这是因为我们已经适应了`var`的不合理
性，然后突然出现了一个理所应当的情况，反倒成了一个“新概念”。
2. 上面声明提升中的例子
    ```js
    function foo(){
        console.log(x); // ReferenceError: x is not defined
        let x = 33;
    };
    ```
    如果没有先入为主学习了不合理的声明提升，这种错误可以说是很明显的：在你还没声明一个变
    量的时候就是用它，当然要报错。
3. 但是这所谓 TDZ，还是有他新的地方，倒不如说是缺陷。就是让`typeof`变得不那么正确了：
    ```js
    console.log(typeof x); // ReferenceError: x is not defined
    let x;
    ```
    `typeof`一个未声明的变量返回`undefined`这合情合理，那么在`let x`之前，`x`就是未声
    明的，所以理应依然返回`undefined`，但这里还是把它设计为报错了。那这是不是说，`let`
    之前的未声明和真正的未声明是有区别的呢？否则为什么前者报错后者返回`undefined`？


## `const`
### 声明的同时必须明确赋值
1. 不管是`let`或`var`，声明变量的时候都可以不明确赋值：
    ```js
    let n;
    n = 2;
    ```
    先声明一个变量`n`并赋值`undefined`，之后再把变量`n`的值变为`2`.
2. 但使用`const`声明变量必须明确赋值：
    ```js
    const n; // Uncaught SyntaxError: Missing initializer in const declaration
    ```
3. 声明的时候不明确赋值，其实就是对其赋值`undefined`。几乎所有的情况下，都是在以后需要
对其进行重新赋值的，这显然是常量所不允许的。所以虽然你也有极小的可能性以至于不正常的就是
想要声明一个值为`undefined`的常量，但 ES 还是直接禁止了这种行为。
4. 因为 JS 的引用类型变量实际上只是指针，所以将其定义为常量，只是将该指针定义为常量，而
不是将实际引用的对象定义为常量。
    ```js
    const OBJ = {
        age: 22,
    };
    OBJ.age = 33;
    console.log(OBJ); // {age: 33}
    ```
    上面这种情况，并不能解释为“如果把一个引用类型定义为常量，那么该引用类型本身不能改变
    ，但是它的子属性可以改变”。常量就是完全不能变的，只不过这里的常量不是对象本身，而是
    指向对象的指针。上述过程中，指针没有发生变化，一直都是指向的同一个对象，但是对象本身
    发生了变化。然而对象不本身不是常量，所以这么变化没什么问题。
5. 想要定义一个真正的常量对象，只有递归使用`Object.freeze`



## `instanceof`
`object instanceof constructor`

1. This operator tests whether the `prototype` property of a constructor appears
anywhere in the prototype chain of an object. 即，`object`的原型链中是否有一节是
`constructor.prototype`
2. 注意是根据构造函数的原型链而不是根据构造函数来判断
    ```js
    function Foo(){}
    let foo = new Foo(); // foo 的直接原型就是 Foo.prototype 引用的对象，设为 proto1
    console.log(foo instanceof Foo); // 所以这里是 true
    Foo.prototype = {}; // Foo.prototype 引用了一个新对象作为原型，设为 proto2
    // foo 的原型链里有 proto1 但没有 proto2，所以 Foo.prototype 不在 foo 的原型链里
    console.log(foo instanceof Foo); // false
    ```
3. 所有引用类型的值都是`Object`的实例。因此在检测一个引用类型值和`Object`构造函数时，
`instanceof`操作符始终会返回`true`。
4. 当然，使用`instanceof`操作符检测基本类型的值，始终会返回`false`，因为基本类型不是
对象实例。
5. 不懂。下面这种情况要怎么解释
    ```js
    function Foo(){}

    let obj_Foo = Foo.bind({});

    let instance = new obj_Foo();

    console.log(obj_Foo.prototype); // undefined
    console.log(instance instanceof obj_Foo); // true
    ```
    《Javascript - The Definitive Guide 6th》也只是对这个做了事实陈述，也没有在其他
    地方看到原因。但给人的感觉是，如果调用构造函数创建的实例在这种情况下返回`false`会比
    较违和，所以就让`instanceof`在这种情况下做出了妥协。
