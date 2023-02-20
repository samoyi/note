# Formatting contexts


<!-- TOC -->

- [Formatting contexts](#formatting-contexts)
    - [块格式化上下文（Block formatting contexts）](#块格式化上下文block-formatting-contexts)
        - [创建新的块格式上下文](#创建新的块格式上下文)
        - [需要创建新的块上下文的场景](#需要创建新的块上下文的场景)
            - [包含内部浮动](#包含内部浮动)
            - [排除外部浮动](#排除外部浮动)
            - [阻止外边距重叠](#阻止外边距重叠)
    - [行内格式化上下文（Inline formatting contexts）](#行内格式化上下文inline-formatting-contexts)
    - [弹性格式化上下文（Flex formatting contexts）](#弹性格式化上下文flex-formatting-contexts)
    - [References](#references)

<!-- /TOC -->


## 块格式化上下文（Block formatting contexts）
1. 块格式化上下文（Block Formatting Context，BFC）是 Web 页面的可视 CSS 渲染的一部分，是块级盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域。
2. 文档最外层元素使用块布局规则或称为 **初始(initial)块格式上下文**。这意味着 `<html>` 元素块中的每个元素都是按照正常流程遵循块和内联布局规则进行布局的。
3. 参与 BFC 的元素使用 CSS 框模型概述的规则，该模型定义了元素的边距、边框和填充如何与同一上下文中的其他块交互。

### 创建新的块格式上下文
1. 除了文档的根元素 `<html>` 之外，还将在以下情况下创建一个新的 BFC
    * 使用 `float` 使其浮动的元素
    * 绝对定位的元素，包含 `position: fixed` 或 `position: sticky`
    * 使用以下属性的元素 `display: inline-block`
    * 块级元素的 `overflow` 属性不为 `visible`
    * 表格单元格或使用 `display: table-cell`, 包括使用 `display: table-*` 属性的所有表格单元格
    * 表格标题或使用 `display: table-caption` 的元素
    * 元素属性为 `display: flow-root` 或 `display: flow-root list-item`
    * 元素属性为 `contain: layout`, `content`, 或 `strict`
    * flex items
    * 网格布局元素
    * multicol containers
    * 元素属性 `column-span` 设置为 `all`
2. 例如下面的例子中，浮动元素会脱离文档流，导致 box 内部不再有元素，进而高度坍缩
    ```html
    <div class="box">
        <div class="float">I am a floated box!</div>
        <p>I am content inside the container.</p>
    </div>
    ```
    ```css
    .box {
        background-color: rgb(224, 206, 247);
        border: 5px solid rebeccapurple;
    }
    .float {
        float: left;
        width: 200px;
        height: 150px;
        background-color: white;
        border:1px solid black;
        padding: 10px;
    }
    ```
3. 可以给 box 设置某个 CSS 属性来来创建一个局部的 BFC，把本来脱离文档流的浮动元素也包含进来。
4. 虽然可以使用例如 `overflow` 之类的其他样式来创建 BFC，但是这将导致语义不明确，而且也可能引发其他样式副作用。
5. 因此应该使用专门用于创建 BFC 的 `display: flow-root` （或 `display: flow-root list-item`）来创建新的 BFC，这样不会产生任何其他潜在的问题副作用
    ```css
    .box {
        background-color: rgb(224, 206, 247);
        border: 5px solid rebeccapurple;
        display: flow-root;
    }
    ```
6. 现在，box 内的所有内容都参与该容器的 BFC，并且浮动不会从元素底部弹出。    
7. `flow-root` 关键字的意义是，创建的内容本质上类似于一个新的根元素（如 `<html>` 所做），并确定这个新的上下文如何创建及其流布局如何实现。
  
### 需要创建新的块上下文的场景
#### 包含内部浮动
如上例

#### 排除外部浮动
1. 下面的例子中，我们使用 `display: flow-root` 和浮动实现双列布局，因为正常文档流中建立的 BFC 不得与元素本身所在的块格式化上下文中的任何浮动的外边距重叠。不懂，怎么感觉和下面说的外边距重叠差不多
    ```html
    <section>
        <div class="float">Try to resize this outer float</div>
        <div class="box"><p>Normal</p></div>
    </section>
    <section>
        <div class="float">Try to resize this outer float</div>
        <div class="box" style="display:flow-root"><p><code>display:flow-root</code><p></div>
    </section>
    ```
    ```css
    section {
        height:150px;
    }
    .box {
        background-color: rgb(224, 206, 247);
        border: 5px solid rebeccapurple;
    }
    .box[style] {
        background-color: aliceblue;
        border: 5px solid steelblue;
    }
    .float {
        float: left;
        overflow: hidden; /* required by resize:both */
        resize: both;
        margin-right:25px;
        width: 200px;
        height: 100px;
        background-color: rgba(255, 255, 255, .75);
        border: 1px solid black;
        padding: 10px;
    }
    ```

#### 阻止外边距重叠
1. 同级元素外边距重叠
    ```html
    <div class="wrapper">
        <div class="blue"></div>
    </div>
    <div class="wrapper">
        <div class="red"></div>
    </div>
    ```
    ```css
    .blue, .red {
        height: 50px;
        margin: 10px 0;
    }

    .blue {
        background: blue;
    }

    .red {
        background: red;
    }
    
    .wrapper {
        display: flow-root;
    }
    ```
2. 和同级元素的子元素外边距重叠
    ```html
    <div class="blue"></div>
    <div class="red-outer">
        <div class="red-inner">red inner</div>
    </div>
    ```
    ```css
    .blue, .red-inner {
        height: 50px;
        margin: 10px 0;
    }

    .blue {
        background: blue;
    }

    .red-outer {
        display: flow-root;
        background: red;
    }
    ```


## 行内格式化上下文（Inline formatting contexts）


## 弹性格式化上下文（Flex formatting contexts）


## References
* [格式化上下文简介](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flow_Layout/Intro_to_formatting_contexts)
* [块格式化上下文](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)