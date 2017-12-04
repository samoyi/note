function base64ToBinary(str){
    // 如果存在补0编码再补=的情况
    let nBase64Pad0Amount = 0; // 补0的数量
    if( str.endsWith('==') ){
        str = str.slice(0, -2);
        nBase64Pad0Amount = 4;
    }
    if( str.endsWith('=') ){
        str = str.slice(0, -1);
        nBase64Pad0Amount = 2;
    }

    let base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        index = null,
        sBinIndex = '',
        aBinIndexCache = [],
        strLen = str.length,
        sResult = '';

    for(let i=0; i<strLen; i++){
        index = base64Chars.indexOf(str[i]);
        sBinIndex = aBinIndexCache[index];
        if(sBinIndex===undefined){// 该序号之前没有缓存对应的二进制值
            sBinIndex = index.toString(2).padStart(6, '0'); // 取得该base64字符对应的需要对应的二进制值
            aBinIndexCache[index] = sBinIndex; // 缓存该二进制值
        }
        sResult += sBinIndex;
    }

    // 有补0就把0去掉
    return nBase64Pad0Amount ? sResult.slice(0,-nBase64Pad0Amount) : sResult;
}


function base64ToUTF8(str){
    let sBin = base64ToBinary(str),
        nBinLen = sBin.length,
        nDecCodePoint = "",
        sResult = '';

    while(sBin){
        if(sBin.startsWith('0')){ // Single-byte character
            nDecCodePoint = Number.parseInt(sBin.slice(1, 8), 2);
            sBin = sBin.slice(8);
        }
        else if(sBin.startsWith('110')){ // Double-byte character
            nDecCodePoint = Number.parseInt(sBin.slice(3, 8) + sBin.slice(10, 16), 2);
            sBin = sBin.slice(16);
        }
        else if(sBin.startsWith('1110')){ // Three-byte character
            nDecCodePoint = Number.parseInt(sBin.slice(4, 8) + sBin.slice(10, 16) + sBin.slice(18, 24), 2);
            sBin = sBin.slice(24);
        }
        else if(sBin.startsWith('11110')){ // Four-byte character
            nDecCodePoint = Number.parseInt(sBin.slice(5, 8) + sBin.slice(10, 16) + sBin.slice(18, 24) + sBin.slice(26, 32), 2);
            sBin = sBin.slice(32);
        }
        else{
            throw new TypeErrow(str + ' is not a encoded from a UTF8 string');
        }
        sResult += String.fromCodePoint(nDecCodePoint);
    }

    return sResult;
}


function binaryToBase64(str){
    let base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        sBase64Char = '', // 6bit对应的base字符
        strLen = str.length,
        mod = strLen%24, // 最后剩下的不足4个base64字符的二进制字符串
        iterationLen = strLen - mod, // 最后剩下的不足4个base64字符的二进制字符串不进入循环
        index = null,
        substr = '',
        sResult = '',
        base64Cache = {};

    for(var i=0; i<iterationLen; i+=6){
        substr = str.substr(i, 6);
        sBase64Char = base64Cache[substr];
        if(!sBase64Char){ // 如果当前6bit对应的base字符值没有有缓存
            index = Number.parseInt(substr, 2);
            sBase64Char = base64Chars[index];
            base64Cache[substr] = sBase64Char; // 缓存
        }
        sResult += sBase64Char;
    }

    if(mod){// 最后存在不足24bit的二进制字符串
        let remainder = str.slice(-mod);

        while(remainder.length>6){
            index = Number.parseInt(remainder.slice(0, 6), 2);
            sResult += base64Chars[index];
            remainder = remainder.slice(6);
        }
        index = Number.parseInt((remainder.padEnd(6, '0')), 2);
        let nPadNum = remainder.length===2 ? 3 : 2;
        sResult += base64Chars[index].padEnd(nPadNum, '=');
    }

    return sResult;
}


function UTF8ToBase64(str, encode='utf8'){
    let sBinStr = [...str].map(char=>{
        let nCodePoint = char.codePointAt(0); // 每个字符的unicode
        return unicodeToUTF8( nCodePoint ); // 每个字符的UTF8编码
    }).join('');

    return binaryToBase64(sBinStr);
}

function unicodeToUTF8( nCodePoint ){
	let sBin = nCodePoint.toString(2),
		sResult = "";

	if( nCodePoint<0x80 ){
		sResult = sBin.padStart(8, "0");
	}
	else if( nCodePoint<0x800 ){
		sResult = "110"+sBin.slice(0, -6).padStart(5, "0") + "10"+sBin.slice(-6);
	}
	else if( nCodePoint<0x10000 ){
		sResult = "1110"+sBin.slice(0, -12).padStart(4, "0") + "10"+sBin.slice(-12, -6) + "10"+sBin.slice(-6);
	}
	else{
		sResult = "11110"+sBin.slice(0, -18).padStart(3, "0") + "10"+sBin.slice(-18, -12) + "10"+sBin.slice(-12, -6) + "10"+sBin.slice(-6);
	}

	return sResult;
}


module.exports = {base64ToBinary, base64ToUTF8, binaryToBase64, UTF8ToBase64};
