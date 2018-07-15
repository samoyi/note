# Buffer的拼接

## 多字节字符的问题
使用下面的方法读取文件中的文本：
```js
const fs = require('fs');

let rs = fs.createReadStream('test.md');
let data = '';

rs.on("data", function (chunk){
    data += chunk;
});
rs.on("end", function () {
    console.log(data);
});
```
1. 一般不会出错，但是有隐患。  
2. 在本文有多字节字符的情况下，一个 chunk 的边界可能会截断一个多字节字符。chunk 是
一个 Buffer 对象，在进行`data += chunk`操作时，会被转换为字符串。如果该 chunk 正
好截断了一个多字节字符，则最后的结果就会出现乱码。  
3. 但一般不会出错是因为，文本里不一定有多字节字符，或者 chunk 正好没有截断多字节字
符，还有一个更可能的原因是，一个 chunk 的大小默认有 64KB，即`fs.createReadStream`
的`highWaterMark`参数，默认为 64*1024。只要文本不超过 64KB，就会一次读取进一个
chunk。
4. 知道了一般不会出错的原因，也可以很方便的模拟出错。假设`test.md`中的文本是
`床前明月光，疑是地上霜；举头望明月，低头思故乡。`，现在把`highWaterMark`参数设为
`11`，这样就一定会截断汉字。

```js
const fs = require('fs');

let rs = fs.createReadStream('test.md', {highWaterMark: 11});
let data = '';

rs.on("data", function (chunk){
    data += chunk;
});
rs.on("end", function () {
    console.log(data); // 床前明��光，疑���地上霜；举头��明月，���头思故乡。
});
```


## 解决
### 使用 `readable.setEncoding(encoding)`
1. The `readable.setEncoding()` method sets the character encoding for data read
 from the `Readable` stream.
2. By default, no encoding is assigned and stream data will be returned as
`Buffer` objects. Setting an encoding causes the stream data to be returned as
strings of the specified encoding rather than as `Buffer` objects.
3. The `Readable` stream will properly handle multi-byte characters delivered
through the stream that would otherwise become improperly decoded if simply
pulled from the stream as `Buffer` objects.

```js
const fs = require('fs');

let rs = fs.createReadStream('test.md', {highWaterMark: 11});
rs.setEncoding('utf8');

let data = '';

rs.on("data", function (chunk){
    // console.log(typeof chunk); // 之前是 object，现在是 string
    data += chunk;
});
rs.on("end", function () {
    console.log(data); // 床前明月光，疑是地上霜；举头望明月，低头思故乡。
});
```

#### 实现原理
1. 在调用`setEncoding()`时，可读流对象在内部设置了一个`decoder`对象。
2. 每次`data`事件都通过该`decoder`对象进行`Buffer`到字符串的解码，然后传递给调用者。
3. `decoder`对象来自于`string_decoder`模块`StringDecoder`的实例对象。When a
`Buffer` instance is written to the `StringDecoder` instance, an internal buffer
 is used to ensure that the decoded string does not contain any incomplete
multibyte characters. These are held in the buffer until the next call to
`stringDecoder.write()` or until `stringDecoder.end()` is called.
4. 但`string_decoder`只能处理 UTF-8、Base64 和 UCS-2/UTF-16LE 这3种编码。要处理其他
类型的编码，还需要借助例如 iconv 和 iconv-lite 这样的外部模块。见
[《深入浅出Node.js》6.3.3](https://book.douban.com/subject/25768396/)

### 拼接时不转化为字符串
每次接受的`Buffer`对象先统一保存进数组，最后使用`Buffer.concat`合并为一个完整的
Buffer，然后再转换为字符串：
```js
const fs = require('fs');

let rs = fs.createReadStream('test.md', {highWaterMark: 11});
let chunks = [];
let chunksSize = 0;

rs.on("data", function (chunk){
    chunks.push(chunk);
    chunksSize += chunk.length;
});
rs.on("end", function () {
    let buffer = Buffer.concat(chunks, chunksSize);
    console.log(buffer + '');
});
```

#### `Buffer.concat(list[, totalLength])`
* `totalLength`不是`list`的`length`，而是里面所有 Buffer 的`length`的总和。
* If `totalLength` is not provided, it is calculated from the `Buffer` instances
in `list`. This however causes an additional loop to be executed in order to
calculate the `totalLength`, so it is faster to provide the length explicitly if
 it is already known.



## References
* [《深入浅出Node.js》](https://book.douban.com/subject/25768396/)
