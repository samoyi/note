# Undefined and Null


***
## Undefined
* The `undefined` value represents a deeper kind of absence.
* A variable containing the value of `undefined` is different from a variable
that hasn’t been defined at all.：
    ```js
    let message;
    console.log(message);  // undefined
    console.log(age);      // ReferenceError
    ```
3. The `typeof` operator returns `undefined` when called on an uninitialized
variable, but it also returns `undefined` when called on an undeclared variable.
```js
let message;
console.log(typeof message);  // undefined
console.log(typeof age);      // undefined    
```
Even though uninitialized variables are automatically assigned a value of
`undefined`, it is advisable to always initialize variables. That way, when
`typeof` returns `undefined`, you'll know that it's because a given variable
hasn’t been declared rather than was simply not initialized.

### `void`
The `void` operator lets you create the `undefined` value from any other value.
`void` expression always returns `undefined`
```js
function foo(){ return 333; }
console.log( void alert );       // undefined
console.log( void undefined );   // undefined
console.log( void null );        // undefined
console.log( void true );        // undefined
console.log( void foo() );       // undefined
```



***
## Null
* Logically, a `null` value is an empty object pointer, which is why `typeof`
returns `object` when it’s passed a `null` value
* The value `undefined` is a derivative of null, so ECMA-262 defines them to be
superficially equal
```js
console.log(null == undefined);  // true
```
* You might consider `undefined` to represent a system-level, unexpected, or
error-like absence of value and `null` to represent program-level, normal, or
expected absence of value. If you need to assign one of these values to a
variable or property or pass one of these values to a function, `null` is almost
 always the right choice. This helps to keep the paradigm of `null` as an empty
object pointer and further differentiates it from `undefined`.


***
## Difference
```js
{
    let undefined = 22;
    console.log(undefined); // 22
}
undefined = 22; // TypeError: Cannot assign to read only property 'undefined' of object '#<Window>'
```
```js
{
    let null = 22; // SyntaxError: Unexpected strict mode reserved word
}
```
