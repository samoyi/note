# Object

## Misc
### `super` keyword
* 在 class 中的使用方法见`Theories\Languages\JavaScript\KnowledgeStructure\Object-Oriented\ES6Inheritance.md`
* 在对象字面量中，`super`指向对象的原型
    ```js
    const proto = {
        foo: 'hello'
    };

    const obj = {
        foo: 'world',
        find() {
            console.log(super.foo);
        }
    };

    Object.setPrototypeOf(obj, proto);
    obj.find() // "hello"
    ```
* JavaScript 引擎内部，`super.foo`等同于`Object.getPrototypeOf(this).foo`（属性）
或`Object.getPrototypeOf(this).foo.call(this)`（方法）。因此，虽然使用的原型方法，但
`this`还是指向实例
    ```js
    const proto = {
        x: 'hello',
        foo() {
            console.log(this.x);
        },
    };

    const obj = {
        x: 'world',
        foo() {
            super.foo();
        }
    }

    Object.setPrototypeOf(obj, proto);

    obj.foo() // "world"
    ```
* `super`关键字表示原型对象时，只能用在对象的方法之中，用在其他地方都会报错。目前，只有
对象方法的简写法可以让 JavaScript 引擎确认，定义的是对象的方法。   
    ```js
    // 报错
    const obj = {
        foo: super.foo
    }

    // 报错
    const obj = {
        foo: () => super.foo
    }

    // 报错
    const obj = {
        foo: function () {
            return super.foo
        }
    }
    ```

