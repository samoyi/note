# Plain Object clone


<!-- TOC -->

- [Plain Object clone](#plain-object-clone)
    - [TODO](#todo)
    - [根据以下几个标准来对各种拷贝方法进行分类](#根据以下几个标准来对各种拷贝方法进行分类)
    - [测试函数](#测试函数)
    - [拷贝方法](#拷贝方法)
        - [方法一：`Object(source)`](#方法一objectsource)
        - [方法二：`Object.assign(target, source)`](#方法二objectassigntarget-source)
        - [方法三：`JSON.parse( JSON.stringify( source ) )`](#方法三jsonparse-jsonstringify-source--)
        - [方法四：自定义方法 `clone`](#方法四自定义方法-clone)
            - [实现](#实现)
            - [`mixin` 中不拷贝的属性](#mixin-中不拷贝的属性)
    - [浏览器尚未实现的拷贝功能](#浏览器尚未实现的拷贝功能)
        - [`localStorage` 和 `sessionStorage` 对引用类型的拷贝](#localstorage-和-sessionstorage-对引用类型的拷贝)
    - [References](#references)

<!-- /TOC -->


## TODO
* ES6的新类型中只检测了是否可拷贝`Symbol`


## 根据以下几个标准来对各种拷贝方法进行分类
是对被拷贝对象的属性进行判断，而不是对被拷贝对象本身。
* 深/浅：深拷贝和浅拷贝。  
    存在深拷贝的三种对象：Plain Object、 Array、 Dom Node，会分别判断。
* 是否仅实例：是否只拷贝被拷贝对象的实例属性
* 是否仅可枚举：只拷贝被拷贝对象中的可枚举属性（`enumerable` 为 `true`）。  
    `Symbol` 属性虽然实际上不可枚举，但其本身的 `enumerable` 为 `true`。
* 不可拷贝类型：不能拷贝被拷贝对象中某些类型的属性


## 测试函数
1. 定义一个 `consoleCloneType` 函数，调用时传入一个拷贝函数，`consoleCloneType` 会打印出该拷贝函数具备哪些拷贝特征。
2. `consoleCloneType` 会先创建一个 source 对象，然后使用拷贝函数生成一个新的 target 对象，比较两个对象得出结论。整体结构如下
    ```js
    function consoleCloneType(fnClone, bCheckNodeType=true){
        // 如果环境不支持 Node 节点，则需要把第二个参数设为 false
        
        // 之后设为 source 对象的属性，用来检测是否可拷贝 Symbol 类型
        let symbol = Symbol();

        // 创建 source 对象
        function createSource(){
            ...

            return source;
        }

        // 比较两个对象，返回拷贝特征
        function cloneTypeDes( target ){
            ...

            return sCloneType;
        }

        let source = createSource();
        let target = fnClone(source);

        console.log(cloneTypeDes(target));
    }
    ```
3. `createSource` 实现如下
    ```js
    function createSource() {

        // 之后设为 source 对象的属性，用来检测是否支持 Plain Object 深拷贝
        // 如果拷贝成功且修改了 source 的 deep3 后 target 的 deep3 维持不变，则认为其支持对 Plain Object 的深拷贝
        let innerObj = {
            deep1: {
                deep2: {
                    deep3: false 
                }
            }
        };

        // 之后设为 source 对象的属性，用来检测是否支持 Array 深拷贝
        // 如果拷贝成功且把 source 的 false 改为 true 后 target 的这里仍然维持 false，则认为其支持对数组的深拷贝
        let innerArr = [
            [
                [
                    [false]
                ]
            ]
        ];

        // 之后设为 source 对象的属性，用来检测是否支持 Node 深拷贝
        // 之后会替换掉 source 的 span 节点，如果 target 中的改变，则说明支持对 Node 的深拷贝
        let innerNode = null;
        if( bCheckNodeType ){
            let divNode = document.createElement("div");
            let paraNode = document.createElement("p");
            let spanNode = document.createElement("span");
            spanNode.textContent = "span text";
            paraNode.appendChild(spanNode);
            divNode.appendChild( paraNode );
            innerNode = divNode;
        }

        // 将 source 对象作为 O 的实例，检测是否能拷贝其原型中的 protoName 属性
        function O(){
            O.prototype.protoName = "prototypeName";
        }
        let source = new O();

        // 检测是否可拷贝不可枚举属性
        Object.defineProperty(source, "innumerable", {enumerable: false, value: true});

        // 完整的 source 对象
        source.p0 = innerObj; // 检测是否深拷贝 Plain Object
        source.p1 = innerArr; // 检测是否深拷贝 Array
        source.p2 = bCheckNodeType && innerNode; // 检测是否深拷贝 Node
        source.p3 = undefined; // 检测是否可拷贝 undefined
        source.p4 = 1.23; // 检测是否可拷贝 Number
        source.p5 = 'str'; // 检测是否可拷贝 String
        source.p6 = true; // 检测是否可拷贝 Boolean
        source.p7 = null; // 检测是否可拷贝 null
        source.p8 = NaN; // 检测是否可拷贝 NaN
        source.p9 = function(){return "p9";}; // 检测是否可拷贝函数
        source.p11 = /2/gim; // 检测是否可拷贝正则
        source.p12 = new Date(123); // 检测是否拷贝 Date 对象
        source[symbol] = "sym"; // 检测是否可拷贝 Symbol

        return source;
    }
    ```
4. 负责比较 source 和 target 的 `cloneTypeDes` 方法
    ```js
    function cloneTypeDes(target) {
        let sCloneType = "";
        let sDisabledType = "不可拷贝类型：";
        let sDeepOrShallow = "";
        let bAnyDisabledType = false;

        if ( // 首先确定能正确拷贝 plain object
            isPlainObj(target.p0) 
            && isPlainObj(target.p0.deep1) 
            && isPlainObj(target.p0.deep1.deep2)
            && target.p0.deep1.deep2.deep3 === false
        ) { 
            // 判断能否深拷贝：改变 source 中的 deep3，看看 target 中是否也变化
            source.p0.deep1.deep2.deep3 = true;
            let targetDeep3 = target.p0.deep1.deep2.deep3;
            if ( targetDeep3 === false ) {
                sDeepOrShallow += "PlainObject深拷贝";
            }
            else if ( targetDeep3 === true ) {
                sDeepOrShallow += "PlainObject浅拷贝";
            }
            else {
                sDisabledType += "PlainObject/";
                bAnyDisabledType = true;
            }
        }
        else {
            sDisabledType += "PlainObject/";
            bAnyDisabledType = true;
        }

        if ( // 首先确定能正确拷贝数组
            isArray(target.p1) 
            && isArray(target.p1[0]) 
            && isArray(target.p1[0][0]) 
            && isArray(target.p1[0][0][0]) 
            && (target.p1)[0][0][0][0] === false 
        ) {
            // 判断能否深拷贝：改变 source 最内层的 false，看看 target 会不会跟着改变
            source.p1[0][0][0][0] = true;
            if( (target.p1)[0][0][0][0] === false ){
                sDeepOrShallow += " + Array深拷贝";
            }
            else if( (target.p1)[0][0][0][0] === true ){
                sDeepOrShallow += " + Array浅拷贝";
            }
            else {
                sDisabledType += "Array/";
                bAnyDisabledType = true;
            }
        }
        else{ 
            sDisabledType += "Array/";
            bAnyDisabledType = true;
        }

        if( bCheckNodeType ) {
            if ( // 首先确定能正确拷贝 Node 节点
                objToString(target.p2) === "[object HTMLDivElement]"
                && objToString(target.p2.firstElementChild) === "[object HTMLParagraphElement]"
                && objToString(target.p2.firstElementChild.firstElementChild) === "[object HTMLSpanElement]"
                && target.p2.firstElementChild.firstElementChild.textContent === "span text"
            ) {
                // 判断能否深拷贝：把 source 中的 span 节点改为 br 节点
                let newNode = document.createElement("BR");
                let sourceParaNode = source.p2.firstElementChild;
                let sourceSpanNode = sourceParaNode.firstElementChild;
                sourceParaNode.replaceChild(newNode, sourceSpanNode);
                if ( target.p2.firstElementChild.firstElementChild.nodeName === "SPAN"
                    && target.p2.firstElementChild.firstElementChild.textContent === "span text") {
                    sDeepOrShallow += " + Node深拷贝";
                }
                else if (target.p2.firstElementChild.firstElementChild.nodeName === "BR") {
                    sDeepOrShallow += " + Node浅拷贝";
                }
                else {
                    sDisabledType += "Node/";
                    bAnyDisabledType = true;
                }
            }
            else {
                sDisabledType += "Node/";
                bAnyDisabledType = true;
            }
        }

        if( !("p3" in target) || (target.p3 !== undefined) ) {
            sDisabledType += "Undefined/";
            bAnyDisabledType = true;
        }

        if (target.p4 !== 1.23) {
            sDisabledType += "Number/";
            bAnyDisabledType = true;
        }

        if (target.p5 !== 'str') {
            sDisabledType += "String/";
            bAnyDisabledType = true;
        }

        if (target.p6 !== true) {
            sDisabledType += "Boolean/";
            bAnyDisabledType = true;
        }

        if (target.p7 !== null) {
            sDisabledType += "Null/";
            bAnyDisabledType = true;
        }
        if (!Number.isNaN(target.p8)) {
            sDisabledType += "NaN/";
            bAnyDisabledType = true;
        }
        
        if ( typeof target.p9 !== "function" || (target.p9)() !== "p9" ) {
            sDisabledType += "Function/";
            bAnyDisabledType = true;
        }

        if ( (objToString(target.p11) !== "[object RegExp]") || (target.p11+"" !== "/2/gim") ) {
            sDisabledType += "RegExp/";
            bAnyDisabledType = true;
        }

        if( (objToString(target.p12) !== "[object Date]") || (target.p12.getTime() !== 123) ) {
            sDisabledType += "Date/";
            bAnyDisabledType = true;
        }

        if( !(symbol in target) || (target[symbol] !== "sym")  ){
            sDisabledType += "Symbol/";
            bAnyDisabledType = true;
        }

        if( target.protoName === "prototypeName"){
            sCloneType += "可拷贝原型属性";
        }
        else{
            sCloneType += "仅实例";
        }

        if( target.innumerable === true ){
            sCloneType += " + 可拷贝不可枚举";
        }
        else{
            sCloneType += " + 仅可枚举";
        }

        sCloneType =  sDeepOrShallow + " + " + sCloneType;
        if (bAnyDisabledType) {
            sCloneType += " + " + sDisabledType.slice(0, -1);
        }

        return sCloneType;
    }
    ```
5. `consoleCloneType` 完整实现
    ```js
    function consoleCloneType(fnClone, bCheckNodeType=true){

        // 之后设为 source 对象的属性，用来检测是否可拷贝 Symbol 类型
        let symbol = Symbol();

        function createSource() {

            // 之后设为 source 对象的属性，用来检测是否支持 Plain Object 深拷贝
            let innerObj = {
                deep1: {
                    deep2: {
                        deep3: false // 如果拷贝方法可以深入第三层，则认为其支持对 Plain Object 的深拷贝
                    }
                }
            };

            // 之后设为 source 对象的属性，用来检测是否支持 Array 深拷贝
            let innerArr = [
                [
                    [
                        [false] // 如果拷贝方法可以深入第三层，则认为其支持对 Array 的深拷贝
                    ]
                ]
            ];

            // 之后设为 source 对象的属性，用来检测是否支持 Node 深拷贝
            let innerNode = null;
            if( bCheckNodeType ){
                let divNode = document.createElement("div");
                let paraNode = document.createElement("p");
                let spanNode = document.createElement("span");
                spanNode.textContent = "span text";
                paraNode.appendChild(spanNode);
                divNode.appendChild( paraNode );
                innerNode = divNode;  // 如果拷贝方法可以深入第三层，则认为其支持对 Node 的深拷贝
            }

            // 将 source 对象作为 O 的实例，检测是否能拷贝其原型中的 protoName 属性
            function O(){
                O.prototype.protoName = "prototypeName";
            }
            let source = new O();

            // 检测是否可拷贝不可枚举属性
            Object.defineProperty(source, "innumerable", {enumerable: false, value: true});

            // 完整的 source 对象
            source.p0 = innerObj; // 检测是否深拷贝 Plain Object
            source.p1 = innerArr; // 检测是否深拷贝 Array
            source.p2 = bCheckNodeType && innerNode; // 检测是否深拷贝 Node
            source.p3 = undefined; // 检测是否可拷贝 undefined
            source.p4 = 1.23; // 检测是否可拷贝 Number
            source.p5 = 'str'; // 检测是否可拷贝 String
            source.p6 = true; // 检测是否可拷贝 Boolean
            source.p7 = null; // 检测是否可拷贝 null
            source.p8 = NaN; // 检测是否可拷贝 NaN
            source.p9 = function(){return "p9";}; // 检测是否可拷贝函数
            source.p11 = /2/gim; // 检测是否可拷贝正则
            source.p12 = new Date(123); // 检测是否拷贝 Date 对象
            source[symbol] = "sym"; // 检测是否可拷贝 Symbol 类型

            return source;
        }


        function cloneTypeDes(target) {
            let sCloneType = "";
            let sDisabledType = "不可拷贝类型：";
            let sDeepOrShallow = "";
            let bAnyDisabledType = false;

            if ( // 首先确定能正确拷贝 plain object
                isPlainObj(target.p0) 
                && isPlainObj(target.p0.deep1) 
                && isPlainObj(target.p0.deep1.deep2)
                && target.p0.deep1.deep2.deep3 === false
            ) { 
                // 判断能否深拷贝：改变 source 中的 deep3，看看 target 中是否也变化
                source.p0.deep1.deep2.deep3 = true;
                let targetDeep3 = target.p0.deep1.deep2.deep3;
                if ( targetDeep3 === false ) {
                    sDeepOrShallow += "PlainObject深拷贝";
                }
                else if ( targetDeep3 === true ) {
                    sDeepOrShallow += "PlainObject浅拷贝";
                }
                else {
                    sDisabledType += "PlainObject/";
                    bAnyDisabledType = true;
                }
            }
            else {
                sDisabledType += "PlainObject/";
                bAnyDisabledType = true;
            }

            if ( // 首先确定能正确拷贝数组
                isArray(target.p1) 
                && isArray(target.p1[0]) 
                && isArray(target.p1[0][0]) 
                && isArray(target.p1[0][0][0]) 
                && (target.p1)[0][0][0][0] === false 
            ) {
                // 判断能否深拷贝：改变 source 最内层的 false，看看 target 会不会跟着改变
                source.p1[0][0][0][0] = true;
                if( (target.p1)[0][0][0][0] === false ){
                    sDeepOrShallow += " + Array深拷贝";
                }
                else if( (target.p1)[0][0][0][0] === true ){
                    sDeepOrShallow += " + Array浅拷贝";
                }
                else {
                    sDisabledType += "Array/";
                    bAnyDisabledType = true;
                }
            }
            else{ 
                sDisabledType += "Array/";
                bAnyDisabledType = true;
            }

            if( bCheckNodeType ) {
                if ( // 首先确定能正确拷贝 Node 节点
                    objToString(target.p2) === "[object HTMLDivElement]"
                    && objToString(target.p2.firstElementChild) === "[object HTMLParagraphElement]"
                    && objToString(target.p2.firstElementChild.firstElementChild) === "[object HTMLSpanElement]"
                    && target.p2.firstElementChild.firstElementChild.textContent === "span text"
                ) {
                    // 判断能否深拷贝：把 source 中的 span 节点改为 br 节点
                    let newNode = document.createElement("BR");
                    let sourceParaNode = source.p2.firstElementChild;
                    let sourceSpanNode = sourceParaNode.firstElementChild;
                    sourceParaNode.replaceChild(newNode, sourceSpanNode);
                    if ( target.p2.firstElementChild.firstElementChild.nodeName === "SPAN"
                        && target.p2.firstElementChild.firstElementChild.textContent === "span text") {
                        sDeepOrShallow += " + Node深拷贝";
                    }
                    else if (target.p2.firstElementChild.firstElementChild.nodeName === "BR") {
                        sDeepOrShallow += " + Node浅拷贝";
                    }
                    else {
                        sDisabledType += "Node/";
                        bAnyDisabledType = true;
                    }
                }
                else {
                    sDisabledType += "Node/";
                    bAnyDisabledType = true;
                }
            }

            if( !("p3" in target) || (target.p3 !== undefined) ) {
                sDisabledType += "Undefined/";
                bAnyDisabledType = true;
            }

            if (target.p4 !== 1.23) {
                sDisabledType += "Number/";
                bAnyDisabledType = true;
            }

            if (target.p5 !== 'str') {
                sDisabledType += "String/";
                bAnyDisabledType = true;
            }

            if (target.p6 !== true) {
                sDisabledType += "Boolean/";
                bAnyDisabledType = true;
            }

            if (target.p7 !== null) {
                sDisabledType += "Null/";
                bAnyDisabledType = true;
            }
            if (!Number.isNaN(target.p8)) {
                sDisabledType += "NaN/";
                bAnyDisabledType = true;
            }
            
            if ( typeof target.p9 !== "function" || (target.p9)() !== "p9" ) {
                sDisabledType += "Function/";
                bAnyDisabledType = true;
            }

            if ( (objToString(target.p11) !== "[object RegExp]") || (target.p11+"" !== "/2/gim") ) {
                sDisabledType += "RegExp/";
                bAnyDisabledType = true;
            }

            if( (objToString(target.p12) !== "[object Date]") || (target.p12.getTime() !== 123) ) {
                sDisabledType += "Date/";
                bAnyDisabledType = true;
            }

            if( !(symbol in target) || (target[symbol] !== "sym")  ){
                sDisabledType += "Symbol/";
                bAnyDisabledType = true;
            }

            if( target.protoName === "prototypeName"){
                sCloneType += "可拷贝原型属性";
            }
            else{
                sCloneType += "仅实例";
            }

            if( target.innumerable === true ){
                sCloneType += " + 可拷贝不可枚举";
            }
            else{
                sCloneType += " + 仅可枚举";
            }

            sCloneType =  sDeepOrShallow + " + " + sCloneType;
            if (bAnyDisabledType) {
                sCloneType += " + " + sDisabledType.slice(0, -1);
            }

            return sCloneType;
        }

        function objToString (o) {
            return Object.prototype.toString.call(o);
        }
        function isPlainObj (o) {
            return objToString(o) === "[object Object]";
        }
        function isArray (a) {
            return Array.isArray(a);
        }

        let source = createSource();
        let target = fnClone(source);

        console.log(cloneTypeDes(target));
    }
    ```


## 拷贝方法
### 方法一：`Object(source)`
直接返回 `source`，即完全是同一个对象

### 方法二：`Object.assign(target, source)`
`PlainObject` 浅拷贝 + `Array` 浅拷贝 + `Node` 浅拷贝 + 仅实例 + 仅可枚举

### 方法三：`JSON.parse( JSON.stringify( source ) )`
`PlainObject` 深拷贝 + `Array` 深拷贝 + 仅实例 + 仅可枚举 + 不可拷贝类型：`Undefined/NaN/RegExp/Function/Date/Node/Symbol`

### 方法四：自定义方法 `clone`
`PlainObject` 深拷贝 + `Array` 深拷贝 + `Node` 深拷贝 + 可拷贝原型属性 + 仅可枚举  

#### 实现
1. 在 [这篇文章](https://davidwalsh.name/javascript-clone) 的 `clone` 函数中加入了对 `Symbol` 的支持。
2. 主函数 `clone` 实现如下
    ```js
    function clone(src) {
        
        if (!src || typeof src != "object" || Object.prototype.toString.call(src) === "[object Function]") {
            // 如果不是引用类型或者是函数，则直接返回本身
            return src;
        }
        if (src.nodeType && "cloneNode" in src) {
            // DOM Node
            return src.cloneNode(true); // deep clone
        }
        if (src instanceof Date) {
            // Date
            return new Date(src.getTime());
        }
        if (src instanceof RegExp) {
            // RegExp
            return new RegExp(src);
        }

        var dest;
        if ( Array.isArray(src) ) {
            // 如果是数组则创建一个新数组，把 src 的数组项逐一拷贝过来
            // 为了深拷贝数组项，需要递归的使用 clone 调用
            dest = [];
            src.forEach(function(item) {
                dest.push(clone(item));
            });
        } 
        else {
            // plain objects 会先创建一个空的对象，然后通过 mixin 拷贝属性
            // TODO 在什么情况下才会不存在 constructor 属性
            dest = src.constructor ? new src.constructor() : {};
        }
        
        // 数组情况下的 dest 也会使用 mixin，但只是为了拷贝可能的非索引属性
        return mixin(dest, src, clone);
    }
    ```
3. 因为数组可能不是基础类型，所以对于数组项的拷贝可以递归的使用 `clone` 函数。
4. 而为了深拷贝 Plain Object 的属性和数组的非索引属性的，单独实现一个 `mixin` 函数来完成。其实一般情况下，对于这样的属性也可以直接使用 `for...in` 来遍历并通过 `clone` 来拷贝，但还是有两类特殊情况需要处理：
    * `Symbol` 属性无法通过 `for...in` 遍历到
    * 因为这个拷贝方法会拷贝原型属性，所以要避免把 `Object.prototype` 上的属性拷贝为 `dest` 的实例属性。
5. `mixin` 实现如下
    ```js
    // 不能直接拷贝的属性使用 mixin
    // 包括 Symbol 属性、Plain Object 和 Array
    function mixin(dest, source, copyFunc) {
        var name, s, empty = {};

        // Symbol 属性只能通过以下方法枚举
        if ( Object.getOwnPropertySymbols ) {
            Object.getOwnPropertySymbols( source ).forEach(function (item) {
                dest[item] = source[item];
            });
        }

        // 如果 source 是数组的，这里的 for 循环虽然可以遍历到索引属性，但是不会通过里面的 if 
        for (name in source) {
            s = source[name];
            if ( !(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s)) ) {
                // 如果没有 copyFunc 说明该属性不引用，则直接赋值
                dest[name] = copyFunc ? copyFunc(s) : s; 
            }
        }
        return dest;
    }
    ```

#### `mixin` 中不拷贝的属性
1. 有两类属性不拷贝：
    * 如果一个 `source` 中的一个属性在 `dest` 中有同名同值的属性。包括实例和原型上的。
    * 同名不同值也不是一定就可以拷贝，如果这个属性是 `Object` 原型上的属性，但是 `source` 将它重写为不同的值，那么也不应该把这个属性拷贝到 `dest` 上。
2. 判断 `if( !(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s)) )` 会过滤掉这两类属性。
3. 把 `if` 的条件简写为 `A || ( B && (C||D) )` 分析其逻辑。
    * A：`!(name in dest)` 为 `true` 则表明 `dest` 实例和原型中都没有和 `name` 同名的属性；为 `false` 则表明 `dest` 的实例和原型两个对象中，至少其中之一是有和 `name` 同名的属性。
    * B：`dest[name] !== s`：如果为 `true` 则表明 `dest` 里有 `name` 属性但值不等于 `source` 中 `name` 属性的值；如果为 `false` 则表明 `dest` 里有 `name` 属性，且值和 `source` 里 `name` 属性的值相同。
    * C：`!(name in empty)`：`true` 则说明 `Object` 原型中没有这个属性；为 `false` 则说明 `Object` 原型中有属性与 `name` 同名属性。
    * D：`empty[name] !== s`：如果为 `true` 表明 `Object` 原型中有 `name` 属性，但值和 `source` 中 `name` 属性的值不同；如果为 `false` 则表明 `Object` 原型中有 `name` 属性且和 `source` 的 `name` 属性值相同。
4. 当 A 为 `false` B 也为 `false` 时，说明 `dest` 中有同名同值的 `name` 属性。不用拷贝。
5. 当 A 为 `false` B 为 `true` 且 `C` 和 `D` 都为 `false` 时，说明 `dest` 里面有和 `source` 同名但不同值的属性，但这个属性是 `Object` 原型属性且没有被 `source` 重写为不同的值（说明 `dest` 中重写了该属性）。


## 浏览器尚未实现的拷贝功能
### `localStorage` 和 `sessionStorage` 对引用类型的拷贝
虽然目前还没有浏览器支持这两个对象操作引用类型，不过根据《权威指南》上面说的：
> Objects and array values are normally mutable, so a Storage object is required to make a copy when you store a value, so that any subsequent changes to the original value have no effect on the stored value. The Storage object is also required to make a copy when you retrieve a value so that any changes you make to the retrieved value have no effect on the stored value.


## References
* [也来谈一谈js的浅复制和深复制](http://www.imooc.com/article/11253)
* [Clone Anything with JavaScript](https://davidwalsh.name/javascript-clone)
* [The structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)