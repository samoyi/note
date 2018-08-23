# Filters

1. Vue.js allows you to define filters that can be used to apply common text
formatting.
2. Filters are usable in two places: mustache interpolations and `v-bind`
expressions.
3. Filters should be appended to the end of the JavaScript expression, denoted
by the “pipe” symbol.
4. You can define local filters in a component’s options or define a filter
globally before creating the Vue instance.
5. Filters can be chained.
6. Filters are JavaScript functions, therefore they can take arguments. 函数默认
的第一个参数是之前的表达式的值，传入的一个或多个参数被认为是第二个及更靠后的参数

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
