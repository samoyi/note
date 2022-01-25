# Large Class and Large Record

<!-- TOC -->

- [Large Class and Large Record](#large-class-and-large-record)
    - [现象](#现象)
        - [扁平的记录](#扁平的记录)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 现象
如果没有良好的结构设计，就可能把很多属性都塞进一个对象里。

### 扁平的记录
1. 例如下面的一个 JavaScript 对象
    ```js
    let params = {
        foo_prop1: 1,
        foo_prop2: 2,
        foo_prop3: 3,

        bar_prop1: 11,
        bar_prop2: 22,
        bar_prop3: 33,

        qux_prop1: 111,
        qux_prop2: 222,
        qux_prop3: 333,
    };
    ```
2. 它其实是有嵌套的结构的，但出于某些原因写成了扁平的样子。更有甚者，在中间也没有空行也没有注释，必须要很费劲的看代码。
3. 如果逻辑上结构那就应该体现出结构，而且最好能像提取函数一样对子结构进行提取
    ```js
    let foo = {
        foo_prop1: 1,
        foo_prop2: 2,
        foo_prop3: 3,
    };
    let bar = {
        bar_prop1: 11,
        bar_prop2: 22,
        bar_prop3: 33,
    };
    let qux = {
        qux_prop1: 111,
        qux_prop2: 222,
        qux_prop3: 333,
    };
    let params = {
        ...foo,
        ...bar,
        ...qux,
    };
    ```
    

## 重构方法参考
* Replace Loop with Pipeline


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
