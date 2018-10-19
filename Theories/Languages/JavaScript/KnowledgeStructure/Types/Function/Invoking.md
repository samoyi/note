# Invoking

JavaScript functions can be invoked in four ways:
1. as functions
2. as methods
3. as constructors
4. indirectly through their `call()` and `apply()` methods


## Method Invocation
1. The function expression is itself a property access expression.
2. 所以和访问对象属性一样，对象方法调用也可以使用中括号
    ```js
    let o = {
    	say: function(){
    		console.log(666);
    	}
    };

    o["say"](); // 666
    ```

### 方法调用的调用上下文
#### The importance of the context in method invocation
```js
let getById = document.getElementById;
getById('d'); // TypeError: Illegal invocation
```
1. `document.getElementById`引用了一个函数，通过赋值，`getById`也引用了这个函数。
2. 前者是方法，它的 context 是`document`; 后者是非方法函数，此时它的 context 是
`window`，但其引用的函数要在`document`环境中来运行，所以就会出现错误。
3. 通过给`getById`添加正确的环境，使其可以正确的运行
    ```js
    var getById = document.getElementById.bind(document);
	getById('d'); // 不会出错
	```

#### 真伪方法调用
一个函数只有在它调用的时候才能确定是不是方法调用。

```js
let handler ={
    handleClick(){
        console.log( this );
    }
};

document.addEventListener("click", handler.handleClick); // 点击后输出 #document

handler.handleClick(); // Object {}
let foo = handler.handleClick;
foo(); // undefined
```
1. 第一处  
不是虽然表面上是方法，但 **没有调用**，只是进行了传参。传入的事件处理函数实际上是一个指
针，指向`handler`对象的`handlerClick`方法，也就是说真正传入的是这个 **独立的函数**，
而不是 **在`handlerClick`上调用这个函数**。你只能传参/拷贝一个方法，但不能传参/拷贝一
个方法调用。
2. 第二处  
这个是典型的在`handlerClick`上调用这个函数，即典型的方法调用。
3. 第三处  
和第一处一样，只不过前者是传参，这里是拷贝。


## Constructor Invocation
1. 参考这篇对`new`调用的解释：
`Theories\Languages\JavaScript\UnderstandJS\Function Invoking\2.thisBindingRules.md`
2. Note that the new object is used as the invocation context even if the
constructor invocation looks like a method invocation.
    ```js
    let o = {
        m: function (){
            this.age = 22;
            return this;
        }
    };

    console.log( new o.m() ); // {age: 22}
    console.log( 'm' in new o.m() ); // false
    console.log( 'age' in new o.m() ); // true
    console.log( 'm' in o.m() ); // true
    ```
3. 如果要像上面那样把方法作为构造函数，则方法不能用简写定义。可以看出来简写不仅仅是写法
的不同，内部还是有些不同的。简写是明确的方法定义，而非简写其实还是属于属性定义。
    ```js
    let o = {
        m(){},
    };

    new o.m(); // TypeError: o.m is not a constructor
    ```

## Indirect Invocation
`call()`  `apply()`  
You can invoke any function as a method of any object, even if it is not
actually a method of that object.


## 尾调用优化   
`Theories\Languages\Common\Function\RecursionStackOverflowAndTCO.md`
