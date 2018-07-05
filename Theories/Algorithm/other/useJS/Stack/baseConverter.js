'use strict';

// 将十进制正整数转换为其他进制的数字字符串



const Stack = require('./Stack');

/*
 * 思路（以除以10为例）
 *
 * 第一次除以10，得出一个整数解和一个余数
 * 余数意味着不到10，所以作为个位数很合理
 * 整数解意味着在余数以外，有多少10。
 * 即，整数解现在的一个 1 ，实际上代表 10
 * 再除以10，这时的 10 实际上已经代表 100 了
 * 所以余数就是不能被100整除的部分，就是作为十位数
 * 整数解现在代表着有多少个100
 * 以此类推
 */
function baseConverter(decNumber, base){

    let remStack = new Stack(),
        rem,
        baseString = '',
        digits = '0123456789ABCDEF';

    while (decNumber > 0 && Number.isSafeInteger(decNumber)){
        rem = decNumber % base;
        remStack.push(rem);
        decNumber = Math.floor(decNumber / base);
    }

    while (!remStack.isEmpty()){
        baseString += digits[remStack.pop()]; //{7}
    }

    return baseString;
}


console.log(baseConverter(5.6, 2)); // ""
console.log(baseConverter(100345, 2) === (100345).toString(2)); // true
console.log(baseConverter(100345, 8) === (100345).toString(8)); // true
console.log(baseConverter(100345, 16) === (100345).toString(16).toUpperCase()); // true
