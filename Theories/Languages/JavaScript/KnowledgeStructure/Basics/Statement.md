# Statement


## 复合语句和空语句
### Compound Statements
* a statement block combines multiple statements into a single compound
statement.
* the following lines act as a single statement and can be used anywhere
that JavaScript expects a single statement:
    ```js
    {
        x = Math.PI;
        cx = Math.cos(x);
        console.log("cos(π) = " + cx);
    }
    ```


### Empty Statements
1. 空语句就是一条什么也不会做的语句
    ```js
    ;
    ```
2. 可能的应用场景是，按照规定必须要有一个语句，但是其实你并不想做什么的情况。比如下面的
操作
    ```js
    let arr = [1, 2, 3];
    for(let i = 0; i < arr.length; i++){
    	arr[i] = 0;
    }
    console.log(arr); // [0, 0, 0]
    ```
    可以简化为
    ```js
    let arr = [1, 2, 3];
    for(let i = 0; i < arr.length; arr[i++] = 0) ;
    ```
    赋值操作已经在圆括号里完成后，后面的循环体就不需要做什么，所以写一个空语句即可
* 正如上面的情况，分号在某些情况下 并不是可有可无的。如果上面忘了加那个分号，那之后一行
的代码就会变成循环体。下面这种情况也是一样
    ```js
    if( false );
    console.log( 'It is false' ); // this line is always executed.
    ```
    误加了了分号后，逻辑判断就与预期不符了
* 因为很多人都习惯省略分号的写法，所以最好不要使用空语句，以免引起误会。如果必须要使用的
话，最好加上注释说明
    ```js
    for(let i = 0; i < arr.length; arr[i++] = 0) /* empty*/ ;
    ```



## Statement Completion Values
语句的返回值不一定都是`undefined`

