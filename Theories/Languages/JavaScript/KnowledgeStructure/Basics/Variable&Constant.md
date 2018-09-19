# Variable & Constant


一..ECMAScript的变量是松散类型的，即可以用来保存任何形式的数据

二. 使用var时的声明提前（hoisting）
 1. 由于使用var声明变量有声明提前的存在,变量在其作用域的整体内始终是可见的。也就是说变量在它声明之前就已
    经可用。
alert(a);  //这里不是报错，而是弹出undefined。声明提前，但初始化不会提前。
var a = 3;
    下面是另外一个例子
var scope = "global";
function()
{
 console.log(scope); //undefined。下面局部变量的声明覆盖了全局变量。但尚未初始化。
 var scope = "local";
 console.log(scope); //local
}
循环语句中var声明的的同样也提升，因为其中并没有独立的作用域：
console.log( n ); // undefined 而不是报错
for(let i=0; i<3; i++){var n;}
2. 声明提前的问题
var tmp = 2233;
function f()
{
console.log(tmp);
if (false)
    {
var tmp = "hello world";
    }
}
f(); // undefined
期望是2233，实际上是undefined。因为var temp会提升到作用域的顶端。

3. let声明并不会提前，有时会出现很有趣的错误
let i=2;
{
    alert(i); // Uncaught ReferenceError: i is not defined
    let i;
}
如果不在块级作用域中再声明i则不会报错，alert中的i使用外部的i。但在代码块中声明了，则块级作用域中的人和地方的i都是这个再次声明的这个i。而这个声明不会提前，所以就报错了

三.未经初始化的变量会保存一个特殊的值：undefined


四.给未经声明的变量赋值在严格模式下会导致抛出ReferenceError错误。


五.没有声明的全局变量会报错，但没有定义的全局属性不会报错，只会被认为是undefined
    alert(window.a);    //undefined
    alert(a);           //Uncaught ReferenceError: a is not defined;


六.使用var重复声明变量不会改变之前变量的值
var n = 3;
var n;
alert(n);  //3

七. web环境的三种全局变量：
1. 使用var声明的全局变量会作为window的属性，其configurable特性为false，不能通过delete删除
    var name = undefined;
  console.log( name ); // "undefined"
  console.log( typeof name ); // string
    // 这里并不是重新声明一个变量，而是把undefined赋值给了window.name，而该属性必须是字符串，所以变成了这个样子
2.  未使用var或let声明的全局变量也会作为window的属性，但其configurable特性为true，可以通过delete删除
3.  在全局环境中使用let声明的变量不会作为window的属性



ES6的解构（Destructuring）赋值————————————
适用于变量和常量
一. 数组式
let [a, b, c] = [1, 2, 3];
let [foo, [[bar], baz]] = [1, [[2], 3]];
let [x, , y] = [1, 2, 3];
let [x, y] = [1, 2, 3];
[x, y] = [y, x];

2.只要数据具有Iterator接口，都可以采用数组形式的解构赋值 不懂，未入手册
function* fibs()
{
var a = 0;
var b = 1;
while (true)
    {
yield a;
        [a, b] = [b, a + b];
    }
}
var [first, second, third, fourth, fifth, sixth] = fibs();
alert( sixth ); // 5
不懂上面的代码

3. 解构赋值允许指定默认值。
var [ n = 6] = [];
console.log( n ); // 6
如果默认值是函数调用，则只在使用默认值的时候该函数才会真的执行
function f() {
console.log('aaa');//并不会执行
}
let [x = f()] = [1];

关于变量初始化和默认值之间的关系，除了上面用函数调用作为默认值的情况以外，两者似乎比较相似。默认值看起来也好像是，声明一个变量并初始化一个值，如果之后设定了该变量的值则使用设定值，即覆盖了开始时设置的值；如果之后没有设置，也就是没有覆盖刚开始初始化的值，也就是使用了默认值。

4. 使用扩展运算符的解构赋值
const [first, ...rest] = [1, 2, 3, 4, 5];
console.log( first ); // 1
console.log( rest ); // [2, 3, 4, 5]


5. 如果某项无法赋值，则值为undefined


