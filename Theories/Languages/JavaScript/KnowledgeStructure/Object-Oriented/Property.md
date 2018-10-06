# Property


* 对象属性可以是 **数据属性**（data property），也可以是 **访问器属性**（accessor
property）。
* **特性**（attributes）用于定义和解释对象属性的状态。使用两个中括号来指示：
`[[Enumerable]]`。


## 数据属性的特性
<table>
    <thead>
        <tr>
            <th>特性名</th>
            <th>数据类型</th>
            <th>描述</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>属性值 `[[Value]]`</td>
            <td>任何类型</td>
            <td>The value retrieved by a get access of the property</td>
        </tr>
        <tr>
            <td>可写 `[[Writable]]`</td>
            <td>`Boolean`</td>
            <td>能否改变`[[Value]]`</td>
        </tr>
        <tr>
            <td>可枚举 `[[Enumerable]]`</td>
            <td>`Boolean`</td>
            <td>是否能通过`for...in`遍历到</td>
        </tr>
        <tr>
            <td>可配置 `[[Configurable]]`</td>
            <td>`Boolean`</td>
            <td>
                如果为`false`：不能删除属性；不能将该属性改为访问器属性；
                除了修改`[[Value]]`和将`[[Writable]]`改为`false`以外的特性修改都会
                失败
            </td>
        </tr>
    </tbody>
</table>


## 访问器属性的特性
<table>
    <thead>
        <tr>
            <th>特性名</th>
            <th>数据类型</th>
            <th>描述</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>属性值 `[[Get]]`</td>
            <td>`Function` | `Undefined`</td>
            <td>如果设定为函数，读取该属性时，该函数将被调用，返回值作为读取的结果</td>
        </tr>
        <tr>
            <td>可写 `[[Set]]`</td>
            <td>`Function` | `Undefined`</td>
            <td>如果设定为函数，修改该属性时，该函数将被调用，唯一的参数是修改的新值</td>
        </tr>
        <tr>
            <td>可枚举 `[[Enumerable]]`</td>
            <td>Boolean</td>
            <td>是否能通过`for...in`遍历到</td>
        </tr>
        <tr>
            <td>可配置 `[[Configurable]]`</td>
            <td>Boolean</td>
            <td>
                如果为`false`：不能删除属性；不能将该属性改为数据属性；不能修改特性。
            </td>
        </tr>
    </tbody>
</table>

### 只有属性的修改才能触发 setter，属性删除以及子属性的变动都不会触发。
```js
let data = {
    _info: {
        _age: 22,
    },
};

Object.defineProperty(data._info, 'age', {
    get(){
        return this._age;
    },
    set(newAge){
        this._age = newAge;
        console.log('modify age');
    },
    enumerable: true,
    configurable: true,
});

Object.defineProperty(data, 'info', {
    get(){
        return this._info;
    },
    set(newInfo){
        this._info = newInfo;
        console.log('modify info');
    },
    configurable: true,
});

console.log(data.info.age);     // 22
data.info.age = 33;             // "modify age"   不会输出"modify info"
console.log(data.info.age);     // 33
delete data.info.age;           // 不会有输出
console.log(data.info.age);     // undefined
data.info = {};                 // "modify info"
data.info.newProp = 'newProp';  // 不会有输出
console.log(data.info.newProp); // "newProp"
delete data.info;               // 不会有输出
```

### 只读和只写的访问器属性
如果只设置了`[[Get]]`就是只读属性，如果只设置`[[Set]]`就是只写属性。

### 强大的自定义对象
通过`[[Get]]`和`[[Set]]`可以捕获到对对象属性的读写请求，并且可以自定义对请求的响应。因
此对对象属性的读写可以响应任何符合语言规范的操作，这就使得对象可以无限的扩展其功能，从而
构造出具有各种各样属性和功能的对象。

### 访问器属性会屏蔽数据属性
```js
let obj = {name: 22,};
Object.defineProperty(obj, 'name', {
    get(){return 33;},
});
console.log(obj.name); // 33
```

如果只设置了`[[Set]]`而没有设置`[[Get]]`，即使该属性的数据属性有`value`，也是不可读的
```js
let obj = {name: 22,};
Object.defineProperty(obj, 'name', {
    set(){},
});
console.log(obj.name); // undefined
console.log(Object.getOwnPropertyDescriptor(obj, 'name').get); // undefined
```

