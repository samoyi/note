# Function


<!-- TOC -->

- [Function](#function)
    - [函数是一种特殊的对象](#函数是一种特殊的对象)
    - [JavaScript 函数是一等公民（First Class Function）](#javascript-函数是一等公民first-class-function)
    - [References](#references)

<!-- /TOC -->


## 函数是一种特殊的对象
1. 函数虽然本质上是对象，但它的特殊之处在于可调用。为了实现可调用的特性，V8 为函数对象添加了两个隐藏属性，具体属性如下图所示
    <img src="./images/08.jpg" width="800" style="display: block; margin: 5px 0 10px;" />
2. 隐藏 `name` 属性的值就是函数名称，如果某个函数没有设置函数名，如下面这段函数
    ```js
    (function (){
        var test = 1
        console.log(test)
    })()
    ```
    该函数对象的默认的 `name` 属性值就是 `"anonymous"`，表示该函数对象没有被设置名称。
3. 另外一个隐藏属性是 `code` 属性，其值表示函数代码，以字符串的形式存储在内存中。当执行到一个函数调用语句时，V8 便会从函数对象中取出 `code` 属性值，也就是函数代码，然后再解释执行这段函数代码。


## JavaScript 函数是一等公民（First Class Function）
1. 因为函数是一种特殊的对象，所以在 JavaScript 中，函数可以赋值给一个变量，也可以作为函数的参数，还可以作为函数的返回值。
2. 如果某个编程语言的函数，可以和这个语言的数据类型做一样的事情，我们就把这个语言中的函数称为一等公民。
3. 支持函数是一等公民的语言可以使得代码逻辑更加清晰，代码更加简洁。但是由于函数的可被调用的特性，使得实现函数的可赋值、可传参和可作为返回值等特性变得有一点麻烦。为什么？
4. 当函数内部引用了外部的变量时，使用这个函数进行赋值、传参或作为返回值，你还需要保证这些被引用的外部变量是确定存在的，这就是让函数作为一等公民麻烦的地方，因为虚拟机还需要处理函数引用的外部变量。我们来看一段简单的代码
    ```js
    function foo(){
        var number = 1
        function bar(){
            number++
            console.log(number)
        }
        return bar
    }
    var mybar = foo()
    mybar()
    ```
    如果要返回函数 `bar` 给外部，那么即便 `foo` 函数执行结束了，其内部定义的 `number` 变量也不能被销毁，因为 `bar` 函数依然引用了该变量。
5. 另外基于函数是一等公民，我们可以轻松使用 JavaScript 来实现函数式编程。

    
## References
* [图解 Google V8](https://time.geekbang.org/column/intro/296)
