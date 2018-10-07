# Tamper Proof Object

Once an object has been made temper-proof, the operation cannot be undone.



## Prevent extension
### Prevent
```js
Object.preventExtensions()
```

* 阻止向对象添加新属性。
* 向不可扩展对象添加新属性的话，严格模式下会报错，非严格模式静默失败。
    ```js
    let obj = {
    	age: 22,
    };

    Object.preventExtensions(obj);
    obj.name = '33'; // TypeError: Cannot add property name, object is not extensible
    ```
* 只阻止向对象自身添加属性，向对象的属性再添加属性则不受影响
    ```js
    let obj = {
        num: [1, 2],
    };
    Object.preventExtensions(obj);
    obj.num.push(3);
    console.log(obj.num); // [1, 2, 3]
    obj.name = 22; // TypeError: Cannot add property name, object is not extensible
    ```
* 这个操作会阻止修改对象的原型
    ```js
    let obj = {
    	age: 22,
    };

    Object.preventExtensions(obj);
    Object.setPrototypeOf(obj, {}); // TypeError: #<Object> is not extensible
    ```
    但不懂这个要如何理解？实例本身就是有`[[Prototype]]`的，修改实例的原型按理来说应该
    只是修改而不添加啊
* 如果参数是基础类型，在 ES5 中则会报错，在 ES6 会直接返回参数。
    ```js
    console.log(Object.preventExtensions(22)); // 22
    ```

### Detect
```js
let obj = {};
console.log(Object.isExtensible(obj)); // true
Object.preventExtensions(obj);
console.log(Object.isExtensible(obj)); // false
```

如果参数是基础类型，在 ES5 中则会报错，在 ES6 会直接返回`false`。
```js
console.log(Object.isExtensible(22)); // false  不是对象，也就更不是可扩展对象了
```


## Seal object
### Seal
```js
Object.seal()
```
* 在不可扩展的基础上，将对象的所有属性变成不可配置
    ```js
    let obj = {
    	age: 22,
    };

    console.log(Object.isExtensible(obj)); // true
    console.log(Object.getOwnPropertyDescriptor(obj, 'age'));
    // {value: 22, writable: true, enumerable: true, configurable: true}

    Object.seal(obj);

    console.log(Object.isExtensible(obj)); // false
    console.log(Object.getOwnPropertyDescriptor(obj, 'age'));
    // {value: 22, writable: true, enumerable: true, configurable: false}
    ```
* 如果参数是基础类型，在 ES5 中则会报错，在 ES6 会直接返回参数。

### Detect
```js
Object.isSealed()
```
如果参数是基础类型，在 ES5 中则会报错，在 ES6 会直接返回`true`。这就不符合逻辑了！
```js
console.log(Object.isSealed(22)); // true  
```


## Freeze object
### Freeze
```js
Object.freeze()
```

* 在 seal object 的基础上，将对象的所有属性变成不可写
    ```js
    let obj = {
    	age: 22,
    };

    console.log(Object.isExtensible(obj)); // true
    console.log(Object.isSealed(obj)); // false
    console.log(Object.getOwnPropertyDescriptor(obj, 'age'));
    // {value: 22, writable: true, enumerable: true, configurable: true}

    Object.freeze(obj);

    console.log(Object.isExtensible(obj)); // false
    console.log(Object.isSealed(obj)); // true
    console.log(Object.getOwnPropertyDescriptor(obj, 'age'));
    // {value: 22, writable: false, enumerable: true, configurable: false}
    ```
* 但如果是访问器属性，只要定义了 setter 就依然是可写的。也就是说`Object.freeze()`只会
把数据属性的`writable`变为`false`，还不至于会去删除访问器属性的 setter
    ```js
    let obj = {};
    let _name = '33';

    Object.defineProperties(obj, {
        name: {
            get(){
                return _name;
            },
            set(newName){
                _name = newName;
            },
        },
        age: {
            value: 22,
        },
    });

    Object.freeze(obj)
    console.log(obj.name); // "33"
    obj.name = '22'; // 不会导致错误
    console.log(obj.name); // "22"
    console.log(obj.age); // 22
    obj.age = 33; // TypeError
    ```
* 如果参数是基础类型，在 ES5 中则会报错，在 ES6 会直接返回参数。

### Detect
```js
Object.isFrozen()
```
如果参数是基础类型，在 ES5 中则会报错，在 ES6 会直接返回`true`。依然不符合逻辑了！
```js
console.log(Object.isFrozen(22)); // true  
```

### Deep freeze
1. 该方法是浅冻结，如果要深冻结，就要遍历冻结对象的所有属性。
2. 如果对象属性不存在循环引用，就可以用下面的方法实现深冻结。
4. 不过除了循环引用的风险以外，还有可能会意外冻结某些不该被冻结的对象，比如被冻结对象的
某个属性引用了`window`。

```js
function deepFreeze(obj) {

    // Retrieve the property names defined on obj
    let propNames = Object.getOwnPropertyNames(obj);

    // Freeze properties before freezing self
    propNames.forEach(function(name) {
        let prop = obj[name];

        // Freeze prop if it is an object
        if (typeof prop === 'object' && prop !== null){            
            deepFreeze(prop);
        }
    });

    // Freeze self (no-op if already frozen)
    return Object.freeze(obj);
}
```


## References
* [Professional JavaScript for Web Developers](https://book.douban.com/subject/7157249/)
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
