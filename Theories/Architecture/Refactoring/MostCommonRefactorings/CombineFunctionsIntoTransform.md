# Combine Functions into Transform


<!-- TOC -->

- [Combine Functions into Transform](#combine-functions-into-transform)
    - [思想](#思想)
        - [内聚封装](#内聚封装)
        - [语义化](#语义化)
    - [Motivation](#motivation)
        - [与封装为类的区别](#与封装为类的区别)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
### 内聚封装

### 语义化
一个对象也许可以兼顾实现其他功能，但是从语义上来考虑，还是最好用符合语义的对象来做事情。


## Motivation
1. 比如我们要对数据进行若干处理，那么从语义上、易维护性、内聚性来说，应该把数据和处理方法都整合在一起。除了把它们整合为类，另一个方法就是这里的变换函数。
2. 类的思路是输入数据，调用若干种方法返回若干种处理后的数据；而变换函数的思路是，输入数据，在内部自动变换，并输出变换后的数据。
3. 比如说一个系统中有收支账单数据，针对这类数据，有计算总收入的操作，有计算总支出的操作，有计算净收入的，有计算各类别支出百分比的操作，等等。
4. 我们当然可以定义好各种方法，然后再需要的地方调用，调用时将账单数据作为参数。但这样在逻辑上，其实操作和数据还是分离的。
    ```js
    const bill = getBill();
    
    function totalIncome(bill) {
        // ...
    }
    function totalOutgoing(bill) {
        // ...
    }
    ```
5. 对于数据使用者来说，他们除了要获取数据，还必须引用这些操作数据的方法。即使封装为类，也是要调用类的方法才行。
6. 如果你的方法还会复用到其他数据上，那这种分离是很好的。但如果这些方法只是针对账单数据，那这种分离就没有必要，而且有些麻烦。不如把方法和数据整合到一起。
7. 而且，这种整合甚至都用不上使用类。你只需要在内部转换好数据并返回就行了，客户并不需要手动进行转换。
8. 我们定义一个转换方法，这个方法接收原始账单数据作为参数。在函数内部，直接进行那些操作，并把操作的结果组合为转换后的对象返回
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
9. 现在，我们不必再向数据使用者暴露 `totalIncome`、`totalOutgoing` 等方法，数据操作方法有几条，只需要使用 `enrichBill` 返回一个对象，上面就有了所有想要的操作后的数据。

### 与封装为类的区别
1. 首先从语义上来说，类是 “数据和对数据的操作”，需要有人来操作对数据的行为；而变换（transform）从名字上就能看出来，它是直接对数据进行了变换，并不需要客户和对象进行交互来获得转换后的数据。
2. 类的本意是作为对象的类，如果你不打算使用一组同类的对象，那就不用优先考虑使用类。
3. 另外，使用类的话，调用方法处理数据时可以实时获取数据进行转换；而使用变换则是一次变换之后数据就保存在返回的对象中，之后并不会更新。所以如果源数据之后会发生变化的话，那使用变换就不合适了。


## Mechanics
1. Create a transformation function that takes the record to be transformed and returns the same values.
    * This will usually involve a deep copy of the record. It is often worthwhile to write a test to ensure the transform does not alter the original record.
2. Pick some logic and move its body into the transform to create a new field in the record. Change the client code to access the new field.
    * If the logic is complex, use Extract Function first.
3. Test.
4. Repeat for the other relevant functions.


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
