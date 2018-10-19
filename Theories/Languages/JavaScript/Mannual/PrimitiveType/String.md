# String

## 查询字符串
### 正确识别字符串长度
1. 因为 JavaScript 的字符串规则是 UCS-2，所以16位以上的 Unicode 字符，识别为2个字符。
2. 使用 ES6 的扩展运算符或者`Array.from()`将字符串转化为数组则可以正确的识别字符的数量
，因此最好使用如下方法来取得字符串的长度
```js
function length(str){
    return [...str].length;
    //return Array.from(str).length; // 或者这个
}
```

### 查找某个位置的字符
1. 中括号方法和`charAt()`方法查找指定位置的字符
2. 这两个方法共同的问题就是，不能正确处理多字节字符。如果为了万无一失，就不能用这两个方
法，而应该把字符串转换为数组。

### 查找子字符串的位置
#### `indexOf()`和`lastIndexOf()`
不支持正则表达式

#### `match()`
支持正则表达式

#### `search()`
只支持正则表达式或者可以转换成正则表达式的参数

### 获得子字符串
* `slice()`
* `substring()`
* `substr()`

### 是否（在头或尾）包含某子字符串
* `includes()`
* `startsWidth()`和`endsWidth()`

### Verify a string as palindrome
```js
function isPalindrome(str){
    return str === [...str].reverse().join('');
}
```


## 改变字符串
### 拼接字符串
1. `+`和`concat()`
2. [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/concat):
>It is strongly recommended that the assignment operators (+, +=) are used
instead of the concat() method. According to this performance test,
the assignment operators are several times faster.

### 增长字符串
* `repaet()`
* `padStart()`和`padEnd()`

### 反转字符串
```js
function strReverse(str){
    return [...str].reverse().join("");
}
```

### 字符串去重
```js
function strUnique(str){
    return [...new Set(str)].join("");
}
```


## 其他
### 支持正则表达式的方法
* `search()`
* `replace()`
* `match()`
* `split()`

### 对原字符串的改变
都不改变原字符串？
