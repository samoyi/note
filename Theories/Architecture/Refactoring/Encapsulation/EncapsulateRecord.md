# Encapsulate Record


<!-- TOC -->

- [Encapsulate Record](#encapsulate-record)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [References](#references)

<!-- /TOC -->


## 思想
中层设计规则：意图与实现分离


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


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
