# Tamper Proof Object

Once an object has been made temper-proof, the operation cannot be undone.



## Prevent extension
### Prevent
```js
Object.preventExtensions()
```
* Prevents new properties from ever being added to an object.
* Attempting to add new properties to a non-extensible object will fail, either
silently or by throwing a TypeError (most commonly, but not exclusively, when in
`strict mode`).
* `Object.preventExtensions()` only prevents addition of own properties.
    ```js
    let obj = {
        num: [1, 2],
    };
    Object.preventExtensions(obj);
    obj.num.push(3);
    console.log(obj.num); // [1, 2, 3]
    obj.name = 22; // TypeError: Cannot add property name, object is not extensible
    ```
* 虽然这个操作会阻止对象将`__proto__`属性重新指向另一个对象，但并不会影响对象的原型。
不懂这样的目的是什么
    ```js
    let obj = {
        num: [1, 2],
    };
    Object.preventExtensions(obj);
    obj.num = 3;
    console.log(obj.num); // 3
    obj.constructor.prototype.age = 22;
    console.log(obj.age); // 22
    obj.__proto__ = {}; // TypeError: #<Object> is not extensible
    ```
* In ES5, if the argument to this method is not an object (a primitive), then it
will cause a `TypeError`. In ES2015, a non-object argument will be treated as if
it was a non-extensible ordinary object, simply return it.

### Detect
```js
Object.isExtensible()
```
In ES5, if the argument to this method is not an object (a primitive), then it
will cause a `TypeError`. In ES2015, a non-object argument will be treated as if
it was a non-extensible ordinary object, simply return `false`.
```js
let obj = 'hi';
Object.preventExtensions(obj);
console.log(typeof obj); // string
console.log(Object.isExtensible(obj)); // false
```


## Seal object
### Seal
```js
Object.seal()
```
* Preventing new properties from being added to it and marking all existing
properties as non-configurable.
* Values of present properties can still be changed as long as they are writable
* Attempting to delete or add properties to a sealed object, or to convert a
data property to accessor or vice versa, will fail, either silently or by
throwing a `TypeError` (most commonly, although not exclusively, when in
`strict mode` code).
    ```js
    let arr = [1, 2];
    Object.seal(arr);
    arr[1] = 3;
    console.log(arr); // [1, 3]
    try {
        arr.push(4);
    }
    catch(err){
        console.log(err); // TypeError: Cannot add property 2, object is not extensible
    }
    arr.length = 1; // TypeError: Cannot delete property '1' of [object Array]
    ```
* 同样会阻止一个对象将`__proto__`属性重新指向另一个对象。
* In ES5, if the argument to this method is not an object (a primitive), then it
will cause a `TypeError`. In ES2015, a non-object argument will be treated as if
it was a sealed ordinary object, simply return it.

### Detect
```js
Object.isSealed()
```
In ES5, if the argument to this method is not an object (a primitive), then it
will cause a `TypeError`. In ES2015, a non-object argument will be treated as if
it was a sealed ordinary object, simply return `true`.


## Freeze object
### Freeze
```js
Object.freeze()
```
* Prevents new properties from being added to it
* Prevents existing properties from being removed
* Prevents existing properties, or their enumerability, configurability, or
writability, from being changed
* Prevents the prototype from being changed
* Nothing can be added to or removed from the properties set of a frozen object.
Any attempt to do so will fail, either silently or by throwing a `TypeError`
(most commonly, but not exclusively, when in` strict mode`).
* Accessor properties may still be written to but only if a `[[Set]]` function
has been defined.
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
    obj.name = '22';
    console.log(obj.name); // "22"
    console.log(obj.age); // 22
    obj.age = 33; // TypeError
    ```
* In ES5, if the argument to this method is not an object (a primitive), then it
will cause a `TypeError`. In ES2015, a non-object argument will be treated as if
it were a frozen ordinary object, and be simply returned.

### Deep freeze
1. A frozen object is not constant, because the freeze is shallow.
2. To make an object constant, recursively freeze each property which is of type
object (deep freeze).  
3. Use the pattern on a case-by-case basis based on your design when you know
the object contains no cycles in the reference graph, otherwise an endless loop
will be triggered.  
4. You still run a risk of freezing an object that shouldn't be frozen, such as
`window`.

```js
function deepFreeze(obj) {

    // Retrieve the property names defined on obj
    var propNames = Object.getOwnPropertyNames(obj);

    // Freeze properties before freezing self
    propNames.forEach(function(name) {
        var prop = obj[name];

        // Freeze prop if it is an object
        if (typeof prop === 'object' && prop !== null)
        deepFreeze(prop);
    });

    // Freeze self (no-op if already frozen)
    return Object.freeze(obj);
}
```

### Detect
```js
Object.isFrozen()
```
In ES5, if the argument to this method is not an object (a primitive), then it
will cause a `TypeError`. In ES2015, a non-object argument will be treated as if
it was a frozen ordinary object, simply return `true`.


## References
* [Professional JavaScript for Web Developers](https://book.douban.com/subject/7157249/)
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
