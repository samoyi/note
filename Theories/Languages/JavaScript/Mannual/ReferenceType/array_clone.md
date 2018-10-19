# Array clone

## TODO
* ES6的新类型中只检测了是否可拷贝`Symbol`


## 测试代码
```js
// 保证自己的拷贝函数接受待拷贝对象作为参数，并返回拷贝后的对象。例如：
function fnClone(source){
    return source.slice(0);
}
// 将该拷贝函数作为参数传入consoleCloneType即可在Console中看到结果
consoleCloneType(fnClone); // PlainObject浅拷贝 Array浅拷贝 Node浅拷贝

// 如果不检测是否可拷贝Node类型，consoleCloneType第二个参数传false



/*
 * 测试思路：
 * 不检测能否拷贝数组的属性，一般情况下使用数组只关心数组项，再检测数组属性比较麻烦
 * 只检测能否拷贝特定类型的数组项，以及是否能深拷贝 plain object、array 和 node 数
 *   组项
 *
 * consoleCloneType函数中有一个包含各种数据类型的source数组，通过待测试函数拷贝后会
 *  生成一个新数组，对比两者分析可以进行怎样的拷贝
 *
 * 与检测 plain object 不同，因为数组拷贝方法有可能会改变数组项的序号，也就是说键值
 * 对不是固定的，因此没办法确定 source 中一个 plain object 被拷贝后在 target 数组中
 * 的位置。同时，某些拷贝方法比如 JSON.parse( JSON.stringify( source ) ) 可能会改
 * 变数组元素类型。例如这个方法会把 Node 类型转换为 {}，即使你在数组里查找到一个
 * plain object，你也不能确定它在 source 中对应的是 plain object 还是 node。
 * 因此这里的检测，不会被各种数据类型都放在同一个数组里，而是每个数据类型都放在独立的
 * 数组里，这样每个数组都只有一项，不存在混淆的问题
 */
function consoleCloneType(fnClone, bCheckNodeType=true){

    // PlainObject Array Node 三个存在深拷贝的对象
    let innerObj = { name: 33 },
        innerArr = [33],
        innerNode = null;
    if( bCheckNodeType ){
        let divNode = document.createElement("div"),
        paraNode = document.createElement("p");
        divNode.appendChild( paraNode );
        innerNode = divNode;
    }

    // 各种数据类型都放进单独的数组里
    let aSources = [
        [innerObj],
        [innerArr],
        ["str"],
        [12.3],
        [true],
        [undefined],
        [null],
        [NaN],
        [function(){return "foo";}],
        [/2/],
        [new Date()],
        [Symbol()]
    ];

    if( bCheckNodeType ){
        aSources.push([innerNode]);
    }
    let aTargets = aSources.map(value=>fnClone(value));



    // 建立source数组，并使用待测试的拷贝方法生成target数组
    let source = [innerObj, innerArr, innerNode],
        target = fnClone(source);

    // 改变source数组项引用的对象，看看target中的数组项是否也会跟着改变
    innerObj.name = 22;
    innerArr[0] = 22;
    if( bCheckNodeType ){
        let newNode = document.createElement("SPAN"),
        oParaNode = innerNode.firstElementChild;
        innerNode.replaceChild(newNode, oParaNode);
    }

    // 检测target数组项是否随之改变
    {
        let cloneTypeDes = '',
            sDisabledType = ''

        if(  aTargets[0][0] instanceof Object === true )
        {
            if(  aTargets[0][0].name === 22 ){
                cloneTypeDes += 'PlainObject浅拷贝';
            }
            else if(  aTargets[0][0].name === 33 ){
                cloneTypeDes += 'PlainObject深拷贝';
            }
        }
        else{
            sDisabledType += ' PlainObject';
        }

        if( aTargets[1][0] instanceof Array === true ){
            if( aTargets[1][0][0] === 22 ){
                cloneTypeDes += ' Array浅拷贝';
            }
            else if( aTargets[1][0][0] === 33 ){
                cloneTypeDes += ' Array深拷贝';
            }
        }
        else{
            sDisabledType += ' Array';
        }

        if( bCheckNodeType ){
            if( aTargets[12][0] instanceof Node === true ) {
                if( aTargets[12][0].firstElementChild.nodeName === 'SPAN' ){
                    cloneTypeDes += ' Node浅拷贝';
                }
                else if(aTargets[12][0].firstElementChild.nodeName === 'P' ){
                    cloneTypeDes += ' Node深拷贝';
                }
            }
            else{
                sDisabledType += ' Node';
            }
        }

        if( aTargets[2][0] !== 'str'){
            sDisabledType += ' String';
        }

        if( aTargets[3][0] !== 12.3){
            sDisabledType += ' Number';
        }

        if( aTargets[4][0] !== true){
            sDisabledType += ' Boolean';
        }

        if( aTargets[5][0] !== undefined){
            sDisabledType += ' Undefine';
        }

        if( aTargets[6][0] !== null){
            sDisabledType += ' Null';
        }

        if( !Object.is(aTargets[7][0], NaN)){
            sDisabledType += ' NaN';
        }

        if( typeof aTargets[8][0] !== 'function'){
            sDisabledType += ' Function';
        }

        if( aTargets[9][0] instanceof RegExp !== true ){
            sDisabledType += ' RegExp';
        }

        if( aTargets[10][0] instanceof Date !== true ){
            sDisabledType += ' Date';
        }

        if( typeof aTargets[11][0] !== 'symbol'){
            sDisabledType += ' Symbol';
        }

        if(sDisabledType){
            sDisabledType = ' 不可拷贝的数组项类型：' + sDisabledType;
        }
        console.log( cloneTypeDes + sDisabledType );
    }
}
```