### getter 和 setter 里的`this`值
如果不是箭头函数，则指向属性所属的对象
```js
let obj = {name: 22,};
Object.defineProperties(obj, {
	foo: {
		get(){
			console.log(this); // {name: 22}
		},
		set(){
			console.log(this); // {name: 22}
		},
	},
	bar: {
		get: ()=>{
			console.log(this); // window
		},
		set: ()=>{
			console.log(this); // window
		},
	},
});

obj.foo;
obj.foo = 33;
obj.bar;
obj.bar = 33;
```


## 特性默认值
1. 在使用`Object.defineProperty()`和`Object.defineProperties()`定义一个属性时，如果
没有设定某个特性，则使用以下默认值

Attribute Name | Default Value
--|--
`[[Value]]` | `undefined`
`[[Get]]` | `undefined`
`[[Set]]` | `undefined`
`[[Writable]]` | `false`
`[[Enumerable]]` | `false`
`[[Configurable]]` | `false`

```js
let obj = {};

Object.defineProperty(obj, 'name', {});
console.log(Object.getOwnPropertyDescriptor(obj, 'name'));
// {value: undefined, writable: false, enumerable: false, configurable: false}

Object.defineProperty(obj, 'age', { get(){} });
console.log(Object.getOwnPropertyDescriptor(obj, 'age'));
// {get: ƒ, set: undefined, enumerable: false, configurable: false}

Object.defineProperty(obj, 'sex', { set(){} });
console.log(Object.getOwnPropertyDescriptor(obj, 'sex'));
// {get: undefined, set: ƒ, enumerable: false, configurable: false}
```
2. 对于直接在对象上定义属性，并不属于上面说的默认情况，因为这一行为实际上是执行了规范
中的`CreateDataProperty`（大概是这个） 抽象操作。对于该操作定义的属性，它们的
`[[Configurable]]`、`[[Enumerable]]`和 `[[Writable]]`特性都被默认设置为`true`
    ```js
    let obj = {
        name: '33',
    };

    console.log(Object.getOwnPropertyDescriptor(obj, 'name'));
    // {value: "33", writable: true, enumerable: true, configurable: true}
    ```


## 定义和修改特性
### 定义和修改单个属性的特性
* `Object.defineProperty()`

### 定义和修改多个属性的特性
`Object.defineProperties()`
```js
let obj = {};
Object.defineProperties(obj, {
    'property1': {
        value: true,
        writable: true
    },
    'property2': {
        value: 'Hello',
        writable: false
    }
    // etc. etc.
});
```

### 定义和修改属性时，不会影响到继承的属性
```js
let proto = {
    x: 22
};
let obj = Object.create( proto );
obj.y = 33;

Object.defineProperty(obj, "y", { value: 333 });
console.log( obj.y ); // 333

Object.defineProperty(obj, "x", { value: 222 });
console.log( obj.x ); // 222

let newObj = Object.create( proto );
console.log( newObj.x ); // 22
```


## 读取属性特性
### 读取单个属性的特性
1. `Object.getOwnPropertyDescriptor()`
2. 如其名字所示，该方法只能用于实例属性，要取得原型属性的描述符，必须直接在原型对象上调用这
一方法。

```js
const obj = {
    prop: 42
};
const descriptor = Object.getOwnPropertyDescriptor(obj, 'prop');
console.log(descriptor);
// {value: 42, writable: true, enumerable: true, configurable: true}
```

### 读取所有自身属性的特性
`Object.getOwnPropertyDescriptors()`

```js
let obj = {};
Object.defineProperties(obj, {
    'property1': {
        value: true,
        writable: true
    },
    'property2': {
        value: 'Hello',
        writable: false
    }
});

let descriptors = Object.getOwnPropertyDescriptors(obj);
console.log(JSON.stringify(descriptors, null, 4));
// {
//     "property1": {
//         "value": true,
//         "writable": true,
//         "enumerable": false,
//         "configurable": false
//     },
//     "property2": {
//         "value": "Hello",
//         "writable": false,
//         "enumerable": false,
//         "configurable": false
//     }
// }
```

