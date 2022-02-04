# Replace Parameter with Query

inverse of: *Replace Query with Parameter*


<!-- TOC -->

- [Replace Parameter with Query](#replace-parameter-with-query)
    - [思想](#思想)
        - [API 设计要做人民公仆](#api-设计要做人民公仆)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
中层设计规则：方便使用者

### API 设计要做人民公仆
1. 我们这里讨论的是 API 设计，所以应该优先考虑为调用者减轻工作量，让它减少不必要的参数传递。
2. 一个本来的参数，明明提供者可以统一在内部获取，但如果将它定为参数，则每一个调用者都需要自己计算并传参。
3. 一个接口只要设计一次，但是调用会很多次。所以这样重构整体会节省很多成本。
4. 当然也要做权衡，如果调用者传参的好处更明显，那就让调用者传参。比如纯函数。


## Motivation
1. 如果调用函数是传入了一个值，而这个值由函数自己来获得也基本同样容易，那这个参数就是重复的
    ```js
    let key = getKey();
    function foo (obj, key) {
        // let key = getKey(); // 这里可以自己获得
    }
    ```
2. 函数的提供者作为服务方，应该尽可能的为使用方创造方便。因为你编写虽然可能麻烦了一点，但写好也就不用管了，而调用方很可能不止一个，很可能多大成千上万个，每个调用方都要麻烦的加上一个不必要的参数。
3. 但是需要权衡的是，让函数自己去获取某个值可能会带来耦合。在上面的例子中，函数 `foo` 如果使用参数 `key`，那么就和 `getKey` 耦合了。
4. 如果想要去除的参数是可以直接从另一个参数哪里获取的，那去除它就是安全的。比如说上面的例子中要去除的某个参数可以从 `obj` 那里获取。


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
