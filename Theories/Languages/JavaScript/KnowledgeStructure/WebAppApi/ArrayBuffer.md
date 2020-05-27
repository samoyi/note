# ArrayBuffer


<!-- TOC -->

- [ArrayBuffer](#arraybuffer)
    - [产生背景](#产生背景)
    - [概念](#概念)
        - [`ArrayBuffer`](#arraybuffer)
        - [视图](#视图)
    - [`ArrayBuffer`](#arraybuffer-1)
        - [创建 `ArrayBuffer` 和视图](#创建-arraybuffer-和视图)
        - [实例方法和静态方法](#实例方法和静态方法)
            - [`ArrayBuffer.prototype.byteLength`](#arraybufferprototypebytelength)
            - [`ArrayBuffer.prototype.slice(begin[, end])`](#arraybufferprototypeslicebegin-end)
            - [`ArrayBuffer.isView(arg)`](#arraybufferisviewarg)
    - [Typed Array](#typed-array)
        - [概述](#概述)
        - [构造函数](#构造函数)
            - [使用 `ArrayBuffer` 构造](#使用-arraybuffer-构造)
            - [直接分配内存](#直接分配内存)
            - [通过另一个 TypedArray 构造](#通过另一个-typedarray-构造)
            - [`TypedArray.from()` 和 `TypedArray.of()`](#typedarrayfrom-和-typedarrayof)
            - [new TypedArray(object)](#new-typedarrayobject)
        - [数组方法](#数组方法)
        - [字节序  TODO](#字节序--todo)
        - [一些特别属性和方法](#一些特别属性和方法)
            - [静态属性和实例属性 `BYTES_PER_ELEMENT`](#静态属性和实例属性-bytes_per_element)
            - [`TypedArray.prototype.buffer`](#typedarrayprototypebuffer)
            - [`TypedArray.prototype.byteLength`，`TypedArray.prototype.byteOffset`](#typedarrayprototypebytelengthtypedarrayprototypebyteoffset)
            - [`TypedArray.prototype.set()`](#typedarrayprototypeset)
        - [ArrayBuffer 与字符串的互相转换](#arraybuffer-与字符串的互相转换)
        - [溢出](#溢出)
    - [References](#references)

<!-- /TOC -->


## 产生背景
1. `ArrayBuffer` 对象、`TypedArray` 视图和 `DataView` 视图是 JavaScript 操作二进制数据的一个接口。
2. 这些对象早就存在，属于独立的规格（2011 年 2 月发布），ES6 将它们纳入了 ECMAScript 规格，并且增加了新的方法。
3. 它们都是以数组的语法处理二进制数据，所以统称为二进制数组。
4. 这个接口的原始设计目的，与 WebGL 项目有关。所谓 WebGL，就是指浏览器与显卡之间的通信接口。为了满足 JavaScript 与显卡之间大量的、实时的数据交换，它们之间的数据通信必须是二进制的，而不能是传统的文本格式。
5. 如果使用文本格式传递一个 32 位整数，两端的 JavaScript 脚本与显卡都要进行格式转化，将非常耗时。
6. 这时要是存在一种机制，可以像 C 语言那样，直接操作字节，将 4 个字节的 32 位整数，以二进制形式原封不动地送入显卡，脚本的性能就会大幅提升。
7. 二进制数组就是在这种背景下诞生的。它很像 C 语言的数组，允许开发者以数组下标的形式，直接操作内存，大大增强了 JavaScript 处理二进制数据的能力，使得开发者有可能通过 JavaScript 与操作系统的原生接口进行二进制通信。


## 概念
### `ArrayBuffer`
1. The `ArrayBuffer` object is used to represent a generic, fixed-length raw binary data buffer.
2. It is an array of bytes, often referred to in other languages as a "byte array".
3. 关于 buffer 的概念，意思应该是说，JS 要操作一个二进制文件，但这个文件可能很大，你不能一次性处理整个的。所以你每次就取一部分，放到缓冲区里面，处理完了再取另一部分放到缓冲区里。功能有些像内存，只不过内存是为了平衡速度，而这里的缓冲区是为了平衡数据的大小。参考这个[提问](https://www.zhihu.com/question/26190832)。

### 视图
1. 不能直接读写 `ArrayBuffer`，只能通过视图来读写，视图的作用是以指定格式解读二进制数据。
2. `ArrayBuffer` 对象作为内存区域，可以存放多种类型的数据。同一段内存，不同数据有不同的解读方式，这就叫做 **视图**（view）。
3. `ArrayBuffer` 有两种视图，一种是 Typed Array 视图，另一种是 `DataView` 视图。前者的数组成员都是同一个数据类型，后者的数组成员可以是不同的数据类型。


## `ArrayBuffer`
### 创建 `ArrayBuffer` 和视图
1. `ArrayBuffer` 构造函数可以分配一段存放数据的连续内存区域。`ArrayBuffer` 构造函数的参数是所需要的内存大小（单位字节）
    ```js
    const buffer = new ArrayBuffer(32);
    ```
2. 上面代码生成了一段 32 字节的内存区域，每个字节的值默认都是 0。
3. 为了读写这段内容，需要为它指定视图。`DataView` 视图的创建，需要提供 `ArrayBuffer` 对象实例作为参数
    ```js
    const buffer = new ArrayBuffer(32);
    const dataView = new DataView(buffer);
    dataView.getUint8(0) // 0
    ```
4. 上面代码对一段 32 字节的内存，建立 `DataView` 视图，然后以不带符号的 8 位整数格式，从头读取 8 位二进制数据。结果得到 0，因为原始内存的 `ArrayBuffer` 对象，默认所有位都是 0。
5. 如果使用 Typed Array 视图，它不是一个构造函数，而是一组构造函数，代表不同的数据格式
    ```js
    const buffer = new ArrayBuffer(12);

    const x1 = new Int32Array(buffer);
    x1[0] = 1;
    console.log(x1[0]); // 1

    const x2 = new Uint8Array(buffer);
    x2[0]  = 2;
    console.log(x1[0]); // 2
    ```
6. 上面代码对同一段内存，分别建立两种视图：32 位带符号整数和 8 位不带符号整数。由于两个视图对应的是同一段内存，一个视图修改底层内存，会影响到另一个视图。

### 实例方法和静态方法
#### `ArrayBuffer.prototype.byteLength`
The read-only size, in bytes, of the `ArrayBuffer`. This is established when the array is constructed and cannot be changed.
```js
const buffer = new ArrayBuffer(32);
console.log(buffer.byteLength); // 32
```

#### `ArrayBuffer.prototype.slice(begin[, end])`
1. Returns a new `ArrayBuffer` whose contents are a copy of this `ArrayBuffer`'s bytes from `begin` (inclusive) up to `end` (exclusive).
2. `slice` 方法其实包含两步，第一步是先分配一段新内存，第二步是将原来那个 `ArrayBuffer` 对象拷贝过去。
3. 除了 `slice` 方法，`ArrayBuffer` 对象不提供任何直接读写内存的方法，只允许在其上方建立视图，然后通过视图读写。

#### `ArrayBuffer.isView(arg)`
Returns `true` if `arg` is one of the ArrayBuffer views, such as typed array objects or a `DataView`. Returns `false` otherwise.
```js
const buffer = new ArrayBuffer(8);
ArrayBuffer.isView(buffer) // false

const v = new Int32Array(buffer);
ArrayBuffer.isView(v) // true
```


## Typed Array
### 概述
1. Typed Array 视图一共包括 9 种类型，每一种视图对应一种构造函数。[完整的类型表格](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray#TypedArray_objects)
2. 它们很像普通数组，都有 `length` 属性，都能用方括号运算符获取单个元素，所有数组的方法，在它们上面都能使用。
3. 普通数组与 Typed Array 数组的差异主要在以下方面：
    * Typed Array 数组的所有成员，都是同一种类型。
    * Typed Array 数组的成员是连续的，不会有空位。
    * Typed Array 数组成员的默认值为 0。
    * Typed Array 数组只是一层视图，本身不储存数据，它的数据都储存在底层的 `ArrayBuffer` 对象之中，要获取底层对象必须使用 `buffer` 属性。
4. 每个构造函数都和实例都有属性 `BYTES_PER_ELEMENT`
    ```js
    console.log(Uint8Array.BYTES_PER_ELEMENT);  // 1

    const buffer = new ArrayBuffer(4);
    const uInt16View = new Uint16Array(buffer);
    console.log(uInt16View.BYTES_PER_ELEMENT); // 2
    ```

### 构造函数
有 4 种方法创建 TypedArray 实例

#### 使用 `ArrayBuffer` 构造
1. `new TypedArray(buffer [, byteOffset [, length]]);`
2. When called with a buffer, and optionally a `byteOffset` and a `length` argument, a new typed array view is created that views the specified `ArrayBuffer`. 
3. The `byteOffset` and `length` parameters specify the memory range that will be exposed by the typed array view. 
    ```js
    // 创建一个 8 字节的 ArrayBuffer
    const buffer = new ArrayBuffer(8);

    // 创建一个指向 buffer 的 Int32 视图，开始于字节 0，直到缓冲区的末尾
    const v1 = new Int32Array(buffer);

    // 创建一个指向 buffer 的 Uint8 视图，开始于字节 2，直到缓冲区的末尾
    const v2 = new Uint8Array(buffer, 2);

    // 创建一个指向 buffer 的 Int16 视图，开始于字节 2，长度为 2
    const v3 = new Int16Array(buffer, 2, 2);

    // length 参数指定的是数组元素个数，不是字节数
    console.log(v3.length);     // 2
    console.log(v3.byteLength); // 4
    ```
4. `v1`、`v2` 和 `v3` 是重叠的：`v1[0]`是一个 32 位整数，指向字节 0 ～字节 3；`v2[0]`是一个 8 位无符号整数，指向字节 2；`v3[0]`是一个 16 位整数，指向字节 2 ～字节 3。只要任何一个视图对内存有所修改，就会在另外两个视图上反应出来。
5. 注意，`byteOffset` 必须与所要建立的数组类型的单位长度匹配类型
    ```js
    const buffer = new ArrayBuffer(8);
    const v3 = new Int16Array(buffer, 1, 2); // RangeError: start offset of Int16Array should be a multiple of 2
    // 因为 Int16Array 一个元素是两字节，所以不能这样从中间截断
    ```

#### 直接分配内存
1. 视图还可以不通过 `ArrayBuffer` 对象，直接分配内存而生成。
    ```js
    const f64a = new Float64Array(8);
    f64a[0] = 10;
    f64a[1] = 20;
    f64a[2] = f64a[0] + f64a[1];
    console.log(f64a); // Float64Array(8) [10, 20, 30, 0, 0, 0, 0, 0]
    ```
2. 上面代码生成一个 8 个成员的 `Float64Array` 数组（共 64 字节），然后依次对每个成员赋值。
3. 这时，视图构造函数的参数就是成员的个数。
4. 可以看到，视图数组的赋值操作与普通数组的操作毫无两样。

#### 通过另一个 TypedArray 构造
1. TypedArray 数组的构造函数，可以接受另一个 TypedArray 实例作为参数。
    ```js
    const typedArray = new Int8Array(new Uint8Array(4));
    ```
2. 上面代码中，`Int8Array` 构造函数接受一个 `Uint8Array` 实例作为参数。
3. 此时生成的新数组，只是复制了参数数组的值，对应的底层内存是不一样的。新数组会开辟一段新的内存储存数据，不会在原数组的内存之上建立视图
    ```js
    const x = new Int8Array([1, 1]);
    const y = new Int8Array(x);
    console.log(x[0]); // 1
    console.log(y[0]); // 1

    x[0] = 2;
    console.log(x[0]); // 2
    console.log(y[0]); // 1
    ```
4. 如果想基于同一段内存，构造不同的视图，可以采用下面的写法。
    ```js
    const x = new Int8Array([1, 1]);
    const y = new Int8Array(x.buffer);
    x[0] // 1
    y[0] // 1

    x[0] = 2;
    y[0] // 2
    ```
5. The `buffer` accessor property represents the ArrayBuffer referenced by a TypedArray at construction time.

#### `TypedArray.from()` 和 `TypedArray.of()`
1. 每个构造函数都有这两个静态方法，将参数转换为对应的类型化数组。
2. 前者的参数是类数组或者可迭代对象，还可以指定映射函数及其中的 `this`：`TypedArray.from(source[, mapFn[, thisArg]])`
    ```js
    // 使用 Set (可迭代对象)
    var s = new Set([1, 2, 3]);
    Uint8Array.from(s);
    // Uint8Array [ 1, 2, 3 ]


    // 使用字符串
    Int16Array.from('123');                      
    // Int16Array [ 1, 2, 3 ]


    // 使用箭头函数对数组元素进行映射
    Float32Array.from([1, 2, 3], x => x + x);      
    // Float32Array [ 2, 4, 6 ]


    // 生成一个数字序列
    Uint8Array.from({length: 5}, (v, k) => k);    
    // Uint8Array [ 0, 1, 2, 3, 4 ]
    ```
3. 后者的参数是若干个数组项
    ```js
    Uint8Array.of(1);            // Uint8Array [ 1 ]
    Int8Array.of("1", "2", "3"); // Int8Array [ 1, 2, 3 ]
    Float32Array.of(1, 2, 3);    // Float32Array [ 1, 2, 3 ]
    Int16Array.of(undefined);    // IntArray [ 0 ]
    ```

#### new TypedArray(object)
1. When called with an `object` argument, a new typed array is created as if by the `TypedArray.from()` method
    ```js
    const typedArray1 = new Uint8Array([1, 2]);
    console.log(typedArray1); // Uint8Array(2) [1, 2]
    ```
2. 上面代码从一个普通的数组，生成一个 8 位无符号整数的 TypedArray 实例。
3. 这时 TypedArray 视图会重新开辟内存，不会在原数组的内存上建立视图。
4. 注意这里说和 `TypedArray.from()` 一样是只在参数为 `object` 类型的情况下。下面字符串类型时，就和 `TypedArray.from()` 不一样了
    ```js
    const typedArray2 = new Uint8Array('12');
    console.log(typedArray2); // Uint8Array(12) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    const typedArray3 = Uint8Array.from('12');
    console.log(typedArray3); // Uint8Array(2) [1, 2]
    ```
5. TypedArray 数组也可以转换回普通数组
    ```js
    const typedArray = new Uint8Array([1, 2]);

    const normalArray1 = [...typedArray];
    // or
    const normalArray2 = Array.from(typedArray);
    // or
    const normalArray3 = Array.prototype.slice.call(typedArray);

    console.log(normalArray1); // [1, 2]
    console.log(normalArray2); // [1, 2]
    console.log(normalArray3); // [1, 2]
    console.log(typedArray);   // Uint8Array(2) [1, 2]
    ```

### 数组方法
1. 除了个别例外，几乎所有的普通数组的操作方法和属性，对 TypedArray 数组完全适用。
2. 注意，TypedArray 数组没有 `concat` 方法。如果想要合并多个 TypedArray 数组，可以用下面这个函数
    ```js
    function concatenate(resultConstructor, ...arrays) {
        let totalLength = 0;
        for (let arr of arrays) {
            totalLength += arr.length;
        }
        let result = new resultConstructor(totalLength);
        let offset = 0;
        for (let arr of arrays) {
            result.set(arr, offset);
            offset += arr.length;
        }
        return result;
    }
    ```

### 字节序  TODO
1. 字节序指的是数值在内存中的表示方式。
2. 下面代码生成一个 16 字节的 `ArrayBuffer` 对象，然后在它的基础上，建立了一个 32 位整数的视图。
    ```js
    const buffer = new ArrayBuffer(16);
    const int32View = new Int32Array(buffer);

    for (let i = 0; i < int32View.length; i++) {
        int32View[i] = i * 2;
    }
    ```
3. 由于每个 32 位整数占据 4 个字节，所以一共可以写入 4 个整数，依次为 0，2，4，6。
4. 下面在这段数据上接着建立一个 16 位整数的视图
    ```js
    const int16View = new Int16Array(buffer);
    for (let i = 0; i < int16View.length; i++) {
        console.log("Entry " + i + ": " + int16View[i]);
    }
    // Entry 0: 0
    // Entry 1: 0
    // Entry 2: 2
    // Entry 3: 0
    // Entry 4: 4
    // Entry 5: 0
    // Entry 6: 6
    // Entry 7: 0
    ```
5. 之前是一个数组项四个字节，保存一个整数。现在这每四个字节又一分为二。从上面的结果可以看到，整数保存在了后面的部分。

### 一些特别属性和方法
#### 静态属性和实例属性 `BYTES_PER_ELEMENT`
```js
console.log(Uint8Array.BYTES_PER_ELEMENT);  // 1

const buffer = new ArrayBuffer(4);
const uInt16View = new Uint16Array(buffer);
console.log(uInt16View.BYTES_PER_ELEMENT); // 2
```

#### `TypedArray.prototype.buffer`
返回整段内存区域对应的 `ArrayBuffer` 对象。
```js
const a = new Float32Array(64);
const b = new Uint8Array(a.buffer);
```
上面代码的 `a` 视图对象和 `b` 视图对象，对应同一个 `ArrayBuffer` 对象，即同一段内存。

#### `TypedArray.prototype.byteLength`，`TypedArray.prototype.byteOffset`
`byteLength` 属性返回 TypedArray 数组占据的内存长度，单位为字节。`byteOffset` 属性返回 TypedArray 数组从底层 `ArrayBuffer` 对象的哪个字节开始。
```js
const b = new ArrayBuffer(8);

const v1 = new Int32Array(b);
const v2 = new Uint8Array(b, 2);
const v3 = new Int16Array(b, 2, 2);

console.log(v1.byteLength); // 8
console.log(v2.byteLength); // 6
console.log(v3.byteLength); // 4

console.log(v1.byteOffset); // 0
console.log(v2.byteOffset); // 2
console.log(v3.byteOffset); // 2
```

#### `TypedArray.prototype.set()`
1. 用于复制数组（普通数组或 TypedArray 数组），也就是将一段内容完全复制到另一段内存。
    ```js
    const buffer = new ArrayBuffer(8);
    let uint8_1 = new Uint8Array(buffer);

    uint8_1.set([1, 2, 3], 3); // 把普通数组复制进 uint8_1
    console.log(uint8_1); // Uint8Array [ 0, 0, 0, 1, 2, 3, 0, 0 ]

    let uint8_2 = new Uint8Array(new ArrayBuffer(8)); // 新建一个空的 typed array
    console.log(uint8_2); // [0, 0, 0, 0, 0, 0, 0, 0]

    uint8_2.set(uint8_1); // 把 typed array 复制进 uint8_2
    console.log(uint8_2); // Uint8Array(8) [0, 0, 0, 1, 2, 3, 0, 0]

    console.log(uint8_1.buffer === uint8_2.buffer); // 复制 buffer 而不是共享 buffer
    ```
2. 因为是整段内存的复制，所以比一个个拷贝成员的复制快得多。
3. 还可以接受第二个参数 `offset`。

### ArrayBuffer 与字符串的互相转换
ArrayBuffer 和字符串的相互转换，使用原生 `TextEncoder` 和 `TextDecoder` 方法。

### 溢出
TODO


## References
* [ECMAScript 6 入门](https://es6.ruanyifeng.com/#docs/arraybuffer)