#### 解决`Object.assign()`无法正确拷贝`[[Get]]`和`[[Set]]`的问题
```js
const source = {};
Object.defineProperties(source, {
	foo: {
		get(){
			return 22;
		},
		enumerable: true,
	},
	bar: {
		get(){
			return 33;
		},
	},
});

// 下面 6 行，Object.assign() 只拷贝了可枚举的 foo 属性，而且拷贝方式是直接赋值的方式，所以
// 导致 foo 变成了数据属性，三个布尔值特性全部变成了 true
let target = {};
Object.assign(target, source);
console.log(target); // {foo: 22}
console.log(target.bar); // undefined
const descriptors = Object.getOwnPropertyDescriptors(target);
console.log(descriptors.foo); // {value: 22, writable: true, enumerable: true, configurable: true}

// 下面的方法时先获取 source 所有属性的特性，再通过 Object.defineProperties 定义到 target
// 之上，可以正确的复制
target = {};
Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
console.log(target.foo); // 22
console.log(target.bar); // 33
target.bar = 666; // TypeError: Cannot set property bar of #<Object> which has only a getter
```


## Shadowing Properties
1. `myObject`的原型链上某一对象定义了数据属性`foo`，且为可写的，那么`myObject`上也可以再定
义属性`foo`，`myObject.foo`将屏蔽原型链上的`foo`。这是平时最常见的情况。
    ```js
    let proto = { foo: 22 },
        myObject = Object.create( proto );
    myObject.foo = 33;
    console.log( myObject.foo ); // 33
    ```
2. 如果原型链上的`foo`是只读的，则在`myObject`无法重新定义`foo`属性，因为重新定义的过程也相
当于修改原型链上的`foo`属性。除非使用`Object.defineProperty`定义
    ```js
    let proto = {};
    Object.defineProperty(proto, 'foo', {
    	value: 22,
    });

    let myObject = Object.create(proto);
    console.log(myObject.foo); // 22
    try{
    	myObject.foo = 33;
    }
    catch(err){
    	console.log(err.message);
    	// Cannot assign to read only property 'foo' of object '#<Object>'
    }

    Object.defineProperty(myObject, 'foo', {
    	value: 33,
    })
    console.log(myObject.foo); // 33
    ```

3. 如果原型链上的`foo`是访问器属性，那么给`myObject`添加`foo`也是相当于修改原型链上的`foo`
，除非是使用`Object.defineProperty`。
    ```js
    let proto = {name: 22,};
    Object.defineProperty(proto, 'foo', {
    	get(){
    		return this.name;
    	},
    	set(value){
    		this.name = value;
    	},
    });
    let myObject = Object.create( proto );
    myObject.foo = 666;
    console.log( myObject.hasOwnProperty('foo') ); // false
    console.log( proto.hasOwnProperty('foo') ); // true

    Object.defineProperty(myObject, 'foo', {
    	value: 33,

    })
    console.log( myObject.foo ); // 33
    console.log( myObject.__proto__.foo ); // 22
    console.log( myObject.hasOwnProperty('foo') ); // true
    console.log( proto.hasOwnProperty('foo') ); // true
    ```
4. 屏蔽也可能很隐蔽：
    ```js
    let proto = { a: 2, },
        myObject = Object.create( proto );

    console.log( proto.hasOwnProperty( "a" ) ); // true
    console.log( myObject.hasOwnProperty( "a" ) ); // false

    myObject.a++; // implicit shadowing

    console.log( proto.a ); // 2
    console.log( myObject.a ); // 3

    console.log( myObject.hasOwnProperty( "a" ) ); // true
    ```
The `++` operation corresponds to `myObject.a = myObject.a + 1`.


## 其他
* 定义“常量属性”
    ```js
    let obj = {};
    Object.defineProperty(obj, 'FAVORITE_NUMBER', {value: 42,});
    // 修改和删除 obj.FAVORITE_NUMBER 都会报错
    ```


## References
* [Draft ECMA-262: Property Attributes](https://tc39.github.io/ecma262/#sec-property-attributes)
* [Draft ECMA-262: The Object Type](https://tc39.github.io/ecma262/#sec-object-type)
* [《ECMAScript 6 入门》](http://es6.ruanyifeng.com/#docs/object#Object-getOwnPropertyDescriptors)
