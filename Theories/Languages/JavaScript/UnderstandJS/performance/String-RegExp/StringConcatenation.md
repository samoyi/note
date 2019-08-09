# String Concatenation

1. String concatenation can be surprisingly performance intensive. 
2. For starters, there is more than one way to merge strings
    <table>
        <thead>
            <tr>
                <th>Method</th>
                <th>Example</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>The + operator</td>
                <td>str = "a" + "b" + "c";</td>
            </tr>
            <tr>
                <td>The += operator</td>
                <td>str = "a"; <br /> str += "b"; <br /> str += "c";</td>
            </tr>
            <tr>
                <td>array.join()</td>
                <td>str = ["a", "b", "c"].join("");</td>
            </tr>
            <tr>
                <td>string.concat()</td>
                <td>str = "a"; <br /> str = str.concat("b", "c");</td>
            </tr>
        </tbody>
    </table>
3. All of these methods are fast when concatenating a few strings here and there, so for casual use, you should go with whatever is the most practical. As the length and number of strings that must be merged increases, however, some methods start to show their strength.


## `+` and `+=` Operators
1. 《High Performance JavaScript》说`str = str + 'one' + 'two'`比`str += 'one' + 'two'`更快，但实测相反：
    ```js
    let str = '';
    console.time('+=');
    for (let i=0; i<999999; i++) {
        str += 'one' + 'two';
    }
    console.timeEnd('+='); // 100ms左右
    ```
    ```js
    let str = '';
    console.time('= +');
    for (let i = 0; i < 999999; i++) {
        str = str + 'one' + 'two';
    }
    console.timeEnd('= +'); // 190ms左右
    ```
 2. **实际编写某个性能敏感的程序时，必须要亲自测试，并且保证测试环境和实际运行环境一致。**
 

## Array Joining
1. 《High Performance JavaScript》 说 array joining is slower than other methods of concatenation in most browsers，但实测在不同的操作次数下，结果并不相同:
    * `len`等于`99999`时，直接拼接字符串稍快一些：
        ```js
        let str = `I'm a thirty-five character string.`;
        let len = 99999;
        ```
        ```js
        console.time('join');
        let strArr = [];
        for (let i=0; i<len; i++) {
            strArr[i] = str;
        }
        let newStr = strArr.join('');
        console.timeEnd('join'); // 13ms左右
        ```
        ```js
        console.time('+=');
        let newStr = '';
        for (let i=0; i<len; i++) {
            newStr += str;
        }
        console.timeEnd('+='); // 10ms左右
        ```
    * 但是`len`等于`999999`时，两者的差距不但没有变大，反而变得差不多了。
2. 还是要在生产环境实测才行。


### `String.prototype.concat`
《High Performance JavaScript》 说比直接加慢一些，但测试结果同样显示没有差别


## References
* [*High Performance JavaScript* Chapter 5](https://book.douban.com/subject/4183808/)
