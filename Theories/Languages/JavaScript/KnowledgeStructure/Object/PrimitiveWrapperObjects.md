# Primitive wrapper objects


## Example first
First, let's intuitively look at the difference between primitive value and
corresponding wrapper object. Run the following code in Chrome:
```js
var strPrimitive = "I am a string";
console.log( typeof strPrimitive );							
console.log( strPrimitive instanceof String );					

var strObject = new String( "I am a string" );
console.log( typeof strObject ); 								
console.log( strObject instanceof String );					

console.log( Object.prototype.toString.call( strPrimitive ) );
console.log( Object.prototype.toString.call( strObject ) );
console.log( strObject );
```
Output:
```
string
false
object
true
[object String]
[object String]
String {0: "I", 1: " ", 2: "a", 3: "m", 4: " ", 5: "a", 6: " ", 7: "s", 8: "t", 9: "r", 10: "i", 11: "n", 12: "g", length: 13, [[PrimitiveValue]]: "I am a string"}
```

1. The primitive value `I am a string` is not an object, it's a primitive
literal and immutable value. To perform operations on it, such as checking its
`length`, accessing its individual character contents, etc, a `String` object is
required.
2. Luckily, the language automatically coerces a `"string"` primitive to a
`String` object when necessary, which means you almost never need to explicitly
create the Object form.
3. It is strongly preferred by the majority of the JS community to use the
literal form for a value, where possible, rather than the constructed object
form.
4. As we can see, when detect the type of a variable with
`Object.prototype.toString.call`, it can not defferentiate a primitive value
from its corresponding wrapper object. Because primitive value must be converted
to its wrapper object before it can call a method.
5. Wrapper object won't become primitive value after calculating with its
primitive value
```js
let n = new Number(22);
console.log(n + 11); // 33
console.log(n); // Number {[[PrimitiveValue]]: 22}
```
6. Browsers long ago performance-optimized the common cases like `.length`,
which means your program will actually go slower if you try to "preoptimize" by
directly using the object form (which isn't on the optimized path). In general,
there's basically no reason to use the object form directly. It's better to just
 let the boxing happen implicitly where necessary.


### Unboxing
```js
let s = new String( "abc" );
let n = new Number( 42 );
let b = new Boolean( true );

console.log( s.valueOf() ); // "abc"
console.log( n.valueOf() ); // 42
console.log( b.valueOf() ); // true

console.log( s + '' ); // "abc"
console.log( +n ); // 42
console.log( !!b ); // true
```


## References
* [《You Don't Know JS: this & Object Prototypes》 Chapter 3: Objects](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch3.md)
