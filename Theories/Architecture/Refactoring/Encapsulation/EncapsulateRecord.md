# Encapsulate Record

formerly: Replace Record with Data Class


<!-- TOC -->

- [Encapsulate Record](#encapsulate-record)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
黑箱封装，隐藏内部实现，对于系统本身更安全，对于使用者更方便。


## Motivation


## Mechanics
从暴露可以随意修改且无法监听变动的对象
```js
const organization = {
    name: '33',
    age: 22,
};
```
到封装为可以监听和控制修改的对象
```js
class Organization {
    constructor (data) {
        this._name = data.name;
        this._age = data.age;
    }

    get name () {
        return this._name;
    }
    set name (val) {
        this._name = val;
    }

    get age () {
        return this._age;
    }
    set age (val) {
        this._age = val;
    }
}
```


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
