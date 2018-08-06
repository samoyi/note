# Property

* An Object is logically a collection of properties. Each property is either a
**data property**, or an **accessor property**.
* **Attributes** are used in this specification to define and explain the state
of object properties. These attributes are defined by the specification for
implementation in JavaScript engines, and as such, these attributes are not
directly accessible in JavaScript. To indicate that an attribute is internal,
surround the attribute name with two pairs of square brackets, such as
`[[Enumerable]]`.


## Attributes of a Data Property
Attribute Name | Value Domain | Description
--|--|--
`[[Value]]` | Any ECMAScript language type | The value retrieved by a get access of the property.
`[[Writable]]` | Boolean | If `false`, attempts by ECMAScript code to change the property's `[[Value]]` attribute using `[[Set]]` will not succeed.
`[[Enumerable]]` | Boolean | If `true`, the property will be enumerated by a for-in enumeration. Otherwise, the property is said to be non-enumerable.
`[[Configurable]]` | Boolean | If `false`, attempts to delete the property, change the property to be an accessor property, or change its attributes (other than `[[Value]]`, or changing `[[Writable]]` to `false`) will fail.

* If a data property is not configurable, you cannot change its `[[Writable]]`
attribute from `false` to `true`, but you can change it from `true` to `false`.
    ```js
    let obj = Object.defineProperty({}, "x", { writable: true, configurable: false, });
    Object.defineProperty(obj, "x", { writable: false });
    console.log( Object.getOwnPropertyDescriptor(obj, "x").writable ); // false
    Object.defineProperty(obj, "x", { writable: true }); // TypeError: Cannot redefine property: x
    ```
* Once a property has been defined as nonconfigurable, it cannot become
    configurable again.


## Attributes of an Accessor Property
Attribute Name | Value Domain | Description
--|--|--
`[[Get]]` | Object or Undefined | If the value is an Object it must be a function object. The function's `[[Call]]` internal method is called with an empty arguments list to retrieve the property value each time a get access of the property is performed.
`[[Set]]` | Object or Undefined | If the value is an Object it must be a function object. The function's `[[Call]]` internal method is called with an arguments list containing the assigned value as its sole argument each time a set access of the property is performed. The effect of a property's `[[Set]]` internal method may, but is not required to, have an effect on the value returned by subsequent calls to the property's `[[Get]]` internal method.
`[[Enumerable]]` | Boolean | If `true`, the property will be enumerated by a for-in enumeration. Otherwise, the property is said to be non-enumerable.
`[[Configurable]]` | Boolean | If `false`, attempts to delete the property, change the property to be a data property, or change its attributes will fail.

<a href="https://tc39.github.io/ecma262/#table-6">`[[Call]]`</a>

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

### Read-only and Write-only properties
It’s not necessary to assign both a getter and a setter. Assigning just a getter
means that the property cannot be written to. Likewise, a property with only a
setter cannot be read

### 强大的自定义对象
通过`[[Get]]`和`[[Set]]`可以捕获到对对象属性和事件的读写请求，并且可以自定义对请求的响
应。因为你可以任意编写`get`和`set`函数，对对象属性和事件的读写可以响应任何符合语言规范
的操作，这就使得对象可以无限的扩展其功能，就可以构造出具有各种各样属性和功能的对象。

### 访问器属性会屏蔽数据属性
```js
let proto = {name: 22,};
Object.defineProperty(proto, 'name', {
    get(){
        return 33;
    },
});
let myObject = Object.create( proto );
console.log( myObject.name ); // 33
```

如果只设置了`[[Set]]`而没有设置`[[Get]]`，即使该属性的数据属性有`value`，也是不可读的
```js
let proto = {name: 22,};
Object.defineProperty(proto, 'name', {
    set(){},
});
let myObject = Object.create( proto );
console.log( myObject.name ); // undefined
```


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
* 属性名参数不只可以用字符串字面量，也可以用表达式：
    ```js
    let obj = {};
    let str = 'a';

    Object.defineProperty(obj, str, { value: 'Hello' });

    Object.defineProperties(obj, {
        [str + 'b']: {
            value: 'World'
        }
    });

    console.log(obj.a); // Hello
    console.log(obj.ab); // World
    ```

### `Object.getOwnPropertyDescriptor()`
如其名字所示，该方法只能用于实例属性，要取得原型属性的描述符，必须直接在原型对象上调用这
一方法。
```js
const obj = {
  prop: 42
}

const descriptor = Object.getOwnPropertyDescriptor(obj, 'prop');

console.log(descriptor); // {value: 42, writable: true, enumerable: true, configurable: true}
```

