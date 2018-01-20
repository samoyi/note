# Generator

## Misc
* `Generator`函数可以不用`yield`表达式，这时就变成了一个单纯的暂缓执行函数。
* `yield`表达式如果用在另一个表达式之中，必须放在圆括号里面。如果用作函数参数或放在赋值
表达式的右边，可以不加括号。

## 遍历流程
```js
function* demo() {
  console.log('Hello', (yield 22))
  console.log('World', (yield 33));
}

let generator = demo();

console.log(generator.next());
console.log('==============');
console.log(generator.next());
```

输出的结果是：

```
{ value: 22, done: false }
==============
Hello undefined
{ value: 33, done: false }
```

1. 可以看出来在调用一次`next`后，按照顺序执行直到找到下一个`yield`表达式，返回它后面的
值，然后立刻停止
2. 因为`(yield 22)`这个表达式的执行顺序是在它对应的`console.log`方法之前的，所以在当
次`next`结束后，并不会执行其对应的`console.log`
3. 下一次调用`next`后，继续按照顺序执行。但这里看不出来对`yield`表达式求值是在上一次还
是这一次，总之现在有了`yield`表达式的值，即`undefined`，然后就可以执行`console.log`了
。所以第一个`yield`表达式对应的`console.log`是在下次`next`时才会调用。


## References
[Generator 函数的含义与用法](http://www.ruanyifeng.com/blog/2015/04/generator.html)
