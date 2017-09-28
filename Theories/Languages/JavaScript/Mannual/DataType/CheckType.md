# Check data type



***
## Common methods
### `typeof`
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)
* [Spec](https://tc39.github.io/ecma262/#sec-typeof-operator)
```js
console.log( typeof null ); // object
console.log( typeof NaN ); // number
console.log( typeof undefined ); // undefined
```

### `Object.prototype.toString.call`
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)
* [Spec](https://tc39.github.io/ecma262/#sec-object.prototype.tostring)
* According to the Spec, this function will convert `this` to a value of type
`Object`. Thus, this method can not differentiate primitive value from its
corresponding wrapper object.
    ```js
    let str = 'hello',
        obj = new String('hello');
    console.log( typeof str ); // string
    console.log( typeof obj ); // object
    console.log( Object.prototype.toString.call(str) ); // [object String]
    console.log( Object.prototype.toString.call(obj) ); // [object String]
    ```

### `instanceof`
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof)
* [Spec](https://tc39.github.io/ecma262/#sec-instanceofoperator)
* An instance is a concept about prototype, but not that about constructor. So
 `v instanceof Obj` here, it detects whether `v` is a instance of
 `Obj.prototype`, that is, if `Obj.prototype` is present in `v`'s prototype
 chain. It dosen't matter whether `v` is created by `new Obj()`
    ```js
    function Obj(){}
    let v = new Obj();
    console.log( v instanceof Obj ); // true
    console.log( v instanceof Object ); // true
    Obj.prototype = {};
    console.log( v instanceof Object ); // true
    console.log( v instanceof Obj ); // false
    ```



***
## Detect Array
### `Array.isArray`



***
## Detect NaN
### `Number.isNaN()`


## References
* [Spec](https://www.ecma-international.org/ecma-262/5.1/)
