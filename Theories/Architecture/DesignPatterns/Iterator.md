# Iterator

## 内部迭代器和外部迭代器
### 内部迭代器
1. 内部迭代器是内部已经定义好了迭代规则，它完全接手整个迭代过程，外部只需要一次初始调用。
2. 内部迭代器在调用的时候非常方便，外界不用关心迭代器内部的实现，跟迭代器的交互也仅仅是一次初始调用。
3. 但这也刚好是内部迭代器的缺点：内部迭代器无法手动控制迭代的过程，只能按照迭代器定好的规则自动完成迭代。

### 外部迭代器
1. 外部迭代器必须显式地请求迭代下一个元素。外部迭代器增加了一些调用的复杂度，但相对也增强了迭代器的灵活性，我们可以手工控制迭代的过程或者顺序。
2. 实现一个和 ES6 类似的数组迭代器
    ```js
    const Iterator = function(arr){
        let current = 0;

        let next = function(){
            let re = {
                value: arr[current],
                done: current >= arr.length,
            };
            current++;
            return re;
        };

        return {
            next,
        };
    };

    let arr = [1, 2, 3];
    let iterator = Iterator(arr)
    console.log(iterator.next()); // {value: 1, done: false}
    console.log(iterator.next()); // {value: 2, done: false}
    console.log(iterator.next()); // {value: 3, done: false}
    console.log(iterator.next()); // {value: undefined, done: true}
    ```


## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)
