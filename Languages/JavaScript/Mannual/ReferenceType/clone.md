
## TODO
* ES6的新类型中只检测了是否可拷贝`Symbol`

## 根据以下几个标准来对各种拷贝方法进行分类
* 深/浅：深拷贝和浅拷贝。  
    存在深拷贝的三种对象：Plain Object、 Array、 Dom Node，会分别判断。
* 仅实例：只拷贝实例属性
* 仅可枚举：只拷贝对象中的可枚举属性（ `enumerable` 为 `true`）。  
    Symbol属性虽然实际上不可枚举，但其本身的 `enumerable` 为 `true`。
* 不可拷贝类型：不能拷贝某些类型的数据


## 测试代码
```
/*
 * 对于只能拷贝数组不能拷贝 PlainObject 的方法，拷贝方法描述中的 PlainObject深浅拷贝
 * 是指其作为数组项的PlainObject。例如 Array.prototype.slice() 方法的拷贝方法描述中的
 * “PlainObject浅拷贝” 表示只能浅拷贝PlainObject数组项。
 */
{
     /*
      * 默认对节点类型进行检查。如果不是浏览器环境，要将下面的 bCheckNodeType 设为 false
      */
     let bCheckNodeType = true;



     let symbol = Symbol(),
        innerObj = {
            deep1: {
                deep2: {
                    deep3: false // 如果拷贝方法可以深入第三层，则认为其支持对 Plain Object 的深拷贝
                }
            }
        },
        innerArr = [
            [
                [
                    [false] // 如果拷贝方法可以深入第三层，则认为其支持对 Array 的深拷贝
                ]
            ]
        ];

    let innerNode = null;
    if( bCheckNodeType ){
        let divNode = document.createElement("div"),
            paraNode = document.createElement("p"),
            spanNode = document.createElement("span");
        paraNode.appendChild(spanNode);
        divNode.appendChild( paraNode );
        innerNode = divNode;  // 如果拷贝方法可以深入第三层，则认为其支持对 Node 的深拷贝
    }

    // 检测是否可拷贝原型属性
    function O(){
        this.protoName = "prototypeName";
    }
    let source = new O();

    source = {
        p0: innerObj, // 检测是否深拷贝 Plain Object
        p1: innerArr, // 检测是否深拷贝 Array
        p2: bCheckNodeType && innerNode, // 检测是否深拷贝 Node
        p3: undefined, // 检测是否可拷贝undefined
        p4: null, // 检测是否可拷贝null
        p5: NaN, // 检测是否可拷贝NaN
        p6: ["a"], // 检测是否可拷贝数组
        p7: function(){return "p7";}, // 检测是否可拷贝函数
        p8: /2/, // 检测是否可拷贝正则
        p9: new Date("1997"), // 检测是否拷贝Date对象
        p10: innerNode, // 检测是否可拷贝DOM节点
        [symbol]: "sym" // 检测是否可拷贝Symbol类型
    };

    // 检测是否可拷贝不可枚举属性
    Object.defineProperty(source, "innumerable", {enumerable: false, value: true});

    /*
     * 有些拷贝方法只支持数组，例如Array.prototype.slice()
     * 对于这样的方法，将source放进数组中可以避免报错
     * 如果是对于只支持 plain object 的拷贝方法，也不会造成影响
     */
    source = [source];


    // 传入拷贝方法生成的新对象target，返回对该拷贝方法的描述。不判断是否用到了ES6的新方法
    function cloneTypeDes( target )
    {
        /*
         * 因为 source 实际上是数组，所以经过拷贝之后的 target 要么也是数组，要么是一个
         * Object {0: Object}，这里就需要取出其内部真正的 plain object
         */
        target = target[0];

        let sCloneType = "",
        sDisabledType = "不可拷贝类型：",
        sDeepOrShallow = "",
        bAnyDisabledType = false;

        // TODO 这三个判断深拷贝的地方应该先对是否拷贝做判断，如果人家根本不拷贝数组，那就报错了
        innerObj.deep1.deep2.deep3 = true;
        if( target.p0.deep1.deep2.deep3 === false ){
            sDeepOrShallow += "PlainObject深拷贝";
        }
        else if( target.p0.deep1.deep2.deep3 === true ){
            sDeepOrShallow += "PlainObject浅拷贝";
        }


        if( target.protoName !== "prototypeName"){
            sCloneType += "仅实例";
        }
        if( target.innumerable === undefined ){
            sCloneType += " + 仅可枚举";
        }


        if( !("p3" in target) || (target.p3 !== undefined) ){
            sDisabledType += "Undefined/";
            bAnyDisabledType = true;
        }
        if( !("p4" in target) || (target.p4 !== null) ){
            sDisabledType += "Null/";
            bAnyDisabledType = true;
        }
        if( !("p5" in target) || !Number.isNaN(target.p5) ){
            sDisabledType += "NaN/";
            bAnyDisabledType = true;
        }
        if( !Array.isArray( target.p6 ) || (target.p6)[0]!=="a" ){
            sDisabledType += "Array/";
            bAnyDisabledType = true;

        }
        else{ // 如果拷贝数组，看看是否深拷贝数组
            // TODO 这里为什么是4个0而不是三个
            innerArr[0][0][0][0] = true;
            if( (target.p1)[0][0][0][0] === false ){
                sDeepOrShallow += " + Array深拷贝";
            }
            else if( (target.p1)[0][0][0][0] === true ){
                sDeepOrShallow += " + Array浅拷贝";
            }
        }
        if( typeof target.p7 !== "function" || (target.p7)()!=="p7" ){
            sDisabledType += "Function/";
            bAnyDisabledType = true;
        }
        if( target.p8 instanceof RegExp !== true ){
            sDisabledType += "RegExp/";
            bAnyDisabledType = true;
        }
        if( target.p9 instanceof Date !== true || (target.p9).getFullYear()!==1997 ){
            sDisabledType += "Date/";
            bAnyDisabledType = true;
        }
        if( bCheckNodeType )
        {
            if( !(target.p10 instanceof HTMLDivElement) )
            {
                sDisabledType += "Node/";
                bAnyDisabledType = true;
            }
            else
            {
                let newNode = document.createElement("BR"),
                    oFirstEChild = innerNode.firstElementChild;
                oFirstEChild.replaceChild(newNode, oFirstEChild.firstElementChild);
                if( target.p10.firstElementChild.nodeName === "P" &&
                    target.p10.firstElementChild.firstElementChild.nodeName === "SPAN")
                {
                    sDeepOrShallow += " + Node深拷贝";
                }
                else{
                    sDeepOrShallow += " + Node浅拷贝";
                }
            }
        }
        if( !(symbol in target) || (target[symbol] !== "sym")  ){
            sDisabledType += "Symbol/";
            bAnyDisabledType = true;
        }

        sCloneType =  sDeepOrShallow + " + " + sCloneType;
        if( bAnyDisabledType )
        {
            sCloneType += " + " + sDisabledType.slice(0, -1);
        }

        return sCloneType;
    }

    /*
     *  以下代码为具体测试代码
     */
    // 使用待测试的拷贝方法生成一个新对象
    let target = cloneFunc(source);
    // 将新对象传入，返回该拷贝方法的描述
    console.log(cloneTypeDes( target ));

}
```

