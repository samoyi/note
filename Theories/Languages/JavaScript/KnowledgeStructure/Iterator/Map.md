# Map


<!-- TOC -->

- [Map](#map)
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
    - [Reference](#reference)

<!-- /TOC -->


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
如果所有 `Map` 的键都是字符串，它可以无损地转为对象。如果有非字符串的键名，那么这个键名只能先被转成字符串，再作为对象的键名。
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
2. WeakMap 只接受对象作为键名，不接受其他类型的值作为键名。
3. WeakMap 只有四个方法可用：`set()`、`get()`、`has()` 和 `delete()`，也没有 `size` 属性。
4. WeakMap 弱引用的只是键名，而不是键值
    ```js
    const wm = new WeakMap();
    let key = {};
    let obj = {foo: 1};

    wm.set(key, obj);
    obj = null;
    wm.get(key)
    // Object {foo: 1}
    ```


## Reference
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
* [阮一峰](http://es6.ruanyifeng.com/#docs/set-map)
