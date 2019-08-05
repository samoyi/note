# Conditionals


## `if-else` versus `switch`：基本只需要考虑可读性
1. The traditional argument of whether to use `if-else` statements or a `switch` statement applies to JavaScript just as it does to other languages. Since different browsers have implemented different flow control optimizations, it is not always clear which technique to use.
2. The prevailing theory on using `if-else` versus `switch` is based on the number of conditions being tested: the larger the number of conditions, the more inclined you are to use a `switch` instead of `if-else`. This typically comes down to which code is easier to read.
3. As it turns out, the `switch` statement is faster in most cases when compared to `if-else`, but significantly faster only when the number of conditions is large. 
4. The primary difference in performance between the two is that the incremental cost of an additional condition is larger for `if-else` than it is for `switch`. 
5. 大多数的语言对`switch`语句的实现都采用了 branch table 索引来进行优化。另外，在 JavaScript 中，`switch`语句比较值时使用全等操作符，不会有类型转换的损耗。
6. Therefore, our natural inclination to use `if-else` for a small number of conditions and a `switch` statement for a larger number of conditions is exactly the right advice when considering performance.


## Optimizing `if-else`：尽快命中
1. 比如把最容易命中的条件放到最前面
    ```js
    let arr = [];
    for (let i=0; i<9999999; i++){
        arr.push(Math.random());
    }

    let len = arr.length;
    let times = 0;
    ```
    ```js
    console.time('reverse');
    for (let i=0; i<len; i++){
        let val = arr[i];
        if (val > 5){
            times++;
        }
        else if (val > 1) {
            times++;
        }
        else {
            times++;
        }
    }
    console.timeEnd('reverse'); // 32ms左右
    console.log(times);

    console.time('optimal');
    for (let i=0; i<len; i++){
        let val = arr[i];
        if (val <=1 ){
            times++;
        }
        else if (val <=5) {
            times++;
        }
        else {
            times++;
        }
    }
    console.timeEnd('optimal'); // 27ms左右
    console.log(times);
    ```
2. 比如更复杂一些的算法。但下面的例子的实际结果却和预期相反，也就是说并不确定引擎在执行时是怎样的机制
    ```js
    let arr = [];
    for (let i=0; i<9999999; i++){
        arr.push(Math.random());
    }

    let len = arr.length;
    let times = 0;
    ```
    ```js
    console.time('normal');
    for (let i=0; i<len; i++){
        let val = arr[i];
        if (val >= 0.9){
            times++;
        }
        else if (val >= 0.8){
            times++;
        }
        else if (val >= 0.7){
            times++;
        }
        else if (val >= 0.6){
            times++;
        }
        else if (val >= 0.5){
            times++;
        }
        else if (val >= 0.4){
            times++;
        }
        else if (val >= 0.3){
            times++;
        }
        else if (val >= 0.2){
            times++;
        }
        else if (val >= 0.1){
            times++;
        }
        else {
            times++;
        }
    }
    console.timeEnd('normal'); // 118ms左右
    console.log(times);
    ```
    ```js
    console.time('optimal');
    for (let i=0; i<len; i++){
        let val = arr[i];
        if (val <= 0.5){
            if (val <= 0.3){
                if (val <= 0.1){
                    times++;
                } 
                else if (val <= 0.2){
                    times++;
                } 
                else {
                    times++;
                }
            } 
            else {
                if (val <= 0.4){
                    times++;
                } 
                else {
                    times++;
                }
            }
        } 
        else {
            if (val <= 0.8){
                if (val <= 0.6){
                    times++;
                } 
                else if (val <= 0.7){
                    times++;
                } 
                else {
                    times++;
                }
            } 
            else {
                if (val <= 0.9){
                    times++;
                } 
                else {
                    times++;
                }
            }
        }
    }
    console.timeEnd('optimal'); // 155ms左右
    console.log(times);
    ```
3. **对代码的优化必须要以测试结果为准**
4. 显然这种优化策略在条件判断更复杂的情况下会有更明显的优化。
5. 性能优化不能明显牺牲可读性。除了极端性能需求的场合，可读性都要比性能优化重要。


## Lookup Tables
1. Sometimes the best approach to conditionals is to avoid using `if-else` and `switch` altogether. When there are a large number of discrete values for which to test, both `if-else` and `switch` are significantly slower than using a lookup table. 
2. Lookup tables can be created using arrays or regular objects in JavaScript, and accessing data from a lookup table is much faster than using `if-else` or `switch`, especially when the number of conditions is large.
3. Lookup tables are not only very fast in comparison to if-else and switch, but they also help to make code more readable when there are a large number of discrete values for which to test. For example, switch statements start to get unwieldy when large, such as:
    ```js
    switch(value){
        case 0:
            return result0;
        case 1:
            return result1;
        case 2:
            return result2;
        case 3:
            return result3;
        case 4:
            return result4;
        case 5:
            return result5;
        case 6:
            return result6;
        case 7:
            return result7;
        case 8:
            return result8;
        case 9:
            return result9;
        default:
            return result10;
    }
    ```
    The amount of space that this `switch` statement occupies in code is probably not proportional to its importance. The entire structure can be replaced by using an array as a lookup table:
    ```js
    //define the array of results
    var results = [result0, result1, result2, result3, result4, result5, result6,
    result7, result8, result9, result10]
    //return the correct result
    return results[value];
    ```
4. When using a lookup table, you have completely eliminated all condition evaluations. The operation becomes either an array item lookup or an object member lookup. 
5. This is a major advantage for lookup tables: since there are no conditions to evaluate, there is little or no additional overhead as the number of possible values increases.
6. Lookup tables are most useful when there is logical mapping between a single key and a single value (as in the previous example). A `switch` statement is more appropriate when each key requires a unique action or set of actions to take place.


## References
* [*High Performance JavaScript* Chapter 4](https://book.douban.com/subject/4183808/)
* [《高性能JavaScript》 第4章](https://book.douban.com/subject/5362856/)
