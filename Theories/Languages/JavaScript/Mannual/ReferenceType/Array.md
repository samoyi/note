# Array

**收录原则：**  
如果实现同一目的的两种方法，一种方法和另一种相比没有任何优点而只有缺点，则不收录。例如，
使用 `Set` 数据结构可以很好地实现数组去重，替代了之前需要自己编写去重函数，则这里不收录
自编写的去重函数。对自编写去重函数的研究会放在算法研究部分。


##  创建数组
### 使用构造函数
给构造函数传参数组长度时，只是给数组的`length`属性赋值了，而数组本身并没有这么多项，它
还是一个空数组。  
```js
const assert = require('assert');
const arr1 = new Array(1);
const arr2 = [undefined];
console.log(arr1[0] === arr2[0]); // true
console.log(arr1); // [ <1 empty item> ]
console.log(arr2); // [ undefined ]
assert.deepEqual(arr1, arr2); // AssertionError
```
这里倒是可以更好的理解何为**真正的属性**何为**表达的属性**。如果一个数组有三项，则其真
正有三个项，然后我们又定义一个抽象的概念`length`，在这里它像是一个变量，来表达数组有三
个项这个事实，所以它显示`3`。事实没法改变，但数据可以造假。而一般意义上的属性，其实只是
数据而已，就像这里的`length`，它可以被人造假强制修改。

### 使用字面量

### `Array.of()`


## 查询数组
### 查找数组项
#### indexOf()和lastIndexOf()
相等性算法：Strict Equality Comparison
```js
const arr = [-0, NaN, 0];
console.log(arr.indexOf(0)); // 0
console.log(arr.indexOf(NaN)); // -1
```

#### `find()`和`findIndex()`

### `includes()`方法判断数组中是否包含某项
相等性算法： sameValueZero algorithm
```js
const arr = [-0, NaN];
console.log(arr.includes(0)); // true
console.log(arr.includes(NaN)); // true
```


## 改变数组
### 改变顺序
* `reverse()`  改变原数组
* `sort()`     改变原数组

### 添加数组项
* 中括号              改变原数组
* `push()`           改变原数组
* `unshift()`        改变原数组
* `concat()`         不改变原数组
* `splice()`         改变原数组
* spread operator    不改变原数组
    ```js
    let arr = [2, 3];
    let arr1 = [1, ...arr];
    let arr2 = [...arr, 4];
    let arr3 = [1, ...arr, 4];
    console.log(arr); // [2, 3]
    console.log(arr1); // [1, 2, 3]
    console.log(arr2); // [2, 3, 4]
    console.log(arr3); // [1, 2, 3, 4]
    ```

### 删除数组项
* 修改length   改变原数组
* `pop()`      改变原数组
* `shift()`    改变原数组
* `splice()`   改变原数组
* `filter()`   不改变原数组
* `delete`不能删除数组项
```js
let a = [1, 2, 3];
delete a[1];
console.log( a ); // [1, empty × 1, 3]
console.log( a.length ); // 3
```

### 替换数组项
* 中括号        改变原数组
* `splice()`   改变原数组
* `map()`      不改变原数组

### 合并数组
* `concat()`   不改变原数组
* `push()`     改变原数组
```js
arr0.push(...arr1);
Array.prototype.push.apply( arr0, arr1 ); // ES6之前
```
* 字面量合并
```js
[0, 1, 2, ...arr1, ...arr2]
```

### 归并数组
* `reduce()`和`reduceRight()`   不改变原数组
* 遍历数组手动归并


## 遍历数组
不改变原数组
* `every()`  只要有一项是`false`，就返回`false`并终止循环。
* `filter()`
* `forEach()`
* `map()`
* `some()`  只要有一项是`true`，就返回`true`并终止循环。
* `entries()`、`keys()`、`values()`   返回一个遍历器对象
* `Array.from()` 使用第二个参数
* 遍历对象的方法


## 深复制数组
见 `Theories\Languages\JavaScript\Mannual\ReferenceType\array_clone.md`


## 数组去重与搜重
### `Set` 去重  不改变原数组
`Set`中对相等性判断的算法为 Same-value-zero equality
```js
const arr1 = [-0, NaN, NaN];
const arr2 = [0, -0, NaN, NaN];
console.log(new Set(arr1)); // {0, NaN}
console.log(new Set(arr2)); // {0, NaN}
```

### 找出重复项
* 方法一：先把所有重复的项组成新数组，然后去重
```js
function duplicateItems(arr){
  let aDuplicate = arr.filter(function(value, index, array){
      return array.indexOf(value) !== array.lastIndexOf(value);
  });
  return [...new Set(aDuplicate)];
}
```
* 方法二：直接找到若干个重复项中的第一项（或最后一项）
```js
function duplicateItems(arr){
  return arr.filter(function(value, index, array){
      // && 前保证是第一项， && 后保证后面还有重复的
      return array.indexOf(value)===index && array.lastIndexOf(value)!==index;
  });
}
```

