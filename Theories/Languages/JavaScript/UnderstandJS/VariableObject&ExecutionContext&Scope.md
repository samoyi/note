# Variable object, Execution Context and Scope Chain


## Variable object
1. 用`var`声明的全局变量会成为全局对象的属性，但局部变量并没有这样的特性。
2. But you can imagine local variables as the properties of an object associated with each function invocation.   
    ```js
    function foo(){
        let name = '33';
        let age = 22;
        function say(){
            console.log(`I'm ${name}, ${age} years old`);
        }
    }
    ```
    当`foo`执行时，会生成一个变量对象，假设名为`foo_vo`，该对象有三个属性，`name`、`age`和`say`。
3. The ECMAScript 3 specification referred to this object as the “call object,” and the ECMAScript 5 specification calls it a “declarative environment record.”  
4. JavaScript does not give us any way to refer to the object in which local variables are stored. The precise nature of these objects that hold local variables is an implementation detail that need not concern us.


## Execution context
1. The execution context of a variable or function defines what other data it has access to, as well as how it should behave.
2. Each execution context has an associated variable object upon which all of its defined variables and functions exist.
3. This object is not accessible by code but is used behind the scenes to handle data.

```js
function foo(){
    let name = '33';
    let age = 22;
    function say(){
        let inner = 2233;
        console.log(`I'm ${name}, ${age} years old, ${inner}`);
    }
    console.log(`I'm ${name}, ${age} years old`);
    console.log(inner); // ReferenceError: inner is not defined
    return say;
}

let say = foo();
say();
```
4. 当`foo`执行前，会有一个全局的 execution context；当`foo`执行时，会在全局的 execution context 里嵌套生成`foo`的 execution context；而这里`say`是在最内层，所以 在`say`执行的时候，还会生成最内层嵌套的`say`的 execution context。
5. `foo`的环境里有`name`、`age`和`say`。`say`的环境里有`inner`。
6. 在一个环境中，只能访问当前环境和外层环境的变量，而不能访问内层环境的变量。
7. 所以在`foo`的环境，`console.log`可以访问当前环境的`name`和`age`，以及最外层的全局变量。但不能访问内层环境的`inner`。同样，在`say`的环境里，可以访问当前环境的`inner`，外层的`name`和`age`，以及最外层的全局变量。
8. 在这个例子也能看出来 JS 是使用的词法作用域，因为虽然`say`执行时虽然和`foo`在一个环境的，但还是要根据它定义时的嵌套关系来访问变量。

### Global execution context
1. The global execution context is the outermost one.
2. Depending on the host environment for an ECMAScript implementation, the object representing this context may differ. In web browsers, the global context is said to be that of the `window` object, so all global variables and functions are created as properties and methods on the `window` object. *而使用`let`声明的并不会等同于`window`对象的属性和方法*

### Context destroy
When an execution context has executed all of its code, it is destroyed, taking with it all of the variables and functions defined within it (the global context isn’t destroyed until the application exits, such as when a web page is closed or a web browser is shut down).

### Execution flow
1. Each function call has its own execution context.
2. Whenever code execution flows into a function, the function’s context is pushed onto a context stack.
3. After the function has finished executing, the stack is popped, returning control to the previously executing context.
4. This facility controls execution flow throughout an ECMAScript program.


## Scope chain
### 链结构
1. JavaScript is a lexically scoped language: the scope of a variable can be thought of as the set of source code lines for which the variable is defined.
2. If we think of local variables as properties of some kind of implementation-defined object, then there is another way to think about variable scope.
3. This scope chain is a list or chain of objects that defines the variables that are “in scope” for that code.
4. Every chunk of JavaScript code (global code or functions) has a scope chain associated with it. When a function is defined, it stores the scope chain then in effect.
5. When that function is invoked, it creates a new object to store its local variables, and adds that new object to the stored scope chain to create a new, longer, chain that represents the scope for that function invocation.
    ```js
    function outer(){
        let outerVar = 22;
        function inner(){
            let innerVar = 33;
        }
        inner();
    }

    outer();
    ```
    1. 在`outer`没有调用的时候，只有一个全局变量对象，以及对应的全局执行环境。作用域链也只有一节，即全局作用域。
    2. `outer`调用后，全局变量对象里又嵌套了`outer`的变量对象，全局执行环境里嵌套了`outer`的执行环境。作用域链续上了新的一节，即`outer`的作用域。
    3. `inner`调用后，`outer`的变量对象又嵌套了`inner`的变量对象，`outer`的执行环境又嵌套了`outer`的执行环境。作用域链现在成了三节：全局作用域 —— `outer`的作用域—— `inner`的作用域。

### 链分叉
1. This becomes more interesting for nested functions because each time the outer function is called, the inner function is defined again.
2. Since the scope chain differs on each invocation of the outer function, the inner function will be subtly different each time it is defined — the code of the inner function will be identical on each invocation of the outer function, but the scope chain associated with that code will be different.

```js
function outer(num){
    function inner(){
        console.log(num);
    }
    inner();
}

