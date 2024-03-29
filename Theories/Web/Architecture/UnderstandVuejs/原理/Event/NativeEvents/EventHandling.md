# Event Handling


## 相关信息
* 源码版本：2.5.21
* 文件路径 | `src/compiler/parser/index.js`


## 源码分析
1. 源码版本为 `v2.5.21`。
2. 目前只分析了在编译模板时怎么确定节点绑定了什么事件、有什么修饰符以及实际处理函数，即 `processAttrs` 函数部分。之后实际绑定实际的部分，从 `addHandler` 开始，比较复杂现在看不懂。
3. 以下面实际的事件处理为例来分析源码：
    ```html
    <div id="components-demo" @click.once="sayHi">sayHi</div>
    ```
    ```js
    methods: {
        sayHi(){
            console.log('hi');
        }
    }
    ```

### `processAttrs` 函数
```js
// 这个函数接收的参数是 ASTElement
function processAttrs(el) {
    const list = el.attrsList; // 获取元素所有的属性
    // list 如下
    // [
    //     {
    //         "name": "id",
    //         "value": "components-demo"
    //     },
    //     {
    //         "name": "@click.once",
    //         "value": "sayHi"
    //     }
    // ]

    let i, l, name, rawName, value, modifiers, isProp;
    
    // 遍历元素属性
    for (i = 0, l = list.length; i < l; i++) {
        name = rawName = list[i].name; // 属性名
        value = list[i].value; // 属性值
        // dirRE 是用来匹配 vue 指令的正则，值为 /^v-|^@|^:/
        if (dirRE.test(name)) { // 匹配到指令，这里 @click.once 会通过匹配

            // mark element as dynamic
            el.hasBindings = true; // TODO

            // modifiers
            // parseModifiers 函数也会通过正则匹配来确定有没有修饰符
            // 但返回的是一个对象，在本例中，返回  {once: true}
            // modifiers 保存这个对象，之后指定绑定的时候需要
            modifiers = parseModifiers(name);
            if (modifiers) {
                // modifierRE 是用来匹配修饰符的正则，值为 /\.[^.]+/g。
                // 这里会删掉后面的修饰符，name 现在变为 @click
                name = name.replace(modifierRE, "");
            }

            // 匹配 v-bind 指令，正则为 /^:|^v-bind:/。事件绑定不会通过该匹配
            if (bindRE.test(name)) { 
                // v-bind
                name = name.replace(bindRE, "");
                value = parseFilters(value);
                isProp = false;
                if (
                    process.env.NODE_ENV !== "production" &&
                    value.trim().length === 0
                ) {
                    warn(
                        `The value for a v-bind expression cannot be empty. Found in "v-bind:${name}"`
                    );
                }
                if (modifiers) {
                    if (modifiers.prop) {
                        isProp = true;
                        name = camelize(name);
                        if (name === "innerHtml") name = "innerHTML";
                    }
                    if (modifiers.camel) {
                        name = camelize(name);
                    }
                    if (modifiers.sync) {
                        addHandler(
                            el,
                            `update:${camelize(name)}`,
                            genAssignmentCode(value, `$event`)
                        );
                    }
                }
                if (
                    isProp ||
                    (!el.component &&
                        platformMustUseProp(el.tag, el.attrsMap.type, name))
                ) {
                    addProp(el, name, value);
                } else {
                    addAttr(el, name, value);
                }
            } 
            // onRE 是用来匹配事件绑定符的正则，值为 /^@|^v-on:/。匹配到这一个分支。
            else if (onRE.test(name)) {
                // v-on
                // 这里会删掉前面的指令符，name 现在变为 click
                name = name.replace(onRE, "");

                // 下面交给 addHandler ，进行事件绑定
                // el 是当前的 ASTElement
                // name 是 click
                // value 是 sayHi
                // modifiers 是对象 {once: true}
                addHandler(el, name, value, modifiers, false, warn);
            } else {
                // normal directives
                name = name.replace(dirRE, "");
                // parse arg
                const argMatch = name.match(argRE);
                const arg = argMatch && argMatch[1];
                if (arg) {
                    name = name.slice(0, -(arg.length + 1));
                }
                addDirective(el, name, rawName, value, arg, modifiers);
                if (process.env.NODE_ENV !== "production" && name === "model") {
                    checkForAliasModel(el, value);
                }
            }
        } else {
            // literal attribute
            if (process.env.NODE_ENV !== "production") {
                const res = parseText(value, delimiters);
                if (res) {
                    warn(
                        `${name}="${value}": ` +
                            "Interpolation inside attributes has been removed. " +
                            "Use v-bind or the colon shorthand instead. For example, " +
                            'instead of <div id="{{ val }}">, use <div :id="val">.'
                    );
                }
            }
            addAttr(el, name, JSON.stringify(value));
            // #6887 firefox doesn't update muted state if set via attribute
            // even immediately after element creation
            if (
                !el.component &&
                name === "muted" &&
                platformMustUseProp(el.tag, el.attrsMap.type, name)
            ) {
                addProp(el, name, "true");
            }
        }
    }
}
```
