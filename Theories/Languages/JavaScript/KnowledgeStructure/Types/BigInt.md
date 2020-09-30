# BigInt


<!-- TOC -->

- [BigInt](#bigint)
    - [Description](#description)
    - [Type information](#type-information)
    - [Operators](#operators)
    - [Comparisons](#comparisons)
    - [Conditionals](#conditionals)
    - [Static methods](#static-methods)
    - [Instance methods](#instance-methods)
        - [`BigInt.prototype.toLocaleString()`](#bigintprototypetolocalestring)
        - [`BigInt.prototype.toString()`](#bigintprototypetostring)
        - [BigInt.prototype.valueOf()](#bigintprototypevalueof)
    - [Usage recommendations](#usage-recommendations)
        - [Coercion](#coercion)
        - [Cryptography](#cryptography)
        - [Use within JSON](#use-within-json)
    - [References](#references)

<!-- /TOC -->


## Description
1. `BigInt` is a built-in object that provides a way to represent whole numbers larger than $2^53 - 1$, which is the largest number JavaScript can reliably represent with the `Number` primitive and represented by the `Number.MAX_SAFE_INTEGER` constant. 
2. `BigInt` can be used for arbitrarily large integers.
3. A `BigInt` is created by appending `n` to the end of an integer literal — `10n` — or by calling the function `BigInt()`
    ```js
    const theBiggestInt = 9007199254740991n;

    const alsoHuge = BigInt(9007199254740991);
    console.log( alsoHuge ); // 9007199254740991n

    const hugeString = BigInt("9007199254740991");
    console.log( hugeString ); // 9007199254740991n

    const hugeHex = BigInt("0x1fffffffffffff");
    console.log( hugeHex ); // 9007199254740991n

    const hugeBin = BigInt("0b11111111111111111111111111111111111111111111111111111");
    console.log( hugeBin ); // 9007199254740991n
    ```
4. `BigInt` is similar to `Number` in some ways, but also differs in a few key matters:
    * It cannot be used with methods in the built-in `Math` object.
    * It cannot be mixed with instances of `Number` in operations, they must be coerced to the same type
        ```js
        console.log(1n + 1); // TypeError: Cannot mix BigInt and other types, use explicit conversions
        ```
5. Be careful coercing values back and forth, however, as the precision of a `BigInt` may be lost when it is coerced to a `Number`.


## Type information
1. When tested against `typeof`, a `BigInt` will give "bigint":
    ```js
    console.log( typeof 1n === 'bigint' );           // true
    console.log( typeof BigInt('1') === 'bigint' );  // true
    ```
2. When wrapped in an `Object`, a `BigInt` will be considered as a normal "object" type:
    ```js
    console.log( typeof Object(1n) === 'object' ); // true
    ```


## Operators
1. The following operators may be used with `BigInt`s (or object-wrapped `BigInt`s): `+`, `*`, `-`, `**`, `%`
    ```js
    const previousMaxSafe = BigInt(Number.MAX_SAFE_INTEGER);
    console.log(previousMaxSafe); // 9007199254740991n

    const maxPlusOne = previousMaxSafe + 1n;
    console.log(maxPlusOne); // 9007199254740992n
    
    const theFuture = previousMaxSafe + 2n;
    console.log(theFuture); // 9007199254740993n

    const multi = previousMaxSafe * 2n;
    console.log(multi); // 18014398509481982n

    const subtr = multi - 10n;
    console.log(subtr); // 18014398509481972n

    const mod = multi % 10n;
    console.log(mod); // 2n

    const bigN = 2n ** 54n;
    console.log(bigN); // 18014398509481984n

    console.log(bigN * -1n); // –18014398509481984n
    ```
2. The `/` operator also works as expected with whole numbers. However, since these are `BigInt`s and not `BigDecimal`s, this operation will round towards `0` (which is to say, it will not return any fractional digits)
    ```js
    const expected = 4n / 2n;
    console.log(expected); // 2n

    const rounded = 5n / 2n;
    console.log(rounded); // 2n
    ```
3. Bitwise operators are supported as well, except `>>>` (zero-fill right shift) as all `BigInt`s are signed.
4. Also unsupported is the unary operator (`+`), [in order to not break asm.js](https://github.com/tc39/proposal-bigint/blob/master/ADVANCED.md#dont-break-asmjs).


## Comparisons
1. A `BigInt` is not strictly equal to a `Number`, but it is loosely so:
    ```js
    // Strict Equality
    console.log( 0n === 0 ); // false

    // Abstract Equality
    console.log( 0n == 0 ); // true

    // Same-value
    console.log( Object.is(0n, 0) ); // false     

    //  Same-value-zero
    let arr = [0];
    console.log( arr.includes(0n) ); // false     
    ```
2. A `Number` and a `BigInt` may be compared as usual:
    ```js
    console.log(1n < 2); // true

    console.log(2n > 1); // true

    console.log(2 > 2); // false

    console.log(2n > 2); // false

    console.log(2n >= 2); // true
    ```
3. They may be mixed in arrays and sorted:
    ```js
    const mixed = [4n, 6, -12n, 10, 4, 0, 0n];
    console.log(mixed); // [4n, 6, -12n, 10, 4, 0, 0n]

    mixed.sort(); // default sorting behavior
    console.log(mixed); // [ -12n, 0, 0n, 10, 4n, 4, 6 ]

    mixed.sort((a, b) => a - b); // TypeError: can't convert BigInt to number
    // won't work since subtraction will not work with mixed types

    // sort with an appropriate numeric comparator
    mixed.sort((a, b) => (a < b) ? -1 : ((a > b) ? 1 : 0));
    console.log(mixed); // [ -12n, 0, 0n, 4n, 4, 6, 10 ]
    ```
4. Note that comparisons with `Object`-wrapped `BigInt`s act as with other objects, only indicating equality when the same object instance is compared:
    ```js
    console.log( 0n === Object(0n) ); // false
    console.log( Object(0n) === Object(0n) ); // false

    const o = Object(0n) 
    console.log( o === o ); // true
    ```


## Conditionals
A `BigInt` behaves like a `Number` in cases where:
    * it is converted to a `Boolean`: via the `Boolean` function;
    * when used with logical operators `||`, `&&`, and `!`;
    * within a conditional test like an `if` statement.

```js
if ( 0n ) {
  console.log('Hello from the if!') 
} else {
  console.log('Hello from the else!') 
}
// "Hello from the else!"

console.log( 0n || 12n ); // 12n

console.log( 0n && 12n ); // 0n

console.log( Boolean(0n) ); // false

console.log( Boolean(12n) ); // true

console.log( !12n ); // false

console.log( !0n ); // true
```


## Static methods
TODO
* BigInt.asIntN()
* BigInt.asUintN()


## Instance methods
### `BigInt.prototype.toLocaleString()`
Returns a string with a language-sensitive representation of this number
```js
console.log( 1024n.toLocaleString() ); // 1,024
console.log( 1024n.toLocaleString('de-DE') ); // 1.024
```

### `BigInt.prototype.toString()`
Returns a string representing the specified object in the specified radix (base)
```js
console.log( 1024n.toString() ); // 1024
```

### BigInt.prototype.valueOf()
Returns the primitive value of the specified object
```js
console.log( typeof Object(1n) ); // object

console.log( typeof Object(1n).valueOf() ); // bigint
```


## Usage recommendations
### Coercion
Because coercing between `Number` and `BigInt` can lead to loss of precision, it is recommended to only use `BigInt` when values greater than $2^53$ are reasonably expected and not to coerce between the two types.

### Cryptography
The operations supported on `BigInt`s are not constant time. `BigInt` is therefore [unsuitable for use in cryptography](https://www.chosenplaintext.ca/articles/beginners-guide-constant-time-cryptography.html).

### Use within JSON
1. Using `JSON.stringify()` with any `BigInt` value will raise a `TypeError` as `BigInt` values aren't serialized in JSON by default. 
2. However, you can implement your own `toJSON` method if needed:
    ```js
    BigInt.prototype.toJSON = function() { return this.toString()  };
    ```
3. Instead of throwing, `JSON.stringify` now produces a string like this:
    ```js
    console.log( JSON.stringify(BigInt(1)) ); // "1"
    ```


## References
* [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)