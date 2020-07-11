# Data Abstraction


<!-- TOC -->

- [Data Abstraction](#data-abstraction)
    - [思想](#思想)
    - [一些算法实现](#一些算法实现)
        - [判断字符串是否是一条回文](#判断字符串是否是一条回文)
        - [判断两个字符串是否回环变位](#判断两个字符串是否回环变位)
        - [一个使用递归反转字符串的方法](#一个使用递归反转字符串的方法)
    - [References](#references)

<!-- /TOC -->


## 思想


## 一些算法实现
### 判断字符串是否是一条回文
```js
function isPalindrome(str) {
    let arr = [...str];
    let len = arr.length;

    for (let i=0; i<len/2; i++) {
        if (arr[i] !== arr[len - 1 - i]) {
            return false;
        }
    }

    return true;
}
```

### 判断两个字符串是否回环变位
1. 如果字符串 `s` 中的字符循环移动任意位置之后能够得到另一个字符串 `t`，那么 `s` 就被称为 `t` 的回环变位（circular rotation）。例如，`ACTGACG` 就是 `TGACGAC` 的一个回环变位，反之亦然。
2. 刚开始想到的是最直观的实现
    ```js
    function isCircularRotation (str1, str2) {
        let len1 = str1.length;
        let len2 = str2.length;

        if (str1 === str2) {
            return true;
        }
        if (len1 !== len2) {
            return false;
        }

        for (let i=1; i<len1; i++) {
            if (str1.slice(i) + str1.slice(0, i) === str2) {
                return true;
            }
        }

        return false;
    }
    ```
3. 但是更好的实现是
    ```js
    function isCircularRotation (str1, str2) {
        let len1 = str1.length;
        let len2 = str2.length;

        if (len1 !== len2) {
            return false;
        }

        return (str1 + str1).indexOf(str2) > -1;
    }
    ```
4. TODO 怎么想到这个方法的呢？

### 一个使用递归反转字符串的方法
和归并排序的分支思想类似
```js
function reverse (str) {
    let len = str.length;
    if (len <= 1) return str;

    let sub1 = str.slice(0, len/2);
    let sub2 = str.slice(len/2);

    return reverse(sub2) + reverse(sub1);
}
```


## References
* [算法（第4版）](https://book.douban.com/subject/19952400/)