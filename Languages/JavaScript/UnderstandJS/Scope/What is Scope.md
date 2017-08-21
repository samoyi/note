# Understanding Scope

***
## The Cast
* **Engine**: Responsible for start-to-finish compilation and execution of our JavaScript program.
* **Compiler**: Handles all the dirty work of parsing and code-generation.
* **Scope**: Collects and maintains a look-up list of all the declared identifiers (variables), and enforces a strict set of rules as to accessibility to currently executing code.

***
## 以代码 var a = 2; 为例讲解引擎编译代码时的作用域概念
1. The first thing Compiler will do with this program is perform lexing to break it down into tokens.
2. Parse these tokens into a tree.
3. Encountering `var a`, Compiler asks Scope to see if a variable `a` already exists for that particular scope collection. If so, Compiler ignores this declaration and moves on. Otherwise, Compiler asks Scope to declare a new variable called `a` for that scope collection.
4. Compiler then produces code for Engine to later execute, to handle the `a = 2` assignment.
5. The code Engine runs will first ask Scope if there is a variable called a accessible in the current scope collection. If so, Engine uses that variable. If
not, Engine looks elsewhere.
6. If Engine eventually finds a variable, it assigns the value `2` to it. If not, Engine will throw an error.  
**To summarize**: Two distinct actions are taken for a variable assignment:
1. First, Compiler declares a variable (if not previously declared in the current scope)
2. Second, when executing, Engine looks up the variable in Scope and assigns to
it, if found.

***
## LHS 和 RHS
1. When Engine executes the code that Compiler produced for step (2), it has to look-up the variable a to see if it has been declared, and this look-up is consulting Scope. But the type of look-up Engine performs affects the outcome of the look-up.
2. An LHS look-up is done when a variable appears on the left-hand side of an assignment operation, and an RHS look-up is done when a variable appears on the right-hand side of an assignment operation.
3. An RHS look-up is indistinguishable from simply a look-up of the value of some variable, whereas the LHS look-up is trying to find the variable container itself, so that it can assign.
4. In this way, RHS doesn't really mean "right-hand side of an assignment" per se, it just, more accurately, means "not left-hand side". Being slightly glib for a moment, you could also think "RHS" instead means "retrieve his/her source (value)", implying that RHS means "go get the value of...".
```
console.log( a );
```
The reference to `a` is an RHS reference, because nothing is being assigned to `a` here. Instead, we're looking-up to retrieve the value of `a`, so that the value
can be passed to `console.log()`.
By contrast:
```
a = 2;
```
The reference to `a` here is an LHS reference, because we don't actually care what the current value is, we simply want to find the variable as a target for the `= 2` assignment operation.
5. LHS and RHS meaning "left/right-hand side of an assignment" doesn't necessarily literally mean "left/right side of the = assignment operator". There are several other ways that assignments happen.
```
function foo(a) {
	console.log( a ); // 2
}
foo( 2 );
```
    * The last line that invokes foo(..) as a function call requires an RHS reference to foo, meaning, "go look-up the value of foo
    * There's a subtle assignment here, it happens when the value `2` is assigned
    to the parameter `a`, an LHS look-up is performed.
    * There's also an RHS reference for the value of `a`, and that resulting value is passed to `console.log()`.
    * `console.log()` also needs a reference to execute. It's an RHS look-up for
    the `console` object, then a property-resolution occurs to see if it has a method called `log`.
6. Function declaration is not an LHS look-up
```
function foo(a) {}
```
 Compiler handles both the declaration and the value definition during code-generation, such that when Engine is executing code, there's no processing necessary to "assign" a function value to `foo`.

***
## How engine looks up elements in scope
```
function foo(a) {
    console.log( a ); // 2
}
foo( 2 );
```
1. 引擎执行到 `foo( 2 )` 时， 需要对 `foo` 进行RHS，因此查询作用域
2. 因为之前编译器在正确的作用域里声明了该函数，因此引擎可以查询到该函数的值
3. engine executes `foo`
4. 执行该函数时因为进行了2的传参，因此要进行LHS，看看把2赋值给了谁
5. 因为编译器在正确的作用域里创建了该形参，因此引擎得以找到该变量，成功传参。
6. 函数内部存在一个 `console` 引擎不知道是什么，需要到作用域中进行RHS查询
7. 作用域中存在该内置对象，引擎找到该对象并从中找到了 `log()` 方法
8. 将a传给该方法的参数时，还要进行一次RHS来确定a的值。

## Reference
* [You Don't Know JS: Scope & Closures](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch1.md)
