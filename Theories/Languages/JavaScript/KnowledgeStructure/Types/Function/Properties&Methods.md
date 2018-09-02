# Properties and Methods


## Properties
### `length`
1. The value of the `length` property is an integer that indicates the typical
number of arguments expected by the function.
2. 默认参数和 rest 参数的情况
按照上面`length`的定义，默认参数不计入可以理解，但是默认参数后面的也不计入，就有些不符
合定义了。
    ```js
    function foo(a, b=0) {}
    function bar(a, b=0, c) {}

    console.log(foo.length); // 1
    console.log(bar.length); // 1
    ```
    不过 rest 参数不计入`length`倒是合理
    ```js
    function foo(a, ...rest) {}
    console.log(foo.length); // 1
    ```

### `prototype`
对于 ECMAScript 中的引用类型而言，`prototype`是保存它们所有实例方法的真正所在。换句话
说，`toString()`和`valueOf()`等方法实际上都保存在`prototype`名下，只不过是通过各自对
象的实例访问罢了。

### `name`
1. 如果将一个匿名函数赋值给一个变量，ES5 的`name`属性，会返回空字符串，而 ES6 的`name`
属性会返回变量名。
    ```js
    let foo = function(){};
    console.log(foo.name); // "foo"
    ```
2. 如果将一个具名函数赋值给一个变量，则 ES5 和 ES6 的`name`属性都返回这个具名函数原本
的名字。
    ```js
    let foo = function bar(){};
    console.log(foo.name); // "bar"
    ```
3. `Function`构造函数返回的函数实例，`name`属性的值为`anonymous`。
    ```js
    let foo = new Function;
    console.log(foo.name); // "anonymous"
    ```
4. `bind`返回的函数，`name`属性值会加上`bound `前缀。不懂这样设计的目的是什么。
    ```js
    function foo() {};
    console.log(foo.bind(null).name); // "bound foo"
    console.log((function(){}).bind(null).name); // "bound "
    ```

### 使用函数自定义属性来替代全局变量
1. 不需要在函数外面创建一个变量也可以每次调用都会记得上一次的值
    ```js
    count.index = 0;
    function count(){
    	return count.index++;
    }
    ```
2. 但是这个方法会把属性暴露在外部作用域，可能对其他地方产生影响，或者被影响。在一般情况
下，应该使用闭包
    ```js
    // 使用属性
    count.index = 0;
    function count(){
    	return count.index++;
    }
    console.log( count() ); // 0
    console.log( count() ); // 1
    count.index = null;
    console.log( count() ); // 0
    ```
    ```js
    // 使用闭包
    let index = 0;
    let count = (function(){
    	let index = 0;
    	return function(){
    		return index++;
    	};
    })();
    console.log( count() ); // 0
    console.log( count() ); // 1
    index = null;
    console.log( count() ); // 2
    ```


## Methods
### `call()` and `apply()`
1. `call()` and `apply()` allow you to indirectly invoke a function as if it
were a method of some other object.
    ```js
    function foo(){
        console.log(this.name);
    }
    foo.call({name: '33'});
    ```
2. `apply()` works with array-like objects as well as true arrays
    ```js
    function foo(x, y, z){
        console.log(x, y, z); // "1 2 3"
    }

    function bar(){
        foo.apply(null, arguments);
    }

    bar(1, 2, 3);
    ```
3. If a function is defined to accept an arbitrary number of arguments, the
`apply()` method allows you to invoke that function on the contents of an array
of arbitrary length. 不过在 ES6 中，可以直接用 rest 参数了
    ```js
    let arr = [5, 42, 645, 1, 54, 1, 24, 2];
    Math.max.apply(Math, arr);
    Math.max(...arr)
    ```

### `bind()`
`function.bind(thisArg[, arg1[, arg2[, ...]]])`

1. This method creates a new function instance whose `this` value is bound to
the value that was passed into `bind()`.
2. 绑定之后的函数，通过`call`或`apply`甚至`bind`都无法改变其`this`值。
    ```js
    function foo(){
        console.log(this.age);
    }

    let obj1 = {age: 22};
    obj1_foo = foo.bind(obj1);
    obj1_foo(); // 22

    let obj2 = {age: 33};
    obj2_foo = obj1_foo.bind(obj2);
    obj2_foo(); // 22
    ```
3. Function objects created using `Function.prototype.bind` are exotic objects.
They also do not have a `prototype` property.
4. If the function returned by `bind()` is used as a constructor:
    * the `this` passed to `bind()` is ignored, and the original function is
    invoked as a constructor, with some arguments already bound.
    ```js
    function Foo(age){
        console.log(this.name, age);
    }
    let obj = {name: '22'};

    let obj_Foo = Foo.bind(obj, 33);

    obj_Foo(); // "22" 33
    new obj_Foo(); // undefined 33
    ```
    * Functions returned by the `bind()` method do not have a `prototype`
    property and objects created when these bound functions are used as
    constructors inherit from the `prototype` of the original, unbound
    constructor.
    ```js
    function Foo(){}
    let obj = {};

    let obj_Foo = Foo.bind(obj);

    let instance = new obj_Foo();

    console.log(obj_Foo.prototype); // undefined
    console.log(Foo.prototype); // {constructor: ƒ}

    console.log(instance instanceof obj_Foo); // true  ！！
    console.log(instance instanceof Foo); // true
    ```
    * 但有一点不懂，就是对绑定的函数使用`instanceof`居然也返回`true`。《Javascript -
    The Definitive Guide 6th》也只是对这个做了事实陈述，也没有在其他地方看到原因。但
    给人的感觉是，如果调用构造函数创建的实例在这种情况下返回`false`会比较违和，所以就让
    `instanceof`在这种情况下做出了妥协。
3. 通过该方法实现 Partial application / Currying
    ```js
    // example1
    var sum = function(x,y) { return x + y }; // Return the sum of 2 args
    // Create a new function like sum, but with the this value bound to null
    // and the 1st argument bound to 1. This new function expects just one arg.
    var succ = sum.bind(null, 1);
    console.log( succ(2) ); // => 3: x is bound to 1, and we pass 2 for the y argument
    ```
    ```js
    // example2
    function f(y,z) { return this.x + y + z }; // Another function that adds
    var g = f.bind({x:1}, 2); // Bind this and y
    console.log( g(3) ); // => 6: this.x is bound to 1, y is bound to 2 and z is 3
    ```
    ```js
    // example3  实现在不能传参得到情况下进行预传参
    let name = 33,
        oBtn = document.querySelector("#btn");

    function handler( name ){
        console.log( name );
        console.log( this );
    }
    oBtn.addEventListener("click", handler.bind(oBtn, name));
    ```

### toString()
Like all JavaScript objects, functions have a `toString()` method. The
ECMAScript spec requires this method to return a string that follows the syntax
of the function declaration statement. In practice most (but not all)
implementations of this `toString()` method return the complete source code for
the function.
