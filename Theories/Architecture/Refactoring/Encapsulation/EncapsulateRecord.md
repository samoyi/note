# Encapsulate Record

formerly: Replace Record with Data Class


<!-- TOC -->

- [Encapsulate Record](#encapsulate-record)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [提供明确的 API，降低使用成本](#提供明确的-api降低使用成本)
        - [提供数据读取逻辑](#提供数据读取逻辑)
        - [方便修改](#方便修改)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
* **意图与实现分离**：供使用者方便使用，但不需要他们知道功能的实现。
* **黑箱封装**：黑箱内部可以对公开的功能做一些黑箱操作；而且里面怎么修改逻辑，使用者都是无感的。


## Motivation
从记录
```js
let organization = {
    name: '33',
    age: 22,
};
```
重构为对象
```js
class Organization {
    constructor (data){
        this._name = data.name;
        this._age = data.age;
    }

    get name() {
        return this._name;
    }
    set name(newName) {
        this._name = newName;
    }
    get age() {
        return this._age;
    }
    set age(newAgew) {
        this._age = newAgew;
    }
}
```

### 提供明确的 API，降低使用成本
1. 上面只是一个很简单的记录，所以看起来比较容易。
2. 但如果记录变得复杂，里面会有各种处理逻辑，甚至有一些在某些情况下不希望暴露出来的数据。这时，记录就比较复杂了。
3. 记录的使用者需要仔细看里面的代码，他会看到自己不需要知道逻辑和数据。
4. 显然这样的情况，对于使用者是很不方便的。
5. 封装为对象后，内部的逻辑和私有内容完全隐藏了，只暴露出明确的 API，使用成本就会降低。

### 提供数据读取逻辑
1. 使用记录的情况下，数据是完全暴露，使用者可以随意的读取和修改。
2. 但有时你希望对读取和修改加上一些控制，这时就需要把数据封装为对象。

### 方便修改
1. 假设你的数据逻辑发生了变化，你使用对象的话，那 API 完全可以不变化，只在方法内部进行逻辑修改，对用户来说这样的变化就是无感的。
2. 或者你要对某个属性重命名，你完全可以提供新旧两个命名方法的，让这两个命名在重构阶段可以共存，逐步替换。


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
