# Property
* An Object is logically a collection of properties. Each property is either a
**data property**, or an **accessor property**.
* Attributes are used in this specification to define and explain the state of
Object properties. These attributes are defined by the specification for
implementation in JavaScript engines, and as such, these attributes are not
directly accessible in JavaScript. To indicate that an attribute is internal,
surround the attribute name with two pairs of square brackets, such as
`[[Enumerable]]`.



***
## data property attributes

### `[[Value]]`
* [Table 2: Attributes of a Data Property](https://tc39.github.io/ecma262/#sec-property-attributes)

### `[[Writable]]`  
* [Table 2: Attributes of a Data Property](https://tc39.github.io/ecma262/#sec-property-attributes)

### `[[Enumerable]]`
* [Table 2: Attributes of a Data Property](https://tc39.github.io/ecma262/#sec-property-attributes)

### `[[Configurable]]`
* [Table 2: Attributes of a Data Property](https://tc39.github.io/ecma262/#sec-property-attributes)
* If a data property is not configurable, you cannot change its writable
attribute from false to true, but you can change it from true to false.
```js
let p = Object.defineProperty({}, "x", { writable: true, configurable:false });
Object.defineProperty(p, "x", { writable: false });
console.log( Object.getOwnPropertyDescriptor(p, "x").writable ); // false
Object.defineProperty(p, "x", { writable: true }); // TypeError
```
* Once a property has been defined as nonconfigurable, it cannot become
    configurable again.



***
## accessor property
### `[[Get]]`
* [Table 3: Attributes of an Accessor Property](https://tc39.github.io/ecma262/#sec-property-attributes)

### `[[Set]]`
* [Table 3: Attributes of an Accessor Property](https://tc39.github.io/ecma262/#sec-property-attributes)

### `[[Enumerable]]`
* [Table 3: Attributes of an Accessor Property](https://tc39.github.io/ecma262/#sec-property-attributes)

### ` [[Configurable]]`
* [Table 3: Attributes of an Accessor Property](https://tc39.github.io/ecma262/#sec-property-attributes)

### Read-only and Write-only properties
It’s not necessary to assign both a getter and a setter. Assigning just a getter means that the property cannot be written to. Likewise, a property with only a setter cannot be read

### 强大的自定义对象
通过`[[Get]]`和`[[Set]]`可以捕获到对对象属性和事件的读写请求，并且可以自定义对请求的响
应。因为你可以任意编写`get`和`set`函数，对对象属性和事件的读写可以响应任何符合语言规范
的操作，这就使得对象可以无限的扩展其功能，就可以构造出具有各种各样属性和功能的对象。


***
## Methods
### Define and change
* `Object.defineProperty()`
* `Object.defineProperties()`
* Will not alter an inherited property
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

### Get
* `Object.getOwnPropertyDescriptor()`
* 如其名字所示，该方法只能用于实例属性，要取得原型属性的描述符，必须直接在原型对象上调用
这一方法方法。
* ES7有一个提案，提出了`Object.getOwnPropertyDescriptors`方法，返回指定对象所有自身属
性（非继承属性）的描述对象。该方法的提出目的，主要是为了解决`Object.assign()`无法正确拷
贝`[[Get]]`和`[[Set]]`的问题。



***
## Default value
* If the initial values of a property's attributes are not explicitly specified
by specification, the default value are:  

Attribute Name | Default Value
--|--
[[Value]] | `undefined`
[[Get]] | `undefined`
[[Set]] | `undefined`
[[Writable]] | `false`
[[Enumerable]] | `false`
[[Configurable]] | `false`

```js
let obj = {};

Object.defineProperty(obj, 'name', {});
console.log(Object.getOwnPropertyDescriptor(obj, 'name'));

Object.defineProperty(obj, 'age', { get(){} });
console.log(Object.getOwnPropertyDescriptor(obj, 'age'));

Object.defineProperty(obj, 'sex', { set(){} });
console.log(Object.getOwnPropertyDescriptor(obj, 'sex'));

```

* 对于直接在对象上定义属性，并不属于上面说的默认情况，因为这一行为实际上是执行了规范中的
`CreateDataProperty`（大概是这个） 抽象操作。对于该操作定义的属性，它们的
`[[Configurable]]`、`[[Enumerable]]`和 `[[Writable]]`特性都被默认设置为`true`



***
## 其他
* 以字符串的形式输出一个对象的时候，只会输出自身的、可枚举的属性
* Define a "constant property"
    ```js
    var myObject = {};
    Object.defineProperty( {}, "FAVORITE_NUMBER", {
    	value: 42,
    	writable: false,
    	configurable: false
    } );
    ```


***
## Reference
* [Draft ECMA-262: Property Attributes](https://tc39.github.io/ecma262/#sec-property-attributes)
* [Draft ECMA-262: The Object Type](https://tc39.github.io/ecma262/#sec-object-type)
