# Dijkstra 的双栈算术表达式求值算法



## 设计思想
1. 一个数学表达式计算的过程，实际上就是不断合并的过程
2. 而在具有完全括号的表达式中，每一个反括号，就代表要进行一次合并。



## 算法
1. 计算具有完全括号的算数表达式字符串的值，如 `'( 1 + ( ( 2 + 3 ) * ( 4 * 5 ) ) )'` 或者 `'( ( 1 + sqrt ( 5.0 ) ) / 2.0 )'`。
2. E.W.Dijkstra 在 20 世纪 60 年代发明了一个非常简单的算法，用两个栈（一个用于保存运算符，一个用于保存操作数）完成了这个任务，其实现过程见下图
    <img src="./images/01.png" width="400" style="display: block; margin: 5px 0 10px;" />


## 实现
```js
function isNumberString (str) {
    let n = Number.parseFloat(str);
    return !Number.isNaN(n) && (typeof n === 'number');
}

function Evaluate (str) {
    // 要求数字和操作符之间有一个空格
    let charList = str.split(' ');

    // 保存数字和操作符的两个栈
    let numberCharList = [];
    let operatorList = [];

    // 支持 5 种操作符
    // 分为操作两个数字的和操作一个数字的
    const operators_double = ['+', '-', '*', '/'];
    const operators_single = ['sqrt'];
    const operators = [...operators_double, ...operators_single]

    // 每种操作符对应的计算函数
    const calcFnMap = {
        '+': (m, n) => m + n,
        '-': (m, n) => m - n,
        '*': (m, n) => m * n,
        '/': (m, n) => m / n,
        'sqrt': (n) => Math.sqrt(n),
    }


    charList.forEach((char) => {
        if (char === '(') {
            return;
        }
        else if (char === ')') {
            let n = numberCharList.pop();
            let operator = operatorList.pop();

            let result;

            if ( operators_double.includes(operator) ) {
                let m = numberCharList.pop();
                result = calcFnMap[operator](m, n);
            }
            else {
                result = calcFnMap[operator](n);
            }

            numberCharList.push(result);
        }
        else if (operators.includes(char)) {
            operatorList.push(char);
        }
        else if ( isNumberString(char) ) {
            numberCharList.push( Number.parseFloat(char) );
        }
    });

    return numberCharList[0];
}

console.log( Evaluate('( 1 + ( ( 2 + 3 ) * ( 4 * 5 ) ) )') ); // 101
console.log( Evaluate('( ( 1 + sqrt ( 5.0 ) ) / 2.0 )') ); // 1.618033988749895
```