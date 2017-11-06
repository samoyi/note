

'use strict';

let s1 = 'aeeo',
    s2 = 'a𝑒𝑒o',
    s3 = '𝑒';


// function checkByteSubstr(str){
//     return str.length - [...str].length;
// }
//
// console.log( s1.split('').toString(16) );
// console.log( s2.split('')).toString(16) );

console.log( s3.charCodeAt(0).toString(16) );       // "*"
console.log( s3.codePointAt(0).toString(16) );       // 0x1d452
console.log( s3.charCodeAt(0).toString(2) );       //    11011000 00110101
console.log( s3.codePointAt(0).toString(2) );       // 1 11010100 01010010

console.log( String.fromCodePoint(42) );       // "*"

console.log( String.fromCharCode(42) );       // "*"


function MB(str){

    let arr = [...str];

    this.check = ()=>str.length - [...str].length;

    this.length = arr.length;

    this.slice = (beginIndex, endIndex=undefined)=>arr.slice(beginIndex, endIndex).join('');

    this.split = ()=>arr;

    this.reverse = ()=>arr.reverse().join('');
}

let mb = new MB(s2);
// console.log( s2.split('𝑒') );
// console.log( s1.split('e') );
// console.log( mb.slice(2) );
