# JavaScript Defensive Programming

## Basic
* 使用ES6语法
* 使用strict mode
* 不要使用 ==
* 从自己系统以外进来的数据，必须要检查类型或者转换类型
* JS文件头部加分号

## 字符
### 获取字符串长度是考虑双字节字符
```
function strLen(str){
    return [...str].length;
}
```

## 数学计算
### 严格的相等比较
```
// 如果有一个比较数是NaN、正负无穷或者非Number类型，则返回NaN
// 第三个参数如果为真，则区分正负零
function mathEquality(m, n, bDistinguishNegativeZero=false){
	if( !isFinite(m) || !isFinite(n) ){
		return NaN;
	}
	return bDistinguishNegativeZero ? Object.is(m, n) : (m===n);
}
```

## 数据类型
### 类型检测
#### 应该对计算的输入数据和结果进行类型检测
```
let a = 4/2,
	b = 8/undefined;
a === b; // false。

let c = 4 + 2,
    d = 3 + "3";
c === d; // false
```
第一个例子，如果只看结果，你以为两个结算结果不相等，而实际上是一个计算出错了。  
第二个例子，如果只看结果，你以为两个结算结果不相等，而实际上是一个结果意外的成了其他类型。
