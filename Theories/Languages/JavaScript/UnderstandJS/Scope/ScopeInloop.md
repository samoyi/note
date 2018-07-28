# Scope in loop

## 一个常见的非预期`for`循环
```js
var arr = [];
for (var i = 0; i < 3; i++){
	arr[i] = function(){console.log(i)};
}
arr[1](); // 期望1，实际3
```

实际上如果将`for`循环展开，就会很好理解
```js
{
	var i = 0;
	arr[i] = function(){console.log(i)};
}
{
	var i = 1;
	arr[i] = function(){console.log(i)};
}
{
	var i = 2;
	arr[i] = function(){console.log(i)};
}
{
	var i = 3;
}
```
对于`var`声明的变量，花括号并不会对其生成一层作用域，所以这三个函数中的`i`的作用域链就
只有两层：函数内部和全局。在调用函数的时候，全局的`i`已经3了。


## 一个常见的解决方法
```js
for (var i = 0; i < 3; i++){
	(function(i){
		arr[i] = function(){console.log(i)};
	})(i);
}
arr[1](); // 1
```
`for`循环内部现在是一个立即执行的函数，因此就有了一层新的作用域，现在的作用域链成了三层。
最内部的`console.log(i)`在执行时不需要检索到最外层的全局作用域，直接在立即执行函数内部
就找到了`i`的值，该值是每次循环是作为参数传进来的，所以每一次的值都是当前循环的`i`值。  


## 使用`let`定义循环序号
```js
var arr = [];
for (let i = 0; i < 3; i++){
    arr[i] = function(){console.log(i)};
}
arr[1](); // 1
```

将循环展开，就能清楚的看到为什么用`let`会是1而不是3
```js
{
	let i = 0;
	arr[i] = function(){console.log(i)};
}
{
	let i = 1;
	arr[i] = function(){console.log(i)};
}
{
	let i = 2;
	arr[i] = function(){console.log(i)};
}
{
	let i = 3;
}
```
现在每个函数都有自己的块级作用域，内部定义了自己的`i`
