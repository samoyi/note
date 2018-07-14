# Buffer的转换

* Buffer对象可以与字符串之间相互转换。目前支持的字符串编码类型有如下这几种:
    * ASCII
    * UTF-8
    * UTF-16LE/UCS-2
    * Base64
    * Binary
    * Hex


## 字符串转 Buffer
1. 字符串转 Buffer 对象主要是通过`Buffer.from`完成的（构造函数的方式已经被弃用）：
    ```js
    Buffer.from(str, [encoding]);
    ```
2. 通过`Buffer.from`转换的 Buffer 对象，存储的只能是一种编码类型。`encoding`参数不传
递时，默认按 UTF-8 编码进行转码和存储。
3. 一个 Buffer 对象可以存储不同编码类型的字符串转码的值，调用`write()`方法可以实现该目
的：
    ```js
    buf.write(string, [offset], [length], [encoding])
    ```
4. 由于可以不断写入内容到 Buffer 对象中，并且每次写入可以指定编码，所以 Buffer 对象中
可以存在多种编码转化后的内容。需要小心的是，每种编码所用的字节长度不同，将 Buffer 反转
回字符串时需要谨慎处理。


## Buffer转字符串
1. Buffer 对象的`toString()`方法
```js
buf.toString([encoding], [start], [end])
```
2. 可以设置`encoding`（默认为UTF-8）、`start`、`end`这3个参数实现整体或局部的转换。
3. 如果 Buffer 对象由多种编码写入，就需要在局部指定不同的编码，才能转换回正常的编码。

```js
let buf = Buffer.alloc(5);
let str1 = '你';
let str2 = '好';
buf.write(str1, 0, 3);
buf.write(str2, 3, 2, 'ucs2');
console.log(buf.toString('utf8', 0, 3)); // "你"
console.log(buf.toString('ucs2', 3)); // "好"
```


## Buffer不支持的编码类型
1. Buffer 提供了一个`isEncoding()`函数来判断编码是否支持转换：
    ```js
    console.log(Buffer.isEncoding('ucs2')); // true
    console.log(Buffer.isEncoding('gb2312')); // false
    ```
2. 对于不支持的编码类型，可以借助 Node 生态圈中的模块完成转换。例如 iconv 和 iconv-lite



## References
* [《深入浅出Node.js》](https://book.douban.com/subject/25768396/)
