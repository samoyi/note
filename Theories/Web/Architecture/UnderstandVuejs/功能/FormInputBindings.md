# Form Input Bindings


<!-- TOC -->

- [Form Input Bindings](#form-input-bindings)
    - [Basic Usage](#basic-usage)
    - [`v-model` 和原生 `input`事件的区别](#v-model-和原生-input事件的区别)
    - [Modifiers](#modifiers)

<!-- /TOC -->


## Basic Usage
* 可以用 `v-model` 指令在表单 `<input>`、`<textarea>` 及 `<select>` 元素上创建双向数据绑定。它会根据控件类型自动选取正确的方法来更新元素。`v-model` 本质上不过是语法糖，参考源码分析：`Theories\Web\Architecture\UnderstandVuejs\原理\FormInputBindings.md`
* 文档说 “Interpolation on textareas (`<textarea>{{text}}</textarea>`) won't work. Use `v-model` instead”，但我测试显然可以。


## `v-model` 和原生 `input`事件的区别
1. 在 `text` 表单中，`v-model` 实现的事件绑定并不等于原生 JS 的 `input` 事件。输入英文和数 字的时候看不出区别，但输入中文日文等的时候可以看出来不一样：
    ```html
    <div id="components-demo">
        <p>
            <input id="input" type="text" :value="num1" @input="input" />
            <br />
            原生 input 绑定：{{num1}}
        </p>
        <p>
            <input type="text" v-model="num2" />
            <br />
            v-model 绑定：{{num2}}
        </p>
    </div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        data: {
            num1: 22,
            num2: 33,
        },
        methods: {
            input(ev){
                this.num1 = ev.target.value;
            }
        },
    });
    ```
    原生 JS 的 `input` 事件，拼音输入时的字母也会作为变量的更新至；而 `v-model` 绑定的，拼音的字母并不会。
2. 通过 Chrome DevTools 的 Elements 面板的 Event Listeners 可以看到，`v-model` 绑定的情况下，除 `input`事件外，还有 `change`、`compositionstart` 和 `compositionend`。
3. `change` 不知道什么用，有可能是兼容IE。`compositionstart` 和 `compositionend` 就是实现让它和原生 `input` 不同的方法。
4. 下面用原生 JS 实现 `v-model` 的绑定效果：
    ```html
    <div id="components-demo">
        <p>
            <input id="input" type="text" :value="num1"
                @input="input"
                @compositionstart="compositionstart"
                @compositionend="compositionend"
            />
            <br />
            原生 input 绑定：{{num1}}
        </p>
        <p>
            <input type="text" v-model="num2" />
            <br />
            v-model 绑定：{{num2}}
        </p>
    </div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        data: {
            num1: 22,
            num2: 33,
            bShouldUpdateValue: true,
        },
        methods: {
            input(ev){
                if (this.bShouldUpdateValue){ // 输入字母或数字时直接更新
                    this.num1 = ev.target.value;
                }
            },
            compositionstart(){
                // 如果开始拼音输入，则会触发这个方法，因此禁止 input 事件更新数据
                this.bShouldUpdateValue = false;
            },
            compositionend(ev){
                // 选定汉字或词语的时候，会触发这个方法
                // 选定汉字后，输入框里就是最终的字符串，使用该字符串替换原有的
                this.num1 = ev.target.value;
                // input 恢复正常
                this.bShouldUpdateValue = true;
            },
        },
    });
    ```


## Modifiers
* `.lazy`：使用 `change` 进行事件绑定，input 失去焦点后才会出发 `change` 事件更新数据。
* `.number`：源码中的转换方法  
    ```js
    function toNumber (val) {
    	var n = parseFloat(val);
    	return isNaN(n) ? val : n
    }
    ```
* `.trim`
