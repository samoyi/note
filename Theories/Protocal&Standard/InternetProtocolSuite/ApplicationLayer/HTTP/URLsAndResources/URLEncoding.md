# URL Encoding

This section summarizes the universal alphabet and encoding rules for URLs


<!-- TOC -->

- [URL Encoding](#url-encoding)
    - [URL 设计需要面对的问题](#url-设计需要面对的问题)
        - [URL 需要被设计得兼容各种协议](#url-需要被设计得兼容各种协议)
        - [URL 需要被设计为可读可打印的](#url-需要被设计为可读可打印的)
        - [但 URL 又需要被设计得可以包含各种信息](#但-url-又需要被设计得可以包含各种信息)
    - [转义序列的必要性](#转义序列的必要性)
    - [编码机制](#编码机制)
    - [需要编码转义的字符](#需要编码转义的字符)
    - [References](#references)

<!-- /TOC -->


## URL 设计需要面对的问题
### URL 需要被设计得兼容各种协议
1. URLs were designed to be portable. They were also designed to uniformly name all the resources on the Internet, which means that they will be transmitted through various protocols. 
2. Because all of these protocols have different mechanisms for transmitting their data, it was important for URLs to be designed so that they could be transmitted safely through any Internet protocol.
3. Safe transmission means that URLs can be transmitted without the risk of losing information. 
4. Some protocols, such as the Simple Mail Transfer Protocol (SMTP) for electronic mail, use transmission methods that can strip off certain characters. 
5. To get around this, URLs are permitted to contain only characters from a relatively small, universally safe alphabet.

### URL 需要被设计为可读可打印的
1. In addition to wanting URLs to be transportable by all Internet protocols, designers wanted them to be readable by people. 
2. So invisible, nonprinting characters also are prohibited in URLs, even though these characters may pass through mailers and otherwise be portable.

### 但 URL 又需要被设计得可以包含各种信息
1. To complicate matters further, URLs also need to be *complete*. 
2. URL designers realized there would be times when people would want URLs to contain binary data or characters outside of the universally safe alphabet. 
3. So, an escape mechanism was added, allowing unsafe characters to be encoded into safe characters for transport.


## 转义序列的必要性
1. Default computer system character sets often have an Anglocentric bias. Historically, many computer applications have used the US-ASCII character set. 
2. US-ASCII uses 7 bits to represent most keys available on an English typewriter and a few nonprinting control characters for text formatting and hardware signalling.
3. US-ASCII is very portable, due to its long legacy. 
4. But while it’s convenient to citizens of the U.S., it doesn’t support the inflected characters common in European languages or the hundreds of non-Romanic languages read by billions of people around the world. Furthermore, some URLs may need to contain arbitrary binary data. 
5. Recognizing the need for completeness, the URL designers have incorporated *escape sequences*.
6. Escape sequences allow the encoding of arbitrary character values or data using a restricted subset of the US-ASCII character set, yielding portability and completeness.


## 编码机制
1. To get around the limitations of a safe character set representation, an encoding scheme was devised to represent characters in a URL that are not safe. 
2. The encoding simply represents the unsafe character by an “escape” notation, consisting of a percent sign (`%`) followed by two hexadecimal digits that represent the ASCII code of the character.
3. Some encoded character examples
    Character | ASCII code | Example URL
    --|--|--
    ~ | 126 (0x7E) | `http://www.joes-hardware.com/%7Ejoe`
    SPACE | 32 (0x20) | `http://www.joes-hardware.com/more%20tools.html`
    % | 37 (0x25) | `http://www.joes-hardware.com/100%25satisfaction.html`
4. 汉字的情况，以 “汉” 为例，它的 UTF-8 编码三个字节是 E6 B1 89。所以编码之后的字符串为 “%E6%B1%89”。


## 需要编码转义的字符
1. 根据前面说到的 URL 的设计要求，以下三种情况的字符都需要被转义
    * Several characters have been reserved to have special meaning inside of a URL. 
    * Others are not in the defined US-ASCII printable set. 
    * And still others are known to confuse some Internet gateways and protocols, so their use is discouraged.
2. 下表列出了这些字符
<table>
    <thead>
        <tr>
            <th>Character</th>
            <th>Reservation/Restriction</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>%<td/>
            <td>Reserved as escape token for encoded characters</td>
        </tr>
        <tr>
            <td>/<td/>
            <td>Reserved for delimiting splitting up path segments in the path component</td>
        </tr>
        <tr>
            <td>.<td/>
            <td>Reserved in the path component</td>
        </tr>
        <tr>
            <td>..<td/>
            <td>Reserved in the path component</td>
        </tr>
        <tr>
            <td>#<td/>
            <td>Reserved as the fragment delimiter</td>
        </tr>
        <tr>
            <td>?<td/>
            <td>Reserved as the query-string delimiter</td>
        </tr>
        <tr>
            <td>;<td/>
            <td>Reserved as the params delimiter</td>
        </tr>
        <tr>
            <td>:<td/>
            <td>Reserved to delimit the scheme, user/password, and host/port components</td>
        </tr>
        <tr>
            <td>$ , +<td/>
            <td>Reserved</td>
        </tr>
        <tr>
            <td>@ & =<td/>
            <td>Reserved because they have special meaning in the context of some schemes</td>
        </tr>
        <tr>
            <td>{ } | \ ^ ~ [ ] ‘<td/>
            <td>Restricted because of unsafe handling by various transport agents, such as gateways</td>
        </tr>
        <tr>
            <td>&lt; > "<td/>
            <td>Unsafe; should be encoded because these characters often have meaning outside the scope of the URL,
            such as delimiting the URL itself in a document (e.g., "http://www.joes-hardware.com")</td>
        </tr>
        <tr>
            <td>0x00–0x1F, 0x7F<td/>
            <td>Restricted; characters within these hex ranges fall within the nonprintable section of the US-ASCII character set</td>
        </tr>
        <tr>
            <td>大于0x7F<td/>
            <td>Restricted; characters whose hex values fall within this range do not fall within the 7-bit range of the USASCII character set</td>
        </tr>
    </tbody>
</table>


## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/): Shady Characters