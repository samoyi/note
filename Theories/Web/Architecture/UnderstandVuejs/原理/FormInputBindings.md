# Form Input Bindings


## 源码分析
1. 源码版本为 `v2.5.21`。
2. 以 `<input type="text" v-model.trim="num" />` 为例
3. 基本原理就是编译模板时如果发现 `v-model`，就给该节点添加 `value`，值指向 `num`。然后给节点添加 `input` 事件，用输入的值更新 `num`。
4. 大体过程是下面这个函数
    ```js
    // /src/platforms/web/compiler/directives/model.js

    function genDefaultModel (
        el: ASTElement,          // {type: 1, tag: "input", attrsList: Array(2), attrsMap: {…}, parent: {…}, …}
        value: string,           // "num"。也就是 v-model 绑定的属性
        modifiers: ?ASTModifiers // {trim: true}。v-model 的修饰符
    ): ?boolean {

        // el.attrsMap 是 el 的属性映射表。本例中的值为
        // {
        //     type: "text"
        //     v-model.trim: "num"
        // }
        const type = el.attrsMap.type // "text"

        // warn if v-bind:value conflicts with v-model
        // except for inputs with v-bind:type
        if (process.env.NODE_ENV !== 'production') {
            const value = el.attrsMap['v-bind:value'] || el.attrsMap[':value']
            const typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type']
            if (value && !typeBinding) {
                const binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value'
                warn(
                    `${binding}="${value}" conflicts with v-model on the same element ` +
                    'because the latter already expands to a value binding internally'
                )
            }
        }

        const { lazy, number, trim } = modifiers || {} // 本例中只有 trim 有值为 true

        // 是否需要用 compositionstart、compositionend 事件来处理拼音类的输入
        const needCompositionGuard = !lazy && type !== 'range'
        
        // 有 lazy 修饰符会使用 change 事件处理输入，没有的话除了 range 类型的以外都是用 input 事件
        const event = lazy
            ? 'change'
            : type === 'range'
                ? RANGE_TOKEN
                : 'input'

        // input 元素值的求值表达式
        // 默认就是直接的 value 属性，如果要 trim 或者转数字，则相应改变求值表达式
        let valueExpression = '$event.target.value'
        if (trim) {
            valueExpression = `$event.target.value.trim()`
        }
        if (number) {
            valueExpression = `_n(${valueExpression})`
        }
        let code = genAssignmentCode(value, valueExpression)
        // 本例中，这里的 code 为 "num=$event.target.value.trim()"

        if (needCompositionGuard) {
            code = `if($event.target.composing)return;${code}`
            // 进一步，这里的 code 为 "if($event.target.composing)return;num=$event.target.value.trim()"
            // 如果 $event.target.composing 为 true，表明拼音正在拼写中，为 false 表明拼写完了输出汉字。这个逻辑的源码：
            // /src/platforms/web/runtime/directives/model.js
            // 
            // function onCompositionStart (e) {
            //     e.target.composing = true
            // }
            // 
            // function onCompositionEnd (e) {
            //     // prevent triggering an input event for no reason
            //     if (!e.target.composing) return
            //     e.target.composing = false
            //     trigger(e.target, 'input')
            // }
        }

        // TODO
        // addProp 源码在 /src/compiler/helpers.js
        // export function addProp (el: ASTElement, name: string, value: string) {
        //     (el.props || (el.props = [])).push({ name, value })
        //     el.plain = false
        // }
        addProp(el, 'value', `(${value})`)

        // TODO
        // addHandler 源码也在 /src/compiler/helpers.js
        addHandler(el, event, code, null, true)
        if (trim || number) {
            addHandler(el, 'blur', '$forceUpdate()')
        }
    }
    ```