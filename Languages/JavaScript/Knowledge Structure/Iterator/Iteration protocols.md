# Iteration protocols

A couple of additions to ECMAScript 2015 aren't new built-ins or syntax, but
protocols. These protocols can be implemented by any object respecting some
conventions.  
There are two protocols: The iterable protocol and the iterator protocol.


## Iterable protocol
1. The iterable protocol allows JavaScript objects to define or customize their iteration behavior, such as what values are looped over in a `for..of` construct
2. Some built-in types are `built-in iterables` with a default iteration behavior, such as `Array` or `Map`, while other types (such as `Object`) are not
3. In order to be `iterable`, an object must implement the `@@iterator` method, meaning that the object (or one of the objects up its prototype chain) must have a property with a `@@iterator` key which is available via constant `Symbol.iterator`.
4. `[Symbol.iterator]`: A zero arguments function that returns an object, conforming to the iterator protocol.
5. Whenever an object needs to be iterated (such as at the beginning of a `for..of` loop), its` @@iterator` method is called with no arguments, and the returned `iterator` is used to obtain the values to be iterated.



***
## Iterator protocol
1. The iterator protocol defines a standard way to produce a sequence of values (either finite or infinite).
2. An object is an `iterator` when it implements a `next()` method with the following semantics:


**If an object has a @@iterator method, which is `[Symbol.iterator]`, it is an `iterable` object. So, when an iteration is applied to this object, an `iterator` will be returned by the @@iterator method, and the `iterator` has a
'next' method**

3. `built-in iterables`: `String`, `Array`, `TypedArray`, `Map` and `Set`



## Reference
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
* [阮一峰](http://es6.ruanyifeng.com/#docs/set-map)
