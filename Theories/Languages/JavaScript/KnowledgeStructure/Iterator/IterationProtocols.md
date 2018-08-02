# Iteration protocols

1. A couple of additions to ECMAScript 2015 aren't new built-ins or syntax, but
protocols. These protocols can be implemented by any object respecting some
conventions.  
2. There are two protocols: The iterable protocol and the iterator protocol.
3. If an object has a `@@iterator` method, whose key is `Symbol.iterator`, this
object will be an `iterable` object. So, when an iteration is applied to this
object, an `iterator` will be returned by the `@@iterator` method, and this
`iterator` has a `next` method


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
`for..of` loop), its` @@iterator` method is called with no arguments, and the
returned `iterator` is used to obtain the values to be iterated.
6. built-in iterables: `String`, `Array`, `TypedArray`, `Map` and `Set`
```js
var str = 'hi';
console.log( str[Symbol.iterator]); // ƒ [Symbol.iterator]() { [native code] }
console.log( str[Symbol.iterator]()); // StringIterator {}  调用该方法会返回遍历器
```

简单来说，如果一个对象要实现可遍历协议，这个对象就要有一个可以通过`Symbol.iterator`访
问的方法，该方法会返回一个遍历器。


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
        iterated sequence. Has the value `false` if the iterator was able to
        produce the next value in the sequence. 注意参考下面的例子，`true`不是遍历
        的最后一项，而是已经超出超出范围的那一项。
    2. The `next` method always has to return an object with appropriate
    properties including `done` and `value`. If a non-object value gets returned
    , a `TypeError` will be thrown.
    3. If `next()` never returns a object with a `done` which has value `true`,
        the iteration will never stop.

```js
var str = 'hi';
var iterator = str[Symbol.iterator]();
console.log( iterator.next() ); // {value: "h", done: false}
console.log( iterator.next() ); // {value: "i", done: false}
console.log( iterator.next() ); // {value: undefined, done: true}
```

简单来说，如果一个可遍历对象通过`Symbol.iterator`返回的对象要符合遍历器协议，这个对象
必须要有一个符合上述要求的`next`方法。


## 实现可遍历对象
当一个对象实现了 Iterable protocol，并且其遍历器实现了 Iterator protocol，那个该对象
就可以使用`for...of`遍历，也可以使用其他会默认调用遍历接口的方法
```js
let obj = {
    name: '33',
    age: 22,
};

try {
    // 不能使用 for...of
    for (let val of obj){}
}
catch(err){
    console.log(err); // TypeError: obj is not iterable
}
try {
    // 不能使用扩展运算符和解构赋值
    console.log([...obj]);
}
catch(err){
    console.log(err); // TypeError: obj is not iterable
}


// 实现遍历
const aPair = [];
for (let key in obj){
    aPair.push([key, obj[key]]);
}

obj[Symbol.iterator] = function(){
    return {
        length: aPair.length,
        index: 0,
        next(){
            let result = {
                value: aPair[this.index] && aPair[this.index][1],
                done: this.index !== this.length ? false : true,
            };
            this.index++;
            return result;
        },
    };
};

for (let val of obj){
    console.log(val);
}
// "33"
// 22

console.log([...obj]); // ["33", 22]
```


## 可选的`return()`和`throw()`方法


## Reference
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
* [Draft ECMA-262](https://tc39.github.io/ecma262/#sec-iteration)
* [阮一峰](http://es6.ruanyifeng.com/#docs/iterator)
* [You Don't Know JS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch3.md)
