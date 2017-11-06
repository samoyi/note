
function MB(str){
    'use strict';

    this.str = str;
    this.arr = [...this.str];
    // let arr = [...str];

    const check = function(str){
        let arr = [...str];
        if(str.length === arr.length) return [];
        let aMBCharIndex = [],
            i = 0, j = 0,
            len = str.length;
        for(; i<len-1; i++,j++){
            if(str[i] !== arr[j]){
                aMBCharIndex.push(j);
                i++;
            }
        }

        return aMBCharIndex;
    };

    const pad = (direction, targetLength, padString=" ")=>{
        let fnOrigin = direction==='end' ? ''.padEnd.bind(this.str) : ''.padStart.bind(this.str);

        if(padString===" ") return fnOrigin(targetLength, padString);

        let aMBCharIndex = check(padString);
        if(aMBCharIndex.length){
            let aPadStr = [...padString],
                nPadStrLen = aPadStr.length,
                nPadLen = targetLength - this.arr.length,
                nRepeatTimes = Math.floor(nPadLen/nPadStrLen),
                mod = nPadLen%nPadStrLen,
                sPad = padString.repeat(nRepeatTimes) + aPadStr.slice(0, mod).join('');

            return direction==='end' ? this.str + sPad : sPad + this.str;
        }
        else{
            return fnOrigin(targetLength, padString);
        }
    }




    this.check = ()=>check(this.str);


    this.length = this.arr.length;


    this.charAt = (index)=>this.arr[index];


    this.charCodeAt = (index)=>this.str.codePointAt(index);


    this.fromCharCode = (nCode)=>String.fromCodePoint(nCode);


    this.indexOf = (substr)=>this.arr.indexOf(substr);


    this.lastIndexOf = (substr)=>this.arr.lastIndexOf(substr);


    this.match = (re)=>{
        let result = this.str.match(re);

        if(result && result[0]!=='' && result.index!==undefined){
            let substr = this.str.slice(0, result.index),
                aMBCharIndex = check(substr);
            result.index -= aMBCharIndex.length;
        }

        return result;
    };


    this.padEnd = (targetLength, padString=" ")=>{
        return pad('end', targetLength, padString);
    };


    this.padStart = (targetLength, padString=" ")=>{
        return pad('start', targetLength, padString);
    };


    this.search = (re)=>{
        let index = this.str.search(re);
        if(index>1){
            index -= check( this.str.slice(0, index) ).length;
        }
        return index;
    };


    this.slice = (beginIndex, endIndex=undefined)=>this.arr.slice(beginIndex, endIndex).join('');


    this.split = ()=>this.arr;


    this.substr = (start, length=undefined)=>{
        if( check(this.str))
        if(length<1) return '';
        let len = length ? start+length : undefined;
        return this.arr.slice(start, len).join('');
    };


    this.substring = (start, end)=>{
        if(!start || start<0){ // NaN, null or negative
            start = 0;
        }
        if( (end!==undefined) && (!end || end<0) ){ // NaN, null or negative
            end = 0;
        }
        if(start>end){
            return this.arr.slice(end, start).join('');
        }
        return this.arr.slice(start, end).join('');
    };


    this.reverse = ()=>this.arr.reverse().join('');
}
