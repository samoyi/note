# Prototype



***
## Prototype
1. Every function has a prototype object.
2. If a function is called as a constructor, instances inherit properties and
methods from constructor's prototype.
3. There are 2 way to reference a prototype object:
    * constructor's `prototype` property
    * instance's `[[Prototype]]` internal slot
4. Prototype's `constructor` proerty points back to the constructor
    ```js
    let obj1 = {},
    	obj2 = {};
    console.log( obj1.constructor.prototype === obj2.constructor.prototype ); // true
    console.log( obj1.constructor === obj2.constructor.prototype.constructor ); // true
    ```
5. `Object.prototype` is one of the rare objects that has no prototype: it does
not inherit any properties.
6. Not all native prototypes are plain object
    ```js
    console.log( Object.prototype.toString.call(Array.prototype));    // [object Array]
    console.log( Object.prototype.toString.call(Function.prototype)); // [object Function]
    console.log( Object.prototype.toString.call(Number.prototype));   // [object Number]
    console.log( Object.prototype.toString.call(Date.prototype));     // [object Object]
    ```



***
##  `[[Prototype]]`
Each time a constructor is called to create a new instance, that instance has
an internal slot called `[[Prototype]]`, which is a pointer to the constructor’s
prototype.

### References `[[Prototype]]` by 2 ways:
* `Object.prototype.__proto__`
* `Object.getPrototypeOf`
```js
let obj = {};
console.log( obj.__proto__ === obj.constructor.prototype); // true
console.log( Object.getPrototypeOf(obj) === obj.constructor.prototype); // true
```

### Check prototye by `[[Prototype]]`
The `isPrototypeOf()` method checks if an object exists in another object's
prototype chain.
```js
let proto = {},
	obj = Object.create(proto);
console.log( proto.isPrototypeOf(obj) ); // true
```

### Change instance's prototype
#### Two ways
* Reassign `__proto__` property
* `Object.setPrototypeOf(instance, prototype)`

#### Performance
* Changing the `[[Prototype]]` of an object is, by the nature of how modern
JavaScript engines optimize property accesses, a very slow operation, in every
browser and JavaScript engine. The effects on performance of altering
inheritance are subtle and far-flung, and are not limited to simply the time
spent in `obj.__proto__ = ...` statement, but may extend to any code that has
access to any object whose `[[Prototype]]` has been altered. If you care about
performance you should avoid setting the `[[Prototype]]` of an object. Instead,
create a new object with the desired `[[Prototype]]` using `Object.create()`.
* 内置构造函数的原型都是不可写、不可枚举、不可配置的



***
## References
* [Specification](https://tc39.github.io/ecma262/)
* [Professional JavaScript for Web Developers](https://book.douban.com/subject/7157249/)
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)