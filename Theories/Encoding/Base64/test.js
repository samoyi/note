'use strict';

const Convertor = require('./Convertor');


let str = 'I ♡ Unicode!';
console.log( Convertor.UTF8ToBase64(str) );
console.log( new Buffer(str).toString('base64') );
// console.log( Convertor.unicodeStringToBase64(str) ); // JmE=
// console.log( Convertor.base64ToBinary('4pmh') ); // 11100010 10011001 10100001
// console.log( Convertor.binaryToBase64('111000101001100110100001') ); // JmE=


// 111000 101001 100110 100001
// 56     41     38     33
// 4      p      m      h

// console.log(utoa('♡')); // 4pmh
// console.log(atou('4pmh')); // ♡
