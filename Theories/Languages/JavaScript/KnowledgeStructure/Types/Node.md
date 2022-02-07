# Node


<!-- TOC -->

- [Node](#node)
    - [`textContent`](#textcontent)
        - [和 `innerText` 的区别](#和-innertext-的区别)
            - [因此 `innerText` 会受样式影响](#因此-innertext-会受样式影响)
            - [因此读取 `innerText` 会导致页面 reflow](#因此读取-innertext-会导致页面-reflow)
            - [`<script>` 和 `<style>` 的情况](#script-和-style-的情况)
    - [References](#references)

<!-- /TOC -->


## `textContent`
### 和 `innerText` 的区别
1. 根本区别是，`textContent` 返回的是源码上的文本，而 `innerText` 返回的是渲染到页面上的文本。
2. 下面的例子可以说明
    ```html
    <body>

    <div>
        div
        <span></span>
        <span></span>
        <span>    span       </span>

        
        <span>    span       </span>
    </div>
    
    </body>
    <script>
    'use strict';

    let tc = document.querySelector("div").textContent;
    let it = document.querySelector("div").innerText;
    console.log("textContent:【" + tc + "】");
    console.log("innerText:【" + it + "】");

    </script>
    ```
    输出为
    ```
    textContent:【
        div
        
        
            span       

        
            span       
    】
    innerText:【div span span】
    ```

#### 因此 `innerText` 会受样式影响
```js
<body>

<div>
    <span>span</span>
    <span style="visibility: hidden;">hidden</span>
    <span style="display: none;">none</span>
</div>

</body>
<script>
'use strict';

let tc = document.querySelector("div").textContent;
let it = document.querySelector("div").innerText;
console.log("textContent:【" + tc + "】");
console.log("innerText:【" + it + "】");

</script>
```
输出为
```
textContent:【
    span
    hidden
    none
】
innerText:【span 】
```

#### 因此读取 `innerText` 会导致页面 reflow
1. 不懂渲染机制，我第一感觉是直接读取一面文本就行了为什么要重渲染。
2. 但既然会 reflow，那就会比 `textContent` 更耗时。

####  `<script>` 和 `<style>` 的情况
1. 和 MDN 上说的不一样。
2. 分为直接读取这两个节点的属性和读取它们祖先节点的属性时的情况。可以使用如下代码测试
    ```html
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <style>
            div {
                color: red;
            }
        </style>
    </head>
    <body> 
        <script>
        'use strict';
        
            
            console.log( "【" + document.querySelector("head").textContent + "】" );
            console.log( "【" + document.querySelector("body").textContent + "】" );
            console.log( "【" + document.querySelector("head").innerText + "】" );
            console.log( "【" + document.querySelector("body").innerText + "】" );
        
            console.log( "【" + document.querySelector("style").textContent + "】" );
            console.log( "【" + document.querySelector("script").textContent + "】" );
            console.log( "【" + document.querySelector("style").innerText + "】" );
            console.log( "【" + document.querySelector("script").innerText + "】" );
        
        
        </script>
    </body>
    ```


## References
* [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#differences_from_innertext)