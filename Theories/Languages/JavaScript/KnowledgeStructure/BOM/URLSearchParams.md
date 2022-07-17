# URLSearchParams


<!-- TOC -->

- [URLSearchParams](#urlsearchparams)
    - [Constructor `URLSearchParams()`](#constructor-urlsearchparams)
        - [A string](#a-string)
        - [Literal sequence or object](#literal-sequence-or-object)
        - [Record](#record)
    - [`URLSearchParams.append()`](#urlsearchparamsappend)
    - [`URLSearchParams.entries()`](#urlsearchparamsentries)
    - [`URLSearchParams.get()`](#urlsearchparamsget)
    - [`URLSearchParams.getAll()`](#urlsearchparamsgetall)
    - [`URLSearchParams.keys()`](#urlsearchparamskeys)
    - [`URLSearchParams.set()`](#urlsearchparamsset)
    - [`URLSearchParams.sort()`](#urlsearchparamssort)
    - [`URLSearchParams.toString()`](#urlsearchparamstostring)
    - [其他方法](#其他方法)

<!-- /TOC -->


## Constructor `URLSearchParams()`
1. 参数可选，但如果不设置并不会使用 `location.search` 作为参数，而是需要之后手动添加。
2. 如果设置可以是下面三种类型

### A string
1. A string, which will be parsed from `application/x-www-form-urlencoded` format. 
2. A leading `'?'` character is ignored.
3. 下面三个构造函数调用会得到相同的参数值
    ```js
    new URLSearchParams("foo=1&bar=2");

    new URLSearchParams("?foo=1&bar=2");

    const url = new URL('https://example.com?foo=1&bar=2');
    new URLSearchParams(url.search);
    ```

### Literal sequence or object
1. A literal sequence of name-value string pairs, or any object — such as a `FormData` object — with an iterator that produces a sequence of string pairs. 
2. Note that `File` entries will be serialized as `[object File]` rather than as their filename (as they would in an `application/x-www-form-urlencoded` form).
3. 例如
    ```js
    new URLSearchParams([["foo", "1"], ["bar", "2"]]);

    const map = new Map([["foo", "1"], ["bar", "2"]]);
    new URLSearchParams(map);
    ```

### Record
1. A record of string keys and string values
    ```js
    new URLSearchParams({"foo": "1", "bar": "2"});
    ```
2. Note that nesting is not supported
    ```js
    const record = {"foo": "1", "bar": {"qux": 2}, "baz": 3};
    const searchParams = new URLSearchParams(record);

    for (const p of searchParams) {
        console.log(p);
    }
    // 遍历结果
    // ['foo', '1']
    // ['bar', '[object Object]']
    // ['baz', '3']
    ```


## `URLSearchParams.append()`
If the same key is appended multiple times it will appear in the parameter string multiple times for each value
```js
let url = new URL('https://example.com?foo=1&bar=2');
let params = new URLSearchParams(url.search);

params.append('baz', 3);
params.append('qux', 4);
params.append('foo', 5);

for (const p of params) {
    console.log(p);
}
// ['foo', '1']
// ['bar', '2']
// ['baz', '3']
// ['qux', '4']
// ['foo', '5']
```


## `URLSearchParams.entries()`
1. The `entries()` method of the `URLSearchParams` interface returns an iterator allowing iteration through all key/value pairs contained in this object. 
2. The iterator returns key/value pairs in the same order as they appear in the query string. 
3. The key and value of each pair are string objects.
4. 和直接 `for...of` 实例效果一样
    ```js
    const searchParams = new URLSearchParams("key1=value1&key2=value2");

    for(let pair of searchParams.entries()) {
        console.log(pair[0]+ ', '+ pair[1]);
    }
    // key1, value1
    // key2, value2

    for(let pair of searchParams) {
        console.log(pair[0]+ ', '+ pair[1]);
    }
    // key1, value1
    // key2, value2
    ```


## `URLSearchParams.get()`
1. A string if the given search parameter is found; otherwise, `null`
    ```js
    const searchParams = new URLSearchParams("key1=value1&key2=value2");
    console.log( searchParams.get("key2") ); // "value2"
    console.log( searchParams.get("key3") ); // null
    ```
2. 如果一个 key 有多个 value，会返回第一个的
```js
const searchParams = new URLSearchParams("key1=value1&key1=value2");
console.log( searchParams.get("key1") ); // "value1"
```


## `URLSearchParams.getAll()`
返回一个 key 的所有 value 组成的数组
```js
const searchParams = new URLSearchParams("key1=value1&key1=value2&key3=value3");
console.log( searchParams.getAll("key1") ); // ['value1', 'value2']
console.log( searchParams.getAll("key3") ); // ['value3']
```


## `URLSearchParams.keys()`
1. The `keys()` method of the `URLSearchParams` interface returns an iterator allowing iteration through all keys contained in this object. 
2. The keys are string objects
    ```js
    const searchParams = new URLSearchParams("key1=value1&key2=value2");

    for(var key of searchParams.keys()) {
        console.log(key);
    }
    // key1
    // key2
    ```


## `URLSearchParams.set()`
If there were several matching values, this method deletes the others
```js
let params = new URLSearchParams("foo=1&bar=2&bar=3");
console.log(params.toString()); // foo=1&bar=2&bar=3

params.set('bar', 4);
console.log(params.toString()); // foo=1&bar=4
```


## `URLSearchParams.sort()`
1. The `URLSearchParams.sort()` method sorts all key/value pairs contained in this object in place and returns undefined. 
2. The sort order is according to unicode code points of the keys
    ```js
    let searchParams = new URLSearchParams("b=2&c=3&a=1");
    console.log(searchParams.toString()); // b=2&c=3&a=1

    searchParams.sort();
    console.log(searchParams.toString()); // a=1&b=2&c=3
    ```
3. This method uses a stable sorting algorithm (i.e. the relative order between key/value pairs with equal keys will be preserved)
    ```js
    let searchParams = new URLSearchParams("a=2&b=3&a=1");
    console.log(searchParams.toString()); // a=2&b=3&a=1

    searchParams.sort();
    console.log(searchParams.toString()); // a=2&a=1&b=3
    ```


## `URLSearchParams.toString()`
This method returns the query string without the question mark. This is different from `window.location.search`, which includes it.


## 其他方法
* `URLSearchParams.delete()`
* `URLSearchParams.forEach()`
* `URLSearchParams.has()`
* `URLSearchParams.values()`