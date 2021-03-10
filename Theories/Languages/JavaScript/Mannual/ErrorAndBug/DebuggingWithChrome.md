# Debug with Chrome


<!-- TOC -->

- [Debug with Chrome](#debug-with-chrome)
    - [`debugger`](#debugger)
    - [`console`](#console)
        - [`console` 很可能会异步输出](#console-很可能会异步输出)
        - [`printf`-like and output style](#printf-like-and-output-style)
        - [`console.assert(assertion, ...data)`](#consoleassertassertion-data)
        - [`console.clear()`](#consoleclear)
        - [`console.count(label)` 输出执行到该行的次数](#consolecountlabel-输出执行到该行的次数)
        - [`console.dir(object)`](#consoledirobject)
        - [`console.dirxml()`](#consoledirxml)
        - [`console.error()` `console.warn()`](#consoleerror-consolewarn)
        - [`console.group()` `console.groupCollapsed()` `console.groupEnd()`](#consolegroup-consolegroupcollapsed-consolegroupend)
        - [`console.info()` `console.log()`](#consoleinfo-consolelog)
        - [`console.profile()` `console.profileEnd()`](#consoleprofile-consoleprofileend)
        - [`console.table(data [, columns]);`](#consoletabledata--columns)
        - [`console.time(label)` `console.timeEnd(label)`](#consoletimelabel-consoletimeendlabel)
        - [`console.timeStamp()`](#consoletimestamp)
        - [`console.trace()`](#consoletrace)

<!-- /TOC -->


## `debugger`
You can also wrap it in conditional
```js
let i = 0;
if(i){ debugger; }
console.log(i++);  //0
if(i){ debugger; } // break here
console.log(i++);
```


## `console`
### `console` 很可能会异步输出
1. 并没有什么规范或一组需求指定 `console.*` 方法族如何工作——它们并不是 JavaScript 正式的一部分，而是由宿主环境添加到 JavaScript 中的。
2. 不同的浏览器和 JavaScript 环境可以按照自己的意愿来实现，有时候这会引起混淆。尤其要提出的是，在某些条件下，某些浏览器的 `console` 方法并不会把传入的内容立即输出
    ```js
    let o = {name: 33};
    console.log(o.name);
    console.log(o);
    o.name = 22;
    ```
    ![console](console.png)  
3. 出现这种情况的主要原因是，在许多程序（不只是 JavaScript）中，I/O 是非常低速的阻塞部分。所以，从页面 /UI 的角度来说，浏览器在后台异步处理控制台 I/O 能够提高性能。
4. 到底什么时候控制台 I/O 会延迟，甚至是否能够被观察到，这都是游移不定的。
5. 如果遇到这种少见的情况，最好的选择是在 JavaScript 调试器中使用断点，而不要依赖控制台输出。次优的方案是把对象序列化到一个字符串中，以强制执行一次 “快照”，比如通过 `JSON.stringify(..)`
    ```js
    let o = {name: 33};
    console.log(JSON.stringify(o)); // {"name":33}
    o.name = 22;
    ```


### `printf`-like and output style
https://getfirebug.com/wiki/index.php/Console.log
```js
let obj = {
    name: "33",
    age: 22
};
console.log("%c%s%o","color: red; background: yellow; font-size: 24px; font-weight: bold;", "对象引用：", obj);
```

### `console.assert(assertion, ...data)`
1. Writes an error message to the console if the assertion is false. If the assertion is true, nothing happens.
2. 有对象语法和格式字符串语法两种形式。
3. 对象语法效果如下
    ```js
    const errorMsg = 'the # is not even';
    for (let number = 2; number <= 5; number++) {
        console.assert(number % 2 === 0, {number, errorMsg});
    }
    // Assertion failed: {number: 3, errorMsg: "the # is not even"}
    // Assertion failed: {number: 5, errorMsg: "the # is not even"}
    ```
4. 格式字符串使用方法如下
    ```js
    const errorMsg = 'the # is not even';
    for (let number = 2; number <= 5; number++) {
        console.assert(number % 2 === 0, "%s: %d", errorMsg, number);
    }
    // Assertion failed: the # is not even: 3
    // Assertion failed: the # is not even: 5
    ```

### `console.clear()`
Clears the console.

### `console.count(label)` 输出执行到该行的次数
1. Logs the number of times that this particular call to `count()` has been called.
2. If `label` is supplied, this function logs the number of times `count()` has been called with that particular label. If `label` is omitted, the function logs the number of times `count()` has been called at this particular line.
```js
for(let i=0; i<5; i++){
    console.count('times');
}
// times: 1
// times: 2
// times: 3
// times: 4
// times: 5
```

### `console.dir(object)`
Displays an interactive list of the properties of the specified JavaScript object. The output is presented as a hierarchical listing with disclosure triangles that let you see the contents of child objects.

### `console.dirxml()`
Displays an interactive tree of the descendant elements of the specified XML/HTML element. If it is not possible to display as an element the JavaScript Object view is shown instead. The output is presented as a hierarchical listing
of expandable nodes that let you see the contents of child nodes.

### `console.error()` `console.warn()`
```js
function foo(){
    console.error("error");
    console.warn("warn");
}
function bar(){
    foo();
}
bar();
```

### `console.group()` `console.groupCollapsed()` `console.groupEnd()`

### `console.info()` `console.log()`

### `console.profile()` `console.profileEnd()`
Did not find any use

### `console.table(data [, columns]);`
```js
{
    let obj = {
        name: '33',
        age:22,
        info: {
            a: 'aaa',
            b: 'bbb',
        },
    };
    console.table(obj);
}

{
    function Person(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    var john = new Person("John", "Smith");
    var jane = new Person("Jane", "Doe");
    var emily = new Person("Emily", "Jones");

    console.table([john, jane, emily], ["firstName"]);
}

{
    let arr = [
        [1, 11, 111], [2, 22, 222], [3, 33, 333]
    ];
    console.table(arr)
    console.table(arr, [1])
}
```

### `console.time(label)` `console.timeEnd(label)`

### `console.timeStamp()`
Did not find any use

### `console.trace()`
Outputs a stack trace to the Web Console.
