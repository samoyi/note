# Object

## Misc
* An object is an unordered collection of properties, each of which has a name
and a value. Property names are strings, so we can say that objects map strings
to values.
    * 属性名甚至可以是空字符串（空字符串也是字符串，所以这很合理）
    ```js
    var obj ={
     "": 17
    };
    alert(obj[""]); // 17
    ```
    * If you use any other value besides a `string` as the property, it will
    first be converted to a string. This even includes numbers, which are
    commonly used as array indexes, so be careful not to confuse the use of
    numbers between objects and arrays.
    ```js
    let myObject = {};

    myObject[true] = "foo";
    myObject[3] = "bar";
    myObject[myObject] = "baz";

    console.log( myObject["true"] );				// "foo"
    console.log( myObject["3"] );					// "bar"
    console.log( myObject["[object Object]"] );	    // "baz"
    ```
    * If using square brackets, the value within the brackets must be an
    expression that evaluates to a string or a value that can be converted to a
    string
    ```js
    var obj = {},
        name = null;

    obj[name] = "li";

    console.log(obj); // {null: "li"}
    ```
* **dot vs []**  
    1. When you use the `.` operator to access a property of an object, however,
     the name of the property is expressed as an identifier. Identifiers must be
      typed literally into your JavaScript program; they are not a datatype, so
     they cannot be manipulated by the program. On the other hand, when you
     access a property of an object with the `[]` array notation, the name of
     the property is expressed as a string. Strings are JavaScript datatypes, so
      they can be manipulated and created while a program is running.
    ```js
    let obj = {
      name: '33',
    };

    let key = 'name';

    console.log(obj[key]); // 33
    console.log(obj.name); // 33
    console.log(obj.key);  // undefined
    ```
    2. 如果给中括号中的属性名传递一个数字，则它会被转化为字符串，即这种写法也是正确的：
     ```js
     obj[2] = 666;
     ```
    正是因为这个原因以及数组是特殊的对象，所以数组通常也是用这种方法。而且正如对象中的
    写法一样，数组也可以将中括号中的项数写为字符串的形式：
    ```js
    arr["2"] = 666;
    ```
    3. ES6 支持定义对象时属性名使用表达式，表达式放在中括号内：
    ```js
    let str1 = 'na';
    let str2 = 'me';

    let obj = {
        prop:               'not name',
        [str1 + str2]:      33,
        ['a' + 'g' + 'e']:  22,
    }

    console.log(obj.prop);  // not name
    console.log(obj.name);  // 33
    console.log(obj.age);   // 22
    ```
* **reserved word as property identifier**  
    In ECMAScript 3, the identifier that follows the dot operator cannot be a
    reserved word: you cannot write `o.for` or `o.class`, for example, because
    for is a language keyword and class is reserved for future use. If an object
     has properties whose name is a reserved word, you must use square bracket
    notation to access them: `o["for"]` and `o["class"]`. ECMAScript 5 relaxes
    this restriction (as do some implementations of ECMAScript 3) and allows
    reserved words to follow the dot.
* 除非必须使用变量来访问属性，否则建议使用点表示法。


## 创建
创建Object实例的方式有三种：

### 第一种 构造函数
```js
new Object([value])
```
The `Object` constructor creates an object wrapper for the given value. If the
value is `null` or `undefined`, it will create and return an empty object,
otherwise, it will return an object of a type that corresponds to the given
value. If the value is an object already, it will return the value.

### 第二种 对象字面量語法  
1. An object literal is an expression that creates and initializes a new and
distinct object each time it is evaluated. The value of each property is
evaluated each time the literal is evaluated. This means that a single object
literal can create many new objects if it appears within the body of a loop in a
 function that is called repeatedly, and that the property values of these
objects may differ from each other.
2. 数值属性名会自动转换为字符串
3. 在通过对象字面量定义对象时，实际上不会调用 `Object` 构造函数。
4. ES6 允许直接使用变量和函数创建对象，变量名为属性名，变量值为属性值
    ```js
    var birth = '2000/01/01';
    var Person = {
      name: '张三',
      //等同于birth: birth
      birth,
      // 等同于hello: function ()...
      hello() { console.log('我的名字是', this.name); }
    };
    ```
    这有一个问题，就是对象的属性值和外部的变量值相同，后面的会覆盖前面的。

### 第三种 `Object.create()`
1. Using its first argument as the prototype of that object.
2. `Object.create()` also takes an optional second argument that describes the
properties of the new object.  
```js
let proto = {
    name: '33',
    age: 22,
};

let obj = Object.create(proto, {
    sex: {
        value: "female",
        writable: true,
        configurable: true,
        enumerable: true,
    },
});
```
3. You can pass `null` to create a new object that does not have a prototype,
but if you do this, the newly created object will not inherit anything, not even
 basic methods like `toString()`:
```js
let obj = Object.create(null);
console.log(obj + '2233'); // TypeError: Cannot convert object to primitive value
```
4. If you want to create an ordinary empty object (like the object returned by
    `{}` or `new Object()`), pass `Object.prototype`.