二. 对象式
var { foo, bar } = { baz: '没有用', foo: "aaa", bar: "bbb" };
console.log( baz );//"aaa"
console.log( baz );//"bbb"

var { foo: baz } = { foo: "aaa", bar: "bbb" };
console.log( baz );//"aaa"
console.log( foo );//test.html:18 Uncaught ReferenceError: foo is not defined
1. 结合上面两个例子，对象式解构赋值的本质是
var { foo: foo, bar: bar } = { foo: "aaa", bar: "bbb" };
将值赋给相应属性名的属性值，这里的属性值就是创建的变量，而属性名只是作为索引。所以上面第二个例子属性名是未定义的。
2. 对象的解构赋值，可以很方便地将现有对象的方法，赋值到某个变量。
let { log, sin, cos } = Math;

2.嵌套赋值
let obj = {};
let arr = [];
({ foo: obj.prop, bar: arr[0] } = { foo: 123, bar: true });//不加括号会报错
console.log( obj );// {prop:123}
console.log( arr );// [true]

3. 也可以使用默认值
var {x = 3} = {x: undefined};

4. 解构赋值允许等号左边的模式之中不放置任何变量名，也允许右边是空对象。但不允许右边是null或者undefined


三. 字符串式
const [a, b, c, d, e] = 'hello';
let {length : len} = 'hello';
console.log( len ); //5。看起来这里讲字符串字面量转换成了包装类型对象形式


四. 数值和布尔值式解构赋值
解构赋值时，如果等号右边是数值和布尔值，则会先转为对象。
let {toFixed: fn1} = 123;
console.log( fn1 );// function toFixed() { [native code] }

let {toString: fn2} = true;
console.log( fn2 );// function toString() { [native code] }
上面的两个例子，数值和布尔值都会转换成其基本包装类型的对象，然后将与左边对应的方法名赋给左边的变量


五. 函数参数式解构赋值
function add([x, y])
{
console.log(x + y);
}
let arr = [6, 4];
add(arr); // 10
参数中的数组在函数内部被解构为两个变量

1. 函数参数式解构也支持默认值
function move({x = 0, y = 0} = {} )
{
console.log( [x, y] );
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move( ); // [0, 0]

六. 圆括号问题
对于编译器来说，一个式子到底是模式，还是表达式，没有办法从一开始就知道，必须解析到（或解析不到）等号才能知道。

由此带来的问题是，如果模式中出现圆括号怎么处理。ES6的规则是，只要有可能导致解构的歧义，就不得使用圆括号。

建议只要有可能，就不要在模式中放置圆括号。

1. 不能使用圆括号的情况

以下三种解构赋值不得使用圆括号。

（1）变量声明语句中，不能带有圆括号。
var [(a)] = [1];

var {x: (c)} = {};

var ({x: c}) = {};

var {(x: c)} = {};

var {(x): c} = {};}

var { o: ({ p: p }) } = { o: { p: 2 } };

上面三个语句都会报错，因为它们都是变量声明语句，模式不能使用圆括号。

（2）函数参数中，模式不能带有圆括号。

函数参数也属于变量声明，因此不能带有圆括号。

function f([(z)]) { return z; }
// 报错
（3）赋值语句中，不能将整个模式，或嵌套模式中的一层，放在圆括号之中。

({ p: a }) = { p: 42 };

([a]) = [5];

上面代码将整个模式放在圆括号之中，导致报错。

[({ p: a }), { x: c }] = [{}, {}];

上面代码将嵌套模式的一层，放在圆括号之中，导致报错。

2. 可以使用圆括号的情况

可以使用圆括号的情况只有一种：赋值语句的非模式部分，可以使用圆括号。

[(b)] = [3];
({ p: (d) } = {});
[(parseInt.prop)] = [3];
上面三行语句都可以正确执行，因为首先它们都是赋值语句，而不是声明语句；其次它们的圆括号都不属于模式的一部分。第一行语句中，模式是取数组的第一个成员，跟圆括号无关；第二行语句中，模式是p，而不是d；第三行语句与第一行语句的性质一致。


七. 用途
不懂  之后再来看

Note however, that swapping variables with destructuring assignment causes significant performance loss, as of October 2017.
