'use strict';

const Stack = require('./Stack');

function baseConverter(decNumber, base){

    let remStack = new Stack(),
        rem,
        baseString = '',
        digits = '0123456789ABCDEF';

    while (decNumber > 0){
        rem = Math.floor(decNumber % base);
        remStack.push(rem);
        decNumber = Math.floor(decNumber / base);
    }

    while (!remStack.isEmpty()){
        baseString += digits[remStack.pop()]; //{7}
    }

    return baseString;
}



console.log( baseConverter(100345, 2) === (100345).toString(2) ); // true
console.log( baseConverter(100345, 8) === (100345).toString(8) ); // true
console.log( baseConverter(100345, 16) === (100345).toString(16).toUpperCase() ); // true
