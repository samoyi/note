# Prototype

<img src="./images/prototype.png" style="border: 3px solid white;" />


## Prototype
1. Every function has a prototype object.
2. If a function is called as a constructor, instances inherit properties and
methods from constructor's prototype.
3. There are 2 ways to reference a prototype object:
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

### Prototype chain
```js
Object.prototype.say = function(){
    console.log('Object');
};

let obj1 = {
    say1(){
        console.log('obj1');
    },
};
obj1.say(); // Object

let obj2 = Object.create(obj1);
obj2.say2 = function(){
    console.log('obj2');
};
obj2.say(); // Object
obj2.say1(); // obj1

let obj3 = Object.create(obj2);
obj3.say(); // Object
obj3.say1(); // obj1
obj3.say2(); // obj2
```
1. `obj1`直接继承`Object.prototype`
2. `obj2`直接继承`obj1`，间接继承`Object.prototype`
3. `obj3`直接继承`obj2`，间接继承`obj1`，进一步间接继承`Object.prototype`


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

### Check prototype by `[[Prototype]]`
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
* `Object.setPrototypeOf(instance, prototype)`。该方法等同于下面的函数：
    ```js
    function (obj, proto) {
        obj.__proto__ = proto;
        return obj;
    }
    ```

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


## References
* [Specification](https://tc39.github.io/ecma262/)
* [Professional JavaScript for Web Developers](https://book.douban.com/subject/7157249/)
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
