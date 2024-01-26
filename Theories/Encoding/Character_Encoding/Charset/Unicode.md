<!-- vscode-markdown-toc -->
* 1. [Unicode 字符集](#Unicode)
	* 1.1. [Unique](#Unique)
	* 1.2. [Plane](#Plane)
* 2. [编码规则](#)
	* 2.1. [编码规则的用处](#-1)
	* 2.2. [Mapping and encodings](#Mappingandencodings)
	* 2.3. [UTF-32 UTF-24](#UTF-32UTF-24)
	* 2.4. [UTF-16 and UCS-2](#UTF-16andUCS-2)
	* 2.5. [UTF-8](#UTF-8)
* 3. [References](#References)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

# Unicode

分为字符集和编码规则两部分


##  1. <a name='Unicode'></a>Unicode 字符集
###  1.1. <a name='Unique'></a>Unique
1. 不同的字符集有可能用两个不同的二进制数字表示相同的字符，或者用相同的二进制数字表示不同的字符，而且某些字符集收录了一些其他字符集没有的字符。这就导致一个字符集系统接到另一个其他字符集系统的一串数字时，会将其转变为非预期的其他字符。
2. 为了避免这种问题，一个系统需要能具备不同的字符集解码规则，并且在处理表示字符的二进制数字时还需要知道是什么编码规则。
3. Unicode 要收录世界上所有的字符，让所有的字符集编码解码都使用同一个规则。每一个字符在 Unicode 字符集中对应一个唯一的数字 code point。
4. Unicode code point 一共有 1,114,112 个。Unicode 一般用 `U+` 前缀的十六进制表示这些 code point，即从 `U+0` 到 `U+10FFFF`。
5. 2016 年的 Unicode 9.0 一共有 128,172 个字符，所以对应 Unicode 中的 128,172 个 code point。
6. 如果大家都统一使用 Unicode 这一种字符集。这样对于同一个二进制数都会得到统一的字符，而对于一个字符也都会得到统一的二进制数。
7. UNICODE 的前 128 个字符也是 ASCII 的字符，但位置并不是一一对应的。
8. [根据字符查 code point](https://codepoints.net/)，对每个字符都会有一个简介，简直就是人类字符全集字典。

###  1.2. <a name='Plane'></a>Plane
1. Unicode 将 1,114,112 个 code point 分组成了 17 个 plane。包括一个 Basic Multilingual Plane（BMP）和 16 个其他的 plane。
2. BMP 中的 code point 范围是四位十六进制数，从 `0000` 到 `FFFF`；其他 16 个 plane，每个 plane 有 0x10000 个 code point，其中 14 个是五位十六进制数，后两个因为进位了，所以是六位十六进制数。


##  2. <a name=''></a>编码规则
###  2.1. <a name='-1'></a>编码规则的用处
1. 现在，统一了字符集，大家已经可以使用 Unicode 正常交流了。
2. Unicode 中最大的数字转换为二进制是 `10000 11111111 11111111`，一共 21 位。现在我们给对方传输字符串时，就可以发送若干个 21 位二进制数字。即使是小的数字实际没有 21 位，也要在前面添加 `0` 来补足 21 位，这样对方才可以正确解码。
3. 能用是能用，但是其实常用的字符的 code point 都是很小的，尤其是对于英语来说，常用的字符都在前 128 个，如果这些字符的二进制也要转换为 21 位二进制数字，则前面添加了很多无实际意义的 `0`，进而整个字符串的绝大多数都是这些无意义的 `0`。对于传输来说是极大的浪费。
4. 所以需要在 Unicode 的基础上，再建立编码规则，做到可以用尽可能少的数字来表示所有的 code point。


###  2.2. <a name='Mappingandencodings'></a>Mapping and encodings
1. Unicode defines two mapping methods: the Unicode Transformation Format (UTF) encodings, and the Universal Coded Character Set (UCS) encodings.
2. An encoding maps (possibly a subset of) the range of Unicode code points to sequences of values in some fixed-size range, termed *code values*.
3. The numbers in the names of the encodings indicate the number of bits per code value (for UTF encodings) or the number of bytes per code value (for UCS encodings).


###  2.3. <a name='UTF-32UTF-24'></a>UTF-32 UTF-24
1. Unicode 的 1,114,112 个 code point，用二进制表示需要从 `0` 到 `10000 11111111 11111111`。
2. 以 byte 为单位，要保存任意一个字符 code point，即使不进一步编码，也只需要 3 个 byte 的 UTF-24 规则就可以了，为什么还要制定 UTF-32？
3. 一个可能的主要原因就是计算机更适应翻倍式的存储方式，现实中的产品也主要都是 16、32、64 这种规格的。虽然现在不知道这样的原因。
4. UTF-32 使用固定的 32bit 来表示 code point 的，四个字节对应一个 code point，一一对应。使用 UTF-32 编码规则甚至比不是用编码规则还要更浪费。
6. UTF-24 也是基于相似的原因以及其他一些原因，同样基本不使用。


###  2.4. <a name='UTF-16andUCS-2'></a>UTF-16 and UCS-2
1. 因为只有 16bit，所以显然不能简单粗暴的存储 21bit 的 code point。
2. UTF16 规定 BMP 使用两个 byte 来表示，其他 plane 使用四个 byte 来表示。但问题就如这种规则名字所表示的，它的一个单元只有两个 byte，怎么表示 BMP 以外的字符？
3. 不知道怎么办，所以就按照目标简单粗暴的先处理一下，将四个 byte 拆成两个 2byte 看看有什么办法。
4. 现在，BMP 以外的 code point 原本是使用 2^32bit 来表示，现在就变成了：使用一段 2^16bit 表示前半部分，再使用另一段 2^16bit 表示后半部分。
5. 现在，所有 plane 的 code point 都可以用 16bit 来表示了。
6. 现在的问题就变成了，在你看到一个 2byte 的时候，它可能代表以下含义中的一种：
    * BMP 的 code point
    * Supplementary plane 中的 code point 的前半部分
    * Supplementary plane 中的 code point 的后半部分
	怎么识别？
7. UTF16 的规则是，先从所有的 code point 里删掉 BMP 的 code point，只留下
Supplementary plane 的 code point，总共有 2^20 个（从`0x10000`到`0x10ffff`）。
8. 将这些 code point 重新编号，`0` 到 `1111 11111111 11111111`，改一下格式，就是从
`0000000000 0000000000` 到 `1111111111 1111111111`，总共 20 位。
9. 将它们拆分成 2byte 形式，则前半部分有 2^10(`0x400`) 种可能，后半部分同样有
2^10(`0x400`)种可能。
10. BMP 中 `U+D800` 到 `U+DFFF` 这 `0x800` 个位置正好是空的。
11. 将之前拆分出来的前半部分的 2^10(`0x400`) 个 code point 依次映射到 `U+D800`~`U+DBFF`（高位），将后半部分的 2^10(`0x400`)个 code point 依次映射到 `U+DC00`~`U+DFFF`（低位）。
12. 例如 `U+10000` 的 code point 在使用 UTF-16 编码时是第一个需要拆分的。它的 code point 二进制是 `1 00000000 00000000`。按照上面的规则，先删掉 BMP 后再重新排序，则它的编号就成了第一个，`0000000000` 和 `0000000000`。
13. 所以，在高位区间和低位区间，它都排第一个，即它的 UTF16 编码为 0xd800 0xdc00
14. 另一个双字节字符，它的 code point 是`U+1D306`。现在，先删掉 BMP 的 code point，再重新排序（`0x1d306` - `0x10000`），它的序号是 `0xd306`，转换为二进制就是 `0000110100 1100000110`。
15. 它的高位，在`0xd800` 的基础上加上 `0b110100`，得出的结果转换为十六进制就是`0xd834`。
16. 它的低位，在`0xdc00` 的基础上加上 `0b1100000110`，得出的结果转换为十六进制就是 `0xdf06`。
17. 所以，code point 为 `U+1D306` 的双字节字符，用 UTF16 来表示，两个字节为 `0xd834`和 `0xdf06`。
18. 这样，当解码器看到一个 2byte 时，如果它的值在`U+D800`到`U+DBFF`之间，则知道该
2byte 和之后的 2byte 共同组成一个字符。
19. 编码公式:
    ```js
    function unicode2UTF16( nHexCodePoint ){
    	let nHeigh = Math.floor( (nHexCodePoint - 0x10000)/1024 ) + 0xd800,
    		nLow = (nHexCodePoint - 0x10000)%1024 + 0xdc00;
    	return [nHeigh.toString(16), nLow.toString(16)];
    }
    ```
20. UCS-2 是已经被淘汰的 2byte 编码形式，它只能表示 BMP 的字符，因为它没有 UTF-16 那样用 4 个 byte 来表示 Supplementary plane 的机制。


###  2.5. <a name='UTF-8'></a>UTF-8
1. UTF-8 使用 1 到 4 个字节来表示 code point。
3. 单字节的第一位是 `0`，后七位对应 ASCII。
4. 对于 n 字节的符号（n>1），第一个字节的前 n 位都设为 1，第 n+1 位设为 0，后面字节的前两位一律设为 10。剩下的没有提及的二进制位，全部为这个符号的 unicode 码。
5. 绝大多数的汉字字符和符号都落在三字节的范围，很少一部分是四字节

Unicode符号范围 | UTF-8编码方式
-|-
(十六进制) | （二进制）
0000 0000-0000 007F | 0xxxxxxx
0000 0080-0000 07FF | 110xxxxx 10xxxxxx
0000 0800-0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx
0001 0000-0010 FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx

```js
function unicode2UTF8( nHexCodePoint ){
	let sBin = nHexCodePoint.toString(2),
		aUTF8 = "";

	if( nHexCodePoint<0x80 ){
		aUTF8 = [sBin.padStart(8, "0")];
	}
	else if( nHexCodePoint<0x800 ){
		aUTF8 = ["110"+sBin.slice(0, -6).padStart(5, "0"), "10"+sBin.slice(-6)];
	}
	else if( nHexCodePoint<0x10000 ){
		aUTF8 = ["1110"+sBin.slice(0, -12).padStart(4, "0"),
                    "10"+sBin.slice(-12, -6), "10"+sBin.slice(-6)];
	}
	else{
		aUTF8 = ["11110"+sBin.slice(0, -18).padStart(3, "0"),
                    "10"+sBin.slice(-18, -12), "10"+sBin.slice(-12, -6),
                    "10"+sBin.slice(-6)];
	}

	return aUTF8.map(function(item){
		return Number.parseInt(item, 2).toString(16);
	});
}
```


##  3. <a name='References'></a>References
* [阮一峰Unicode简介](http://www.ruanyifeng.com/blog/2014/12/unicode.html)
* [阮一峰 ASCII，Unicode和UTF-8](http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_UTF-8.html)
* [Unicode Wiki](https://en.wikipedia.org/wiki/Unicode)
* [Official Site](http://www.unicode.org/)