5. A TypeError exception if the proto parameter isn't `null` or an object。
6. 可以通过任意原型创建新对象，也就是说，可以使任意对象可继承。
7. 该方法第二个可选参数中设置的属性会覆盖原型对象上的同名属性。


## 原型方法
### `valueOf()`
1. Returns the primitive value of the specified object. If an object has no
primitive value, `valueOf` returns the object itself.
2. You rarely need to invoke the `valueOf` method yourself; JavaScript
automatically invokes it when encountering an object where a primitive value is
expected.
3. By default, the `valueOf` method is inherited by every object descended from
`Object`. Every built-in core object overrides this method to return an
appropriate value.
4. 看起来除了针对包装类型对象，其他对象都是原样返回
```js
let obj = {x:3, y:5};
console.log(obj.valueOf() === obj); // true

let arr = [1, 2, 3];
console.log(arr.valueOf() === arr); // true

function fn(){return;}
console.log(fn.valueOf() === fn); // true

let re = /\d+/g;
console.log(re.valueOf() === re); // true

let date = new Date();
console.log(date.valueOf()); // 1474267248866
console.log(typeof date.valueOf()); // "number"

let str = new String('hello');
console.log(str.valueOf()); // "hello"
console.log(typeof str.valueOf()); // "string"
```

### `toString()`
1. The `toString()` method returns a string representing the object.
2. Every object has a `toString()` method that is automatically called when the
object is to be represented as a text value or when an object is referred to in
a manner in which a string is expected.
3. By default, the `toString()` method is inherited by every object descended
from `Object`.
4. 不过其他对象类型都会重写自己的`toString()`方法：
```js
let arr = [1, 2, 3];
console.log(arr.toString()); // “1,2,3”
```
5. If this method is not overridden in a custom object, `toString()`
 returns `"[object type]"`, where `type` is the object type. 常用语类型判断：
    ```js
    let obj = {};
    console.log(obj.toString()); // "[object Object]"

    let arr = [1, 2, 3];
    console.log(Object.prototype.toString.call(arr)); // "[object Array]"
    ```


## 属性和方法
### `Object.is`
1. 判断两个值是否相等
2. 使用 `===` 的问题是，`NaN` 不等于` NaN` 本身，以及 `0` 等于 `-0`
    ```js
    console.log( Object.is(3/"a", NaN) ); // true
    console.log( Object.is(0, +0) ); // true
    console.log( Object.is(0, -0) ); // false
    ```
3. ES6 提出 “Same-value equality”（同值相等）算法，用来解决这个问题。`Object.is` 就
是部署这个算法的新方法。

### `Object.assign(target, ...sources)`
1. Copy(Shallow-clone) the values of all enumerable own properties from one or
more source objects to a target object.
    ```js
    var obj = Object.create({foo: 1}, { // foo 是个继承属性。
        bar: {
            value: 2  // bar 是个不可枚举属性。
        },
        baz: {
            value: 3,
            enumerable: true  // baz 是个自身可枚举属性。
        }
    });

    var copy = Object.assign({}, obj);
    console.log(copy); // { baz: 3 }
    ```
2. 调用该方法会直接改变目标对象，并且返回目标对象
    ```js
    let target = {
        name: '33',
        age: 33,
    };

    let source1 = {
        age: 22,
    };
    let source2 = {
        sex: 'female',
    };

    Object.assign(target, source1, source2); // 因为会直接改变目标对象，所以也可以不读取返回值

    console.log(target);
    ```
3. It uses `[[Get]]` on the source and `[[Set]]` on the target, so it will
invoke getters and setters. 后面这一段不懂，Therefore it assigns properties
versus just copying or defining new properties. This may make it unsuitable for
merging new properties into a prototype if the merge sources contain getters.
For copying property definitions, including their enumerability, into prototypes
`Object.getOwnPropertyDescriptor()` and `Object.defineProperty()` should be used
 instead.
    ```js
    // Note that `Object.assign()` triggers `setters` whereas spread syntax doesn't.
    let obj1 = {};
    let obj2 = {};

    Object.defineProperties(obj1, {
        name: {
            get(){
                return '33';
            },
            enumerable: true,
        },
        age: {
            get(){
                return 33;
            },
            enumerable: true,
        },
    });
    Object.defineProperties(obj2, {
        name: {
            get(){
                return '33';
            },
            enumerable: true,
        },
        age: {
            get(){
                return 22;
            },
            enumerable: true,
        },
        sex: {
            get(){
                return 'female';
            },
            enumerable: true,
        },
    });

    let obj = {...obj1, ...obj2};
    console.log(obj); // {name: "33", age: 22, sex: "female"}

    obj = Object.assign(obj1, obj2); // TypeError: Cannot set property name of #<Object> which has only a getter
    ```
