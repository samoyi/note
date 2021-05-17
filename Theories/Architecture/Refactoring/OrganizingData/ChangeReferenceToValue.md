# Change Reference to Value

inverse of: *Change Value to Reference*


<!-- TOC -->

- [Change Reference to Value](#change-reference-to-value)
    - [思想](#思想)
        - [消除非必要的可变性](#消除非必要的可变性)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
### 消除非必要的可变性
1. 如果你不希望其他人共同修改一份数据，那你分发对数据的引用（修改权限），就可能导致该数据被意外修改。
2. 这时你就应该分发数据的副本，供他们自己折腾，而不会影响到自己。


## Motivation
1. 在把一个对象（或数据结构）嵌入另一个对象时，位于内部的这个对象可以被视为引用对象，也可以被视为值对象。
2. 如果视为引用对象，则修改该对象属性的时候，就正常的直接在该对象上修改。也就是说，引用对象是可变的
    ```js
    let inner = {
        age: 33,
    }

    let outer = {
        inner,
        
        getAge () {
            return this.inner.age;
        },
        setAge (val) {
            this.inner.age = val;
        },
    }

    console.log(outer.getAge()); // 33
    outer.setAge(22);
    console.log(outer.getAge()); // 22
    console.log(inner.age); // 22
    ```
3. 如果视为值对象，那修改该对象属性时，会创建一个新的对象来替代该对象。也就是说，值对象是不可变的，只能被一个新的对象替换
    ```js
    let inner = {
        age: 33,
    }

    let outer = {
        inner,
        
        getAge () {
            return this.inner.age;
        },
        setAge (val) {
            this.inner = {
                age: val,
            };
        },
    }

    console.log(outer.getAge()); // 33
    outer.setAge(22);
    console.log(outer.getAge()); // 22
    console.log(inner.age); // 33
    ```    
4. 可以看到，因为引用对象是直接引用，那么修改时就修改了原对象，其他也访问原对象地方也会受到影响；而值对象的修改是直接替换，所以原对象会保留，其他访问原对象的地方不会受到影响。
5. 如果你希望所有访问原对象的地方可以共享修改，那就是用引用对象，否则就使用值对象。
6. 不过如果想要值引用的话，为什么引用的时候不直接使用一个副本呢？


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
