# Primitive And Reference Values


## 概述
1. ECMAScript 变量松散类型的本质，决定了它只是在特定时间用于保存特定值的一个名字而已。
由于不存在定义某个变量必须要保存何种数据类型值的规则，变量的值及其数据类型可以在脚本的生
命周期内改变。
2. ECMAScript 变量可能包含两种不同数据类型的值：基本类型值和引用类型值。基本类型值指的
是简单的数据段，引用类型值指那些可能由多个值构成的对象。在将一个值赋给变量时，解析器必须
确定这个值是基本类型值还是引用类型值。
3. 基本数据类型是按值访问的，因为可以操作保存在变量中的实际的值。
4. 引用类型的值是保存内存中的对象。与其他语言不同，ECMAScript 不允许直接访问内存中的位
置，也就是说不能直接操作对象的内存空间。在操作对象时，实际上是在操作对象的引用而不是实际
的对象。为此，引用类型的值是按引用访问的。
5. 在很多语言中，字符串以对象的形式表示，因此被认为是引用类型。ECMAScript 放弃了这一传
统。


## 能用`let`就别用`var`
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
4. 另外两个因为提升而增加出错机会的例子

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
        console.log(x);
        let x = 33; // ReferenceError: x is not defined
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



动态的属性——————————————————
     对于引用类型的值，我们可以为其添加属性和方法，也可以改变和删除其属性和方法。但是，我们不能给基本类型的值添加属性，尽管这样做不会导致任何错误。


复制变量值————————————————————
一.如果从一个变量向另一个变量复制基本类型的值，会在变量对象上创建一个新值，然后把该值复制到为新变量分配的位置上。两个变量里的值是完全独立的。此后，这两个变量可以参与任何操作而不互相影响。
二.当从一个变量向另一个变量复制引用类型的值时，同样也会将存储在变量中的值复制一份放到为新变量分配的空间中。不同的是，这个值的副本实际上是一个指针，而这个指针指向存储在堆中的一个对象。复制操作结束后，两个变量实际上将引用同一个对象。





传递参数————————————————————
一.ECMAScript中所有函数的参数都是按值传递的，即把函数外部的值复制给函数内部的参数。
1.基本类型值的传递如同基本类型变量的复制一样，而引用类型值的传递，则如同引用类型变量的复制一样，即拷贝一份指针传给
    新的变量。
2.传参都是按值传递，但在内部访问时，基本类型是按值访问，引用类型仍然是按引用访问。

二. 在向参数传递基本类型的值时，被传递的值会被复制给一个局部变量（即命名参数，或者用ECMAScript的概念来说，就是arguments对象中的一个元素）。

三. 在向参数传递引用类型的值时，会把这个值在内存中的地址复制给一个局部变量，因此这个局部变量的变化会反映在函数的外部。
传引用类型的时候所谓的按值传递，这里的值并不是这个引用类型本身的值，而是存储该引用类型的变量的地址。即，复制一份地址然后传给你。而如果是按引用传递，就不是传递参数变量的指向对象的地址，而是直接传递给对象的引用。
function setName(obj)
{
     obj.name="li";
}
var person=new Object();
setName(person); // 把person的地址传给了obj，obj现在指向person，所以修改obj就修改了person
alert(person.name);     //"li" 。
以上代码中创建一个对象，并将其保存在了变量 person 中。然后，这个变量被传递到 setName() 函数中之后就被复制给了 obj。在这个函数内部， obj 和 person 引用的是同一个对象。换句话说，即使这个变量是按值传递的， obj 也会按引用来访问同一个对象。（按值传递，按引用访问）于是，当在函数内部为 obj 添加 name属性后，函数外部的 person 也将有所反映；因为 person 指向的对象在堆内存中只有一个，而且是全局对象。

四.很多开发人员错误地认为：在局部作用域中修改的对象会在全局作用于中反映出来，就说明是按引用传递的。为了证明对象时按值传递的，再看一例：
function setName(obj)
{
     obj.name="li";
     obj=new Object();//这里修改的是person的副本，并不是person
     obj.name="ni";
}
var person=new Object();
setName(person); // person指向堆内存的对象，通过传参把堆内存中对象的地址传给了obj，obj和person现在都指向堆内存中的对象，所以修改obj就修改了对象
// 但是，在函数内部obj抛弃了这个地址，重新指向了一个新的对象。到了这一步，obj就和person分别指向了不同的堆内存对象。
// 如果是按引用传递，则传进来就是对person的引用对象，obj指向新对象时，实际上就是让person指向了新对象
alert(person.name);     //"li"
         如果person是按引用传递的，那么person就会被自动修改为指向其name属性值为ni的新对象。但接下来再访问person.name时，仍然是li。实际上，当在函数内部重写obj时，这个变量引用的就是一个局部对象了，这个局部对象会在函数执行完毕后立即被销毁。

五. 可以把ECMAScript函数的参数想象成局部变量




检测类型——————————————————————
一. result = variable instanceof constructor
    1. 如果变量是给定引用类型（根据它的原型链来识别）的实例，那么instanceof操作符就会返回true
    2. 注意是根据构造函数的原型而不是根据构造函数来判断
    console.log( instance instanceof SubType);  // true
    SubType.prototype = {};  
    console.log( instance instanceof SubType); // false
在这个例子中，instance本来是构造函数SubType的原型的实例，但修改了该构造函数的原型，就不是了


二.根据规定，所有引用类型的值都是Object的实例。因此在检测一个引用类型值和Object构造函数时，instanceof操作符始终会返回true。
三.当然，使用instanceof操作符检测基本类型的值，始终会返回false，因为基本类型不是对象。