## 方法一：`Object.assign(target, source)`
### 拷贝特点：
`PlainObject`浅拷贝 + `Array`浅拷贝 + `Node`浅拷贝 + 仅实例 + 仅可枚举 + ES6

##  方法二：`JSON.parse( JSON.stringify( source ) )`
### 拷贝特点：
`PlainObject`深拷贝 + `Array`深拷贝 + 仅实例 + 仅可枚举 + 不可拷贝类型：`Undefined/NaN/RegExp/Function/Date/DOM/Symbol`

## 方法三：自定义方法1
### 拷贝特点：
`PlainObject`深拷贝 + `Array`深拷贝 + `Node`深拷贝 + 仅实例 + 仅可枚举
### 引用来源：
在[这篇文章](https://davidwalsh.name/javascript-clone)的`clone`函数中加入了对`Symbol`的支持
```
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

				/*
				 * 分析下面的 if condition
                 * 简写以下condition为 A || (B&&(C||D))
                 * A：!(name in dest)：为true则表明dest实例和原型中都没有和name同名
                 *                     的属性，为false则表明dest的实例和原型两个对象
                 *                     中，至少其中之一是有和name同名的属性。
                 * B：dest[name] !== s：如果为true则可能有以下两种可能：
                 *                       1.dest里有name属性但值不等于source中name
                 *                         属性的值
                 *                       2.dest里面没有name属性（值为undefined），
                 *                         source里name属性的值不为undefined。但
                 *                         这种情况在这里并不会发生，因为如果发生，则
                 *                         !(name in dest)就会是 true。则整个判断
                 *                         就是true了。
                 *                      如果为false则有以两下种可能：
                 *                       1.dest里有name属性，且值和source里name
                 *                         属性的值相同
                 *                       2.dest里没有name属性或name属性值为
                 *                         undefined，且source里name属性值为
                 *                         undefined
                 * C：!(name in empty)：进入 for...in 的属性都不是Object原型属性
                 *                     （Object原型属性不可枚举），!(name in empty)
                 *                      为true则说明原型中没有这个属性，为false则
                 *                      说明原型中有属性与name同名
                 * D：empty[name] !== s：如果为true，则有以下两种可能：
                 *                       1.原型中有name属性，但值和source中name属性
                 *                         的值不同。
                 *                       2.原型中没有name属性，且source中name属性的
                 *                         值不为undefined。这个情况也不会发生，因为
                 *                         只有C为false才会对D进行判断，而C为false
                 *                         的话，empty中就一定有name属性。
                 *                      如果为false，则有以下两种可能：
                 *                       1.原型中有name属性且和source的name属性值
                 *                         相同
                 *                       2.原型中没有name属性，且source中name属性的
                 *                         值为undefined。同理，这个情况也不会发生，
                 * C||D：如果为true则有以下两种情况：1.原型中没有与source中的name属性
                 *                                  同名的属性；
                 *                                2.原型中有和与source中的name属性
                 *                                  同名但不同值的属性
                 *       如果为false则说明原型中有和name同名且同值的属性 。
                 * B&&(C||D)：如果为true则必须同时满足以下两个条件：
                 *             1.原型中不能存在和source中name属性同名且同值的属性
                 *             2.dest有name属性的情况下，值不等于source中name属性值
                 *            如果为false，则以上两个条件至少有一个不能满足
                 * A || (B&&(C||D))：如果为true，则必须满足一下两个条件之一：
                 *                    1.dest实例和原型中都没有和name同名的属性
                 *                    2.B&&(C||D)为true
                 *
				 * A || (B&&(C||D))：相当于(A||B)&&(A||(C||D))
                 * A||B：原型里没有和name同名的属性，dest里没有和name同名且同值的属性
                 * A||(C||D)：原型中没有和name同名同值的属性，dest没有和name同名的属性
                 * A || (B&&(C||D))：原型中没有和name同名同值的属性，dest里没有和name
				 *					 同名同值的属性
				 */
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
### 逻辑分析：
1. 如果不是引用类型或者是函数，则直接返回本身
2. 如果是Node类型，则使用该类型的 `cloneNode()` 方法并传参`true`进行深拷贝
3. 如果是Date类型，则创建一个与当前Date对象相同时间（通过`getTime()`方法获得当前Date对象的时间）的新Date对象
4. 如果是RegExp对象，使用RegExp构造函数复制该对象
5. 如果是以上四种情况，则不存在深入一层进行拷贝的问题，直接返回拷贝后的结果即可。
6. 如果是Array或PlainObject类型，就不能直接拷贝，而是需要深入其内部再遍历数组项或对象属性。如果是Symbol属性，则需要通过`Object.getOwnPropertySymbols()`方法进行遍历。


## 方法四：`Array.prototype.slice()` 拷贝数组
### 拷贝特点：
`PlainObject`浅拷贝 + `Array`浅拷贝 + `Node`浅拷贝 + 仅实例


## 方法五：`[...array]` 拷贝数组
### 拷贝特点：
`PlainObject`浅拷贝 + `Array`浅拷贝 + `Node`浅拷贝 + 仅实例


## 浏览器尚未实现的拷贝功能
### `localStorage`和`sessionStorage`对引用类型的拷贝
虽然目前还没有浏览器支持这两个对象操作引用类型，不过根据《权威指南》上面说的：
> Objects and array values are normally mutable, so a Storage object is required to make a copy when you store a value, so that any subsequent changes to the original value have no effect on the stored value. The Storage object is also required to make a copy when you retrieve a value so that any changes you make to the retrieved value have no effect on the stored value.


## References
* [也来谈一谈js的浅复制和深复制](http://www.imooc.com/article/11253)
* [Clone Anything with JavaScript](https://davidwalsh.name/javascript-clone)


## 附：
* [The structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)