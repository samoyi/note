# Check data type
* Converting a value from one type to another is often called "type casting,"
when done explicitly, and "coercion" when done implicitly.


***
## Common checks
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
## Check for Number
### isNumber
```js
function isNumber(v){
    return (typeof v === 'number') && !Number.isNaN(v);
}
```

### isNumericString
```js
function isNumericString(v){
    // !!(v.trim()): exclude '' and '   '.
    // Number(v) == v: binary, octal, hexadecimal and exponential could be
    //                 converted correctly.
    // Number.parseFloat(v) == v   can exclude '' and '   ', but can not covert  
    //                             binary, octal, hexadecimal and exponential
    //                             string correctly.
    return (typeof v === 'string') && !!(v.trim()) && (Number(v) == v);
}
```

### isNumeric
Number or numeric string
* Cover ±Infinite
```js
function isNumeric(v){
    return isNumber(v) || isNumericString(v);
}
```

* Exclude ±Infinite
```js
// From jquery 3.2.1
function isNumeric(n) {
    const type = typeof n;
    return ( type === "number" || type === "string" ) &&
        !isNaN( n - Number.parseFloat( n ) );
}
```

* test code
```js
// http://run.plnkr.co/plunks/93FPpacuIcXqqKMecLdk/
console.log( 'isNumeric("-10")', isNumeric("-10") );
console.log( 'isNumeric("0")', isNumeric("0") );
console.log( 'isNumeric("5")', isNumeric("5") );
console.log( 'isNumeric(-16)', isNumeric(-16) );
console.log( 'isNumeric(0)', isNumeric(0) );
console.log( 'isNumeric(32)', isNumeric(32) );
console.log( 'isNumeric("040")', isNumeric("040") );
console.log( 'isNumeric("0o144")', isNumeric("0o144") );
console.log( 'isNumeric(0o144)', isNumeric(0o144) );
console.log( 'isNumeric("0xFF")', isNumeric("0xFF") );
console.log( 'isNumeric(0xFFF)', isNumeric(0xFFF) );
console.log( 'isNumeric("-1.6")', isNumeric("-1.6") );
console.log( 'isNumeric("4.536")', isNumeric("4.536") );
console.log( 'isNumeric(-2.6)', isNumeric(-2.6) );
console.log( 'isNumeric(3.1415)', isNumeric(3.1415) );
console.log( 'isNumeric(8e5)', isNumeric(8e5) );
console.log( 'isNumeric("123e-2")', isNumeric("123e-2") );
console.log( 'isNumeric("")', isNumeric("") );
console.log( 'isNumeric("        ")', isNumeric("        ") );
console.log( 'isNumeric("\t\t")', isNumeric("\t\t") );
console.log( 'isNumeric("abcdefghijklm1234567890")', isNumeric("abcdefghijklm1234567890") );
console.log( 'isNumeric("xabcdefx")', isNumeric("xabcdefx") );
console.log( 'isNumeric(true)', isNumeric(true) );
console.log( 'isNumeric(false)', isNumeric(false) );
console.log( 'isNumeric("bcfed5.2")', isNumeric("bcfed5.2") );
console.log( 'isNumeric("7.2acdgs")', isNumeric("7.2acdgs") );
console.log( 'isNumeric(undefined)', isNumeric(undefined) );
console.log( 'isNumeric(null)', isNumeric(null) );
console.log( 'isNumeric(NaN)', isNumeric(NaN) );
console.log( 'isNumeric(new Date(2009, 1, 1))', isNumeric(new Date(2009, 1, 1)) );
console.log( 'isNumeric(new Object())', isNumeric(new Object()) );
console.log( 'isNumeric(function() {})', isNumeric(function() {}) );
console.log( 'isNumeric(Infinity)', isNumeric(Infinity) );
console.log( 'isNumeric(Number.POSITIVE_INFINITY)', isNumeric(Number.POSITIVE_INFINITY) );
console.log( 'isNumeric(Number.NEGATIVE_INFINITY)', isNumeric(Number.NEGATIVE_INFINITY) );
```

### `Number.isInteger()` & `Number.isSafeInteger()`
* [Spec: Number.isInteger()](https://tc39.github.io/ecma262/#sec-number.isinteger)
* [Spec: Number.isSafeInteger()](https://tc39.github.io/ecma262/#sec-number.issafeinteger)
* [MDN: Number.isSafeInteger()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger)

### `Number.isFinite()` & `isFinite()`    
* [Spec: Number.isFinite](https://tc39.github.io/ecma262/#sec-number.isfinite)  
* [Spec: isFinite()](https://tc39.github.io/ecma262/#sec-isfinite-number)

### `Number.isNaN()` & `isNaN ( number )`
* [Spec: Number.isNaN()](https://tc39.github.io/ecma262/#sec-number.isnan)
* [Spec: isNaN ( number )](https://tc39.github.io/ecma262/#sec-isnan-number)

https://stackoverflow.com/questions/9716468/is-there-any-function-like-isnumeric-in-javascript-to-validate-numbers



***
## Check for Array
### `Array.isArray`



***
## References
* [Spec](https://www.ecma-international.org/ecma-262/5.1/)
