# Unicode


## Unique
1. 不同的字符集有可能用两个不同的二进制数字表示相同的字符，或者用相同的二进制数字表示不同
   的字符，而且某些字符集收录了一些其他字符集没有的字符。这就导致一个字符集系统接到另一个
   其他字符集系统的一串数字时，会将其转变为非预期的其他字符。
2. 为了避免这种问题，一个系统需要能具备不同的字符集解码规则，并且在处理表示字符的二进制数
   字时还需要知道是什么编码规则。
3. Unicode要收录世界上所有的字符，让所有的字符集编码解码都是用同一个规则。每一个字符在
   Unicode字符集中对应一个唯一的数字code point。
4. Unicode code point 一共有1,114,112个。Unicode一般用U+前缀的十六进制表示这些
   code point，即从U+0到U+10FFFF。
5. 2016年的Unicode 9.0 一共有 128,172个字符，所以对应Unicode中的128,172个code point。

[根据字符查code point](https://codepoints.net/)，对每个字符都会有一个简介，简直就是人类字符全集字典。

## plane
1. Unicode将1,114,112个code point分组成了17个plane。包括一个
   Basic Multilingual Plane（BMP）和16个其他的plane。
2. BMP中的code point范围是四位十六进制数，从0000到FFFF；其他16个plane，每个plane有
   0x10000个code point，其中14个是五位十六进制数，后两个因为进位了，所以是六位十六进制数。


## Mapping and encodings
1. Unicode defines two mapping methods: the Unicode Transformation Format (UTF)
   encodings, and the Universal Coded Character Set (UCS) encodings
2. An encoding maps (possibly a subset of) the range of Unicode code points to
   sequences of values in some fixed-size range, termed *code values*.
3. The numbers in the names of the encodings indicate the number of bits per
   code value (for UTF encodings) or the number of bytes per code value
   (for UCS encodings).


## utf-32 utf-24
1. Unicode的1,114,112个code point，用二进制表示需要从`0`到`10000 11111111 11111111`
2. 以byte为单位，要保存任意一个字符code point，需要3个byte。UTF-24就可以了，为什么还要
   制定UTF-32
3. 一个可能的主要原因就是计算机更适应翻倍式的存储方式，现实中的产品也主要都是16、32、64这
   种规格的。虽然现在不知道这样的原因。
4. UTF-32使用固定的32bit来表示code point的，四个字节对应一个code point，一一对应，简单
   粗暴。粗暴的就是，我们用到的大多数的字符都是BMP的，而BMP的字符只需要两个字节就够了
   （从`0`到`11111111 11111111`），但如果用UTF-32编码，就会产生大量的浪费。
5. 还有一些其他缺点，所以基本不使用。
6. utf-24也是基于相似的原因以及其他一些原因，同样基本不使用。


## utf-16 and UCS-2
1. 因为只有16bit，所以显然不能简单粗暴的存储21bit的code point
2. utf16规定BMP使用两个byte来表示，其他plane使用四个byte来表示。但问题是就如这种规则名字所表示的，它只有两个byte。
3. 不知道怎么办，所以就按照目标简单粗暴的先处理一下，将四个byte拆成两个2byte看看有什么办法。
4. 现在，BMP以外的code point原本是使用2^32bit来表示，现在就变成了：使用一段2^16bit表示前半部分，再使用另一段2^16bit表示后半部分。
5. 现在，所有plane的code point都可以用16bit来表示了。
6. 现在的问题就变成了，在你看到一个2byte的时候，它可能代表以下含义中的一种：
    * BMP的code point
    * Supplementary plane中的code point的前半部分
    * Supplementary plane中的code point的后半部分
怎么识别？
7. utf16的规则是，先从所有的code point里删掉BMP的code point，只留下 Supplementary plane的 code point，总共有2^20个（从0x10000到0x10ffff）。
8. 将这些code point 重新编号，0到1111 11111111 11111111，改一下格式，就是从0000000000 0000000000到1111111111 1111111111，总共20位)
9. 将它们拆分成2byte形式，则前半部分有2^10(0x400)种可能，后半部分同样有2^10(0x400)种可能。
10. BMP中U+D800到U+DFFF这0x800个位置正好是空的。
11. 将之前拆分出来的前半部分的2^10(0x400)个code point依次映射到U+D800~U+DBFF（高位），将后半部分的2^10(0x400)个code point依次映射到U+DC00~U+DFFF（低位）。
12. 例如U+10000的code point在使用UTF-16编码时是第一个需要拆分的。它的code point 二进制是`1 00000000 00000000`。按照上面的规则，先删掉BMP后再重新排序，则它的编号就成了第一个，`0000000000`和`0000000000`
13. 所以，在高位区间和低位区间，它都排第一个，即它的utf16编码为 0xd800 0xdc00
14. 另一个双字节字符，它的code point是U+1D306。现在，先删掉BMP的code point，再重新排序（0x1d306 - 0x10000），它的序号是 0xd306，转换为二进制就是 `0000110100 1100000110`
15. 它的高位，在0xd800的基础上加上`0b110100`，得出的结果转换为十六进制就是 0xd834
16. 它的低位，在0xdc00的基础上加上`0b1100000110`，得出的结果转换为十六进制就是 0xdf06
17. 所以，code point为U+1D306的双字节字符，用utf16来表示，两个字节为0xd834和0xdf06
18. 普遍的公式:
    ```
    function unicode2utf16( nHexCodePoint ){
    	let nHeigh = Math.floor( (nHexCodePoint - 0x10000)/1024 ) + 0xd800,
    		nLow = (nHexCodePoint - 0x10000)%1024 + 0xdc00;
    	return [nHeigh.toString(16), nLow.toString(16)];
    }
    ```
