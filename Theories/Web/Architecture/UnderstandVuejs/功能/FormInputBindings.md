# Form Input Bindings


## Basic Usage
* `v-model` is essentially syntax sugar for updating data on user input events,
plus special care for some edge cases. 参考源码分析：
`Theories\Web\Architecture\UnderstandVuejs\原理\FormInputBindings.md`
* 文档说 “Interpolation on textareas (`<textarea>{{text}}</textarea>`) won't
work. Use `v-model` instead”，但我测试显然可以。


## `v-model`和原生`input`事件的区别
1. 在`text`表单中，`v-model`实现的事件绑定并不等于原生 JS 的`input`事件。输入英文和数
字的时候看不出区别，但输入中文等的时候可以看出来不一样：
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
原生 JS 的`input`事件，拼音输入时的字母也会作为变量的更新至；而`v-model`绑定的，拼音的
字母并不会。
2. 通过 Chrome DevTools 的 Elements 面板的 Event Listeners 可以看到，`v-model`绑定
的情况下，除了`input`事件外，还有`change`、`compositionstart`和`compositionend`。
3. `change`不知道什么用，有可能是兼容IE。`compositionstart`和`compositionend`就是实
现让它和原生`input`不同的方法。
4. 下面用原生 JS 实现以下`v-model`的绑定效果：
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
            if (this.bShouldUpdateValue){ // 字母或数字输入
                this.num1 += ev.data;
            }
        },
        compositionstart(){
            // 如果开始拼音输入，则会触发这个方法，因此禁止 input 事件更新
            this.bShouldUpdateValue = false;
        },
        compositionend(ev){
            // 选定汉字或词语的时候，会触发这个方法
            this.num1 += ev.data; // 汉字或词语追加到字符串里
            this.bShouldUpdateValue = true; // input 恢复正常
        },
    },
});
```


## Modifiers
* `.lazy`：使用`change`进行事件绑定
* `.number`：源码中的转换方法  
    ```js
    function toNumber (val) {
    	var n = parseFloat(val);
    	return isNaN(n) ? val : n
    }
    ```
* `.trim`
