


### 计算一个正整数由哪些不重复的二的幂相加而成
1. 可以直接把整数转为二进制形式的字符串，然后遍历每个字符看看是 0 还是 1。
2. 也可以依次用 2^0、2^1、2^0…… 和字符串进行 `&` 运算进行判断。
3. 下面的函数使用第二个方法计算。第二个参数为默认的 `false` 时，结果是组成该整数的二的幂；为 `true` 时，结果是这些二的幂的 1 所在的位数
    ```js
    function getBitsIs1 (decimal, isShowBit=false) {
        let bit1 = 1;
        let res = [];
        while (bit1 <= decimal) {
            if (bit1 & decimal) {
            if (isShowBit) {
                res.push(Math.log2(bit1));
            }
            else {
                res.push(bit1);
            }
            }
            bit1 <<= 1;
        }
        return res;
    }

    console.log(getBitsIs1(7));  // [1, 2, 4]
    console.log(getBitsIs1(30)); // [2, 4, 8, 16]
    console.log(getBitsIs1(16)); // [16]
    console.log(getBitsIs1(10)); // [2, 8]

    console.log(getBitsIs1(7, true));   // [0, 1, 2]     
    console.log(getBitsIs1(30, true));  // [1, 2, 3, 4] 
    console.log(getBitsIs1(16, true));  // [4]          
    console.log(getBitsIs1(10, true));  // [1, 3]  
    ```