# Encapsulate Collection


<!-- TOC -->

- [Encapsulate Collection](#encapsulate-collection)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [封装集合](#封装集合)
            - [初步，封装对集合的读写](#初步封装对集合的读写)
            - [进一步，只返回集合的副本，防止外部修改](#进一步只返回集合的副本防止外部修改)
    - [实现方法](#实现方法)
        - [一种不太好的方法——完全不返回集合](#一种不太好的方法完全不返回集合)
        - [返回只读集合的方法](#返回只读集合的方法)
        - [使用 setter 返回副本的方法](#使用-setter-返回副本的方法)
        - [方法的选择](#方法的选择)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
好像也没啥，如果你要维护原始数据，当然要么就禁止修改，要么就返回副本。


## Motivation
### 封装集合
#### 初步，封装对集合的读写
1. I like encapsulating any mutable data in my programs. 
2. This makes it **easier to see when and how data structures are modified**, which then makes it **easier to change those data structures** when I need to. 
3. Encapsulation is often encouraged, particularly by object-oriented developers, but a common mistake occurs when working with collections.
4. Access to a collection variable may be encapsulated, but if the getter returns the collection itself, then that collection’s membership can be altered without the enclosing class being able to intervene. 
5. To avoid this, I provide collection modifier methods — usually add and remove — on the class itself. 
6. This way, changes to the collection go through the owning class, giving me the opportunity to modify such changes as the program evolves.

#### 进一步，只返回集合的副本，防止外部修改
1. If the team has the habit to not to modify collections outside the original module, just providing these methods may be enough. 
2. However, it’s usually unwise to rely on such habits; a mistake here can lead to bugs that are difficult to track down later. 
3. A better approach is to ensure that the getter for the collection does not return the raw collection, so that clients cannot accidentally change it. 


## 实现方法
### 一种不太好的方法——完全不返回集合
1. One way to prevent modification of the underlying collection is by never returning a collection value. 
2. In this approach, any use of a collection field is done with specific methods on the owning class, replacing `aCustomer.orders.size` with `aCustomer.numberOfOrders`. 
3. I don’t agree with this approach. Modern languages have rich collection classes with standardized interfaces, which can be combined in useful ways such as Collection Pipelines [mf-­cp]. 
4. Putting in special methods to handle this kind of functionality adds a lot of extra code and cripples the easy composability of collection operations.

### 返回只读集合的方法
1. Another way is to allow some form of read-­only access to a collection. Java, for example, makes it easy to return a read­-only proxy to the collection. 
2. Such a proxy forwards all reads to the underlying collection, but blocks all writes — in Java’s case, throwing an exception. 
3. A similar route is used by libraries that base their collection composition on some kind of iterator or enumerable object — providing that iterator cannot modify the underlying collection. 

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

### 方法的选择
1. 除了返回副本的方法可能的性能问题外，another difference between using a proxy and a copy is that a modification of the source data will be visible in the proxy but not in a copy. 
2. This isn’t an issue most of the time, because lists accessed in this way are usually only held for a short time.
3. What’s important here is consistency within a code base. Use only one mechanism so everyone can get used to how it behaves and expect it when calling any collection accessor function.


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
