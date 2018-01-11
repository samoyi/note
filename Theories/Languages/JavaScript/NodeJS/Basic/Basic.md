# Stream

Node.js 的异步编程接口习惯是以函数的最后一个参数为回调函数，通常一个函数只有一个回调函
数。回调函数是实际参数中第一个是err，其余的参数是其他返回的内容。如果没有发生错误，err
的值会是null或 undefined。如果有错误发生，err通常是Error对象的实例。



***
## References
* [Node.js v8.5.0 Documentation](https://nodejs.org/api/stream.html)
* [Node.js v8.4.0 文档](http://nodejs.cn/api/stream.html)