### 属性名
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
### **dot vs []**  
1. When you use the `.` operator to access a property of an object, however, the
name of the property is expressed as an identifier. Identifiers must be
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
    3. 给中括号中传递其他类型的值，都会被转换为字符串
        ```js
        let obj = {};

        let arr = [1, 2, 3];
        obj[arr] = 11;
        obj[null] = 22;
        obj[undefined] = 33;

        console.log(obj['1,2,3']);     // 11
        console.log(obj['null']);      // 22
        console.log(obj['undefined']); // 33
        ```
    4. ES6 支持定义对象时属性名使用表达式，表达式放在中括号内：
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
5. If this method is not overridden in a custom object, `toString()` returns
`"[object type]"`, where `type` is the object type.
    * 常用于类型判断：
    ```js
    let obj = {};
    console.log(obj.toString()); // "[object Object]"

    let arr = [1, 2, 3];
    console.log(Object.prototype.toString.call(arr)); // "[object Array]"
    ```
    * 如果参数是`undefined`，返回`[object Undefined]`；如果参数是`null`，返回
    `[object Null]`；如果是基础类型，会先包装为引用类型。参考[规范](https://www.ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
    ```js
    console.log(Object.prototype.toString.call(new Number(22))); // [object Number]
    console.log(Object.prototype.toString.call(22)); // [object Number]
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
1. 只会拷贝可枚举属性，且会把访问器属性变成数据属性
    ```js
    const source = {};
    Object.defineProperties(source, {
    	foo: {
    		get(){
    			return 22;
    		},
    		enumerable: true,
    	},
    	bar: {
    		get(){
    			return 33;
    		},
    	},
    });

    let target = {};
    Object.assign(target, source);
    console.log(target); // {foo: 22}
    console.log(target.bar); // undefined
    const descriptors = Object.getOwnPropertyDescriptors(target);
    console.log(descriptors.foo); // {value: 22, writable: true, enumerable: true, configurable: true}
    ```
    看起来只是遍历读取属性值然后赋值给 target 对象，而且这个赋值是直接赋值，所以导致了
    那三个`true`。
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
4. 如果`target`不是对象，则会先试图将其转成对象。由于`undefined`和`null`无法转成对象
，所以如果它们作为`target`，就会报错：
    ```js
    let source = { a: 1 };
    console.log( Object.assign(999, source) ); // "Number {a: 1, [[PrimitiveValue]]: 999}"
    console.log( Object.assign(999, source) instanceof Number ); // true
    console.log( Object.assign(null, source) ); // TypeError: Cannot convert undefined or null to object
    ```
5. 当只有一个参数时，即只有`target`：如果该参数是对象，`Object.assign`会直接返回该参数；
如果不是对象，则会试图将其转换为对象再返回。
6. 如果`source`不是对象，则会试图将其转成对象。由于`undefined`和`null`无法转成对象，所
以如果它们作为`source`，与作为`target`的情况不同，它们会被跳过。
7. 虽然基本类型的值作为`source`会被转换为对象，但只有字符串的包装对象才可能有自身可枚举
属性，其他基本类型虽然会被转换为对象，但也没有效果：
    ```js
    let v1 = "abc";
    let v2 = true;
    let v3 = 10;
    let v4 = Symbol("foo")

    let obj = Object.assign({}, v1, null, v2, undefined, v3, v4);
    console.log(obj); // { "0": "a", "1": "b", "2": "c" }
    ```


## 遍历对象
### `for...in`
循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。
```js
let obj = {};
obj.__proto__.protoPro = 'protoPro';

let symbol = Symbol('symbol');
Object.defineProperties(obj, {
	foo: {
		value: 'foo',
		enumerable: true,
	},
	bar: {
		value: 'bar',
	},
	[symbol]: {
		value: 'baz',
		enumerable: true,
	},
});

console.log(obj.foo); // "foo"
console.log(obj.bar); // "bar"
console.log(obj[symbol]); // "baz"

let arr = [];
for(let key in obj){
	arr.push(key);
}
console.log(arr); // ["foo", "protoPro"]
```

### `for...of`不能算是遍历对象的方法
1. 它是一个对可迭代对象进行迭代的方法，不是遍历对象的方法。
2. 首先它就不能遍历平对象。而且即使是可迭代对象，它也只会按照`Symbol.iterator`方法返回
的迭代器中的迭代规则来迭代，而不一定就是迭代对象属性
    ```js
    let arr = ['a', 'b', 'c'];
    arr[3] = 'd';
    arr.foo = 'bar';

    let of_result = [];
    for(let val of arr){
    	of_result.push(val);
    }

    // 数组的迭代规则就是迭代 index 属性，而不是其他任意属性
    console.log(of_result); // ["a", "b", "c", "d"]


    let in_result = [];
    for(let val in arr){
    	in_result.push(val);
    }

    // 而对象的遍历则不受迭代规则的影响
    console.log(in_result); // ["0", "1", "2", "3", "foo"]
    ```

### `Object.keys(obj)`  `Object.values(obj)` `Object.entries(obj)`
1. 返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键或值
或键值对。没有`own`居然也不含继承的！
    ```js
    let obj = {};
    obj.__proto__.protoPro = 'protoPro';

    let symbol = Symbol('baz');
    Object.defineProperties(obj, {
    	foo: {
    		value: 'foo_value',
    		enumerable: true,
    	},
    	qux: {
    		value: 'qux_value',
    		enumerable: true,
    	},
    	bar: {
    		value: 'bar_value',
    	},
    	[symbol]: {
    		value: 'baz_value',
    		enumerable: true,
    	},
    });

    console.log(Object.keys(obj)); // ["foo", "qux"]
    console.log(Object.values(obj)); // ["foo_value", "qux_value"]
    console.log(Object.entries(obj)); // [["foo", "foo_value"], ["qux", "qux_value"]]
    ```
2. 如果参数不是对象，会先将其转为对象。由于数值和布尔值的包装对象，都不会为实例添加非继
承的属性。所以会返回空数组。
    ```js
    console.log(Object.keys('hello')); // ["0", "1", "2", "3", "4"]
    console.log(Object.values('hello')); // ["h", "e", "l", "l", "o"]
    console.log(Object.entries('hello')); // [["0","h"],["1","e"],["2","l"],["3","l"],["4","o"]]
    console.log(Object.keys(123)); // []
    console.log(Object.values(true)); // []
    console.log(Object.entries(false)); // []
    ```
3. `Object.entries`方法的一个用处是，将对象转为真正的 Map 结构
    ```js
    let obj = { foo: 'bar', baz: 'qux' };

    let entries = Object.entries(obj);
    console.log(entries); // [["foo", "bar"], ["baz", "qux"]]

    let map = new Map(entries);
    console.log(map); // {"foo" => "bar", "baz" => "qux"}
    ```

### `Object.getOwnPropertyNames(obj) `
返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）
```js
let obj = {};
obj.__proto__.protoPro = 'protoPro';

let symbol = Symbol('symbol');
Object.defineProperties(obj, {
	foo: {
		value: 'foo',
		enumerable: true,
	},
	bar: {
		value: 'bar',
	},
	[symbol]: {
		value: 'baz',
		enumerable: true,
	},
});

console.log(Object.getOwnPropertyNames(obj)); // ["foo", "bar"]
```

### `Object.getOwnPropertySymbols(obj)`
`Object.getOwnPropertySymbols`返回一个数组，包含对象自身的所有 Symbol 属性。
```js
let obj = {};
obj.__proto__.protoPro = 'protoPro';

let symbol = Symbol('symbol');
Object.defineProperties(obj, {
	foo: {
		value: 'foo',
		enumerable: true,
	},
	bar: {
		value: 'bar',
	},
	[symbol]: {
		value: 'baz',
		enumerable: true,
	},
});

console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(symbol)]
```

### `Reflect.ownKeys(obj)`
`Reflect.ownKeys`返回一个数组，包含对象自身的所有属性，不管是属性名是 Symbol 或字符串，
也不管是否可枚举。
```js
let obj = {};
obj.__proto__.protoPro = 'protoPro';

let symbol = Symbol('symbol');
Object.defineProperties(obj, {
	foo: {
		value: 'foo',
		enumerable: true,
	},
	bar: {
		value: 'bar',
	},
	[symbol]: {
		value: 'baz',
		enumerable: true,
	},
});

console.log(Reflect.ownKeys(obj)); // ["foo", "bar", Symbol(symbol)]
```


## Testing Properties
### `in` operator
It returns `true` if the object has an own property or an inherited property .
```js
let proto = {name: 33},
	obj = Object.create( proto );
obj.age = 22;

console.log("name" in obj);  // true
console.log("age" in obj);  // true
```

### `hasOwnProperty()`
1. It tests whether an object has an own property with the given name.
2. It returns `false` for inherited properties.
3. 可以检测到不可遍历的。

```js
let proto = {name: 33},
	obj = Object.create( proto );
obj.age = 22;

console.log(obj.hasOwnProperty("name"));  // false
console.log(obj.hasOwnProperty("age"));  // true
```

### `propertyIsEnumerable()`
It returns `true` only if the named property is an own property and its
`enumerable` attribute is `true`.
```js
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
