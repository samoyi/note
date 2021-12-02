# String


<!-- TOC -->

- [String](#string)
    - [查询字符串](#查询字符串)
        - [正确识别字符串长度](#正确识别字符串长度)
        - [查找某个位置的字符](#查找某个位置的字符)
        - [Verify a string as palindrome](#verify-a-string-as-palindrome)
    - [改变字符串](#改变字符串)
        - [拼接字符串](#拼接字符串)
        - [反转字符串](#反转字符串)
        - [字符串去重](#字符串去重)
    - [比较字符串](#比较字符串)
        - [比较版本号](#比较版本号)
        - [问题描述](#问题描述)
        - [算法思路](#算法思路)
        - [边界](#边界)
        - [实现](#实现)
    - [其他](#其他)

<!-- /TOC -->


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


## 比较字符串
### 比较版本号
### 问题描述
https://leetcode-cn.com/problems/compare-version-numbers/

### 算法思路
1. 根据点号 `.` split 版本号到数组，同时删除每个数组项的前导 0；
2. 依次对比对应的数组项：
    * 如果两个数组项都存在，则比较大小：一样大就比较两个数组的下一项，否则返回结果；
    * 如果一个存在另一个不存在：
        * 判断存在的当前项以及之后的所有项是否有大于 0 的，有的话则该版本号更大
        * 否则两者相等。
    * 如果比较完了还没结果（这可以说是 “两个数组项都不存在”，但不会遍历到这种情况），则相等

### 边界
参数是否是字符串且包含数字和点号

### 实现
1. 初步实现
    ```js
    function AssertValidVerStr (str) {
        if ( typeof str !== "string" || /[^\d\.]/.test(str) ) {
            throw new TypeError();
        }
    }


    function foo (v1, v2) {
        AssertValidVerStr(v1);                                                                 
        AssertValidVerStr(v2);

        let segs1 = v1.split(".").map((item) => {
            return Number.parseInt(item);
        });                                                                 
        let segs2 = v2.split(".").map((item) => {
            return Number.parseInt(item);
        });
        
        let maxLen = Math.max(segs1.length, segs2.length);
        for (let i=0; i<maxLen; i++) {
            if ( segs1[i] !== undefined && segs2[i] !== undefined ) {
                if ( segs1[i] > segs2[i] ) {
                    return 1;
                }
                else if ( segs1[i] < segs2[i] ) {
                    return -1;
                }
            }
            else if (segs1[i] !== undefined) {
                let j = i;
                do {
                    if (segs1[j] > 0) {
                        return 1;
                    }
                    j++;
                }
                while (j < segs1.length);
                return 0;
            }
            else if (segs2[i] !== undefined) {
                let j = i;
                do {
                    if (segs2[j] > 0) {
                        return -1;
                    }
                    j++;
                }
                while (j < segs2.length)
                return 0;
            }
        }
        return 0;
    }
    ```
2. 归并排序中也遇到了一个数组提前比较完的情况，当时如果给两个数组都加上一个最大值，那么就不用判断是否其中一个已经排完了。这里也可以通过类似的思想，来避免掉最外层的两个 `else...if` 分支。
3. 在这里，当一个版本号的字段比较完之后，另一个版本号中剩余的部分要和零比较。那么如果让短的那个数组补上几个 0，让两个数组长度一样就可以。
4. 或者还有一个办法，就是让每次比较的默认值都是 0，如果一个数组的当前项有值，那就覆盖掉默认的 0，否则的话就用默认的 0 去和另一个更长的数组比较
    ```js
    function foo (v1, v2) {
        AssertValidVerStr(v1);                                                                 
        AssertValidVerStr(v2);

        let segs1 = v1.split(".").map((item) => {
            return Number.parseInt(item);
        });                                                                 
        let segs2 = v2.split(".").map((item) => {
            return Number.parseInt(item);
        });
        
        let maxLen = Math.max(segs1.length, segs2.length);
        for (let i=0; i<maxLen; i++) {
            let x = i < segs1.length ? segs1[i] : 0;
            let y = i < segs2.length ? segs2[i] : 0;
            if ( x > y ) {
                return 1;
            }
            else if ( x < y ) {
                return -1;
            }
        }
        return 0;
    }
    ```



## 其他

