# Iterator


<!-- TOC -->

- [Iterator](#iterator)
    - [思想](#思想)
    - [内部迭代器和外部迭代器](#内部迭代器和外部迭代器)
        - [内部迭代器](#内部迭代器)
        - [外部迭代器](#外部迭代器)
    - [References](#references)

<!-- /TOC -->


## 思想



## 内部迭代器和外部迭代器
### 内部迭代器
1. 内部迭代器是内部已经定义好了迭代规则，它完全接手整个迭代过程，外部只需要一次初始调用。
2. 内部迭代器在调用的时候非常方便，外界不用关心迭代器内部的实现，跟迭代器的交互也仅仅是一次初始调用。
3. 但这也刚好是内部迭代器的缺点：内部迭代器无法手动控制迭代的过程，只能按照迭代器定好的规则自动完成迭代。使用内部迭代器比较两个数组
    ```js
    function isEqual (arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }
        return arr1.every((item, index)=>{
            return item === arr2[index];
        });
    }

    console.log(isEqual([ 1, 2, 3 ], [ 1, 2, 4 ])); // false
    console.log(isEqual([ 1, 2, 3 ], [ 1, 2, 3 ])); // true
    ```
4. 我们目前能够顺利完成需求，还要感谢在 JavaScript 里可以把函数当作参数传递的特性，但在其他语言中未必就能如此幸运。在一些没有闭包的语言中，内部迭代器本身的实现也相当复杂。比如 C 语言中的内部迭代器是用函数指针来实现的，循环处理所需要的数据都要以参数的形式明确地从外面传递进去。

### 外部迭代器
1. 外部迭代器必须显式地请求迭代下一个元素。
2. 外部迭代器增加了一些调用的复杂度，但相对也增强了迭代器的灵活性，我们可以手工控制迭代的过程或者顺序。
2. 实现一个和 ES6 类似的数组迭代器
    ```js
    const Iterator = (arr) => {
        let index = 0;

        return {
            next () {
                let done = index >= arr.length;
                if (done) {return null;}
                
                let re = {
                    value: arr[index],
                    index,
                    done,
                };
                index++;
                return re;
            },
        };
    };

    let arr = [1, 2, 3];
    let iterator = Iterator(arr)
    console.log(iterator.next()); // {value: 1, done: false}
    console.log(iterator.next()); // {value: 2, done: false}
    console.log(iterator.next()); // {value: 3, done: false}
    console.log(iterator.next()); // {value: undefined, done: true}
    console.log(iterator.next()); // {value: undefined, done: true}
    ```


## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)