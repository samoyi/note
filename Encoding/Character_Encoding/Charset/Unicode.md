
## Unicode


## Unique
1. 不同的字符集有可能用两个不同的二进制数字表示相同的字符，或者用相同的二进制数字表示不同的字符，而且某些字符集收录了一些其他字符集没有的字符。这就导致一个字符集系统接到另一个其他字符集系统的一串数字时，会将其转变为非预期的其他字符。
2. 为了避免这种问题，一个系统需要能具备不同的字符集解码规则，并且在处理表示字符的二进制数字时还需要知道是什么编码规则。
3. Unicode要收录世界上所有的字符，让所有的字符集编码解码都是用同一个规则。每一个字符在Unicode字符集中对应一个唯一的数字code point。
4. Unicode code point 一共有1,114,112个。Unicode一般用U+前缀的十六进制表示这些code point，即从U+0到U+10FFFF。
4. 2016年的Unicode 9.0 一共有 128,172个字符，所以对应Unicode中的128,172个code point。


## plane
1. Unicode将1,114,112个code point分组成了17个plane。包括一个Basic Multilingual Plane（BMP）和16个其他的plane。
2. BMP中的code point范围是四位十六进制数，从0000到FFFF；其他16个plane，每个plane有0x10000个code point，其中14个是五位十六进制数，后两个因为进位了，所以是六位十六进制数。

## Mapping and encodings
1. Unicode defines two mapping methods: the Unicode Transformation Format (UTF) encodings, and the Universal Coded Character Set (UCS) encodings
2. An encoding maps (possibly a subset of) the range of Unicode code points to sequences of values in some fixed-size range, termed *code values*.
3. The numbers in the names of the encodings indicate the number of bits per code value (for UTF encodings) or the number of bytes per code value (for UCS encodings).

## utf-32 utf-24
1. Unicode的1,114,112个code point，用二进制表示需要从`0`到`10000 11111111 11111111`
2. 以byte为单位，要保存任意一个字符code point，需要3个byte。UTF-24就可以了，为什么还要指定UTF-32
3. 一个可能的主要原因就是计算机更适应翻倍式的存储方式，现实中的产品也主要都是16、32、64这种规格的。虽然现在不知道这样的原因。
4. UTF-32使用固定的32bit来表示code point的，四个字节对应一个code point，一一对应，简单粗暴。粗暴的就是，我们用到的大多数的字符都是BMP的，而BMP的字符只需要两个字节就够了（从`0`到`11111111 11111111`），但如果用UTF-32编码，就会产生大量的浪费。
5. 还有一些其他缺点，所以基本不使用。
6. utf-24也是基于相似的原因以及其他一些原因，同样基本不使用。



## utf-16 and UCS-2
1. 因为只有16bit，所以显然不能简单粗暴的存储21bit的code point
2. utf16规定BMP使用两个byte来表示，其他plane使用四个byte来表示。但问题是就如这种规则名字所表示的，它只有两个byte。
3. 不知道怎么办，所以就按照目标简单粗暴的先处理一下，将四个byte拆成2 \* 2个byte看看有什么办法。本来四个byte是2^32,现在拆分之后就成了 2^16 * 2^16。虽然现在还不知道要怎么办，但至少4byte的code point可以拆分成utf-16所规定的2byte了。
4. 现在，BMP以外的code point原本是使用2^32bit来表示，现在就变成了：使用一段2^16bit表示前半部分，再使用另一段2^16bit表示后半部分。
5. 现在，所有plane的code point都可以用16bit来表示了。
6. 现在的问题就变成了，在你看到一个2byte的时候，它可能代表以下含义中的一种：BMP的code point，其他plane中的code point的前半部分，其他plane中的code point的后半部分。怎么识别？
7. 分组。2byte一共有2^16（65536）中可能。例如说这65536中可能分成 0-5535、5536-35535、35536-65535，也就是以下三个2byte范围：
    ```
    00000000 00000000  到  00010101 10011111
    00010101 10100000  到  10001010 11001111
    10001010 11010000  到  11111111 11111111
    ```
    将BMP的code point都放在第一段范围内，其他plane的code point的前半部分放在第二段范围内，后半部分放在第三段范围内。这样当年看到一段2byte数字时，你就知道这个2byte是单独代表一个字符还是应该和后面的一个2byte连起来表示一个字符。
