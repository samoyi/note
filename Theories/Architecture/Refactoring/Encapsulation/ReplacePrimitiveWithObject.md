# Replace Primitive with Object


<!-- TOC -->

- [Replace Primitive with Object](#replace-primitive-with-object)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [References](#references)

<!-- /TOC -->


## 思想
对应 Bad Codes 中的 Primitive Obsession


## Motivation
1. Often, in early stages of development you make decisions about representing simplefacts as simple data items, such as numbers or strings. 
2. As development proceeds, those simple items aren’t so simple anymore. A telephone number may be represented as a
string for a while, but later it will need special behavior for formatting, extracting the area code, and the like. 
3. This kind of logic can quickly end up being duplicated around the code base, increasing the effort whenever it needs to be used.
4. As soon as I realize I want to do something other than simple printing, I like to create a new class for that bit of data. 
5. At first, such a class does little more than wrap the primitive — but once I have that class, I have a place to put behavior specific to its needs.
6. These little values start very humble, but once nurtured they can grow into useful tools. They may not look like much, but I find their effects on a code base can be surprisingly large. 
7. Indeed many experienced developers consider this to be one of the most valuable refactorings in the toolkit — even though it often seems counterintuitive to a new programmer.


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
