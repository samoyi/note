# Execution Context &  Variable Object & Scope Chain

Execution context is defined as the environment in which JavaScript code is
executed.


## Three Execution Context types
### Global excution context
1. This is the default execution context in which JS code start it’s execution
when the file first loads in the browser.
2. All the global code are executed inside global execution context.
3. Global execution context cannot be more than one because only one global
environment is possible for JS code execution.

### Functional execution context
1. Functional execution context is defined as the context created by the
execution of code inside a function.
2. Each function has it’s own execution context.
3. Functional execution context have access to all the code of global execution
context.
4. While executing global execution context code, if JS engine finds a function
call, it creates a new functional execution context for that function.

### Eval execution context


## Execution context stack
1. Execution context stack is a stack data structure to store all the execution
stacks created while executing the JS code.
2. Global execution context is present by default in execution context stack
and it is at the bottom of the stack.
3. While executing global execution context code, if JS engines finds a function
call, it creates functional execution context of that function and pushes that
function execution context on top of execution context stack.
4. JS engine executes the function whose execution context is at the top of the
execution context stack.
5. Once all the code of the function is executed, JS engines pop’s out that
function’s execution context and starts executing the function which is below it
6. When all the code is executed JS engines pops out the global execution
context and execution of JavaScript ends.


## Creates execution context
JavaScript engine creates the execution context in the following two stages:
1. Creation phase
2. Execution phase

### Creation phase
Creation phase is the phase in which JS engine has called a function but it’s
execution has not started. In the creation phase, JS engine is in the
compilation phase and it scans over the function to compile the code.  
创建变量对象——创建作用域链——确定`this`

#### 1. Creates the Activation object or the variable object
Activation object is a special object in JS which contain all the variables,
function arguments and inner functions declarations information. As activation
object is a special object it does not have the `dunder proto`(`__proto__`)
property.

#### 2. Creates the scope chain
Once the activation object gets created, JS engine initializes the scope chain
which is a list of all the variables objects inside which the current function
exists. This also includes the variable object of global execution context.
Scope chain also contains the current function variable object.

#### 3. Determines the value of `this`
After the scope chain, JavaScript engine initialize the value of `this`.

#### Example
```js
function funA (a, b) {
	var c = 3;

	var d = 2;

	d = function() {
		return a - b;
	}
}
funA(3, 2);
```
1. Just after `funA` is called and before code execution of `funA` starts, JS
engine creates an `executionContextObj` for `funcA`
2. Activation object or variable object contains `argument` object which have
details about the arguments of the function.
3. It will have a property name for each of the variables and functions which
are declared inside the current function.
4. When JS engines encounters a function definition inside the current function,
JS engine will create a new property by the name of the function. Function
definitions are stored in heap memory, they are not stored in the execution
context stack. Function name property points to it’s definition in the heap
memory.
5. After this, JS engines will create the scope chain and will determine the
value of `this`.
	```js
	executionContextObj = {
		variableObject: {
			argumentObject : {
				0: a,
				1: b,
				length: 2
			},
			a: 3,
			b: 2
			c: undefined,
			d: undefined
		},
		scopechain: [],
		this
	}
	```

### Execution phase
1. In the execution phase, JS engines will again scan through the function to
update the variable object with the values of the variables and will execute
the code.  
2. After the execution stage, variable object will look like this:
```
variableObject = {
	argumentObject : {
		0: a,
		1: b,
		length: 2
	},
	a: 3,
	b: 2,
	c: 3,
	d: undefined then pointer to the function defintion of d
}
```


## Complete example
非严格模式下
```js
a = 1; // Line 1

var b = 2; // Line 3

function cFunc(e) { // Line 5
	var c = 10;
	var d = 15;

	a = 3

	function dFunc() {
		var f = 5;
	}

	dFunc();
}

cFunc(10); // Line 18
```

### 1. JS engine will enter the compilation phase to create the execution objects
1. **Line 1**: 编译器看到直接给变量`a`赋值的代码，所以这不是变量声明也不是函数声明，因
此不归编译阶段负责，因为具体赋值是运行时的操作。编译器不会对这一行做什么，而是继续往下移
动寻找其他代码。
2. **Line 3**: 编译器发现这一行是全局环境的变量声明，因此会在全局变量对象上创建一个属性
`b`，并且初始化为`undefined`。
3. **Line 5**: 编译器发现一个函数声明，因为编译阶段既会处理函数声明又会处理该函数的初始
化，所以编译器会在堆内存中保存这个函数，然后在全局变量对象上创建属性`cFunc`，该属性是一
个指针，指向堆内存中的函数值。但因为现在不会执行该函数，所以编译器不会知道该函数内部的情
况。
4. **Line 18**(原文是13): 没有变量和函数的声明，因此编译器什么都不会做。

### 2. Global Execution Context object after the creation phase stage:
```
globalExecutionContextObj = {
	activationbj: {
		argumentObj : {
			length:0
		},
		b: undefined,
		cFunc: Pointer to the function definition
	},
	scopeChain: [GLobal execution context variable object],
	this: value of this
}
```

### 3. JS engine will now enter the execution phase and will scan the function again
1. **Line 1**: 引擎发现全局变量对象上没有定义`a`，因此现在需要定义一个`a`，并初始化赋
值`1`。
2. **Line 3**: 引擎发现全局变量对象上定义了`b`，现在把它的值从`undefined`更新为`2`。
3. **Line 5**: 这是函数声明，编译器已经处理过了。

### 4. Global execution context object after the execution phase:
```
globalExecutionContextObj = {
	activationbj: {
		argumentObj : {
			length:0
		},
		b: 2,
		cFunc: Pointer to the function definition,
		a: 1
	},
	scopeChain: [GLobal execution context variable object],
	this: value of this
}
```

### 5. Create other execution contexts on top of the stack
For `cfunc`, then for `dFunc`


## 总结一下
1. 执行环境是一个函数执行时需要的完整的环境。它包括：
	* 当前函数中有哪些可访问的变量：变量对象
	* 当前函数外部有哪些可访问的变量：作用域链。每个链节点是一个变量对象。
	* 当前函数的`this`值
2. 可以看出来，只要在编译阶段确定了这三个部分，那么就可以确定函数的具体执行了。


## References
* [Execution context, Scope chain and JavaScript internals](https://hackernoon.com/execution-context-in-javascript-319dd72e8e2c)