### Variable Statement
* [ecma-262](https://www.ecma-international.org/ecma-262/8.0/index.html#sec-variable-statement)
* 变量声明语句的返回值是`undefined`

### `{ .. }` block
* `{ .. }` block has a completion value of the completion value of its last
contained statement/expression.
* 目前（2018.5）获取代码块结果值的方法是使用`console`或`REPL`
例如，执行以下代码，会打印输入`3`。因为这个代码块的最后一个表达式的结果值是3
```js
{
    1 + 2
}
```
而执行以下代码，会打印输入`undefined`。因为这个代码块的最后一个语句是会返回`undefined`
的变量赋值语句。
```js
{
    var a = 33;
}
```
* 如果需要直接在代码中获取代码块的结果，需要用到[ES7的`do`表达式](http://es6.ruanyifeng.com/?search=do&x=0&y=0#docs/proposals#do-%E8%A1%A8%E8%BE%BE%E5%BC%8F)
*




## The if Statement
* The condition can be any expression; it doesn’t even have to evaluate to an actual Boolean value. ECMAScript automatically converts the result of the expression into a Boolean by calling the Boolean() casting function on it.
* JavaScript syntax requires a single statement after the if keyword and parenthesized expression, but you can use a statement block to combine multiple statements into one.
* It’s considered best coding practice to always use block statements, even if only one line of code is to be executed.
* The rule in JavaScript (as in most programming languages) is that by default an else clause is part of the nearest if statement.
    ```js
    let n = 3;
    if( n<10 )
    	if( n>5 )
    		console.log( "n<10 && n>5" );
    else
    	console.log( "n>=10" );
    ```
    以上代码从缩进来看，是预期先 n<10成立，然后进一步n>5不成立，所以没有输出。但实际上因为else子句要和离它最近的if组成一组，所以实际上是输出```n>=10```
* 如果else依然加了判断条件，则无论如何都会执行其内部语句
    ```js
    let n = 5;
    if( n === 5 )
    {
        console.log(22); // 可以输出 22   
    }
    else( false )
    {
        console.log(33); // 也可以输出 33
    }
    ```
* `else if` is not really a JavaScript statement, but simply a frequently used programming idiom that results when repeated if/else statements are used.其真实的逻辑如下所示
    ```js
    let n = 3;
    if( n>10 )
    {
    	console.log( "n>10" );
    }
    else
    	if( n>5 )
    	{
    		console.log( "n>5" );
    	}
    	else
    		if( n>=0 )
    		{
    			console.log( "n>=0" );
    		}
    		else
    		{
    			console.log( "negative" );
    		}
    ```

## The switch Statement
* An if statement causes a branch in the flow of a program’s execution, and you can use the else if idiom to perform a multiway branch. This is not the best solution, however, when all of the branches depend on the value of the same expression. In this case, it is wasteful to **repeatedly evaluate that expression in multiple if statements**.
* It’s best to always put a break statement after each case to avoid having cases fall through into the next one. If you need a case statement to fall through, include a comment indicating that the omission of the break statement is intentional
* Although the switch statement was borrowed from other languages, it has some unique characteristics
in ECMAScript:
    1.  the switch statement works with all data types (in many languages it works only with numbers), so it can be used with strings and even with objects.
    2. nguages it works only with numbers), so it can be used with strings and even with objects. Second, the case values need not be constants; they can be variables and even expressions.
    ```js
    function helloworld()
    {
    	return "hello world";
    }
    switch( helloworld() )
    {
    	case "hello"+" world":
    	{
            console.log("Greeting was found.")
      		break;
    	}       
    	case "goodbye":
    	{

            console.log("Closing was found.");
      		break;
    	}      
    	default:
    	{
            console.log("Unexpected message was found.");
    	}
    }
    ```
    3. The fact that the case expressions are evaluated at run-time makes the JavaScript switch statement much different from (and less efficient than) the switch statement of C, C++, and Java. In those languages, the case expressions must be compile-time constants of the same type, and switch statements can often compile down to highly efficient jump tables.
* The switch statement compares values using the identically equal operator(===), so no type coercion occurs (for example, the string "10" is not equal to the number 10). 不过可以使用下面这种方法来模拟使用`==`的情况：
```js
switch (true) {
    case a == 10:
        console.log( "10 or '10'" );
        break;
    case a == 42;
        console.log( "42 or '42'" );
        break;
    default:
}
```
* When using switch inside a function, however, you may use a return statement instead of a break
* default项并不是必须的，甚至也并不一定要放在最后


## while语句

## do-while语句
the do/while loop must always be terminated with a semicolon. The while loop doesn’t need a semicolon if the loop body is enclosed in curly braces.
```
do {
statement
} while (expression);
```

## for语句
for(initialization; expression; post-loop-expression) statement
* The for statement is also a pretest loop with the added capabilities of variable initialization before entering the loop and defining postloop code to be executed.
* 圆括号相当是花括号的父级作用域
    ```js
    for (let i=0; i<3; i++){
        let i = 2;
        console.log(i);
    }
    ```
    没有报错，说明不是同一个作用域，否则不能重复声明。如果在花括号找不到`i`的定义，就会去父级圆括号里找，现在找到了，就直接用自己作用域的。所以打印出来的都是`2`
* there’s no need to use the var keyword inside the for loop initialization. It can be done outside the initialization as well
    ```
    var i;
    for (i=0;i<5;i++)
    {
         alert(i);
    }
    ```
三.因为post-loop-expression是在一次循环结束后才执行的，所以即使改成++i，和之前的结果也是一样；
* The initialization, control expression, and postloop expression are all optional. You can create an infinite loop by omitting all three
* 括号中的三部分可以写多个语句，第二部分如果写多个语句，会以最后一个语句作为条件
    ```
    var i,n,m;
    for(i=0,n=3; i>5,i<5; i++,m=4)
    {
        alert(n+m);//弹出一个NaN四个7
    }
    ```
* 括号中的语句不一定是数学表达式
    ```
    let arr = [1, 2, 3];
    for( let i=0; arr[i]; i++)
    {
    	console.log( arr[i] );
    }
    ```


## for-in 语句
* The for/in loop does not actually enumerate all properties of an object, only the enumerable properties.
* JavaScript arrays are simply a specialized kind of object and array indexes are object properties that can be enumerated with a for/in loop.
    ```
    let arr = [1, 2, 3];
    for( let index in arr )
    {
    	arr[index] *= arr[index];
    }
    console.log( arr ); // [1, 4, 9]
    ```
* 与for语句类似，这里控制语句中的var操作符也不是必需的，但是为了保证使用局部变量，我们推荐加上var。
* ECMAScript内置对象的属性没有顺序，因此通过for-in循环输出的属性名的顺序是不可预测的，返回的先后顺序可能会因浏览器而异。但是，If an object（以及数组） was created as an object literal, its enumeration order is the same order that the properties appear in the literal.
* 但是如果表示要迭代的对象的变量值为null或undefined，for-in语句会抛出错误。ECMAScript 5 更正了这一行为，对这种情况不在抛出错误，而只是不执行循环体。为了保证最大限度的兼容性，建议在使用for-in循环前，先检测确认该对象的值不是null或undefined。
==不懂 5.5.4.1第一段以外对顺序的讲解==

*  the variable in the for/in loop may be an arbitrary expression, as long as it evaluates to something suitable for the left side of an assignment. This expression is evaluated each time through the loop, which means that it may evaluate differently each time.
    ```
    let arr = [],
    	obj = {
    		name: "ni",
    		age: 19,
    		sex: "femail"
    	},
    	i = 0;
    for( arr[i++] in obj ) ;
    console.log( arr ); // [ 'name', 'age', 'sex' ]
    ```
* If the body of a for/in loop deletes a property that has not yet been enumerated, that property will not be enumerated. If the body of the loop defines new properties on the object, those properties will generally not be enumerated. (Some implementations may enumerate inherited properties that are added after the loop begins, however.)


## ==label语句 不懂==
     使用label语句可以在代码中添加标签，以便将来由break或continue语句引用。
     ```
    var num=0;
    outermost:
    for(var i=0; i<10; i++) {
        for(var j=0; j<10; j++) {
            if(i==5 && j==5) {
                break outermost;
            }
            num++;
        }
    }
    alert(num);  
    ```
上面的代码，如果不加outermost标签，结果会是95，但加上之后，break是直接跳出整个start，所接结果是55。


## break
* The break statement, used alone, causes the innermost enclosing loop or switch statement to exit immediately.
* ==不懂 和lable相关的部分==

## continue
* The continue statement is similar to the break statement. Instead of exiting a loop, however, continue restarts a loop at the next iteration.
* ==不懂 和lable相关的部分==

## return
Because of JavaScript’s automatic semicolon insertion, you cannot include a line break between the return keyword and the expression that follows it.

## with语句
* The ```with``` statement sets the scope of the code within a particular object.
* In strict mode, the ```with``` statement is not allowed and is considered a syntax error.
* It is widely considered a poor practice to use the ```wit```h statement in production code because of its negative performance impact and the difficulty in debugging code contained in the ```with``` statement.


## debugger
* The debugger statement invokes any available debugging functionality, such as setting a breakpoint.
* If no debugging functionality is available, this statement has no effect. For example, if you use the Firebug debugging extension for Firefox, you must have Firebug enabled for the web page you want to debug in order for the debugger statement to work.
