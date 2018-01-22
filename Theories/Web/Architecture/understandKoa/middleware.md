# Middleware

## Stack-like async middleware system
A Koa application is an object containing an array of middleware functions which
 are composed and executed in a stack-like manner upon request.  

 <mark>不懂。Koa这种中间件加载机制和`Connect`的线性同步的机制相比有什么优劣？</mark>
```js
const Koa = require('koa');
const app = new Koa();

const one = async (ctx, next) => {
  console.log(1);
  await next();
  console.log(6);
}

const two = async (ctx, next) => {
  console.log(2);
  await next();
  console.log(5);
}

const three = async (ctx, next) => {
  console.log(3);
  await next();
  console.log(4);
}

app.use(one);
app.use(two);
app.use(three);

app.listen(3000);
```
输出为：
```
1
2
3
4
5
6
```



## References
* [Koa](http://koajs.com/)
* [Koa 框架教程](http://www.ruanyifeng.com/blog/2017/08/koa.html)
* [Koa2 源码赏析](http://maples7.com/2017/04/09/koa2-src/)
