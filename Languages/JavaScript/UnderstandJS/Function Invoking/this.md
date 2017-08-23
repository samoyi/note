# Evaluation Strategy
1. When a function is invoked, an activation record, otherwise known as an
execution context, is created.
2. This record contains information about where the function was called from
(the call-stack), how the function was invoked, what parameters were passed, etc
3. One of the properties of this record is the `this` reference which will be
used for the duration of that function's execution.



***
## four `this` binding rules
### 1. Default binding
在非全局严格模式的情况下，有一点需要注意
```js
function foo() {
    console.log( this );
}

(function(){
"use strict";
    console.log( this ); // undefined
    foo(); // window
})();
```
之所以是window的原因，可以从下面的规范摘抄中得到解释：   
> Function code that is part of a FunctionDeclaration, FunctionExpression, or
accessor PropertyAssignment is strict function code if its FunctionDeclaration,
FunctionExpression, or PropertyAssignment is contained in strict mode code or if
the function code begins with a Directive Prologue that contains a Use Strict
Directive.  

1. 一个函数是否按照严格模式来执行，不是看它的调用环境，而是看它的定义环境以及它本身函数体
内是否是严格模式。
2. IIFE中是严格模式，在它里面对`this`求值的结果是`undefined`。但`foo`函数内部不是严
格模式，所以对`this`求值时，因为不是方法调用且没有指定`this`，所以`this`就被自动设定为全局对象。（对`this`的求值并不会和变量一样继承外层的`this`值，如果没有，要不就是非
严格的全局对象，要么就是严格的`undefined`）


### 2. Implicit Binding
1. When there is a context object for a function reference, `this` in the function
will be bound to the context object implicitly.
    ```js
    function foo() {
    	console.log( this.a );
    }

    var obj = {
    	a: 2,
    	foo: foo
    };

    obj.foo(); // 2
    ```
2. Only the top/last level of an object property reference chain matters to the `this` binding.
    ```js
    function foo() {
    	console.log( this.a );
    }

    var obj2 = {
    	a: 42,
    	foo: foo
    };

    var obj1 = {
    	a: 2,
    	obj2: obj2
    };

    obj1.obj2.foo(); // 42
    ```
3. Implicitly Lost
A bound function falls back to the default binding
    ```js
    function foo() {
    	console.log( this.a );
    }

    var obj = {
    	a: 2,
    	foo: foo
    };

    var bar = obj.foo; // lose binding

    bar(); // TypeError
    ```




## 构造函数中的`this`
* 如果构造函数返回值是引用类型
```js
function Foo(){
    this.age = 22;
    return {
        age: 33,
    };
}
let foo = new Foo;
console.log( foo.age ); // 33
```
* 如果构造函数范围值是基础类型
```js
function Bar(){
    this.age = 22;
    return null;
}
let bar = new Bar;
console.log( bar.age ); // 22
```

## References
* [《Professional JavaScript for Web Developers》](https://book.douban.com/subject/7157249/)
