# Flyweight


<!-- TOC -->

- [Flyweight](#flyweight)
    - [适用场景](#适用场景)
    - [要点](#要点)
    - [使用场景](#使用场景)
        - [一次前端内存溢出优化测试](#一次前端内存溢出优化测试)
        - [列表项复用](#列表项复用)
    - [References](#references)

<!-- /TOC -->


## 适用场景
* 同时存在大量相似对象且明显消耗内存
* 使用了多次的大成本数据结构


## 要点
* 复杂度：如果对象不多而且占用内存不明显，那就不要使用
* 共享状态不能被子类修改


## 使用场景
### 一次前端内存溢出优化测试
1. 下面的 `grow` 函数，每执行一次，内存使用就增加大概 40MB
    ```js
    let arr = [];

    class Obj {
        constructor () {
            this.list = new Array(10000000);
        }
    }

    function grow() {
        arr.push( new Obj() );
    }
    ```
2. 按照 flyweight 模式的方法，把大列表提出去共享
    ```js
    let bigList = new Array(10000000);

    let arr = [];

    class Obj {
        constructor () {
            this.list = bigList;
        }
    }

    function grow() {
        arr.push( new Obj() );
    }
    ```
3. 这样就只有在刚开始创建大数组的时候会消耗 40MB 内存，之后反复创建对象都不会再重新创建大数组了。
4. 如果希望不是一开始就创建大数组，而是创建对象的时候才创建，可以加个判断
    ```js
    let bigList = [];

    let arr = [];

    class Obj {
        constructor () {
            if ( bigList.length === 0 ) {
                bigList = new Array(10000000);
            }
            this.list = bigList;
        }
    }

    function grow() {
        arr.push( new Obj() );
    }
    ```
5. 注意，如果改成继承的方式，也不能在父类构造函数中直接创建数组
    ```js
    let arr = [];

    class Parent {
        constructor () {
            this.list = new Array(10000000);
        }
    }

    class Obj extends Parent {
        constructor () {
            super();
        }
    }

    function grow() {
        arr.push( new Obj() );
    }

    setTimeout(() => {
        console.log(arr[0].list === arr[1].list); // false
    }, 5555);
    ```
6. 因为子类构造函数会调用父类的构造函数，所以还是会反复创建大数组，所以在父类中还是要加判断。

### 列表项复用
1. 项目中会遇到很长的相册列表，好几百项，每个列表项都是一个相册。一个相册有包含了各种信息，还有相关的操作。
2. 然后，是很自然的，或者是不得不的，就会被一个列表项实现为单独模块，然后通过传递不同的 prop 来循环复用。
3. 当然，这么做的目的，并不是在考虑内存消耗的问题，而是在考虑可维护性的问题。


## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)