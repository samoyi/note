'use strict';
// 00100110 01100001
// 00100110 01100001

const Convertor = require('./Convertor');

// let str = 'I ♡ Unicode!';
// console.log( Convertor.unicodeStringToBase64(str) );
// console.log(Convertor.binaryToBase64('0100100100100000111000101001100110100001001000000101010101101110011010010110001101101111011001000110010100100001')); // SSDimaEgVW5pY29kZSQ=


// 01001001 00100000 00100110 01100001 001000000101010101101110011010010110001101101111011001000110010100100001
// 010010 010010 000000 100110 01100001001000000101010101101110011010010110001101101111011001000110010100100001
// S      S      D      i      m      a      E      g      V      W      5      p      Y      2      9      k      Z      S      E
// *************************** *************************** *************************** *************************** ****************** *********


let str = '♡';
console.log( Convertor.base64ToUTF8('SSDimaEgVW5pY29kZSE=') );
// console.log( Convertor.unicodeStringToBase64(str) ); // JmE=
// console.log( Convertor.base64ToBinary('4pmh') ); // 11100010 10011001 10100001
// console.log( Convertor.binaryToBase64('111000101001100110100001') ); // JmE=


// 111000 101001 100110 100001
// 56     41     38     33
// 4      p      m      h

// console.log(utoa('♡')); // 4pmh
// console.log(atou('4pmh')); // ♡
