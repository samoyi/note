# Performance


<!-- TOC -->

- [Performance](#performance)
    - [Why JavaScript arrays are not actual arrays](#why-javascript-arrays-are-not-actual-arrays)
        - [Actual arrays](#actual-arrays)
        - [JavaScript arrays](#javascript-arrays)
    - [Evolution of JavaScript arrays](#evolution-of-javascript-arrays)
        - [快数组和慢数组](#快数组和慢数组)
        - [快数组和慢数组的转换](#快数组和慢数组的转换)
        - [Typed Array](#typed-array)
    - [避免非预期的转换为慢数组](#避免非预期的转换为慢数组)
        - [Using homogeneous array](#using-homogeneous-array)
        - [避免使用过于稀疏的数组](#避免使用过于稀疏的数组)
    - [性能比较](#性能比较)
        - [先说结论：别使用混杂类型元素数组](#先说结论别使用混杂类型元素数组)
        - [写入速度比较](#写入速度比较)
            - [单一类型元素数组 VS 类型化数组 —— 没有明确结论](#单一类型元素数组-vs-类型化数组--没有明确结论)
            - [混杂类型元素数组 VS 单一类型元素数组 —— 前者明显慢得多](#混杂类型元素数组-vs-单一类型元素数组--前者明显慢得多)
        - [读取速度比较](#读取速度比较)
            - [单一类型元素数组 VS 类型化数组](#单一类型元素数组-vs-类型化数组)
            - [混杂类型元素数组 VS 单一类型元素数组 —— 没有差别](#混杂类型元素数组-vs-单一类型元素数组--没有差别)
    - [References](#references)

<!-- /TOC -->


## Why JavaScript arrays are not actual arrays
### Actual arrays
1. Before stating something about JavaScript, let me tell you what is an `Array`.
2. So, arrays are a bunch of continuous memory location, used to hold some values. Here the emphasis is on the word **continuous** or **contiguous**; because this has a significant effect
    <img src="./images/actual-array.png" width="400" style=" display: block; margin: 5px 0 10px;" />
3. An memory representation of an array has been provided in the picture above. So it is made to hold 4 elements of 4 bits each. Thus it is taking 16 bits memory blocks, all in the same order.
4. Suppose, I’ve declared `tinyInt arr[4];` and it has captured a series of memory blocks, starting from address `1201`. 
5. Now at some point if I try to read `a[2]`, what it will do is a simple mathematical calculation to find out the address of `a[2]`. Something like $1201 + (2 X 4)$ and will directly read from address `1209`.

### JavaScript arrays
1. In JavaScript, an array is a **hash-map**. It can be implemented using various data structures, one of them is linked-list. 
    <img src="./images/old-array-js.png" width="400" style=" display: block; margin: 5px 0 10px;" />
2. So in JavaScript if you declare an array `var arr = new Array(4);` it will make a structure like the picture above. 
3. Thus, if you want to read from `a[2]` at any point in your program, it has to traverse starting from `1201` to find the address of `a[2]`.
4. So this is how JavaScript arrays are different from actual arrays. Obviously a mathematical calculation will take way lesser time than an linked-list traversal. For long arrays, life will be more tough.


## Evolution of JavaScript arrays  
### 快数组和慢数组
1. 根据 V8 的源码可以看到，根据具体的使用情况，会有两种速度不同的数组实现
    ```cpp
    // The JSArray describes JavaScript Arrays
    //  Such an array can be in one of two modes:
    //    - fast, backing storage is a FixedArray and length <= elements.length();
    //       Please note: push and pop can be used to grow and shrink the array.
    //    - slow, backing storage is a HashTable with numbers as keys.
    ```
2. 快数组类似于真正的数组，慢数组是用哈希表的实现的。正是因为可以用哈希表实现慢数组，所以 JS 的数组才可能保存不同类型的数据。
3. 快速组的内存空间也是变的，也就是扩容和收缩。但它并不能像哈希表那样每次增删元素时都单独的为该元素分配空间，而是要批量的增加或删除空间。
4. 快数组的扩容，会是比如说发现快满了，就把存储空间增大到当前的 1.5 倍；收缩也是比如说发现当前数组项很少，数组内存用了 1/3，那就让内存空间缩减到原来的一般。当然实际的比例要看具体的实现。
5. 因此快数组总是会有一些多出来的还没有用到的数组内存。所以从这一点上来说，快数组使用空间换时间，而慢数组是用时间换空间。

### 快数组和慢数组的转换
1. 刚声明的空数组是默认使用快数组，但是根据使用的情况，有可能会自动转为慢数组，而慢数组之后也可能再变为快数组。
2. 很明显，如果数组项是不同的数据类型，那么肯定要转换为慢数组来实现。
3. 另外，如果一个慢数组中出现了大量的空位，那么如果还是用连续的内存，这些空位就会占用很多空间，这时就会被转换为慢数组来节省空间
    ```js
    let a = [1, 2]
    a[1030] = 1;
    ```
4. 之后如果数组没有那么多的空位了，那么慢数组又会被切换为快数组以提升访问速度。

### Typed Array
1. Not only that, the arrays have evolved even more with ES2015 or ES6, we have `ArrayBuffer` with us today. 
2. `ArrayBuffer` gives you a chunk of contiguous memory chunk and let you do whatever you want with it. However, dealing directly with memory is very low level and more complicated. So we have Views to deal with `ArrayBuffer`.
3. Typed arrays are performant and efficient. It was introduced after the request from WebGL people, as they were facing immense performance issues without a way to handle binary data efficiently. You can also share the memory using `SharedArrayBuffer` across multiple web-workers to get a performance boost. 


## 避免非预期的转换为慢数组
### Using homogeneous array
1. JavaScript engines these days actually allocate contiguous memory for its arrays; if the array if **homogeneous** (all elements of same type). 

2. Good programmers always keep their array homogeneous and JIT (just in time compiler) taking the advantage of that does all its array reading calculation just like the way `C` compiler does. 
3. But, the moment you want to insert an element of different type on that homogeneous array, JIT de-structure the entire array and recreate with the old-days style. 
4. So, if you are not writing bad codes, JavaScript `Array` objects maintains an actual array behind the scene.

### 避免使用过于稀疏的数组


## 性能比较
### 先说结论：别使用混杂类型元素数组

### 写入速度比较
#### 单一类型元素数组 VS 类型化数组 —— 没有明确结论
  ```js
  var LIMIT = 10000000;
  var arr = new Array(LIMIT);
  console.time("Homogeneous array insertion time");
  for ( var i = 0; i < LIMIT; i++) {
      arr[i] = i;
  }
  console.timeEnd("Homogeneous array insertion time");
  ```
  ```js
  var LIMIT = 10000000;
  var buffer = new ArrayBuffer(LIMIT * 4);
  var arr = new Int32Array(buffer);
  console.time("ArrayBuffer insertion time");
  for (var i = 0; i < LIMIT; i++) {
      arr[i] = i;
  }
  console.timeEnd("ArrayBuffer insertion time");
  ```

* 引用文章中的测试结果： Node.js 8.4.0 on Mac，普通数组 55ms，类型化数组 52ms。
* 我在 windows Chrome 75.0.3770.142 上测试结果：普通数组只需要 25ms 左右，而 类型化数组却超过了 30ms。
* 我在 Node v10.13.0 上测试结果：普通数组只要 11ms 左右，类型化数组却超过 20ms。
* 而我在 Firefox 66.0.4 上测试结果却完全相反且相差很多：普通数组要超过 170ms 左右，而类型化数组只大约 30ms。

#### 混杂类型元素数组 VS 单一类型元素数组 —— 前者明显慢得多
  ```js
  var LIMIT = 10000000;
  var arr = new Array(LIMIT);
  arr.push({ a: 22 });
  console.time("Heterogeneous array insertion time");
  for (var i = 0; i < LIMIT; i++) {
      arr[i] = i;
  }
  console.timeEnd("Heterogeneous rray insertion time");
  ```

* 我在 windows Chrome 75.0.3770.142 上测试结果：超过 800ms
* 我在 Node v10.13.0 上测试结果：超过 700ms
* 我在 Firefox 66.0.4 上测试结果：超过 2000ms

###　读取速度比较
#### 单一类型元素数组 VS 类型化数组
* 引用文章中的测试结果：普通数组 196ms，类型化数组 27ms
* 我测试的结果：没有差别

#### 混杂类型元素数组 VS 单一类型元素数组 —— 没有差别


## References
* [Diving deep into JavaScript array – evolution & performance](http://voidcanvas.com/javascript-array-evolution-performance/)
* [探究JS V8引擎下的“数组”底层实现](https://zhuanlan.zhihu.com/p/96959371)