## 拷贝方法
### 方法一：`source.slice(0)` / `source.concat()` / `Array.of.apply(null, source)`
`PlainObject`浅拷贝 `Array`浅拷贝 `Node`浅拷贝

### 方法二：`JSON.parse( JSON.stringify( source ) )`
`PlainObject`深拷贝 `Array`深拷贝 不可拷贝的数组项类型： `Node` `Undefine` `NaN` `Function` `RegExp` `Date` `Symbol`

### 方法三：`[...array]`
`PlainObject`浅拷贝 + `Array`浅拷贝 + `Node`浅拷贝

### 方法四：自定义方法1
`PlainObject`深拷贝 + `Array`深拷贝 + `Node`深拷贝

#### 来源：
* 在[这篇文章](https://davidwalsh.name/javascript-clone)的`clone`函数中加入了对`Symbol`的支持
* 在 [plain_object_clone](plain_object_clone.md) 这篇中有对这个函数的分析

```js
function clone(src)
{
    function mixin(dest, source, copyFunc)
    {
        var name, s, i, empty = {}; // TODO 为什么empty只有空对象而没有空数组，如果自定义了一个属性和数组特有的原型属性同名怎么办？

		 // Symbol属性只能通过以下方法枚举
		if( Object.getOwnPropertySymbols ){
			Object.getOwnPropertySymbols( src ).forEach(function(item)
			{
				dest[item] = source[item];
			});
		}

        for(name in source)
        {
            // the (!(name in empty) || empty[name] !== s) condition avoids copying properties in "source"
            // inherited from Object.prototype.	 For example, if dest has a custom toString() method,
            // don't overwrite it with the toString() method that source inherited from Object.prototype

            s = source[name];
            if( !(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s)) ){
                dest[name] = copyFunc ? copyFunc(s) : s; // 如果没有copyFunc则执行浅拷贝
            }
        }
        return dest;
    }


    if(!src || typeof src != "object" || Object.prototype.toString.call(src) === "[object Function]"){
        // 如果不是引用类型或者是函数，则直接返回本身
        return src;
    }
    if(src.nodeType && "cloneNode" in src){
        // DOM Node
        return src.cloneNode(true); // deep clone
    }
    if(src instanceof Date){
        // Date
        return new Date(src.getTime());
    }
    if(src instanceof RegExp){
        // RegExp
        return new RegExp(src);
    }

	// Array 和 PlainObject 遍历深拷贝
    var r, i, l;
    if( Array.isArray(src) ){
        r = [];
        src.forEach(function(item)
        {
            r.push(clone(item));
        });
    }else{
        // plain objects
        // TODO  不懂再什么情况下才会不存在constructor属性
        r = src.constructor ? new src.constructor() : {};
    }
    return mixin(r, src, clone);
}
```


## 浏览器尚未实现的拷贝功能
### `localStorage`和`sessionStorage`对引用类型的拷贝
虽然目前还没有浏览器支持这两个对象操作引用类型，不过根据《权威指南》上面说的：
> Objects and array values are normally mutable, so a Storage object is required to make a copy when you store a value, so that any subsequent changes to the original value have no effect on the stored value. The Storage object is also required to make a copy when you retrieve a value so that any changes you make to the retrieved value have no effect on the stored value.


## References
* [Clone Anything with JavaScript](https://davidwalsh.name/javascript-clone)
