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




## References
* [《深入浅出Node.js》](https://book.douban.com/subject/25768396/)
