# Form Input Bindings


## 源码分析
1. 源码版本为`v2.5.17`。
2. 以`<input type="text" v-model.trim="num" />`为例
3. 基本原理就是编译模板时如果发现`v-model`，就给该节点添加`value`，值指向`num`。然后给
节点添加`input`事件，用输入的值更新`num`。
4. 大体过程是下面这个函数
```js
function genDefaultModel (
    el, // {type: 1, tag: "input", attrsList: Array(2), attrsMap: {…}, parent: {…}, …}
    value, // num
    modifiers // {trim: true}
) {
    // 通过参数获得元素、绑定的数据和表单修饰符
    // type 获得表单类型
    var type = el.attrsMap.type; // text

    // warn if v-bind:value conflicts with v-model
    // except for inputs with v-bind:type
    {
        var value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
        var typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
        if (value$1 && !typeBinding) {
            var binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
            warn$1(
                binding + "=\"" + value$1 + "\" conflicts with v-model on the same element " +
                'because the latter already expands to a value binding internally'
            );
        }
    }

    var ref = modifiers || {};
    var lazy = ref.lazy;
    var number = ref.number;
    var trim = ref.trim;
    var needCompositionGuard = !lazy && type !== 'range';
    // 通过下面的判断，的值要绑定的事件类型是 input
    var event = lazy
    ? 'change'
    : type === 'range'
    ? RANGE_TOKEN
    : 'input';

    var valueExpression = '$event.target.value';
    if (trim) {
        // 事件处理中进行 trim
        valueExpression = "$event.target.value.trim()";
    }
    if (number) {
        valueExpression = "_n(" + valueExpression + ")";
    }

    var code = genAssignmentCode(value, valueExpression);
    if (needCompositionGuard) {
        code = "if($event.target.composing)return;" + code;
    }

    // 给表单添加 value 属性
    addProp(el, 'value', ("(" + value + ")"));
    console.log(event); // "input"
    // 给表单添加 input 事件监听
    addHandler(el, event, code, null, true);
    if (trim || number) {
        addHandler(el, 'blur', '$forceUpdate()');
    }
}
```
