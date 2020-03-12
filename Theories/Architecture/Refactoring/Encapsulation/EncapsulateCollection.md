# Encapsulate Collection


<!-- TOC -->

- [Encapsulate Collection](#encapsulate-collection)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [应该避免对原始 collection 的直接修改](#应该避免对原始-collection-的直接修改)
        - [一种不太好的方法——完全不返回 collection](#一种不太好的方法完全不返回-collection)
        - [返回 collection 副本的方法](#返回-collection-副本的方法)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 其实是对 Encapsulate Collection 的补充，在对数据类型是对类似于 JS 引用类型的数据结构进行封装时，只能监控对数据结构本身的整体修改，但不能监听到对其子属性的修改。
2. 在读取该数据结构时，可以返回该数据结构的副本，保证不会直接修改原始数据。
3. 但如果原始数据结构的属性也是引用类型，则需要进行深拷贝才能真正保护原始数据。下面这样的浅拷贝并不行
    ```js
    let arr = [1, [2]];
    let newArr = arr.slice();
    newArr[1][0] = 3;
    console.log(arr[1]); // [3]
    ```


## Motivation
### 应该避免对原始 collection 的直接修改
1. I like encapsulating any mutable data in my programs. This makes it **easier to see when and how data structures are modified**, which then makes it **easier to change those data structures** when I need to. 
2. Encapsulation is often encouraged, particularly by objectoriented developers, but a common mistake occurs when working with collections.
3. Access to a collection variable may be encapsulated, but if the getter returns the collection itself, then that collection’s membership can be altered without the enclosing class being able to intervene. 
4. To avoid this, I provide collection modifier methods — usually add and remove — on the class itself. This way, changes to the collection go through the owning class, giving me the opportunity to modify such changes as the program evolves.
5. If the team has the habit to not to modify collections outside the original module, just providing these methods may be enough. However, it’s usually unwise to rely on such habits; a mistake here can lead to bugs that are difficult to track down later. 
6. A better approach is to ensure that the getter for the collection does not return the raw collection, so that clients cannot accidentally change it. 

### 一种不太好的方法——完全不返回 collection
1. One way to prevent modification of the underlying collection is by never returning a collection value. 
2. In this approach, any use of a collection field is done with specific methods on the owning class, replacing `aCustomer.orders.size` with `aCustomer.numberOfOrders`. 
2. I don’t agree with this approach. Modern languages have rich collection classes with standardized interfaces, which can be combined in useful ways such as Collection Pipelines [mf-­cp]. Putting in special methods to handle this kind of functionality adds a lot of extra code and cripples the easy composability of collection operations.

### 返回 collection 副本的方法
1. Another way is to allow some form of read­only access to a collection. 
2. Java, for example, makes it easy to return a read­only proxy to the collection. Such a proxy forwards all reads to the underlying collection, but blocks all writes — in Java’s case, throwing an exception. 
3. A similar route is used by libraries that base their collection composition on some kind of iterator or enumerable object — providing that iterator cannot modify the underlying collection. 
4. Probably the most common approach is to provide a getting method for the collection, but make it return a copy of the underlying collection. That way, any modifications to the copy don’t affect the encapsulated collection. 
5. This might cause some confusion if programmers expect the returned collection to modify the source field — but in many code bases, programmers are used to collection getters providing copies. 
6. If the collection is huge, this may be a performance issue—but most lists aren’t all that big.


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
到返回原始 collection 的副本
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
