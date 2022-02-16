# Compiler

源码版本：2.5.21




<!-- TOC -->

- [Compiler](#compiler)
    - [设计目的](#设计目的)
        - [关键细节](#关键细节)
    - [实现原理](#实现原理)
    - [抽象本质](#抽象本质)
    - [设计思想](#设计思想)
    - [References](#references)

<!-- /TOC -->


## 设计目的
将模板编译为 AST


### 关键细节


## 实现原理
1. parse 过程会用正则等方式将 template 模板中进行字符串解析，得到指令、class、style 等数据，最终形成 AST。
2. AST 的每一个节点都是一个 `ASTElement` 实例。
3. 假设编译以下模板
    ```html
    <div id="app">
        <header>
            <h1>I'm a template!</h1>
        </header>
        <p v-if="message">{{ message }}</p>
        <p v-else>No message.</p>
    </div>
    ```
    返回的 `ast` 部分展开如下
    <img src="./images/06.png" width="800" style="display: block; margin: 5px 0 10px 0;" />


## 抽象本质


## 设计思想



[一篇带注释的源码](https://github.com/answershuto/learnVue/blob/master/vue-src/compiler/parser/index.js#L53)。






## References
* [聊聊Vue的template编译.MarkDown](https://github.com/answershuto/learnVue/blob/master/docs/%E8%81%8A%E8%81%8AVue%E7%9A%84template%E7%BC%96%E8%AF%91.MarkDown)