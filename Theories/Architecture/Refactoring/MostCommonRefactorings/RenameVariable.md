# Rename Variable


<!-- TOC -->

- [Rename Variable](#rename-variable)
    - [思想](#思想)
        - [语义化](#语义化)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [Example](#example)
        - [When a variable has a wider scope than just a single function.](#when-a-variable-has-a-wider-scope-than-just-a-single-function)
        - [Renaming a Constant](#renaming-a-constant)
    - [References](#references)

<!-- /TOC -->


## 思想
### 语义化
1. 命名，不管是对实质的还是虚拟的任何东西进行命名，都是一件很重要的事情。
2. 因为人们大多数的时候都没有时间甚至是没有兴趣去看事物的本质，或者看了也不一定能看透。这里，名称就和事物的实质产生了距离，所以命名就可以先入为主的决定人们对一个事物的理解。
3. 那么，给对象准确的命名，就有助于阅读的人准确的把握对象的本质。而不准确的命名则会对人产生误导。
4. 在程序中同样如此。不管是一个变量、一个函数还是一个模块，如果命名不准确，就会对看代码的人造成误解。


## Motivation
1. 通过命名可以快速传达被命名对象的本质，程序中各种对象都需要准确的命名。
2. 一个对象应用的越广泛，它的命名的准确性就越重要。对于一个局部使用的临时变量，随便起一个名字问题也不大；但如果被到处引用那就不行了。
3. 随着对对象的理解的深入，或者随着对象的演进，需要对命名进行相应的修订。


## Mechanics
1. If the variable is used widely, consider *Encapsulate Variable*.
2. Find all references to the variable, and change every one.
    * If the variable does not change, you can copy it to one with the new name, then change gradually, testing after each change. 在实践中很可能无法一次性修改所有引用该变量的组件，那么通过新旧命名共存，实现逐步替换。参考下面重命名常量的例子。
    * If there are references from another code base, the variable is a published variable, and you cannot do this refactoring.
3. Test.


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

    function title()       {return tpHd;}
    function setTitle(arg) {tpHd = arg;}
    ```
5. At this point, I can rename the variable.
    ```js
    let _title = "untitled";
    function title() {return _title;}
    function setTitle(arg) {_title = arg;}
    ```
6. 这里如果仅仅为了重命名，没必要进行封装，直接全局替换就行了。但因为变量的使用范围比较广，变得比较全局，那么进行封装后，就可以方便的追踪对该变量进行的操作。
7. 在前端工程中，也会使用这样的封装。例如 Vuex 中会把这样的变量的访问和设置封装为 getter 和 mutation。
8. I could continue by inlining the wrapping functions so all callers are using the variable directly. But I’d rarely want to do this. If the variable is used widely enough that I feel the need to encapsulate it in order to change its name, it’s worth keeping it encapsulated behind functions for the future.
9. In cases where I was going to inline, I’d call the getting function `getTitle` and not use an underscore for the variable name when I rename it.

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