19. UCS-2是已经被淘汰的2byte编码形式，它只能表示BMP的字符，因为它没有UTF-16那样用4个byte来表示Supplementary plane的机制。


## utf-8
1. An 8-bit variable-width encoding which maximizes compatibility with ASCII
2. UTF-8 uses one to four bytes per code point
3. 对于单字节字符，和ASCII一样。
4. 对于n字节的符号（n>1），第一个字节的前n位都设为1，第n+1位设为0，后面字节的前两位一律设为10。剩下的没有提及的二进制位，全部为这个符号的unicode码。

Unicode符号范围 | UTF-8编码方式
-|-
(十六进制) | （二进制）
0000 0000-0000 007F | 0xxxxxxx
0000 0080-0000 07FF | 110xxxxx 10xxxxxx
0000 0800-0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx
0001 0000-0010 FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx

```
function unicode2utf8( nHexCodePoint ){
	let sBin = nHexCodePoint.toString(2),
		aUTF8 = "";

	if( nHexCodePoint<0x80 ){
		aUTF8 = [sBin.padStart(8, "0")];
	}
	else if( nHexCodePoint<0x800 ){
		aUTF8 = ["110"+sBin.slice(0, -6).padStart(5, "0"), "10"+sBin.slice(-6)];
	}
	else if( nHexCodePoint<0x10000 ){
		aUTF8 = ["1110"+sBin.slice(0, -12).padStart(4, "0"), "10"+sBin.slice(-12, -6), "10"+sBin.slice(-6)];
	}
	else{
		aUTF8 = ["11110"+sBin.slice(0, -18).padStart(3, "0"), "10"+sBin.slice(-18, -12), "10"+sBin.slice(-12, -6), "10"+sBin.slice(-6)];
	}

	return aUTF8.map(function(item){
		return Number.parseInt(item, 2).toString(16);
	});
}
```


## References
* [阮一峰Unicode简介](http://www.ruanyifeng.com/blog/2014/12/unicode.html)
* [阮一峰 ASCII，Unicode和UTF-8](http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html)
* [Unicode Wiki](https://en.wikipedia.org/wiki/Unicode)
* [Official Site](http://www.unicode.org/)