### `Object.getOwnPropertyDescriptors`
* ES7 方法，返回指定对象所有自身属性的描述对象：
    ```js
    const obj = {
      foo: 123,
      get bar() { return 'abc' },
    };

    Object.getOwnPropertyDescriptors(obj);
    ```

    将返回如下对象：
    ```js
    {
        foo: {
            value: 123,
            writable: true,
            enumerable: true,
            configurable: true,
        },
        bar: {
            get: [Function: get bar],
            set: undefined,
            enumerable: true,
            configurable: true,
        },
    }
    ```

#### 为了解决`Object.assign()`无法正确拷贝`[[Get]]`和`[[Set]]`的问题
```js
const source = {
    set foo(value) {
        console.log(value);
    }
};

const target = {};
Object.assign(target, source);

console.log(Object.getOwnPropertyDescriptor(target, 'foo'));
// {value: undefined, writable: true, enumerable: true, configurable: true}
```
上面代码中，`source`对象的`foo`属性的值是一个赋值函数，`Object.assign`方法将这个属性
拷贝给`target`对象，结果该属性的值变成了`undefined`。这是因为`Object.assign`方法总是
拷贝一个属性的值，而不会拷贝`[[Get]]`和`[[Set]]`。  
`Object.getOwnPropertyDescriptors`方法配合`Object.defineProperties`方法，就可以实
现正确拷贝：
```js
const source = {
    set foo(value) {
        console.log(value);
    }
};

const target = {};
Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
console.log(Object.getOwnPropertyDescriptor(target, 'foo'));
// {get: undefined, set: ƒ, enumerable: true, configurable: true}
```


## Default value
* If the initial values of a property's attributes are not explicitly specified
by specification, the default value are:  

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

* 对于直接在对象上定义属性，并不属于上面说的默认情况，因为这一行为实际上是执行了规范
中的`CreateDataProperty`（大概是这个） 抽象操作。对于该操作定义的属性，它们的
`[[Configurable]]`、`[[Enumerable]]`和 `[[Writable]]`特性都被默认设置为`true`
    ```js
    let obj = {
        name: '33',
    };

    console.log(Object.getOwnPropertyDescriptor(obj, 'name'));
    // {value: "33", writable: true, enumerable: true, configurable: true}
    ```



## Shadowing Properties
When `foo` is not already on `myObject` directly, but is at a higher level of
`myObject`'s `[[Prototype]]` chain:
1. If a normal data accessor property named `foo` is found anywhere higher on
the `[[Prototype]]` chain, and it's not marked as read-only (`writable: false`)
then a new property called `foo` is added directly to `myObject`, resulting in a
shadowed property.
    ```js
    let proto = { foo: 22 },
        myObject = Object.create( proto );
    myObject.foo = 33;
    console.log( myObject.foo ); // 33
    ```
2. If a `foo` is found higher on the `[[Prototype]]` chain, but it's marked as
read-only (`writable: false`), then both the setting of that existing property
as well as the creation of the shadowed property on `myObject` are disallowed.
    ```js
    let proto = {};
    Object.defineProperty(proto, 'foo', {
        'value': 22,
    });
    let myObject = Object.create( proto );
    myObject.foo = 33; // TypeError: Cannot assign to read only property 'foo' of object '#<Object>'
    ```
3. If a `foo` is found higher on the `[[Prototype]]` chain and it's a setter,
then the setter will always be called. No `foo` will be added to `myObject`, nor
will the `foo` setter be redefined.
    ```js
    let proto = {name: 22,};
    Object.defineProperty(proto, 'foo', {
        get(){
            return this.name;
        },
        set(){
            this.name = 33;
        },
    });
    let myObject = Object.create( proto );
    console.log( myObject.foo ); // 22
    console.log( proto.hasOwnProperty('foo') ); // true
    myObject.foo = 666;
    console.log( myObject.foo ); // 33
    console.log( myObject.hasOwnProperty('foo') ); // false
    ```
4. If you want to shadow `foo` in cases 2 and 3, you cannot use `=` assignment,
but must instead use `Object.defineProperty(..)` to add `foo` to `myObject`.
5. Shadowing can even occur implicitly in subtle ways:
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
<mark>没看明白规范中对于 ++ 操作符的说明</mark>



## 其他
* 以字符串的形式输出一个对象的时候，只会输出自身的、可枚举的属性
* Define a "constant property"
    ```js
    var myObject = {};
    Object.defineProperty(myObject, "FAVORITE_NUMBER", {
    	value: 42,
    	writable: false,
    	configurable: false
    } );
    ```


## References
* [Draft ECMA-262: Property Attributes](https://tc39.github.io/ecma262/#sec-property-attributes)
* [Draft ECMA-262: The Object Type](https://tc39.github.io/ecma262/#sec-object-type)
* [《ECMAScript 6 入门》](http://es6.ruanyifeng.com/#docs/object#Object-getOwnPropertyDescriptors)