4. 如果 `target` 不是对象，则会先试图将其转成对象。由于 `undefined` 和 `null` 无法转成对象
    ，所以如果它们作为 `target`，就会报错：
    ```js
    let source = { a: 1 };
    console.log( Object.assign(999, source) ); // "Number {a: 1, [[PrimitiveValue]]: 999}"
    console.log( Object.assign(999, source) instanceof Number ); // true
    console.log( Object.assign(null, source) ); // TypeError: Cannot convert undefined or null to object
    ```
5. 当只有一个参数时，即只有 `target`：如果该参数是对象，`Object.assign` 会直接返回该参数；
如果不是对象，则会试图将其转换为对象再返回。
6. 如果 `source` 不是对象，则会试图将其转成对象。由于 `undefined` 和 `null` 无法转成对象，
所以如果它们作为 `source`，与作为 `target` 的情况不同，它们会被跳过。
7. 虽然基本类型的值作为 `source` 会被转换为对象，但只有字符串的包装对象才可能有自身可枚举属
性，其他基本类型虽然会被转换为对象，但也没有效果：
    ```js
    let v1 = "abc";
    let v2 = true;
    let v3 = 10;
    let v4 = Symbol("foo")

    let obj = Object.assign({}, v1, null, v2, undefined, v3, v4);
    console.log(obj); // { "0": "a", "1": "b", "2": "c" }
    ```

### 四 . ES6可以使用变量和表达式来命名属性和方法
    let propKey = 'foo';
    function bar() {
        return '22';
    }

    let obj = {
        [propKey]: true,
        ['a' + 'bc']: 123,
        ['h'+'ello']() { return 'hi';},
        [bar()]: 33
    };

    console.log(obj.foo); // true
    console.log(obj.abc); // 123
    console.log(obj.hello()); // hi
    console.log(obj['22']); // 33

该方法不能和直接使用变量来创建对象的方法混合使用
// 报错
var foo = 'bar';
var bar = 'abc';
var baz = { [foo] };

// 正确
var foo = 'bar';
var baz = { [foo]: 'abc'};



## 遍历对象

**ES6一共有5种方法可以遍历对象的属性。**

一. ```for...in```
for...in循环遍历对象自身的和继承的可枚举属性（不含Symbol属性）。

二. ```Object.keys(obj)```
Object.keys返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含Symbol属性）。

三. ```Object.getOwnPropertyNames(obj) ```
Object.getOwnPropertyNames返回一个数组，包含对象自身的所有属性（不含Symbol属性，但是包括不可枚举属性）。

四. ES6 ```Object.getOwnPropertySymbols(obj)```
Object.getOwnPropertySymbols返回一个数组，包含对象自身的所有Symbol属性。

五. ES6 ```Reflect.ownKeys(obj)```
Reflect.ownKeys返回一个数组，包含对象自身的所有属性，不管是属性名是Symbol或字符串，也不管是否可枚举。

以上的5种方法遍历对象的属性，都遵守同样的属性遍历的次序规则：
首先遍历所有属性名为数值的属性，按照数字排序。
其次遍历所有属性名为字符串的属性，按照生成时间排序。
最后遍历所有属性名为Symbol值的属性，按照生成时间排序。


**ES7的两种遍历提案**

六. ```Object.values(obj) ```
1. 返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的值。
2. Object.values会过滤属性名为Symbol值的属性。
3. 如果Object.values方法的参数是一个字符串，会返回各个字符组成的一个数组。
4. 如果参数不是对象，Object.values会先将其转为对象。由于数值和布尔值的包装对象，都不会为实例添加非继承的属性。所以，Object.values会返回空数组。


七. ```Object.entries(obj) ```
1. 返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值对数组。
2. 如果原对象的属性名是一个Symbol值，该属性会被省略
3. Object.entries方法的一个用处是，将对象转为真正的Map结构
```
var obj = { foo: 'bar', baz: 42 };
var map = new Map(Object.entries(obj));
map // Map { foo: "bar", baz: 42 }
```




## ES7 对象的扩展运算符
==不懂 没看==



## Testing Properties
* 方法一：```in``` operator, it returns true if the object has an own property or an inherited property .
```
let proto = {name: 33},
	obj = Object.create( proto );
obj.age = 22;

console.log("name" in obj);  // true
console.log("age" in obj);  // true
```
* 方法二：```hasOwnProperty()```
It tests whether an object has an own property with the given name. It returns false for inherited properties
```
let proto = {name: 33},
	obj = Object.create( proto );
obj.age = 22;

console.log(obj.hasOwnProperty("name"));  // false
console.log(obj.hasOwnProperty("age"));  // true
```
* 方法三：```propertyIsEnumerable()```
It returns true only if the named property is an own property and its enumerable attribute is true.
```
let proto = {name: 33},
	obj = Object.create( proto );
obj.age = 22;
Object.defineProperty(obj, "sex", {
	configurable: false,
	value: "female"
});

console.log(obj.propertyIsEnumerable("name"));  // false
console.log(obj.propertyIsEnumerable("sex"));  // false
console.log(obj.propertyIsEnumerable("age"));  // true
```
