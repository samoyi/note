# Filters

1. Vue.js 允许你自定义过滤器，可被用于一些常见的文本格式化。
2. 过滤器可以用在两个地方：双花括号插值和 v-bind 表达式。
3. 过滤器应该被添加在 JavaScript 表达式的尾部，由`|`符号指示。
4. 你可以在组件内通过`fileter`选项定义局部过滤器，也可以在实例创建前定义全局过滤器。
5. 过滤器可以串联使用。
6. 过滤器是函数，因此可以接受参数。函数默认的第一个参数是之前的表达式的值，传入的一个或
多个参数被认为是第二个及更靠后的参数

```html
<div id="components-demo">
    {{str1 | capitalize}}
    <child-component :str="str2 | capitalize | exclamation(3)"></child-component>
</div>
```
```js
Vue.filter('capitalize', function (value) {
    if (!value) return '';
    let str = value.toString();
    let arr = [...str];
    return arr[0].toUpperCase() + arr.slice(1).join('');
});

new Vue({
    el: '#components-demo',
    filters: {
        exclamation(value, number){
            number = Number.parseInt(number);
            if (!Number.isNaN(number) && number>0){
                return value.toString() + ' ' + '!'.repeat(number);
            }
            else {
                return value.toString() + ' !';
            }
        },
    },
    components: {
        'child-component': {
            props: {
                str: String,
            },
            template: `<span>{{str}}</span>`,
        }
    },
    data: {
        str1: 'hello',
        str2: 'world',
    },
});
```
