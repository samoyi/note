# Template Syntax


<!-- TOC -->

- [Template Syntax](#template-syntax)
    - [概述](#概述)
    - [Using JavaScript Expressions](#using-javascript-expressions)
    - [Directives](#directives)
        - [Dynamic Arguments](#dynamic-arguments)
            - [对动态参数的值的约束](#对动态参数的值的约束)
            - [对动态参数表达式的约束](#对动态参数表达式的约束)

<!-- /TOC -->


## 概述
* Vue.js 使用了基于 HTML 的模板语法，允许开发者声明式地将 DOM 绑定至底层 Vue 实例的数据。 Vue.js 正是作为 VM 层实现 DOM 和 Data 的绑定。
* 在底层的实现上，Vue 将模板编译成虚拟 DOM 渲染函数。所以说即使使用模板语法，也会被转换为渲染函数的形式。


## Using JavaScript Expressions
1. 必须是有明确返回值的单独表达式。
2. 模板表达式都被放在沙盒中，只能访问全局变量的一个白名单，如 `Math` 和 `Date`。你不应该在模板表达式中试图访问用户定义的全局变量。
3. 想想在模板里用了实例没定义的属性的话，出现的是 Vue 级别的报错，内容类似于：
`Property or method "某某" is not defined on the instance but referenced during
render`。如果可以随意引用全局变量，只会出现 JS 级别的报错，类似于：`ReferenceError:
某某 is not defined`
    ```html
    <div id="components-demo">
        {{ Math.random() }}  <!-- 没问题 -->
    </div>
    ```


## Directives
### Dynamic Arguments
1. 可以用方括号括起来的 JavaScript 表达式作为一个指令的参数
    ```html
    <a v-bind:[attributeName]="url"> ... </a>
    ```
2. 这里的 `attributeName` 会被作为一个 JavaScript 表达式进行动态求值，求得的值将会作为最终的参数来使用。例如，如果你的 Vue 实例有一个 data property `attributeName`，其值为 `"href"`，那么这个绑定将等价于 `v-bind:href`。
3. 同样地，你可以使用动态参数为一个动态的事件名绑定处理函数：
    ```html
    <a v-on:[eventName]="doSomething"> ... </a>
    ```
    在这个示例中，当 `eventName` 的值为 `"focus"` 时，`v-on:[eventName]` 将等价于 `v-on:focus`。

#### 对动态参数的值的约束
动态参数预期会求出一个字符串，异常情况下值为 `null`。这个特殊的 `null` 值可以被显性地用于移除绑定。任何其它非字符串类型的值都将会触发一个警告。

#### 对动态参数表达式的约束
1. 动态参数表达式有一些语法约束，因为某些字符，如空格和引号，放在 HTML attribute 名里是无效的。例如：
    ```html
    <!-- 这会触发一个编译警告 -->
    <a v-bind:['foo' + bar]="value"> ... </a>
    ```
2. 变通的办法是使用没有空格或引号的表达式，或用计算属性替代这种复杂表达式。
3. 在 DOM 中使用模板时，还需要避免使用大写字符来命名键名，因为浏览器会把 attribute 名全部强制转为小写：
    ```html
    <!--
    在 DOM 中使用模板时这段代码会被转换为 `v-bind:[someattr]`。
    除非在实例中有一个名为“someattr”的 property，否则代码不会工作。
    -->
    <a v-bind:[someAttr]="value"> ... </a>
    ```