### 找出所有重复的 index
```js
function findDuplicateIndexes(arr){
    let oSameIndexes = {};
    arr.forEach((item, index)=>{
        let firstIndex = arr.indexOf(item),
            lastIndex = arr.lastIndexOf(item);
        if (index===firstIndex && firstIndex!==lastIndex){ // 重复项第一次出现
            oSameIndexes[item] = [firstIndex]; // 记录第一次出现的重复项的index
            // 向后遍历找到所有重复项
            let nNextIndex = firstIndex + 1;
            while (nNextIndex!==lastIndex){
                if (arr[nNextIndex]===arr[firstIndex]){
                    oSameIndexes[item].push(nNextIndex);
                }
                nNextIndex++;
            }
            oSameIndexes[item].push(lastIndex);
        }
    });
    return oSameIndexes;
}
```


## 空数组项和 `undefined` 项
### 空数组项和 `undefined` 项的区别
```js
console.log(arr1); // ["a", empty, "c"]
console.log(arr2); // ["a", undefined, "c"]
console.log( arr1.length ); // 3  length 属性并不是根据数组项的个数来决定的
console.log( arr2.length ); // 3
console.log(arr1[1] === arr2[1]); // true
console.log('1' in arr1); // false
console.log('1' in arr2); // true
```

### 各种数组方法对空数组项和 `undefined` 项的处理
* `forEach()`、 `filter()`、 `every()` 和 `some()` 都会跳过空数组项；`map()` 会跳过
空数组项，但会保留这个值
    ```js
    let arr = [ "a", , "c"],
        num = 0,
        result = [];

    function reset(sFnName){
        console.log("\n" + sFnName + "---------------------------");
        num = 0;
        result = [];
    }

    reset("forEach");
    arr.forEach(item=>{
        num++;
    });
    console.log(num); // 2

    reset("every");
    arr.every(item=>{
        num++;
        return true;
    });
    console.log(num); // 2

    reset("filter");
    result = arr.filter(item=>{
        num++;
        return true;
    });
    console.log(num); // 2
    console.log(result); // ["a", "c"]
    console.log(result.length); // 2

    reset("some");
    arr.some(item=>{
        num++;
        return false;
    });
    console.log(num); // 2

    reset("map");
    result = arr.map(item=>{
        num++;
        return item;
    });
    console.log(num); // 2
    console.log(result); // ["a", empty, "c"]
    console.log(result.length); // 3
    ```

* `Object.keys()`、`Object.values()` 和 `Object.entries()` 会忽略空数组项：
    ```js
    const arr1 = [ "a", , "c"];

    console.log(Object.keys(arr1).length);    // 2
    console.log(Object.values(arr1).length);  // 2
    console.log(Object.entries(arr1).length); // 2
    ```

* 实例方法 `entries()`、`keys()` 和 `values()` 会遍历空数组项：
    ```js
    const arr1 = [ "a", , "c"];

    const keys = arr1.keys();
    const values = arr1.values();
    const entries = arr1.entries();

    console.log(keys.next().value); // 0
    console.log(keys.next().value); // 1
    console.log(keys.next().value); // 2

    console.log(values.next().value); // a
    console.log(values.next().value); // undefined
    console.log(values.next().value); // c

    console.log(entries.next().value); // [0, "a"]
    console.log(entries.next().value); // [1, undefined]
    console.log(entries.next().value); // [2, "c"]
    ```

* `for...in` 不会遍历空数组项，但 `for...of` 会遍历空数组项
    ```js
    const arr1 = ["a", , "c"];

    for(let key in arr1){
        console.log(key); // 输出两次，分别为 0、2
    }

    for(let item of arr1){
        console.log(item===undefined); // 输出三次，分别为 false、true、false
    }
    ```

* `join()` 和 `toString()` 会将空数组项和 `undefined`（以及`null`） 转化为空字符串：
    ```js
    const arr1 = [ "a", , "c"];
    const arr2 = [ "a", undefined, "c"];
    const arr3 = [ "a", null, "c"];

    console.log(arr1.join());     // a,,c
    console.log(arr1.toString()); // a,,c
    console.log(arr2.join());     // a,,c
    console.log(arr2.toString()); // a,,c
    console.log(arr3.join());     // a,,c
    console.log(arr3.toString()); // a,,c
    ```

* `Array.from`方法会将数组的空数组项转为 `undefined`：
    ```js
    const arr1 = [ "a", , "c"];
    console.log('1' in arr1); // false
    const arr2 = Array.from(arr1);
    console.log('1' in arr2); // true
    ```

* 扩展运算符（`...`）也会将空数组项转为 `undefined`：
    ```js
    const arr1 = [ "a", , "c"];
    console.log('1' in arr1); // false
    const arr2 = [...arr1];
    console.log('1' in arr2); // true
    ```

* `copyWithin()`会连空数组项一起拷贝，但不会把空数组项转化为：
    ```js
    const arr1 = [ "a", , "b" , , "c"];
    console.log('1' in arr1); // false
    const arr2 = arr1.copyWithin(2, 0);
    console.log(arr2); // ["a", empty, "a", empty, "b"]
    console.log('1' in arr2); // true
    ```

* `fill()`会将空数组项视为正常的数组位置：
    ```js
    new Array(3).fill('a') // ["a","a","a"]
    ```


## 其他
### 数组方法是否改变原数组
#### 会改变的
* `push()`和`pop()`
* `shift()`和`unshift()`
* `reverse()`和`sort()`
* `splice()``
* `copyWithin()`
* `fill()`
#### 不会改变的
* 遍历方法
* `join()`
* `concat()`
* `slice()`
* `reduce()`和`reduceRight()`
* spread operator 添加数组项
