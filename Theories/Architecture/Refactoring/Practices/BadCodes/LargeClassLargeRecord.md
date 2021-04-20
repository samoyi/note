# Large Class Large Record


## 原则



## 场景
### 参数对象扁平
1. 在做某些后台设置的数据提交时，常常是一整个页面的数据一起提交。后端这时如果要求的参数记录是扁平，那前端这里就会生成类似于下面的参数对象
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
2. 这只是一个例子，一般一个页面的数据要比这更多，就会导致一个很长的 `params` 对象，而且属性名其实一般不会这么有规律。所以查找修改起来都很费劲。
3. 即使是像上面那样有空行分割，而且也加上参数的话，也只是稍微方便了一些，而且也没有很明确的表达出数据的结构。
4. 这段代码还有另一个问题就是 *Data Clumps*。
5. 如果逻辑上结构那就应该体现出结构，而且最好能像提取函数一样对子结构进行提取
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


## 过度优化





















































## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
