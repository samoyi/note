# Map


<!-- TOC -->

- [Map](#map)
    - [设计思想](#设计思想)
    - [1. 构造](#1-构造)
    - [2. 实例属性](#2-实例属性)
        - [`size`](#size)
    - [3. 实例方法](#3-实例方法)
        - [3.1 `clear()`](#31-clear)
        - [3.21 `delete(key)`](#321-deletekey)
        - [3.3 `has(key)`](#33-haskey)
        - [3.4 `get(key)`](#34-getkey)
        - [3.5 `set(key, value)`](#35-setkey-value)
    - [4. 示例](#4-示例)
    - [5. 遍历](#5-遍历)
    - [6. 与其他数据结构的互相转换](#6-与其他数据结构的互相转换)
        - [6.1 Map 转为数组](#61-map-转为数组)
        - [6.2 数组转为 Map](#62-数组转为-map)
        - [6.3 Map 转为对象](#63-map-转为对象)
        - [6.4 对象转为 Map](#64-对象转为-map)
        - [6.5 Map 转为 JSON](#65-map-转为-json)
            - [6.5.1 如果 Map 的键名都是字符串](#651-如果-map-的键名都是字符串)
            - [6.5.2 如果 Map 的键名有非字符串，这时可以选择转为数组 JSON](#652-如果-map-的键名有非字符串这时可以选择转为数组-json)
        - [6.6 JSON 转为 Map](#66-json-转为-map)
            - [6.6.1 对象型 JSON](#661-对象型-json)
            - [6.6.2 数组型 JSON](#662-数组型-json)
    - [7. `WeakMap`](#7-weakmap)
    - [8. Object vs Map](#8-object-vs-map)
        - [8.1 语义](#81-语义)
        - [8.2 Object 实现映射相比于 Map 相比相比的缺点](#82-object-实现映射相比于-map-相比相比的缺点)
            - [8.2.1 新键名覆盖原型键名的危险](#821-新键名覆盖原型键名的危险)
        - [8.3 Map 实现映射相比于 Object 实现的缺点](#83-map-实现映射相比于-object-实现的缺点)
    - [Reference](#reference)

<!-- /TOC -->


## 设计思想
Map 解决了之前只能用 Object 凑合实现映射的问题，而 WeakMap 和 WeakSet 解决了之前一直存在的只有强引用的问题。
 

## 1. 构造
1. 语法
    ```js
    new Map([iterable])
    ```
2. `iterable` is an Array or other iterable object whose elements are key-value pairs. Each key-value pair is added to the new `Map`
    ```js
    let myMap = new Map([
        [1, 'one'],
        [2, 'two'],
        [3, 'three'],
    ]);
    console.log(myMap); // Map(3) {1 => "one", 2 => "two", 3 => "three"}
    ```
3. 事实上，不仅仅是数组，任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构都可以当作 `Map` 构造函数的参数
    ```js
    const set = new Set([
        ['foo', 1],
        ['bar', 2]
    ]);
    console.log(new Map(set)); // Map(2) {"foo" => 1, "bar" => 2}
    ```


## 2. 实例属性
### `size`
Returns the number of key/value pairs in the `Map` object.


## 3. 实例方法
### 3.1 `clear()`
和 `Set` 相同

### 3.21 `delete(key)`
和 `Set` 不同，因为 `Set` 没有 key

### 3.3 `has(key)`
和 `Set` 不同，因为 `Set` 没有 key

### 3.4 `get(key)`
1. Returns the value associated to the `key`, or `undefined` if there is none.
2. `Set` 没有这个方法，`Set` 类似于数组的感觉，如果实现这个方法会比较奇怪。
3. 如果读取一个未知的键，则返回 `undefined`
    ```js
    new Map().get('asfddfsasadf'); // undefined
    ```

### 3.5 `set(key, value)`
1. 显然 `Set` 应该用 `add` 而 `Map` 应该用 `set`。
2. 如果对同一个键多次赋值，后面的值将覆盖前面的值
    ```js
    const map = new Map();

    map
    .set(1, 'aaa')
    .set(1, 'bbb');

    map.get(1) // "bbb"
    ```


## 4. 示例
```js
const map = new Map([
    ['name', '33'],
    ['age', 22]
]);

let names = ['hime', 'hina'];
let colors = ['red', 'blue'];

map.set('sex', 'female').set(names, colors);

console.log(map.size); // 4
console.log(map.has('name')); // true
console.log(map.has('sex')); // true
console.log(map.has(names)); // true
console.log(map.has(['hime', 'hina'])); // false  参数是新创建了数组

console.log(map.get('name')); // "33"
console.log(map.get('names')); // undefined
console.log(map.get(names)); // ['red', 'blue']
console.log(map.delete(names)); // true
console.log(map.get(names)); // undefined
console.log(map); // Map(3) {"name" => "33", "age" => 22, "sex" => "female"}
console.log(map.clear()); // undefined
console.log(map); // Map(0) {}
```


## 5. 遍历
和 `Set` 一样的四个方法。而且遍历顺序是也插入顺序。
```js
const map = new Map([
    ['F', 'no'],
    ['T',  'yes'],
]);
// F no
// T yes


map.forEach((val, key, m) => {
    console.log(key, val);
});


for (let key of map.keys()) {
    console.log(key);
}
// "F"
// "T"

for (let value of map.values()) {
    console.log(value);
}
// "no"
// "yes"

for (let [key, value] of map.entries()) {
    console.log(key, value);
}
// "F" "no"
// "T" "yes"
```


## 6. 与其他数据结构的互相转换
### 6.1 Map 转为数组
```js
const map = new Map();
map.set(true, 7).set({foo: 3}, ['abc']);
console.log([...map]); // [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]
```

### 6.2 数组转为 Map
```js
const arr = [
    [true, 7],
    [{foo: 3}, ['abc']],
];
console.log(new Map(arr)); // Map(2) {true => 7, {…} => Array(1)}
```

### 6.3 Map 转为对象
1. 如果所有 `Map` 的键都是字符串，它可以无损地转为对象。如果有非字符串的键名，那么这个键名只能先被转成字符串，再作为对象的键名。
2. 可以使用 ES2019 中的方法 `Object.fromEntries(iterable)`
    ```js
    console.log(map); // {"foo" => "bar", "baz" => "qux"}
    let m = Object.fromEntries(map);
    console.log(m) // {foo: "bar", baz: "qux"}
    ```
3. 或者自己实现
    ```js
    function mapToObj(map) {
        let obj = {};
        for (let [k, v] of map) {
            obj[k] = v;
        }
        return obj;
    }


    const map = new Map();

    map
    .set('yes', true)
    .set(false, 'no')
    .set([1, 2, 3], [4, 5, 6])
    .set({age: 22}, {name: '33'});

    let obj = mapToObj(map);


    console.log(obj.yes); // true
    console.log(obj.false); // "no"
    console.log(obj['1,2,3']); // [4, 5, 6]
    console.log(obj['[object Object]']); // {name: "33"}
    console.log(JSON.stringify(obj, null, 4));
    // {
    //     "yes": true,
    //     "false": "no",
    //     "1,2,3": [
    //         4,
    //         5,
    //         6
    //     ],
    //     "[object Object]": {
    //         "name": "33"
    //     }
    // }
    ```

### 6.4 对象转为 Map
可以使用 `Object.entries` 或者遍历对象逐个 `set`
```js
let obj = {
    name: '33',
    age: 22,
};
let map = new Map( Object.entries(obj) );
console.log( map ); // Map(2) {"name" => "33", "age" => 22}
```

### 6.5 Map 转为 JSON
#### 6.5.1 如果 Map 的键名都是字符串
可以正常的转为对象再转为 JSON
```js
function mapToObj(map) {
    let obj = {};
    for (let [k, v] of map) {
        obj[k] = v;
    }
    return obj;
}

function strMapToJson(strMap) {
    return JSON.stringify(mapToObj(strMap));
}

let map = new Map().set('yes', true).set('no', false);
console.log( strMapToJson(map) );
// '{"yes":true,"no":false}'
```

#### 6.5.2 如果 Map 的键名有非字符串，这时可以选择转为数组 JSON
```js
function mapToArrayJson(map) {
    return JSON.stringify([...map]);
}

let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
console.log( mapToArrayJson(myMap) );
// '[[true,7],[{"foo":3},["abc"]]]'
```

### 6.6 JSON 转为 Map
#### 6.6.1 对象型 JSON
```js
function objToStrMap(obj) {
    let strMap = new Map();
    for (let [key, value] of Object.entries(obj)){
        strMap.set(key, value);
    }
    return strMap;
}

function jsonToStrMap(jsonStr) {
    return objToStrMap(JSON.parse(jsonStr));
}

console.log(objToStrMap(JSON.parse('{"yes": true, "no": false}')));
// Map(2) {"yes" => true, "no" => false}
```

#### 6.6.2 数组型 JSON
如果整个 JSON 就是一个数组，且每个数组成员本身，又是一个有两个成员的数组。这时，它可以一一对应地转为 Map
```js
console.log(new Map(JSON.parse('[[true,7],[{"foo":3},["abc"]]]')));
// Map {true => 7, Object {foo: 3} => ['abc']}
```


## 7. `WeakMap`
1. WeakMap 的键名所指向的对象，不计入垃圾回收机制。
2. WeakMap 只接受引用类型作为键名，不接受其他类型的值作为键名。
3. WeakMap 只有四个方法可用：`set()`、`get()`、`has()` 和 `delete()`，也没有 `size` 属性。
4. WeakMap 弱引用的只是键名，而不是键值
    ```js
    const wm = new WeakMap();
    let key = {};
    let obj = {foo: 1};

    wm.set(key, obj);
    // {foo: 1} 被两个指针引用：一个是 obj，一个是 vm 里的 key 
    obj = null; // obj 不再引用 {foo: 1}
    wm.get(key)
    // Object {foo: 1}
    ```


## 8. Object vs Map
### 8.1 语义
`Object` 是对象，`Map` 是映射。所以如果就是想保存映射，那就优先考虑使用 `Map`。

### 8.2 Object 实现映射相比于 Map 相比相比的缺点
* 键必须是字符串类型或 Symbol 类型
* 其他类型的键会被隐式的转为字符串，因此常常导致 bug
* 可能访问到对象原型链上的属性
* 设置的新键名可能覆盖原型上的键名
* 没有 `size` 属性
* 遍历不保证顺序
* 会遍历到对象方法

#### 8.2.1 新键名覆盖原型键名的危险
1. 如果用一个 Object 对象来保存用户的输入，又如果因为某些需求，Object 的 key 会保存用户的输入。
2. 这时如果用户的某个会保存为 key 的输入值和对象原型上的某个 key 同名，那就直接覆盖了。
3. 比如用户输入了 `toString`，那就覆盖了这个对象的原型方法。

### 8.3 Map 实现映射相比于 Object 实现的缺点
* 如果键是引用类型，可能会导致内存泄露。不过可以使用 WeakMap 来避免。


## Reference
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
* [阮一峰](http://es6.ruanyifeng.com/#docs/set-map)
* [键值对在Javascript如何保存 —— Object vs Map vs WeakMap](https://zhuanlan.zhihu.com/p/257980685)
* [When to Use Map instead of Plain JavaScript Object](https://dmitripavlutin.com/maps-vs-plain-objects-javascript/)
