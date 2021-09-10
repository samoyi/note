// 将十进制正整数转换为其他进制的数字字符串

'use strict';


const Stack = require('./Stack');

function baseConverter(decNumber, base) {
    if (!Number.isSafeInteger(decNumber)) {
        throw new Error("Wrong decimal number.")
    }
    if (!Number.isSafeInteger(base) || base < 2 || base > 16) {
        throw new RangeError("Wrong base range.")
    }

    let remStack = new Stack();
    let baseString = '';
    let digits = '0123456789ABCDEF';

    while (decNumber > 0) {
        remStack.push(decNumber % base);
        decNumber = Math.floor(decNumber / base);
    }

    while (!remStack.isEmpty()) {
        baseString += digits[remStack.pop()];
    }

    return baseString;
}


console.log(baseConverter(5.6, 2)); // undefined
console.log(baseConverter(100345, 2) === (100345).toString(2)); // true
console.log(baseConverter(100345, 8) === (100345).toString(8)); // true
console.log(baseConverter(100345, 16) === (100345).toString(16).toUpperCase()); // true