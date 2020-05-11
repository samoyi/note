# Combine Functions into Transform


<!-- TOC -->

- [Combine Functions into Transform](#combine-functions-into-transform)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [可以将数据和对数据的操作方法整合到一起](#可以将数据和对数据的操作方法整合到一起)
        - [使用变换进行整合](#使用变换进行整合)
        - [与封装为类的区别](#与封装为类的区别)
            - [transform 强调转换，class 强调类型](#transform-强调转换class-强调类型)
            - [源数据是否更新](#源数据是否更新)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想


## Motivation
### 可以将数据和对数据的操作方法整合到一起
1. 比如说一个系统中有收支账单数据，针对这类数据，有计算总收入的操作，有计算总支出的操作，有计算净收入的，有计算各类别支出百分比的操作，等等。
2. 我们当然可以定义好各种方法，然后再需要的地方调用，调用时将账单数据作为参数。但这样在逻辑上，其实操作和数据还是分离的。
    ```js
    const bill = getBill();
    
    function totalIncome(bill) {
        // ...
    }
    function totalOutgoing(bill) {
        // ...
    }
    ```
3. 对于数据使用者来说，他们除了要获取数据，还必须引用这些操作数据的方法。
4. 如果你的方法还会复用到其他数据上，那这种分离是很好的。但如果这些方法只是针对账单数据，那这种分离就没有必要，而且有些麻烦。不如把方法和数据整合到一起。

### 使用变换进行整合
1. 说到数据和方法的整合，很自然就会想到封装为类。当然这也是一个很好的方法。
2. 不过这里说到的是 "transform"，它的实现实际上是对原始数据的一种转换。
3. 我们定义一个转换方法，这个方法接收原始账单数据作为参数。在函数内部，直接进行那些操作，并把操作的结果组合为转换后的对象返回
    ```js
    let bill = getBill();
    
    function totalIncome(bill) {
        // ...
    }
    function totalOutgoing(bill) {
        // ...
    }

    function enrichBill(bill) {
        const enriched = deepClone(bill);
        enriched.totalIncome = totalIncome(bill);
        enriched.totalOutgoing = totalOutgoing(bill);
        return enriched;
    }
    ```
4. 现在，我们不必再向数据使用者暴露 `totalIncome`、`totalOutgoing` 等方法，数据操作方法有几条，只需要使用 `enrichBill` 返回一个对象，上面就有了所有想要的操作后的数据。

### 与封装为类的区别
1. An alternative to *Combine Functions into Transform* is *Combine Functions into Class* that moves the logic into methods on a class formed from the source data. 
2. Either of these refactorings are helpful, and my choice will often depend on the style of programming already in the software. 

#### transform 强调转换，class 强调类型
1. Transform 和 class，在语义上就是不一样的。
2. Transform 只是对源数据的转换，它并没有类型和对象的概念，也没有针具数据的行为；class 则明显的有对象的概念，有属性和行为。
3. 从这个角度来看，两者根本上就是不同的。
4. 要说两者有什么本质上的共同之处，那就是对一组数据的封装。

#### 源数据是否更新
1. There is one important difference: using a class is much better if the source data gets updated within the code. 
2. Using a transform stores derived data in the new record, so if the source data changes, I will run into inconsistencies. 不懂，transform 为什么不能直接引用源数据而要拷贝一份？封装为类不是也可以使用副本吗？



## Mechanics
1. Create a transformation function that takes the record to be transformed and returns the same values.
    * This will usually involve a deep copy of the record. It is often worthwhile to write a test to ensure the transform does not alter the original record.
2. Pick some logic and move its body into the transform to create a new field in the record. Change the client code to access the new field.
    * If the logic is complex, use Extract Function first.
3. Test.
4. Repeat for the other relevant functions.


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
