# Variable & Constant


<!-- TOC -->

- [Variable & Constant](#variable--constant)
    - [Misc](#misc)
    - [声明提前](#声明提前)
    - [解构（Destructuring）赋值](#解构destructuring赋值)
        - [数组式](#数组式)
        - [对象式](#对象式)
        - [使用基本类型结构赋值](#使用基本类型结构赋值)
        - [函数参数式解构赋值](#函数参数式解构赋值)

<!-- /TOC -->


## Misc
* ECMAScript 的变量是松散类型的，即可以用来保存任何形式的数据
* 未经初始化的变量会保存一个特殊的值：`undefined`
* 使用 `var` 重复声明变量不会改变之前变量的值
    ```js
    var n = 3;
    var n;
    console.log(n);  // 3
    ```


## 声明提前
1. 由于使用 `var` 声明变量有声明提前的存在，变量在其作用域的整体内始终是可见的。也就是说变量在它声明之前就已经可用
    ```js
    console.log(a);  // 这里不是报错，而是输出 undefined。声明提前，但初始化不会提前。
    var a = 3;
    ```
2. 声明提前的问题
    ```js
    var tmp = 2233;
    function f(){
        console.log(tmp);
        if (false) {
            var tmp = "hello world";
        }
    }
    f(); // undefined
    ```
    期望是 `2233`，实际上是 `undefined`。因为 `var temp` 会提升到作用域的顶端，而 `var` 不会生成块级作用域，所以会提升到函数作用域的顶端。
3. `let` 声明并不会提前，有时会出现很有趣的错误
    ```js
    let i=2;
    {
        console.log(i); // Uncaught ReferenceError: i is not defined
        let i;
    }
    ```
    如果不在块级作用域中再声明 `i` 则不会报错，`console.log` 中的 `i` 使用外部的 `i`。但在代码块中声明了，则块级作用域中的任何地方的 `i` 都是这个再次声明的这个 `i`。而这个声明不会提前，所以就报错了。


## 解构（Destructuring）赋值
适用于变量和常量

### 数组式
```js
let [a, b, c] = [1, 2, 3];
let [foo, [[bar], baz]] = [1, [[2], 3]];
let [x, , y] = [1, 2, 3];
let [ , b, ] = [1, 2, 3];
let [x, y] = [1, 2, 3];
[x, y] = [y, x];
```

1. 只要数据具有 Iterator 接口，都可以采用数组形式的解构赋值
    ```js
    let [a, b, c] = 'dot';
    console.log(a); // "d"
    console.log(b); // "o"
    console.log(c); // "t"
    ```
2. 解构赋值允许指定默认值。
    ```js
    var [n = 6] = [];
    console.log( n ); // 6
    ```
    如果默认值是函数调用，则只在使用默认值的时候该函数才会真的执行
    ```js
    function f() {
        console.log('使用了默认值');
    }
    let [x = f()] = [1]; // 不会触发函数调用
    let [y = f()] = []; // 会触发函数调用
    ```
3. 使用扩展运算符的解构赋值
    ```js
    const [first, ...rest] = [1, 2, 3, 4, 5];
    console.log( first ); // 1
    console.log( rest ); // [2, 3, 4, 5]
    ```
4. 如果某项无法赋值，则值为 `undefined`
    ```js
    let [a, b] = [22];
    console.log(a); // 22
    console.log(b); // undefined
    ```

### 对象式
```js
{
    let {foo, bar} = { baz: '没有用', foo: 'aaa', bar: 'bbb' };
    console.log(foo); // "aaa"
    console.log(bar); // "bbb"
}

{
    let {foo: baz} = { foo: 'aaa', bar: 'bbb' };
    console.log(baz); // "aaa"
    console.log(foo); // ReferenceError: foo is not defined
}
```

1. 结合上面两个例子，对象式解构赋值的本质是：将值赋给相应属性名的属性值
    ```js
    let { foo: foo, bar: bar } = { foo: "aaa", bar: "bbb" };
    ```
    这里的属性值就是创建的变量，而属性名只是作为索引。所以上面第二个例子中，`foo` 只是作为索引，真正定义的变量是 `baz`。
2. 对象的解构赋值，可以很方便地将现有对象的方法，赋值到某个变量
    ```js
    let { log, sin, cos } = Math;
    ```
3. 数组结构赋值时，赋值给已声明的变量没什么问题。但对象结构赋值时，如果赋值给已声明的变量则会出错
    ```js
    let a;
    [a] = [22]; // 没问题

    let b;
    {b} = {b: 22}; // SyntaxError: Unexpected token =
    ```
    因为 JavaScript 引擎会将 `{b}` 理解成一个代码块，从而发生语法错误。只有不将大括号写在行首，避免 JavaScript 将其解释为代码块，才能解决这个问题
    ```js
    let b;
    ({b} = {b: 22}); // 没问题
    ```
4. 嵌套赋值
    ```js
    let obj = {};
    let arr = [];
    ({ foo: obj.prop, bar: arr[0] } = { foo: 123, bar: true });
    console.log( obj ); // {prop:123}
    console.log( arr ); // [true]
    ```
4. 也可以使用默认值
    ```js
    let {x = 3} = {x: undefined};
    ```
5. 解构赋值允许等号左边的模式之中不放置任何变量名，也允许右边是空对象。但不允许右边是 `null` 或 `undefined`
    ```js
    let {} = {a: 2};
    let {a} = {};
    let {} = {};
    console.log(a); // undefined

    let {b} = null;
    // TypeError: Cannot destructure property `b` of 'undefined' or 'null'.
    ```

#### 解构赋值重命名时使用变量的情况
1. 下面的解构赋值进行了重命名
    ```js
    const obj = {num1: 22, num2: 33};
    const {num1: m, num2: n} = obj; // ok
    ```
2. 但如果对象 `obj` 的属性名不一定是固定的，而是根据一个值动态生成的，比如
    ```js
    const KEY_PREFIX = "num";

    function createObj (keyPrefix) {
        const obj = {};
        obj[keyPrefix+'1'] = 22;
        obj[keyPrefix+'2'] = 33;
        return obj;
    }
    ```
3. 假设 `KEY_PREFIX` 的值是外部生成的，我们不能确定每次这个 `KEY_PREFIX` 具体是什么；或者为了解耦，我们不想直接使用它的字面量。
4. 那我们在结构赋值重命名的时候，就不能确定属性名是什么。可以如下使用动态的属性名
    ```js
    const {[`${KEY_PREFIX}1`]: num1, [`${KEY_PREFIX}1`]: num2} = obj;
    ```
    或者定义成变量再使用
    ```js
    const key1 = `${KEY_PREFIX}1`;
    const key2 = `${KEY_PREFIX}2`;
    const {[key1]: num1, [key2]: num2} = obj;
    ```

### 使用基本类型结构赋值
1. 解构赋值时，如果等号右边是数值和布尔值，则会先转为对象。
    ```js
    let {toFixed: fn1} = 123;
    console.log(fn1); // function toFixed() { [native code] }

    let {toString: fn2} = true;
    console.log(fn2); // function toString() { [native code] }
    ```
    上面的两个例子，数值和布尔值都会转换成其基本包装类型的对象，然后将与左边对应的方法名赋给左边的变量
2. 字符串解构赋值给对象的情况
    ```js
    let {length, 0: a, 1: b, 2: c, 3: d, 4: e} = 'hello';
    console.log(length, a, b, c, d, e); // 5 "h" "e" "l" "l" "o"
    ```

### 函数参数式解构赋值
```js
function foo([x, y]){
    console.log(x + y);
}
foo([2, 3]); // 5

function bar({x, y}){
    console.log(x * y);
}
bar({x:2, y:3}); // 6
```

1. 函数参数式解构也支持默认值
    ```js
    // 注意，这是两种默认值，对量字面量里面是解构赋值的默认值，外面是函数参数默认值
    function move({x = 1, y = 2} = {}){
        console.log(x + y);
    }

    move({x: 3, y: 8}); // 11
    move({x: 3}); // 5
    move({}); // 3
    move(); // 3
    ```
