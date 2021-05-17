# Pull Up Constructor Body

inverse of: *Push Down Field*

<!-- TOC -->

- [Pull Up Constructor Body](#pull-up-constructor-body)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
消除不必要的重复，统一管理。


## Motivation
1. 也是把子类相同的逻辑提取到父类，只不过这里要提取的时候子类构造函数里面的逻辑。
2. 但是构造函数相比于普通函数本身会有一些限制，所以提取起来可能有些麻烦。
3. 如果提取起来比较麻烦，可以考虑使用 *Replace Constructor with Factory Function*，然后再进行提取。


## Mechanics
```js
// 从
class Party {}

class Employee extends Party {
    constructor (name, id, monthlyCost) {
        super();
        this._id = id;
        this._name = name;
        this._monthlyCost = monthlyCost;
    }
}

// 到
class Party {
    constructor (name) {
        this._name = name;
    }
}

class Employee extends Party {
    constructor (name, id, monthlyCost) {
        super(name);
        this._id = id;
        this._monthlyCost = monthlyCost;
    }
}
```


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
