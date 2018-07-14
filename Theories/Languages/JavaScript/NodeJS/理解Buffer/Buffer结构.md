# Buffer 结构

* Buffer 是一个典型的 JavaScript 与 C++ 结合的模块，它将性能相关部分用 C++ 实现，将非
性能相关的部分用 JavaScript 实现。
* 由于 Buffer 太过常见，Node 在进程启动时就已经加载了它，并将其放在全局对象（global）
上。所以在使用 Buffer 时，无须通过`require()`即可直接使用。


## Buffer 对象
### Buffer 对象类似于数组，它的元素为16进制的两位数
    ```js
    let str = "深入浅出node.js";
    // let buf = new Buffer(str, 'utf-8'); // Stability: 0 - Deprecated.
    let buf = Buffer.from(str, 'utf-8')
    console.log(buf);
    // => <Buffer e6 b7 b1 e5 85 a5 e6 b5 85 e5 87 ba 6e 6f 64 65 2e 6a 73>
    console.log(buf.length); // 19  4个UTF-8汉字，7个字母和半角符号
    ```

### 通过下标访问元素和进行赋值
```js
console.log(buf[3].toString(16)) // e5
buf[18] = 0x73 - 8; // "k" 的 ASCII 值
console.log(buf + ''); // "深入浅出node.jk"
```

#### 超出范围的赋值和赋值小数
给元素的赋值如果小于0，就将该值逐次加256，直到得到一个0到255之间的整数。如果得到的数值
大于255，就逐次减256，直到得到0~255区间内的数值。如果是小数，舍弃小数部分，只保留整数部
分。
```js
buf[18] = -100;
console.log(buf[18]); // 156
buf[18] = 300;
console.log(buf[18]); // 44
buf[18] = 3.9;
console.log(buf[18]); // 3
```


## Buffer 内存分配机制
Buffer 对象的内存分配不是在 V8 的堆内存中，而是在 Node 的 C++ 层面实现内存的申请的。因
为处理大量的字节数据不能采用需要一点内存就向操作系统申请一点内存的方式，这可能造成大量的
内存申请的系统调用，对操作系统有一定压力。为此 Node 在内存的使用上应用的是在 C++ 层面申
请内存、在 JavaScript 中分配内存的策略。

### slab
1. 为了高效地使用申请来的内存，Node 采用了 slab 分配机制。
2. slab 就是一块申请好的固定大小的内存区域。具有如下3种状态：
    * full：完全分配状态。
    * partial：部分分配状态。
    * empty：没有被分配状态。
3. 当我们需要一个 Buffer 对象，可以通过以下方式分配指定大小的 Buffer 对象：
    ```js
    // new Buffer(size); // Stability: 0 - Deprecated
    Buffer.alloc(size);
    ```
4. Node 以 8 KB 为界限来区分 Buffer 是大对象还是小对象：
    ```js
    Buffer.poolSize = 8 * 1024;
    ```
这个 8 KB 的值也就是每个 slab 的大小值，在 JavaScript 层面，以它作为单位单元进行内存的
分配。

### 分配小 Buffer 对象
1. 如果指定 Buffer 的大小少于 8 KB，Node 会按照小对象的方式进行分配。
2. Buffer 的分配过程中主要使用一个局部变量`pool`作为中间处理对象，处于分配状态的 slab
单元都指向它。
    ```js
    var pool;
　
    function allocPool() {
      pool = new SlowBuffer(Buffer.poolSize);
      pool.used = 0;
    }
    ```
3. 新构建的 slab 单元处于 empty 状态
4. 创建小 Buffer 对象时，会先检查`pool`对象，如果`pool`没有被创建，将会创建一个新的
slab 单元指向它：
    ```js
    if (!pool || pool.length - pool.used < this.length) allocPool();
    ```
5. 同时当前 Buffer 对象的`parent`属性指向该 slab，并记录下是从这个 slab 的哪个位置
（`offset`）开始使用的，slab 对象自身也记录被使用了多少字节
    ```js
    this.parent = pool;
    this.offset = pool.used;
    pool.used += this.length;
    if (pool.used & 7) pool.used = (pool.used + 8) & ~7; // 不懂
    ```
6. 这时候的 slab 状态为 partial。
7. 当再次创建一个 Buffer 对象时，构造过程中将会判断这个 slab 的剩余空间是否足够。如果
足够，使用剩余空间，并更新 slab 的分配状态。如果 slab 剩余的空间不够，将会构造新的
slab，原 slab 中剩余的空间会造成浪费。
8. 由于同一个 slab 可能分配给多个 Buffer 对象使用，只有这些小 Buffer 对象在作用域释放
并都可以回收时，slab的 8 KB 空间才会被回收。尽管创建了1个字节的Buffer对象，但是如果不
释放它，实际可能是 8 KB 的内存没有释放。

### 分配大 Buffer 对象
1. 如果需要超过 8 KB 的 Buffer 对象，将会分配一个该 Buffer 大小的 SlowBuffer 对象作为
 slab 单元，这个 slab 单元将会被这个大Buffer对象独占。
    ```js
    this.parent = new SlowBuffer(this.length);
    this.offset = 0;
    ```


## References
* [《深入浅出Node.js》](https://book.douban.com/subject/25768396/)