8. 实际上2btye的名额中，除了BMP中用到的code point以外，还有余下的分配给第二段范围和第三段范围的吗？
9. 根据之前说的，BMP以外的16个plane总共有2^20个code point，将它们拆分成2byte形式，则前半部分需要2^10 来存储，后半部分同样需要2^10 来存储，也就是说BMP中有没有多出来的2*2^10（0x800）的名额？
10. BMP中U+D800到U+DFFF这0x800个位置正好是空的。
11. 将之前拆分出来的前半部分的2^10个code point依次存到U+D800到U+DBFF（高位），将后半部分的2^10个code point依次存到U+DC00到U+DFFF（低位）。
12. 将在，在使用UTF16规则解码时，当看到一个2byte数字，看看它的code point：如果不在中U+D800到U+DFFF这个范围，就证明它独自代表一个字符；如他在U+D800到U+DBFF的范围，则表示它表示其他plane的4byte code point的前半部分，需要再组合上后一个2byte数字共同组成一个code point。
13. 例如U+10000的code point在使用UTF-16编码时是第一个需要拆分的。它的二进制是```1 00000000 00000000```。如果直接拆成两部分就是```1000000```和```0000000000```，但是UTF-16的编码规则并不是把前一部分存到0xd800+0b1000000以及把第二部分存到0xdc00+0b0
14. 而是将2^20个 code point转换成一个以0x400为进制、从0到0x10FFFF-0x10000的两位数（不算前面从0到0xffff的0x10000个数）。将第一位和第二位数依次排到0x800和0xdc00后面。
15. 因为是从0到0x10FFFF，所以U+10000转换成上面的两位数就是00，再依次排就是0xd800和0xdc00.
16. 而最后一个code point是U+10FFFF，转换成上面的两位数之后，十位数是Math.floor((0x10ffff-0x10000)/0x400)=0x3ff，个位数也是(0x10ffff-0x10000)%0x400=0x3ff。再依次排到0x800和0xdc00后面就是0xdbff 和 0xdbff。
17. 普遍的公式:
    ```
    function utf16_32to16( nHex )
    {
    	let nHeigh = Math.floor( (nHex - 0x10000)/0x400 ) + 0x800,
    		nLow = (nHex - 0x10000)%0x400 + 0xdc00;
    	let sHeightHex = "0x" + nHeigh.toString(16),
    		sLowHex = "0x" + nLow.toString(16);
    	return [sHeightHex, sLowHex];
    }
    ```


## utf-8
1. An 8-bit variable-width encoding which maximizes compatibility with ASCII
2. UTF-8 uses one to four bytes per code point
3. 对于单字节字符，和ASCII一样。
4. 对于n字节的符号（n>1），第一个字节的前n位都设为1，第n+1位设为0，后面字节的前两位一律设为10。剩下的没有提及的二进制位，全部为这个符号的unicode码。
```
function utf8_hexEncode( nHex )
{
	function utf8_insert0( sL, sR ){
		return sL + "0000".slice(sL.length+sR.length-8) + sR;
	}

	let sBin = nHex.toString(2),
		sUTF8_bin = "";
	if( nHex<0x80 ){
		sUTF8_bin = ("0" + sBin);
	}
	else if( nHex<0x800 ){
		sUTF8_bin = utf8_insert0("110", sBin.slice(0, -6) ) + "10"+sBin.slice(-6);
	}
	else if( nHex<0x10000 ){
		sUTF8_bin = utf8_insert0("1110", sBin.slice(0, -12) ) + "10"+sBin.slice(-12, -6) + "10"+sBin.slice(-6);
	}
	else{
		sUTF8_bin = utf8_insert0("11110", sBin.slice(0, -18) ) + "10"+sBin.slice(-18, -12) + "10"+sBin.slice(-12, -6) + "10"+sBin.slice(-6);
	}
	return Number.parseInt(sUTF8_bin, 2).toString(16);
}
```


## References


* [阮一峰Unicode简介](http://www.ruanyifeng.com/blog/2014/12/unicode.html)
* [阮一峰 ASCII，Unicode和UTF-8](http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html)
* [Unicode Wiki](https://en.wikipedia.org/wiki/Unicode)
* [Official Site](http://www.unicode.org/)
