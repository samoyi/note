# observer


<img src="./pattern.png" style="display: block;" />


<!-- TOC -->

- [observer](#observer)
    - [相关信息](#相关信息)
    - [设计思想](#设计思想)
    - [示例代码](#示例代码)
    - [源码分析](#源码分析)
    - [References](#references)

<!-- /TOC -->


## 相关信息
* 源码版本：2.5.21
* 源码路径：`src/core/components/keep-alive.js`


## 设计思想


## 示例代码
根据该例子的情况具体分析
```html
<div id="app">
    <keep-alive :max="5">
        <any-name :is="'child' + currIndex"></any-name>
    </keep-alive>

    <input type="button" value="1" @click="switchComponent(1)" />
    <input type="button" value="2" @click="switchComponent(2)" />
    <input type="button" value="3" @click="switchComponent(3)" />
    <input type="button" value="4" @click="switchComponent(4)" />
    <input type="button" value="5" @click="switchComponent(5)" />
    <input type="button" value="6" @click="switchComponent(6)" />
</div>
```
```js
new Vue({
    el: '#app',
    components: {
        'child1': {
            template: `<h2>
                    child1
                    <input />
                </h2>`,

        },
        'child2': {
            template: `<h2>
                    child2
                    <input />
                </h2>`,
        },
        'child3': {
            template: `<h2>
                    child3
                    <input />
                </h2>`,
        },
        'child4': {
            template: `<h2>
                    child4
                    <input />
                </h2>`,
        },
        'child5': {
            template: `<h2>
                    child5
                    <input />
                </h2>`,
        },
        'child6': {
            template: `<h2>
                    child6
                    <input />
                </h2>`,
        },
    },
    data: {
        currIndex: 1,
    },
    methods: {
        switchComponent(index){
            this.currIndex = index;
        }
    },
});
```


## 源码分析
直接看源码中的注释


## References
* [Vue原理解析之observer模块](https://segmentfault.com/a/1190000008377887)
