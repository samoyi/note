# Language Tags and HTTP


<!-- TOC -->

- [Language Tags and HTTP](#language-tags-and-http)
    - [设计思想](#设计思想)
    - [抽象本质](#抽象本质)
    - [Summary](#summary)
    - [Character Set Terminology](#character-set-terminology)
        - [Character](#character)
        - [Glyph](#glyph)
        - [Coded character](#coded-character)
        - [Coding space](#coding-space)
        - [Code width](#code-width)
        - [Character repertoire](#character-repertoire)
        - [Coded character set](#coded-character-set)
        - [Character encoding scheme](#character-encoding-scheme)
    - [没看](#没看)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 抽象本质


## Summary
The previous section described how the HTTP `Accept-Charset` header and the `Content-Type` charset parameter carry character-encoding information from the client and server. HTTP programmers who do a lot of work with international applications and content need to have a deeper understanding of multilingual character systems to understand technical specifications and properly implement software. It isn’t easy to learn multilingual character systems—the terminology is complex and inconsistent, you often have to pay to read the standards documents, and you may be unfamiliar with the other languages with which you’re working. This section is an overview of character systems and standards


## Character Set Terminology
Here are eight terms about electronic character systems that you should know:

### Character
1. An alphabetic letter, numeral, punctuation mark, ideogram (as in Chinese), symbol, or other textual “atom” of writing. 
2. The Universal Character Set (UCS) initiative, known informally as Unicode(Unicode is a commercial consortium based on UCS that drives commercial products.), has developed a standardized set of textual names for many characters in many languages, which often are used to conveniently and uniquely name characters.

### Glyph
A stroke pattern or unique graphical shape that describes a character. A character may have multiple glyphs if it can be written different ways.

### Coded character
A unique number assigned to a character so that we can work with it.

### Coding space
A range of integers that we plan to use as character code values.

### Code width
The number of bits in each (fixed-size) character code.

### Character repertoire
A particular working set of characters (a subset of all the characters in the world).

### Coded character set
A set of coded characters that takes a character repertoire (a selection of characters from around the world) and assigns each character a code from a coding space. In other words, it maps numeric character codes to real characters.

### Character encoding scheme
An algorithm to encode numeric character codes into a sequence of content bits (and to decode them back). Character encoding schemes can be used to reduce the amount of data required to identify characters (compression), work around
transmission restrictions, and unify overlapping coded character sets.


## 没看
该节其他内容


## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)