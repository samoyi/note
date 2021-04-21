# Replace Primitive with Object


## 原则
如果某种数据在系统中比较重要，有自己的内部逻辑，那就可以考虑抽象成类，以此来约束这一类数据的属性和行为。


## 场景
### 属性约束
1. 比如后台管理系统中有管理员列表，可以新增或者删除管理员。
2. 一个管理员可能只是简单的保存姓名和手机号，并没有行为。
3. 刚开始可能只是使用简单的键值对来临时保存和传递，在新增的时候分别校验它的 name 字段和 phone 字段。
4. 这个对象很简单，也没有行为，似乎也不用抽象成类。
5. 但因为它可能会用在好几个地方，而且这个对象也比较重要，如果在各个地方分别进行校验，做到校验逻辑的同步就比较麻烦，而且容易出错。
6. 并且，“管理员” 本身在逻辑上就是一个有特定特征的对象，所以把封装为类并且加入统一的校验逻辑也比较符合语义化。
    ```js
    function throwInvalidFieldName (invalidFieldName) {
        throw new TypeError(invalidFieldName);
    }

    function assertName (sName) {
        if (!sName) {
            throwInvalidFieldName('name');
        }
    }

    function assertPhone (sPhone) {
        let isValid = /^1\d{10}$/.test(sPhone);
        if (!isValid) {
            throwInvalidFieldName('phone');
        }
    }


    export default class Admin {
        constructor (name, phone) {
            const trimmedName = name.trim();
            const trimmedPhone = phone.trim();
            assertName(trimmedName);
            assertPhone(trimmedPhone);
            this.name = trimmedName;
            this.phone = trimmedPhone;
        }
    }
    ```


## 过度优化


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
