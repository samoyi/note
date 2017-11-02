function Base64ToBinary(str){

    if( str.endsWith('==') ){ str = str.slice(0, -2); }
    if( str.endsWith('=') ){ str = str.slice(0, -1); }

    let codes = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        code = '',
        len = str.length,
        index = null,
        sBin = '',
        indexCache = {},
        binCache = [];

    for(let i=0; i<len; i++){
        index = indexCache[str[i]];
        if(index===undefined){
            index = codes.indexOf(str[i]);
            indexCache[str[i]] = index;
        }

        code = binCache[index];
        if(code===undefined){
            code = index.toString(2).padStart(6, '0');
            binCache[index] = code;
        }
        sBin += code;
    }

    return sBin.slice(0,-sBin.length%8);
}


function BinaryToBase64(str){
    let codes = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        code = '',
        len = str.length,
        mod = len%24, // 最后剩下的不足4个base64字符的二进制字符串
        times = len - mod, // 不进入循环
        index = null,
        substr = '',
        sBase64 = '',
        base64Cache = {};

    for(var i=0; i<times; i+=6){
        substr = str.substr(i, 6);
        code = base64Cache[substr];
        if(!code){
            index = Number.parseInt(substr, 2);
            code = codes[index];
            base64Cache[substr] = code;
        }
        sBase64 += code;
    }

    let remainder = str.slice(-mod);

    while(remainder>6){
        index = Number.parseInt(remainder.slice(0, 6), 2);
        sBase64 += codes[index];
        remainder = remainder.slice(6);
    }
    index = Number.parseInt((remainder.slice(-2).padEnd(6, '0')), 2);
    let nPadNum = remainder.length===2 ? 3 : 2;
    sBase64 += codes[index].padEnd(nPadNum, '=');

    return sBase64;
}

module.export = {Base64ToBinary, BinaryToBase64};
