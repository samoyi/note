# Call Stack and Stack Trace


## 3 ways to trace call stack
### 1. `console.trace()`
```js
function d() {
    console.trace();
}
function c() {
    d();
}
function b() {
    c();
}
function a() {
    b();
}
a();
```
In Nodejs, console will be:
```js
Trace
    at d (repl:2:13)
    at c (repl:2:5)
    at b (repl:2:5)
    at a (repl:2:5)
    at repl:1:1
    at ContextifyScript.Script.runInThisContext (vm.js:50:33)
    at REPLServer.defaultEval (repl.js:240:29)
    at bound (domain.js:301:14)
    at REPLServer.runBound [as eval] (domain.js:314:12)
    at REPLServer.onLine (repl.js:441:10)
```
This method displays the whole call stack from top to bottom, and is easy to use
 and has a good compatibility. But you can't catch the trace in code.

### 2. `Error.prototype.stack`
```js
function d() {
    try{throw new Error()} catch(err){console.log(err.stack)}
}

function c() {
    d();
}

function b() {
    c();
}

function a() {
    b();
}

a();
```
In Nodejs, console will be:
```js
Error
    at d (repl:3:15)
    at c (repl:2:5)
    at b (repl:2:5)
    at a (repl:2:5)
    at repl:1:1
    at ContextifyScript.Script.runInThisContext (vm.js:50:33)
    at REPLServer.defaultEval (repl.js:240:29)
    at bound (domain.js:301:14)
    at REPLServer.runBound [as eval] (domain.js:314:12)
    at REPLServer.onLine (repl.js:441:10)
```
Use this method, you can get the stack infomation as a string.

### 3. `Error.captureStackTrace`
```js
let obj = {};
function d() {
    Error.captureStackTrace(obj, c);
}
function c() {
    d();
}
function b() {
    c();
}
function a() {
    b();
}
a();
console.log(obj.stack);
```
In Nodejs, console will be:
```js
Error
    at b (repl:2:5)
    at a (repl:2:5)
    at repl:1:1
    at ContextifyScript.Script.runInThisContext (vm.js:50:33)
    at REPLServer.defaultEval (repl.js:240:29)
    at bound (domain.js:301:14)
    at REPLServer.runBound [as eval] (domain.js:314:12)
    at REPLServer.onLine (repl.js:441:10)
    at emitOne (events.js:121:20)
    at REPLServer.emit (events.js:211:7)
    at REPLServer.Interface._onLine (readline.js:282:10)
```
This method will create a `stack` property in the frist object argument. And if
the second argument is provided, the function passed will be considered the
ending point of the call stack and therefore the stack trace will only display
the calls that happened before this function was called.


## Reference
* [JavaScript Errors and Stack Traces in Depth](http://lucasfcosta.com/2017/02/17/JavaScript-Errors-and-Stack-Traces.html)
