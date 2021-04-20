# Encapsulate Collection


<!-- TOC -->

- [Encapsulate Collection](#encapsulate-collection)
    - [思想](#思想)
        - [黑箱](#黑箱)
    - [涉及的 bad codes](#涉及的-bad-codes)
    - [Motivation](#motivation)
    - [实现方法](#实现方法)
        - [使用 setter 返回副本的方法](#使用-setter-返回副本的方法)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
### 黑箱


## 涉及的 bad codes
* Mutable Data


## Motivation
1. 封装的变量如果是集合（或者说 JavaScript 里的任何引用类型），那么你虽然可以监听对集合变量本身的修改，但是集合元素的修改却不能被监听到。
2. 所以对于集合元素的修改，应该提供专门的方法，例如添加和删除，这样就能监听到。
3. 但是如果有人没有遵守开发规则，他不使用这些方法一样能直接修改集合的元素。
4. 所以安全起见，在封装集合变量时，不应该返回集合本身，而应该返回集合的副本。


## 实现方法
1. 一种不太好的方法是完全不返回集合，而是针对集合的所有元素都提供访问方法。但是这样对于封装方和适用方都不方便。
2. 另一种方法是返回只读的集合，对返回的集合修改会提示错误。例如使用 JavaScript 的 `Object.freeze()`。
3. 不过最常用的方法是返回集合的一个副本。


### 使用 setter 返回副本的方法
1. Probably the most common approach is to provide a getting method for the collection, but make it return a copy of the underlying collection. 
2. That way, any modifications to the copy don’t affect the encapsulated collection. 
3. This might cause some confusion if programmers expect the returned collection to modify the source field — but in many code bases, programmers are used to collection getters providing copies. 
4. If the collection is huge, this may be a performance issue — but most lists aren’t all that big.
5. 如果原始数据结构的属性也是引用类型，则需要进行深拷贝才能真正保护原始数据。下面这样的浅拷贝并不行
    ```js
    let arr = [1, [2]];
    let newArr = arr.slice();
    newArr[1][0] = 3;
    console.log(arr[1]); // [3]
    ```


## Mechanics
从直接返回原始 collection
```js
class Person {
    get courcses () {
        return this._courses; // 还是直接返回了原始 collection 的引用
    }
    set courses(aList) {
        this._courses = aList;
    }
}
```
到返回原始集合的副本
```js
class Person {
    get courses () {
        return this._courses.slice();
    }
    addCourse(aCourse) {
        //...
    }
    removeCourse(aCourse) {
        //...
    }
}
```


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