outer(22); // 22
outer(33); // 33
```

3. 上面的例子中，有了两条作用域链：
    * 全局 —— `22`对应的`outer`作用域 —— `22`对应的`outer`里面的`inner`
    * 全局 —— `33`对应的`outer`作用域 —— `33`对应的`outer`里面的`inner`
4. 从输出结果可以看出来，两个`outer`显然不是同一个作用域。如果时同一个作用域，则其内部的`inner`查找`num`肯定永远都会找到同样的值。

### 沿着作用域链查找变量
1. An inner context can access everything from all outer contexts through the scope chain, but the outer contexts cannot access anything within an inner context.
2. The connection between the contexts is linear and ordered. Each context can search up the scope chain for variables and functions, but no context can search down the scope chain into another execution context.
3. When JavaScript needs to look up the value of a variable `x` (a process called variable resolution), it starts by looking at the first object in the chain.
4. If that object has a property named `x`, the value of that property is used. If the first object does not have a property named `x`, JavaScript continues the search with the next objects in the chain.
5. If `x` is not a property of any of the objects in the scope chain, then `x` is not in scope for that code, and a `ReferenceError` occurs.

```js
let globalVar = 'globalVar';
let outerVar = 'global-outerVar';
let innerVar = 'global-innerVar';

function outer(){
    let outerVar = 'outerVar';
    let innerVar = 'outer-innerVar';

    function inner(){
        let innerVar = 'innerVar';

        console.log(innerVar); // "innerVar"
        console.log(outerVar); // "outerVar"
        console.log(globalVar); // "globalVar"
        console.log(undefinedVar); // ReferenceError
    }

    inner();
}

outer();
```

6. `inner`中查找`innerVar`时，在当前作用域就找到了，所以就不用去找上级作用域中的`innerVar`；查找`outerVar`时，在当前作用域找不到，所以就到上级`outer`作用域中去找`outerVar`，找到了，所以就不需要再去`outer`的上级作用域找了；查找`globalVar`时，在当前作用域和`outer`作用域都找不到，只有继续沿着作用域链再找上级作用域，找到了全局作用域，找到了`globalVar`；查找`undefinedVar`时，一级一级找到全局作用域也没找到，所以报错。


## 作用域（链）和变量对象的关系

## 延长作用域链
1. 虽然执行环境的类型总共只有两种 —— 全局和局部，但有些语句可以在作用域链的前端临时增加一个变量对象，该变量对象会在代码执行后被移除。在两种情况下会发生这种现象，当执行流进入下列任何一个语句时，作用域链就会得到加长：`try-catch`语句的`catch`块，和`with`语句。这两个语句都会在作用域链的前端添加一个变量对象。
3. 对`catch`语句来说，会创建一个新的变量对象，其中包含的是被抛出的错误对象的声明。
    ```js
    function foo(){
        try{
            throw new Error('hehehe');
        }
        catch(err){
            console.log(err.message); // "hehehe"
        }
        console.log(typeof err); // "undefined"
    }
    foo();
    ```
    当执行`foo`时，作用域链是：全局 —— `foo`作用域。当执行到`catch`时，会新出现一个执行环境和变量对象，里面保存着变量`err`。因此作用域链暂时变为：全局 —— `foo`作用域—— `catch`作用域。`catch`作用域里的变量`err`，从外部`foo`的执行环境里无法访问。
4. 对`with`来说，会将指定的对象添加到作用域链中`with` 语句是运行缓慢的代码块，尤其是在已设置了属性值时。大多数情况下，如果可能，最好避免使用它。



## ES6  block scope
ES6 之前没有块级作用域，只能通过 IIFE 来模拟。因为没有块级作用域而臭名昭著的问题：
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




## References
* [*High Performance JavaScript* Chapter 2](https://book.douban.com/subject/4183808/)