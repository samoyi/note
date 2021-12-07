# Array

**收录原则：**  
如果实现同一目的的两种方法，一种方法和另一种相比没有任何优点而只有缺点，则不收录。例如，使用 `Set` 数据结构可以很好地实现数组去重，替代了之前需要自己编写去重函数，则这里不收录自编写的去重函数。对自编写去重函数的研究会放在算法研究部分。


<!-- TOC -->

- [Array](#array)
    - [创建数组](#创建数组)
        - [使用构造函数](#使用构造函数)
        - [使用字面量](#使用字面量)
        - [`Array.of()`](#arrayof)
    - [查询数组](#查询数组)
        - [查找数组项](#查找数组项)
            - [`indexOf()` 和 `lastIndexOf()`](#indexof-和-lastindexof)
            - [`find()` 和 `findIndex()`](#find-和-findindex)
        - [`includes()` 方法判断数组中是否包含某项](#includes-方法判断数组中是否包含某项)
    - [改变数组](#改变数组)
        - [改变顺序](#改变顺序)
            - [翻转顺序](#翻转顺序)
            - [排序](#排序)
            - [乱序](#乱序)
        - [添加数组项](#添加数组项)
        - [删除数组项](#删除数组项)
        - [替换数组项](#替换数组项)
        - [合并数组](#合并数组)
        - [归并数组](#归并数组)
        - [数组 pad 方法](#数组-pad-方法)
    - [遍历数组](#遍历数组)
    - [深复制数组](#深复制数组)
    - [数组去重与搜重](#数组去重与搜重)
        - [功能维度](#功能维度)
        - [`Set` 不改变原数组](#set-不改变原数组)
        - [ES5 返回新数组](#es5-返回新数组)
        - [ES5 直接修改原数组](#es5-直接修改原数组)
        - [找出重复项](#找出重复项)
        - [找出所有重复的 index](#找出所有重复的-index)
    - [空数组项和`undefined`项](#空数组项和undefined项)
        - [空数组项和`undefined`项的区别](#空数组项和undefined项的区别)
        - [各种数组方法对空数组项和 `undefined` 项的处理](#各种数组方法对空数组项和-undefined-项的处理)
    - [其他](#其他)
        - [数组方法是否改变原数组](#数组方法是否改变原数组)
            - [会改变的](#会改变的)
            - [不会改变的](#不会改变的)
    - [列表和树结构的转换](#列表和树结构的转换)
        - [列表转树](#列表转树)
            - [分析](#分析)
            - [逻辑](#逻辑)
            - [边界条件](#边界条件)
            - [实现](#实现)
        - [树转列表](#树转列表)
            - [递归实现](#递归实现)
            - [遍历实现](#遍历实现)

<!-- /TOC -->


##  创建数组
### 使用构造函数
1. 给构造函数传参数组长度时，只是给数组的 `length` 属性赋值了，而数组本身并没有这么多项，它还是一个空数组  
    ```js
    const assert = require('assert');
    const arr1 = new Array(1);
    const arr2 = [undefined];
    console.log(arr1[0] === arr2[0]); // true
    console.log(arr1); // [ <1 empty item> ]
    console.log(arr2); // [ undefined ]
    assert.deepEqual(arr1, arr2); // AssertionError
    ```
2. 这里倒是可以更好的理解何为**真正的属性**何为**表达的属性**。如果一个数组有三项，则其真正有三个项，然后我们又定义一个抽象的概念`length`，在这里它像是一个变量，来表达数组有三个项这个事实，所以它显示`3`。事实没法改变，但数据可以造假。而一般意义上的属性，其实只是数据而已，就像这里的`length`，它可以被人造假强制修改。

### 使用字面量

### `Array.of()`


## 查询数组
### 查找数组项
#### `indexOf()` 和 `lastIndexOf()`
相等性算法：Strict Equality Comparison
```js
const arr = [-0, NaN, 0];
console.log(arr.indexOf(0)); // 0
console.log(arr.indexOf(NaN)); // -1
```

#### `find()` 和 `findIndex()`

### `includes()` 方法判断数组中是否包含某项
相等性算法： sameValueZero algorithm
```js
const arr = [-0, NaN];
console.log(arr.includes(0)); // true
console.log(arr.includes(NaN)); // true
```


## 改变数组
### 改变顺序
#### 翻转顺序
`reverse()` 改变原数组

#### 排序
* `sort()` 改变原数组

#### 乱序
参考 `Theories\Algorithm\Misc\Fisher-Yates shuffle.md`

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
* 修改`length`   改变原数组
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

### 数组 pad 方法
1. 类似于字符串的原生 pad 方法，第三个参数从字符串变成了数组
    ```js
    function arr_padStart (arr, targetLength, padArr) {
        if (targetLength <= arr.length) {
            return arr.slice();
        }
        
        let n = Math.ceil( (targetLength) / padArr.length );
        let repeated = [];
        for (let i=0; i<n; i++) {
            repeated.push(...padArr);
        }
        repeated.length = targetLength - arr.length;

        return repeated.concat(arr);
    }
    function arr_padEnd (arr, targetLength, padArr) {
        if (targetLength <= arr.length) {
            return arr.slice();
        }

        let n = Math.ceil( (targetLength) / padArr.length );
        let repeated = [];
        for (let i=0; i<n; i++) {
            repeated.push(...padArr);
        }
        repeated.length = targetLength - arr.length;
        return arr.concat(repeated);
    }
    ```
2. 先用 `padArr` 重复若干次创建一个长度大于等于 `targetLength` 的数组，然后再通过 `length` 属性把这个数组缩短到合适的长度，再拼接上原数组 `arr`。


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
### 功能维度
* 是否直接修改原数组：两种需求都是存在的；
* 采用哪种同值算法：这里选择和 `Set` 去重一样的 Same-value-zero 算法；

### `Set` 不改变原数组
`Set` 中对相等性判断的算法为 Same-value-zero equality
```js
const arr1 = [-0, NaN, NaN];
const arr2 = [0, -0, NaN, NaN];
console.log(new Set(arr1)); // {0, NaN}
console.log(new Set(arr2)); // {0, NaN}
```

### ES5 返回新数组
1. ES5 没有 Same-vaule-zero 实现，所以要单独判断 `NaN`。而且 ES5 的 `isNaN` 方法很混乱，所以自己实现一个方法
    ```js
    function is_NaN (value) {
        if (typeof value !== "number") {
            return false;
        }
        return value !== value;
    }
    ```
2. 因为返回新数组，所以可以遍历原数组，把新数组里没有的元素加入原数组。
3. 判断新数组里是否存在某个元素要用到 `indexOf`，而这个方法是 strict equality 同值算法。所以为了判断新数组里是否有 `NaN`，还需要一个标记变量 `hasNaN`
    ```js
    function foo (arr) {
        let hasNaN = false; 
        let newArr = [];
        arr.forEach((item) => {
            if ( is_NaN(item) ) {
                if ( !hasNaN ) {
                    newArr.push(item);
                    hasNaN = true;
                }
            }
            else if ( newArr.indexOf(item) === -1 ) {
                newArr.push(item);
            }
        });
        return newArr;
    }

    let arr = [1, 3, 2, 5, NaN, 4, NaN, 5, 3, 6, 3, 2];
    console.log(foo(arr)); // [1, 3, 2, 5, NaN, 4, 6]
    ```

### ES5 直接修改原数组
1. 因为要使用 `splice` 删除数组项，所以从后往前遍历数组，找到一个非 `NaN` 的项，如果之前还存在重复值的项，那就删除当前项。
2. 对于值为非 `NaN` 的项，通过 `indexOf` 和 `lastIndexOf` 是否相等判断是否是重复项。
3. 对于 `NaN`，无法使用 `indexOf` 和 `lastIndexOf`，所以仍然要通过一个变量记录它是否出现。之后再出现 `NaN` 时，删除出现的 `NaN`
    ```js
    function foo (arr) {
        let hasNaN = false;
        for (let i=arr.length; i>-1; i--) {
            if ( is_NaN(arr[i]) ) {
                if (hasNaN) {
                    arr.splice(i, 1);
                }
                else {
                    hasNaN = true;
                }
            }
            else {
                let firstIdx = arr.indexOf(arr[i]);
                if (i !== firstIdx) {
                    arr.splice(i, 1);
                } 
            }
        }
    }
    let arr = [1, 3, 2, 5, NaN, 4, NaN, 5, 3, 6, 3, 2];
    foo(arr);
    console.log(arr); // [1, 3, 2, 5, 4, NaN, 6]
    ```
4. 这个方法有一个小小不完善。就上面的例子来看，我们期望删除的结果是 `[1, 3, 2, 5, NaN, 4, 6]`，和实际的结果在顺序上略有差别。
5. 这是因为对于非 `NaN` 的项是删除右边的若干个重复的保留最左的，而对于 `NaN` 则是保留最右的。
6. 从后往前遍历，就不能通过 `splice` 删除，否则就会影响接下来的遍历。不过，从后往前遍历是因为删除当前项会影响后面遍历的项，但是在这里，删除同值项并不需要删除当前项，而可以通过删除之后的同值项。而这正是我们需要的。
7. 从前往后遍历数组，找到一个非 `NaN` 的项，如果之后还存在重复值的项，删除之后所有相同值的项。
8. 但是此时对于 `NaN`，却只能删除当前 `NaN` 项，因为无法使用 `lastIndexOf` 查找之后的重复。而通过`splice` 删除当前重复的 `NaN` 之后，下一项就无法被遍历到了。
9. 所以，在删除了重复的 `NaN` 之后，还要让索引再减一才行
    ```js
    function foo(arr){
        let hasNaN = false;

        for (let i=0; i<arr.length; i++) {
            let item = arr[i];
            if ( is_NaN(item) ) {
                if (hasNaN) {
                    arr.splice(i, 1);
                    i--;
                }
                else {
                    hasNaN = true;
                }
            }
            else {
                let lastIdx = arr.lastIndexOf(item);
                if (i !== lastIdx) {
                    do {
                        arr.splice(lastIdx, 1);
                        lastIdx = arr.lastIndexOf(item);
                    }
                    while (i !== lastIdx);
                }
            }
        }

        return arr;
    }


    let arr = [1, 3, 2, 5, NaN, 4, NaN, 15, 15, 3, 6, 3, 2];
    foo(arr);
    console.log(arr); // [1, 3, 2, 5, NaN, 4, 15, 6]
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
            oSameIndexes[item] = [firstIndex]; // 记录该重复值第一次出现的 index
            // 向后遍历找到所有重复项
            let nNextIndex = firstIndex + 1;
            while (nNextIndex!==lastIndex){
                if (arr[nNextIndex]===arr[firstIndex]){
                    oSameIndexes[item].push(nNextIndex);
                }
                nNextIndex++;
            }
            oSameIndexes[item].push(lastIndex); // 记录重复值的最后一项 index
        }
    });
    return oSameIndexes;
}
```


## 空数组项和`undefined`项
### 空数组项和`undefined`项的区别
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
* `forEach()`、 `filter()`、 `every()` 和 `some()` 都会跳过空数组项；`map()` 会跳过空数组项，但会保留这个值
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


## 列表和树结构的转换
1. 对于逻辑上的树结构，可以表示成列表的形式。例如
    ```js
    {
        id: 1,
        name: "obj1",
        children: [
            {
                id: 2,
                name: "obj2",
                children: [],
            },
            {
                id: 3,
                name: "obj3",
                children: [
                    {
                        id: 4,
                        name: "obj4",
                        children: [],
                    },
                ],
            },
        ],
    }
    ```
    可以表示为
    ```js
    [
        {id: 1, name: "obj1", pid: 0},
        {id: 2, name: "obj2", pid: 1},
        {id: 3, name: "obj3", pid: 1},
        {id: 4, name: "obj4", pid: 3},
    ]
    ```
2. 对于其中一种表示，提供相应的方法转换成另一种形式。

### 列表转树
#### 分析
1. 当遍历某一个列表项时，需要创建该项对应的对象 `obj`，然后把该对象插入到它父级的 `children` 里。
3. 一个问题是可能此时 `obj` 的父级对象有可能还没有创建。对于这种情况，我们此时已经知道了父级的 `id`，那么可以先创建一个父级 `parent`，然后把 `obj` 加入到 `parent` 的 `children` 里。
3. 但此时 `parent` 是无处安放的，因为我们不知道它的父级，所以需要将它存储起来。之后遍历到 `parent` 对应的列表项时，还要完善它的属性。
4. 当然如果 `obj` 是根对象，也就是 `obj.id` 为 1，那么它就没有父级。
5. 另外 `obj` 本身也要存储起来，这样它的子对象也才能找到它。

#### 逻辑
1. 创建一个哈希结构 `objMap` 用来存储对象。
2. 遍历列表：
    * 如果当前列表项 `id` 没有创建过对象：
        1. 以该 `id` 为 `key` 创建对象，属性包括 `id`、`name`、`pid` 和 `children`；
        2. 根据 `pid` 从 `objMap` 中寻找父对象 `objMap[pid]`：
            * 如果找到，把当前项加入到父对象的 `children` 里面；
            * 如果没找到，创建父对象，把当前节点加入到父对象的 `children` 里面；父对象此时 `name` 和 `pid` 属性为空;
    * 如果当前列表项 `id` 已经创建过对象，那证明是它的子对象创建的，只需要补上该对象的 `pid` 和 `name` 属性；
3. 返回 `objMap[1]`

#### 边界条件
根对象的 `pid` 为 0，没有父对象

#### 实现
```js
function list2tree (list) {
    let objMap = {};
    list.forEach((item) => {
        let {id, name, pid} = item;
        if (objMap[id]) {
            objMap[id].name = name;
            objMap[id].pid = pid;
        }
        else {
            objMap[id] = {
                id,
                name,
                pid,
                children: [],
            };
            if (pid !== 0) {
                if (objMap[pid]) {
                    objMap[pid].children.push(objMap[id]);
                }
                else {
                    objMap[pid] = {
                        id: pid,
                        name: null,
                        pid: null,
                        children: [objMap[id]],
                    };
                }
            }
        }
    });
    return objMap[1];
}
```

### 树转列表
#### 递归实现
1. 函数接受一个对象，将它加入结果列表；
2. 然后遍历这个对象的子对象，递归的调用
    ```js
    function tree2list (tree, list=[]) {
        let {id, name, pid} = tree;
        list.push({id, name, pid});
        tree.children.forEach((item) => {
            tree2list(item, list);
        });
        return list;
    }
    ```

#### 遍历实现
1. 定义一个对象队列，只要里面还有对象，就取出一个对象加入结果列表；
2. 然后把取出的对象的所有子对象再加入对象队列；
3. 初始时把参数的对象加入队列，然后开始循环
    ```js
    function tree2list (tree, list=[]) {
        let objQueue = [tree];
        while (objQueue.length) {
            let child = objQueue.shift();
            let {id, name, pid} = child;
            list.push({id, name, pid});
            objQueue.push(...child.children);
        }
        return list;
    }
    ```