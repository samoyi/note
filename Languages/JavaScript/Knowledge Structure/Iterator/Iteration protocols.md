# Iteration protocols

A couple of additions to ECMAScript 2015 aren't new built-ins or syntax, but
protocols. These protocols can be implemented by any object respecting some
conventions.  
There are two protocols: The iterable protocol and the iterator protocol.


## Iterable protocol
1. The iterable protocol allows JavaScript objects to define or customize their
iteration behavior, such as what values are looped over in a `for..of` construct
2. Some built-in types are `built-in iterables` with a default iteration
behavior, such as `Array` or `Map`, while other types (such as `Object`) are not
3. In order to be `iterable`, an object must implement the `@@iterator` method,
meaning that the object (or one of the objects up its prototype chain) must have
a property with a `@@iterator` key which is available via constant
`Symbol.iterator`.
4. `[Symbol.iterator]`: A zero arguments function that returns an object,
 conforming to the iterator protocol.
5. Whenever an object needs to be iterated (such as at the beginning of a
    `for..of` loop), its` @@iterator` method is called with no arguments, and
    the returned `iterator` is used to obtain the values to be iterated.
6. built-in iterables: `String`, `Array`, `TypedArray`, `Map` and `Set`
```js
var str = 'hi';
console.log( str[Symbol.iterator]); // ƒ [Symbol.iterator]() { [native code] }
console.log( str[Symbol.iterator]()); // StringIterator {}
```


***
## Iterator protocol
1. The iterator protocol defines a standard way to produce a sequence of values
(either finite or infinite).
2. An object is an `iterator` when it implements a `next()` method with the
following semantics:
    1. A zero arguments function that returns an object with two properties:
    `done` and `value`:
        * `value`: any JavaScript value returned by the iterator. Can be omitted
        when `done` is `true`.
        * `done`: Has the value `true` if the iterator is past the end of the
        iterated sequence. Has the value false if the iterator was able to
        produce the next value in the sequence.
    2. The `next` method always has to return an object with appropriate
    properties including `done` and `value`. If a non-object value gets returned
    , a `TypeError` will be thrown.
    ```js
    var str = 'hi';
    var iterator = str[Symbol.iterator]();
    console.log( iterator.next() ); // {value: "h", done: false}
    console.log( iterator.next() ); // {value: "i", done: false}
    console.log( iterator.next() ); // {value: undefined, done: true}
    ```


*If an object has a `@@iterator` method, whose key is `Symbol.iterator`, it will
be an `iterable` object. So, when an iteration is applied to this object, an
`iterator` will be returned by the `@@iterator` method, and this `iterator` has
a 'next' method*



***
## Built-in iteration constructs
Some built-in constructs, such as the spread operator, use the same iteration
protocol under the hood. 下面通过给一个字符串实例添加`@@iterator`方法使其覆盖原型中的
相应方法来改变该字符串对象的迭代规则
```js
var someString = new String('hi');
// var someString = 'hi'; // tye using primitive value, see what happens

console.log( [...someString] ); // ["h", "i"]

someString[Symbol.iterator] = function() {
	return {
		next: function() {
			if (this._first) {
				this._first = false;
				return { value: 'bye', done: false };
			}
			else {
				return { done: true };
			}
		},
		_first: true
	};
};

console.log( [...someString] ); // ["bye"]
console.log( someString+'' );   // hi
```

## Reference
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
* [Draft ECMA-262](https://tc39.github.io/ecma262/#sec-iteration)
* [阮一峰](http://es6.ruanyifeng.com/#docs/iterator)
