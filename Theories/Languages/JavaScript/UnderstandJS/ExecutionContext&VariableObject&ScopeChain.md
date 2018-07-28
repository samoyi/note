# Execution Context &  Variable Object & Scope Chain

Execution context is defined as the environment in which JavaScript code is
executed.


## Three Execution Context types
### 1. Global excution context
1. This is the default execution context in which JS code start it’s execution
when the file first loads in the browser.
2. All the global code are executed inside global execution context.
3. Global execution context cannot be more than one because only one global
environment is possible for JS code execution.

### 2. Functional execution context
1. Functional execution context is defined as the context created by the
execution of code inside a function.
2. Each function has it’s own execution context.
3. Functional execution context have access to all the code of global execution
context.
4. While executing global execution context code, if JS engine finds a function
call, it creates a new functional execution context for that function.

### 3. Eval execution context


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
Creation phase is the phase in which JS engines has called a function but it’s
execution has not started. In the creation phase, JS engine is in the
compilation phase and it scans over the function to compile the code.
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
#### 3. Determines the value of this
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
engine creates an `executonContextObj` for `funcA`
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
In the execution phase, JS engines will again scan through the function to
update the variable object with the values of the variables and will execute
the code.  
After the execution stage, variable object will look like this:
```js
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

cFunc = function(e) { // Line 5
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
1. **Line 1**: In the line variable `a` is assigned a value of `1`, so JS
engines does not think of it as a variable declaration or function declaration
and it  moves to line 3. It does not do anything with this line in compilation
phase as it is not any declaration.
2. **Line 3**: As the code is in global scope and it’s a variable declaration,
JS engines will create a property with the name of this variable in the global
execution context object and will initialize it with `undefined` value.
3. **Line 5**: JS engine finds a function declaration, so it will store the
function definition in a heap memory and create a property which will point to
location where function definition is stored. JS engines doesn’t know what is
inside of `cFunc`.
4. **Line 18**
(原文是13): This code is not any declaration hence, JS engine will not do anything.

### 2. Global Execution Context object after the creation phase stage:
```js
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
1. **Line 1**: JS engines find that there is no property with name `a` in the
variable object, hence it adds this property in the global execution context and
initializes it’s value to `1`.
2. **Line 3**: JS engines checks that there is a property with name `b` in the
variable object and hence update it’s value with `2`.
3. **Line 5**: As it is a function declaration, it doesn’t do anything and moves
to line 18.

### 4. Global execution context object after the execution phase:
```js
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



## References
* [Execution context, Scope chain and JavaScript internals](https://hackernoon.com/execution-context-in-javascript-319dd72e8e2c)
