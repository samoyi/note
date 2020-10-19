# JSON


<!-- TOC -->

- [JSON](#json)
    - [1. 语法](#1-语法)
        - [1.1 基本类型值值](#11-基本类型值值)
        - [1.2 Plain object literal notation](#12-plain-object-literal-notation)
        - [1.3 Array literal notation](#13-array-literal-notation)
    - [2. `JSON` 对象](#2-json-对象)
        - [2.1 `JSON.stringify()`](#21-jsonstringify)
            - [2.1.1 para `replacer`](#211-para-replacer)
            - [2.1.2 para `space`](#212-para-space)
            - [2.1.3 `toJSON()` method](#213-tojson-method)
        - [2.2 `JSON.parse()`](#22-jsonparse)

<!-- /TOC -->


## 1. 语法
JSON 的语法可以表示以下三种类型的值：

### 1.1 基本类型值值
* `String`、`Number`、`Boolean` 和 `Null` 四种基本类型。
* JSON 字符串必须使用双引号

### 1.2 Plain object literal notation
* key 必须加双引号
* 键值对最后一项之后不能加多余的逗号

### 1.3 Array literal notation
* 最后一项之后不能加多余的逗号


## 2. `JSON` 对象
1. `JSON` 对象有两个方法：`stringify()` 和 `parse()`。
2. 在最简单的情况下，这两个方法分别用于把 JavaScript 值序列化为 JSON 字符串和把 JSON 字符串解析为原生 JavaScript 值。
3. 但并不是所有情况下 `JSON.stringify()` 的返回值都是字符串。

### 2.1 `JSON.stringify()`
```js
JSON.stringify(value[, replacer[, space]])
```

1. 默认情况下，该方法返回的 JSON 字符串不包含任何的空白和缩进。
2. 包装类型对象会被转化为基础类型值的字符串。注意因为 JSON 字符串是带双引号的，所以字符串字面量或包装类型经过转化后的字符串都会带上双引号
    ```js
    let num = new Number(2233);
    let str = new String('hi');
    let bool = new Boolean(true);

    console.log( JSON.stringify(num) ); // 2233
    console.log( typeof JSON.stringify(num) ); // string

    console.log( JSON.stringify(str) ); // "hi"
    console.log( JSON.stringify('hi') ); // "hi"
    console.log( JSON.stringify(str) === 'hi' ); // false
    console.log( JSON.stringify('hi') === 'hi' ); // false
    console.log( JSON.stringify(str) === '"hi"' ); // true
    console.log( JSON.stringify('hi') === '"hi"' ); // true

    console.log( JSON.stringify(bool) ); // true
    console.log( typeof JSON.stringify(bool) ); // string
    ```
3. `Undefined`、`NaN`、`Function` 和 `Symbol` 类型在转化时，分为以下情况：
    * 如果它们在对象中，在返回的 JSON 对象字符串中，这些值会被忽略
    * 如果它们在数组中，在返回的 JSON 数组中字符串，这些值被转换为字符串 `null`
    * 如果被单独转换，会被转化为 `undefined`。注意不是字符串
4. `NaN` 在上述三种情况中的任何一种，都会被转换为字符串 `null`

```js
const a = undefined;
const b = ()=>{};
const c = Symbol();
const d = NaN;

let obj = {a, b, c, d,};
console.log(JSON.stringify(obj)); // {"d":null}
console.log(typeof JSON.stringify(obj)); // string

let arr = [a, b, c, d,];
console.log(JSON.stringify(arr)); // [null,null,null,null]
console.log(typeof JSON.stringify(arr)); // string

console.log(JSON.stringify(a)); // undefined
console.log(JSON.stringify(b)); // undefined
console.log(JSON.stringify(c)); // undefined
console.log(JSON.stringify(d)); // null
console.log(typeof JSON.stringify(a)); // undefined
console.log(typeof JSON.stringify(b)); // undefined
console.log(typeof JSON.stringify(c)); // undefined
console.log(typeof JSON.stringify(d)); // string
```

5. `Symbol` 键的属性会被忽略
    ```js
    let obj = {
    	age: 22,
    	[Symbol('sym')]: 33,
    };

    console.log(JSON.stringify(obj)); // {"age":22}
    ```
6. `Node` 的情况，`document` 会被转换为有内容的 JSON 对象字符串，而 `body` 及子节点会被转换为 `{}` 字符串
    ```js
    console.log(JSON.stringify(document, null, 4));
    // {
    //     "location": {
    //         "href": "file:///D:/WWW/test/test.html",
    //         "ancestorOrigins": {},
    //         "origin": "file://",
    //         "protocol": "file:",
    //         "host": "",
    //         "hostname": "",
    //         "port": "",
    //         "pathname": "/D:/WWW/test/test.html",
    //         "search": "",
    //         "hash": ""
    //     }
    // }
    console.log(JSON.stringify(document.body)); // {}
    console.log(JSON.stringify(document.querySelector('div'))); // {}
    ```
6. 不可枚举属性将被忽略
    ```js
    let obj = {
    	name: '33',
    };
    Object.defineProperty(obj, 'foo', {});
    console.log(JSON.stringify(obj)); // {"name":"33"}
    ```
7. 循环引用对象将导致错误
    ```js
    let foo = {};
    let bar = {	name: foo, };
    foo.name = bar;
    JSON.stringify( bar ); // TypeError: Converting circular structure to JSON
    ```


#### 2.1.1 para `replacer`
1. If this argument is an array, then `JSON.stringify()` will include only object properties that are listed in the array.
    ```js
    let obj = {
        name: 33,
        age: 22,
        iq: 9
    }
    let sJSON = JSON.stringify(obj, ['name', 'age']);
    console.log( sJSON ); // {"name":33,"age":22}
    ```
2. If `replacer` is a function, it will be called once for the object itself, and then recursively for every property in the object
    ```js
    let obj = {
    	age: 22,
    	name: "33",
    	bwh: ['?', '??', '???']
    };

    JSON.stringify( obj, function(key,val){
        console.log(key + ': ' + val);
    	if(true) return val;
    } );

    // output:
    /*
        : [object Object]
        age: 22
        name: 33
        bwh: ?,??,???
        0: ?
        1: ??
        2: ???
    */
    ```
3. If this argument is a function, every propety in the object will be set to the return value before stringification.
    ```js
    let obj = {
        name: 33,
        age: 22,
        sex: '♀',
        iq: 9
    };
    let sJSON = JSON.stringify(obj, (key, value)=>{
        switch( key ){
            case 'age': {
                return value - 2;
            }
            case 'iq': {
                return value + 99;
            }
            case 'sex': {
                return undefined;
            }
            default: {
                return value;
            }
        }

    });
    console.log( sJSON ); // {"name":33,"age":20,"iq":108}
    ```
    something weird when using this function
    ```js
    let obj = {
        name: 33,
        age: 22,
        sex: '♀',
        iq: 9
    };
    let sJSON = JSON.stringify(obj, (key, value)=>{
        console.log( 'key= ' + key );
        return value;
    });
    ```
    the log is
    ```
    key=
    key= name
    key= age
    key= sex
    key= iq
    ```

In addition, if the function return a same value(not the parameter `value`), result of stringification will only be the value
```js
let obj = {
    name: 33,
    age: 22,
    sex: '♀',
    iq: 9
};
let sJSON = JSON.stringify(obj, (key, value)=>{
    console.log( 'key= ' + key );
    return 2233;
});
console.log( sJSON );
```
the log is
```
key=
2233
```
Another example:
```js
let obj = {
    name: 33,
    age: 22,
    sex: '♀',
    iq: 9
};
let sJSON = JSON.stringify(obj, (key, value)=>{
    console.log( 'key= ' + key );
    if( Math.random()>0.5 ){
        return 2222;
    }
    else{
        return 3333;
    }
});
console.log( sJSON );
```
the log is
```js
key=
3333
```


#### 2.1.2 para `space`
* If this argument is a number, it represents the number of spaces to indent
* If this argument is a string, then the string is used as the indentation character
* The maximum indentation is 10 spaces or any other characters.


#### 2.1.3 `toJSON()` method
1. Any object can custom own stringification result by `toJSON()` method
2. When an object is passed into `JSON.stringify()`, the following steps are taken:
    1. Call the `toJSON()` method if it’s available to retrieve the actual value. Use the default serialization otherwise.
    2. If the second argument is provided, apply the filter. The value that is passed into a filter function will be the value returned from step 1.
    3. Each value from step 2 is serialized appropriately.
    4. If the third argument is provided, format appropriately
3. If `JSON.stringify()` use `replacer` parameter as a function with "weird mode"(described above), `toJSON()` return value will be modified.
    ```js
    let obj = {
        name: 33,
        age: 22,
        sex: '♀',
        iq: 9,
        toJSON(){
            return this.sex;
        },
    };
    console.log( JSON.stringify(obj, ['name']) ); // "♀"
    console.log( JSON.stringify(obj, function(key, value){
        if( key === "age" ){
            return value - 2;
        }
        else if( key === 'iq' ){
            return value + 100;
        }
        return value;
    }) );  // "♀"
    console.log( JSON.stringify(obj, function(key, value){
        return value + 'abc';
    }) );  // "♀abc"
    console.log( JSON.stringify(obj, function(key, value){
        return 'abc';
    }) );  // "abc"
    ```
4. It's a very common misconception that `toJSON()` should return a JSON stringification representation. That's probably incorrect, unless you're wanting to actually stringify the string itself (usually not!). `toJSON()` should return the actual regular value (of whatever type) that's appropriate, and `JSON.stringify(..)` itself will handle the stringification.
5. In other words, `toJSON()` should be interpreted as "to a JSON-safe value suitable for stringification," not "to a JSON string" as many developers mistakenly assume.


### 2.2 `JSON.parse()`
```
JSON.parse(text[, reviver])
```
1. A JSON string can be passed directly into `JSON.parse()` and it creates an appropriate JavaScript value.
2. The `reviver` function receives two arguments, the key and the value, and needs to return a value. This prescribes how the value originally produced by parsing is transformed, before being returned.
3. If the reviver function returns undefined, then the key is removed from the result.
