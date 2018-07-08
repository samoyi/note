# Map


## Description
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

```js
const map = new Map([
    ['F', 'no'],
    ['T',  'yes'],
]);

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


## 与其他数据结构的互相转换
### Map 转为数组
```js
const map = new Map();
map.set(true, 7).set({foo: 3}, ['abc']);
console.log([...map]); // [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]
```

### 数组转为 Map
```js
const arr = [
    [true, 7],
    [{foo: 3}, ['abc']],
];
console.log(new Map(arr)); // Map(2) {true => 7, {…} => Array(1)}
```

### Map 转为对象
```js
function mapToObj(map) {
    let obj = {};
    for (let [k, v] of map) {
        obj[k] = v;
    }
    return obj;
}

const map = new Map();
map.set('yes', true).set(false, 'no').set([1, 2], [3, 4]);
let obj = mapToObj(map);

console.log(obj.yes); // true
console.log(obj.false); // "no"
console.log(obj['1,2']); // [3, 4]
```
* 如果所有 Map 的键都是字符串，它可以无损地转为对象。
* 如果有非字符串的键名，那么这个键名会被转成字符串，再作为对象的键名。

### 对象转为 Map
```js
function objToStrMap(obj) {
    let strMap = new Map();
    for (let [key, value] of Object.entries(obj)){
        strMap.set(key, value);
    }
    return strMap;
}

console.log(objToStrMap({yes: true, no: false}));
// Map(2) {"yes" => true, "no" => false}
```

### Map 转为 JSON
#### 如果 Map 的键名都是字符串
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
console.log(strMapToJson(map));
// '{"yes":true,"no":false}'
```

#### 如果 Map 的键名有非字符串，这时可以选择转为数组 JSON
```js
function mapToArrayJson(map) {
    return JSON.stringify([...map]);
}

let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
console.log(mapToArrayJson(myMap));
// '[[true,7],[{"foo":3},["abc"]]]'
```

### JSON 转为 Map
#### 对象型 JSON
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

#### 数组型 JSON
```js
console.log(new Map(JSON.parse('[[true,7],[{"foo":3},["abc"]]]')));
// Map {true => 7, Object {foo: 3} => ['abc']}
```


## WeakMap
* WeakMap 只接受对象作为键名，不接受其他类型的值作为键名。
* WeakMap 的键名所指向的对象，不计入垃圾回收机制。
* WeakMap 只有四个方法可用：`set()`、`get()`、`has()`和`delete()`。


## Reference
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
* [阮一峰](http://es6.ruanyifeng.com/#docs/set-map)
