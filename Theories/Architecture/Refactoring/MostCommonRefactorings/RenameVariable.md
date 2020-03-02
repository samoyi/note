# Rename Variable


<!-- TOC -->

- [Rename Variable](#rename-variable)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [Example](#example)
        - [When a variable has a wider scope than just a single function.](#when-a-variable-has-a-wider-scope-than-just-a-single-function)
        - [Renaming a Constant](#renaming-a-constant)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 命名，不管是对实质的还是虚拟的任何东西进行命名，都是一件很重要的事情。
2. 名称一定会或多或少的造成误导。任何名称都不是事物本身，只能尽可能的接近。当然也可以使用这一特征来进行误导。
3. 因为人们大多数的时候都没有时间甚至是没有兴趣去看事物的本质，或者看了也不一定能看透。这里，名称就和事物的实质产生了距离，所以命名就可以先入为主的决定人们对一个事物的理解。
4. 就像《阴阳师》电影第一部中安倍晴明说到的：名字是最短的咒，人会被名字束缚。名字会先入为主的影响人的理解，而且几乎肯定是片面化的。其实所谓的对人贴标签，也就一种命名。对一个人便签化，就几乎肯定是肤浅和片面的认识。
5. 在程序中同样如此。不管是一个变量、一个函数还是一个模块，如果命名不准确，就会对看代码的人造成误解。


## Motivation
1. Naming things well is the heart of clear programming. Variables can do a lot to explain what I’m up to—if I name them well. 
2. But I frequently get my names wrong—sometimes because I’m not thinking carefully enough, sometimes because my understanding of the problem improves as I learn more, and sometimes because the program’s purpose changes as my users’ needs change.
3. Even more than most program elements, the importance of a name depends on how widely it’s used. A variable used in a one­line lambda expression is usually easy to follow—I often use a single letter in that case since the variable’s purpose is clear from its context. Parameters for short functions can often be terse for the same reason, although in a dynamically typed language like JavaScript, I do like to put the type into the name (hence parameter names like aCustomer). 因为在这种情况下，你几乎一定会看到而且看明白命名所指代的事物本身，而不是只看命名。所以明明没那么重要。
4. Persistent fields that last beyond a single function invocation require more careful naming. This is where I’m likely to put most of my attention. 这种情况下，名称和它所指代的事物本身是有距离的，人们看到一个变量的时候不一定很方便的去看变量指代的事物本身，所以就会更依赖名称传达出的意义，就可能会产生误解。


## Mechanics
1. If the variable is used widely, consider Encapsulate Variable.
2. Find all references to the variable, and change every one.
3. If there are references from another code base, the variable is a published variable, and you cannot do this refactoring.
4. If the variable does not change, you can copy it to one with the new name, then change gradually, testing after each change.
5. Test.


## Example
### When a variable has a wider scope than just a single function. 
1. There may be a lot of references all over the code base:
    ```js
    let tpHd = "untitled";
    ```
2. Some references access the variable:
    ```js
    result += `<h1>${tpHd}</h1>`;
    ```
3. Others update it:
    ```js
    tpHd = obj['articleTitle'];
    ```
4. My usual response to this is apply Encapsulate Variable.
    ```js
    result += `<h1>${title()}</h1>`;
    setTitle(obj['articleTitle']);
    function title() {return tpHd;}
    function setTitle(arg) {tpHd = arg;}
    ```
5. At this point, I can rename the variable.
    ```js
    let _title = "untitled";
    function title() {return _title;}
    function setTitle(arg) {_title = arg;}
    ```
6. 这里的想法是，先把分散的引用转变为统一的代理引用，然后只需要修改这唯一的代理引用即可。
7. I could continue by inlining the wrapping functions so all callers are using the variable directly. But I’d rarely want to do this. If the variable is used widely enough that I feel the need to encapsulate it in order to change its name, it’s worth keeping it encapsulated behind functions for the future.
8. In cases where I was going to inline, I’d call the getting function `getTitle` and not use an underscore for the variable name when I rename it.

### Renaming a Constant
1. If I’m renaming a constant (or something that acts like a constant to clients) I can avoid encapsulation, and still do the rename gradually, by copying. 
2. If the original declaration looks like this:
    ```js
    const cpyNm = "Acme Gooseberries";
    ```
3. I can begin the renaming by making a copy:
    ```js
    const companyName = "Acme Gooseberries";
    const cpyNm = companyName;
    ```
4. With the copy, I can gradually change references from the old name to the new name. When I’m done, I remove the copy.


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
