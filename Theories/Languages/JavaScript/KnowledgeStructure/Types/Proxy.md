# Proxy

## 构造函数
### Terminology
* **handler**：Placeholder object which contains traps.
* **traps**：The methods that provide property access. This is analogous to the concept of traps in operating systems.
* **target**：Object which the proxy virtualizes. It is often used as storage backend for the proxy. Invariants (semantics that remain unchanged) regarding object non-extensibility or non-configurable properties are verified against the target.

### Syntax
```js
var p = new Proxy(target, handler);
```

* `target`: A target object to wrap with Proxy. It can be any sort of object, including a native array, a function or even another proxy.
* `handler`: An object whose properties are functions which define the behavior of the proxy when an operation is performed on it.


## 实例方法
### `handler.get()`
```js
let person = {
  name: "张三"
};

let proxy = new Proxy(person, {
  get: function(target, property) {
    if (property in target) {
      return target[property];
    } else {
      throw new ReferenceError("Property \"" + property + "\" does not exist.");
    }
  }
});

console.log(proxy.name); // "张三"
proxy.age // 抛出一个错误
```

#### Parameters
* `target`: The target object.
* `property`: The name or `Symbol` of the property to get.
* `receiver`: Either the proxy or an object that inherits from the proxy. 直接接受请求的对象。可选

#### `this` is bound to the handler
```js
let handler = {
  get: function(target, property, receiver) {
    return this;
  }
};
const proxy = new Proxy({}, handler);

console.log(proxy.foo === handler);
```

#### 可以继承
```js
let proto = new Proxy({}, {
  get(target, propertyKey, receiver) {
    console.log('GET ' + propertyKey);
    return target[propertyKey];
  }
});
let obj = Object.create(proto);
obj.foo // "GET foo"
```

#### `receiver`不继承
一个原型代理的继承实例会继承原型代理的`get`拦截方法，但`receiver`参数仍然是指向实例自身。谁真正的 receive 请求，`receiver`就指向谁
```js
let real_target = {};
let instance = {};
let proxy = new Proxy(real_target, {
  get(target, property, receiver) {
    console.log(proxy === receiver);
    console.log(instance === receiver);
    return target[property];
  }
});

proxy.foo; // true false
instance = Object.create(proxy);
instance.foo; // false true
```

#### 不能`get`拦截的属性
不可写且不可配置的属性不能`get`拦截，更准确的说，拦截了也要放行——必须返回该属性实际的值。这样才符合不可写不可配置的逻辑
```js
const target = Object.defineProperties({}, {
  foo: {
    value: 123,
  },
});
const handler = {
  get(target, propKey) {
    return 'abc';
  }
};

const proxy = new Proxy(target, handler);

console.log(proxy.foo);
// Uncaught TypeError: 'get' on proxy: property 'foo' is a read-only and non-configurable data property on the proxy target but the proxy did not return its actual value (expected '123' but got 'abc')
```
```js
const target = Object.defineProperties({}, {
  foo: {
    value: 123,
  },
});
const handler = {
  get(target, propKey) {
    // 不可写不可配置，所以 foo 必须返回 123
    return 123;
  }
};

const proxy = new Proxy(target, handler); // 123

console.log(proxy.foo);
```
```js
const target = Object.defineProperties({}, {
  foo: {
    value: 123,
  },
  bar: {
    value: 456,
    writable: true,
  }
});
const handler = {
  get(target, propKey) {
    // bar 可写，所以可以迁就 foo，统一返回 foo 的返回值；如果返回 456 则会报错
    return 123;
  }
};

const proxy = new Proxy(target, handler);

console.log(proxy.foo); // 123
console.log(proxy.bar); // 123
```

### `handler.set()`
下面的例子可以看出来代理`set`相比于对象 setter 的优势
```js
const handler = {
  get (target, key) {
    invariant(key, 'get');
    return target[key];
  },
  set (target, key, value) {
    invariant(key, 'set');
    target[key] = value;
    return true;
  }
};
function invariant (key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}
const target = {};
const proxy = new Proxy(target, handler);
proxy._prop
// Error: Invalid attempt to get private "_prop" property
proxy._prop = 'c'
// Error: Invalid attempt to set private "_prop" property
```
1. getter 和 setter 都是属性级别的，只能针对某个属性设置；而 proxy 是对象级别的，可以代理多个属性
2. 更重要的是，getter 和 setter 都是和对象耦合在一起的；而使用 proxy 则是解耦的，一个对象只在需要拦截的时候生成代理实例即可，其他地方仍然可以使用没有拦截的原始对象。

#### Parameters
* `target`: The target object.
* `property`: The name or `Symbol` of the property to set.
* `value`: The new value of the property to set.
* `receiver`: Either the proxy or an object that inherits from the proxy. 可选

#### Return value
1. The `set` method should return a boolean value.
2. Return `true` to indicate that assignment succeeded. If the `set` method returns `false`, and the assignment happened in strict-mode code, a `TypeError` will be thrown.
  ```js
  let handler = {
    set(target, property, value) {}
  };

  let proxy = new Proxy({}, handler);

  proxy.age = 100; // Uncaught TypeError: 'set' on proxy: trap returned falsish for property 'age'
  ```

#### `this` is bound to the handler
```js
let validator = {
  set(obj, prop, value) {
    if (prop === 'age') {
      console.log(this.hasOwnProperty('set')); // true
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }

    // 对于满足条件的 age 属性以及其他属性，直接保存
    obj[prop] = value;

    return true;
  }
};

let person = new Proxy({}, validator);

person.age = 100;
console.log(person.age) // 100
person.age = 'young' // 报错
person.age = 300 // 报错
```

#### `get`方法可以继承，但和`get`情况一样，`receiver`指向真正接受请求的代理
```js
let real_target = {};
let instance = {};
let proxy = new Proxy(real_target, {
  set(target, property, value, receiver) {
    console.log(receiver === proxy);
    console.log(receiver === instance);
    return true;
  }
});

proxy.foo = 1; // true false
instance = Object.create(proxy);
instance.foo = 2; // false true
```

#### 不可写的属性`set`代理了仍然不可写
```js
const obj = {};
Object.defineProperty(obj, 'foo', {
  value: 'bar',
  configurable: true,
});

const handler = {
  set(obj, prop, value, receiver) {
    obj[prop] = 'baz';
    return true;
  }
};

const proxy = new Proxy(obj, handler);
proxy.foo = 'baz'; // Uncaught TypeError: Cannot assign to read only property 'foo' of object '#<Object>'
```


### `handler.apply()`
#### Interceptions
This trap can intercept these operations:
* `proxy(...args)`
* `Function.prototype.apply()` and `Function.prototype.call()`
* `Reflect.apply()`

```js
var twiceHandler = {
  apply (target, ctx, args) {
    return Reflect.apply(...arguments) * 2;
  }
};
function sum (left, right) {
  return left + right;
};
var proxy = new Proxy(sum, twiceHandler);

proxy(1, 2) // 6
proxy.call(null, 5, 6) // 22
proxy.apply(null, [7, 8]) // 30
Reflect.apply(proxy, null, [9, 10]) // 38
```

#### Parameters
The following parameters are passed to the apply method. `this` is bound to the handler.
* `target`: The target object. The `target` must be a callable itself. That is, it must be a function object.
* `thisArg`: The this argument for the call.
* `argumentsList`: The list of arguments for the call.


### `handler.has()`
The `handler.has()` method is a trap for the `in` operator.
```js
var handler = {
  has (target, key) {
    if (key[0] === '_') {
      return false;
    }
    return key in target;
  }
};
var target = { _prop: 'foo', prop: 'foo' };
var proxy = new Proxy(target, handler);
console.log('_prop' in proxy); // false
```

#### Interceptions
This trap can intercept these operations:
* Property query: `foo in proxy`
* Inherited property query: `foo in Object.create(proxy)`
* `with` check: `with(proxy) { (foo); }`
* `Reflect.has()`

##### 对`for...in`不生效
```js
let stu1 = {name: '张三', score: 59};
let stu2 = {name: '李四', score: 99};

let handler = {
  has(target, prop) {
    if (prop === 'score' && target[prop] < 60) {
      return false;
    }
    return prop in target;
  }
}

let oproxy1 = new Proxy(stu1, handler);
let oproxy2 = new Proxy(stu2, handler);

console.log('score' in oproxy1); // false
console.log('score' in oproxy2); // true

for (let a in oproxy1) {
  console.log(oproxy1[a]);
}
// 张三
// 59

for (let b in oproxy2) {
  console.log(oproxy2[b]);
}
// 李四
// 99
```

#### Parameters
* `target`: The target object.
* `prop`: The name or `Symbol` of the property to check for existence.

####  Return value
The `has` method must return a boolean value.

#### Invariants
If the following invariants are violated, the proxy will throw a `TypeError`:
* A property cannot be reported as non-existent, if it exists as a non-configurable own property of the target object.
* A property cannot be reported as non-existent, if it exists as an own property of the target object and the target object is not extensible. 不懂，为什么不可扩展的也不行？
  ```js
  var obj = { a: 10 };
  Object.preventExtensions(obj);
  var p = new Proxy(obj, {
    has: function(target, prop) {
      return false;
    }
  });

  'a' in p; // Uncaught TypeError: 'has' on proxy: trap returned falsish for property 'a' but the proxy target is not extensible
  ```


### `handler.construct()`
The `handler.construct()` method is a trap for the `new` operator.
```js
var p = new Proxy(function() {}, {
  construct: function(target, argumentsList, newTarget) {
    console.log('called: ' + argumentsList.join(', '));
    return { value: argumentsList[0] * 10 };
  }
});

console.log(new p(1).value); // "called: 1"
                             // 10
```

#### Parameters
The following parameters are passed to the `construct` method. `this` is bound to the handler.
* `target`: The target object.
* `argumentsList`: The list of arguments for the constructor.
* `newTarget`: The constructor that was originally called, `p` above.

#### Return value
The `construct` method must return an object.

#### Interceptions
This trap can intercept these operations:
* `new proxy(...args)`
* `Reflect.construct()`

#### Invariants
If the following invariants are violated, the proxy will throw a `TypeError`:
* The result must be an `Object`.


### `handler.deleteProperty()`
The `handler.deleteProperty()` method is a trap for the `delete` operator.
```js
var handler = {
  deleteProperty (target, key) {
    invariant(key, 'delete');
    delete target[key];
    return true;
  }
};
function invariant (key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}

var target = {
  prop1: 'foo',
  _prop2: 'bar',
 };
var proxy = new Proxy(target, handler);
delete proxy.prop1
delete proxy._prop2
// Error: Invalid attempt to delete private "_prop2" property
```

#### Parameters
The following parameters are passed to the `deleteProperty` method. `this` is bound to the handler.
* `target`: The target object.
* `property`: The name or `Symbol` of the property to delete.

#### Return value
The `deleteProperty` method must return a `Boolean` indicating whether or not the property has been successfully deleted.

#### Interceptions
This trap can intercept these operations:
* Property deletion: `delete proxy[foo]` and `delete proxy.foo`
* `Reflect.deleteProperty()`

#### Invariants
If the following invariants are violated, the proxy will throw a `TypeError`:
* A property cannot be deleted, if it exists as a non-configurable own property of the target object.


### `handler.defineProperty()`
The `handler.defineProperty()` method is a trap for `Object.defineProperty()`.
```js
const handler1 = {
  defineProperty(target, key, descriptor) {
    invariant(key, 'define');
    return true;
  }
};

function invariant(key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}

const monster1 = {};
const proxy1 = new Proxy(monster1, handler1);

console.log(proxy1._secret = 'easily scared');
// expected output: Error: Invalid attempt to define private "_secret" property
```

#### Parameters
The following parameters are passed to the `defineProperty` method. `this` is bound to the handler.
* `target`: The target object.
* `property`: The name or `Symbol` of the property whose description is to be retrieved.
* `descriptor`: The descriptor for the property being defined or modified.

#### Return value
The `defineProperty` method must return a `Boolean` indicating whether or not the property has been successfully defined.

#### Interceptions
This trap can intercept these operations:
* `Object.defineProperty()`
* `Reflect.defineProperty()`

#### Invariants
If the following invariants are violated, the proxy will throw a `TypeError`:
* `A property cannot be added, if the target object is not extensible.`
* A property cannot be added as or modified to be non-configurable, if it does not exists as a non-configurable own property of the target object.
* A property may not be non-configurable, if a corresponding configurable property of the target object exists.
* If a property has a corresponding target object property then `Object.defineProperty(target, prop, descriptor)` will not throw an exception.
* In strict mode, a `false` return value from the `defineProperty` handler will throw a `TypeError` exception.


### `handler.getOwnPropertyDescriptor()`
The `handler.getOwnPropertyDescriptor()` method is a trap for `Object.getOwnPropertyDescriptor()`.
```js
const monster1 = {
  eyeCount: 4
};

const handler1 = {
  getOwnPropertyDescriptor(target, prop) {
    console.log(`called: ${prop}`);
    // expected output: "called: eyeCount"

    return { configurable: true, enumerable: true, value: 5 };
  }
};

const proxy1 = new Proxy(monster1, handler1);

console.log(Object.getOwnPropertyDescriptor(proxy1, 'eyeCount').value);
// expected output: 5
```

#### Parameters
The following parameters are passed to the `getOwnPropertyDescriptor` method. `this` is bound to the handler.
* `target`: The target object.
* `property`: The name of the property whose description should be retrieved.

#### Return value
The `getOwnPropertyDescriptor` method must return an object or `undefined`.

#### Interceptions
This trap can intercept these operations:
* `Object.getOwnPropertyDescriptor()`
* `Reflect.getOwnPropertyDescriptor()`

#### Invariants
If the following invariants are violated, the proxy will throw a `TypeError`:
* `getOwnPropertyDescriptor` must return an object or `undefined`.
* A property cannot be reported as non-existent, if it exists as a non-configurable own property of the target object.
* A property cannot be reported as non-existent, if it exists as an own property of the target object and the target object is not extensible.
* A property cannot be reported as existent, if it does not exists as an own property of the target object and the target object is not extensible.
* A property cannot be reported as non-configurable, if it does not exists as an own property of the target object or if it exists as a configurable own property of the target object.
* The result of `Object.getOwnPropertyDescriptor(target)` can be applied to the target object using `Object.defineProperty` and will not throw an exception.


### `handler.getPrototypeOf()`
The `handler.getPrototypeOf()` method is a trap for the `[[GetPrototypeOf]]` internal method.
```js
const monster1 = {
  eyeCount: 4
};

const monsterPrototype = {
  eyeCount : 2
};

const handler = {
  getPrototypeOf(target) {
    return monsterPrototype;
  }
};

const proxy1 = new Proxy(monster1, handler);

console.log(Object.getPrototypeOf(proxy1) === monsterPrototype);
// expected output: true

console.log(Object.getPrototypeOf(proxy1).eyeCount);
// expected output: 2
```

#### Parameters
The following parameters are passed to the `getPrototypeOf` method. `this` is bound to the handler.
* `target`: The target object.

#### Return value
The `getPrototypeOf` method must return an object or `null`.

#### Interceptions
This trap can intercept these operations:
* `Object.getPrototypeOf()`
* `Reflect.getPrototypeOf()`
* `__proto__`
* `Object.prototype.isPrototypeOf()`
* `instanceof`

#### Invariants
If the following invariants are violated, the proxy will throw a `TypeError`:
* `getPrototypeOf` method must return an object or `null`.
* If target is not extensible, `Object.getPrototypeOf(proxy)` method must return the same value as `Object.getPrototypeOf(target)`.


### `handler.isExtensible()`
The `handler.isExtensible()` method is a trap for `Object.isExtensible()`. 只能添加操作，不能改变结果。
```js
const monster1 = {
  canEvolve: true
};

const handler1 = {
  isExtensible(target) {
    return Reflect.isExtensible(target);
  },
  preventExtensions(target) {
    target.canEvolve = false;
    return Reflect.preventExtensions(target);
  }
};

const proxy1 = new Proxy(monster1, handler1);

console.log(Object.isExtensible(proxy1));
// expected output: true

console.log(monster1.canEvolve);
// expected output: true

Object.preventExtensions(proxy1);

console.log(Object.isExtensible(proxy1));
// expected output: false

console.log(monster1.canEvolve);
// expected output: false
```

#### Parameters
The following parameters are passed to the `isExtensible` method. `this` is bound to the handler.
* `target`: The target object.

#### Return value
The `isExtensible` method must return a boolean value.

#### Interceptions
This trap can intercept these operations:
* `Object.isExtensible()`
* `Reflect.isExtensible()`

#### Invariants
If the following invariants are violated, the proxy will throw a `TypeError`:
* `Object.isExtensible(proxy)` must return the same value as `Object.isExtensible(target)`.


### `handler.ownKeys()`
The `handler.ownKeys()` method is a trap for `Reflect.ownKeys()`.
```js
const monster1 = {
  _age: 111,
  [Symbol('secret')]: 'I am scared!',
  eyeCount: 4
}

const handler1 = {
  ownKeys (target) {
    return Reflect.ownKeys(target)
  }
}

const proxy1 = new Proxy(monster1, handler1);

for (let key of Object.keys(proxy1)) {
  console.log(key);
  // expected output: "_age"
  // expected output: "eyeCount"
}
```

#### Parameters
The following parameters are passed to the `ownKeys` method. `this` is bound to the handler.
* `target`: The target object.

#### Return value
The `isExtensible` method must return a boolean value.

#### 可能会被自动过滤的属性
在不同的遍历方法中，以下的三类属性可能会被全部会部分的自动过滤
* 目标对象上不存在的属性
* 属性名为 Symbol 值
* 不可遍历（enumerable）的属性

```js
let target = {
  a: 1,
  b: 2,
  c: 3,
  [Symbol.for('secret')]: '4',
};

Object.defineProperty(target, 'key', {
  enumerable: false,
  configurable: true,
  writable: true,
  value: 'static'
});

let handler = {
  ownKeys(target) {
    return ['a', 'd', Symbol.for('secret'), 'key'];
  }
};

let proxy = new Proxy(target, handler);

console.log(Object.keys(proxy));
// ['a']

console.log(Object.getOwnPropertyNames(proxy));
// ["a", "d", "key"]

for (let key in proxy) {
    console.log(key);
}
// a
````

#### Interceptions
This trap can intercept these operations:
* `Object.getOwnPropertyNames()`
* `Object.getOwnPropertySymbols()`
* `Object.keys()`
* `Reflect.ownKeys()`

#### Invariants
If the following invariants are violated, the proxy will throw a `TypeError`:
* The result of ownKeys must be an array.
* The type of each array element is either a String or a Symbol.
    ```js
    var obj = {};

    var p = new Proxy(obj, {
      ownKeys: function(target) {
        return [123, true, undefined, null, {}, []];
      }
    });

    Object.getOwnPropertyNames(p)
    // Uncaught TypeError: 123 is not a valid property name
    ```
* The result List must contain the keys of all non-configurable own properties of the target object.
    ```js
    var obj = {};
    Object.defineProperty(obj, 'a', {
      configurable: false,
      enumerable: true,
      value: 10 }
    );

    var p = new Proxy(obj, {
      ownKeys: function(target) {
        return ['b'];
      }
    });

    Object.getOwnPropertyNames(p)
    // Uncaught TypeError: 'ownKeys' on proxy: trap result did not include 'a'
    ```
* If the target object is not extensible, then the result List must contain all the keys of the own properties of the target object and no other values.
    ```js
    var obj = {
    a: 1
    };

    Object.preventExtensions(obj);

    var p = new Proxy(obj, {
    ownKeys: function(target) {
      return ['a', 'b'];
    }
    });

    Object.getOwnPropertyNames(p)
    // Uncaught TypeError: 'ownKeys' on proxy: trap returned extra keys but proxy target is non-extensible
    ```


### `handler.preventExtensions()`
The `handler.preventExtensions()` method is a trap for `Object.preventExtensions()`.
```js
const monster1 = {
  canEvolve: true
};

const handler1 = {
  preventExtensions(target) {
    target.canEvolve = false;
    Object.preventExtensions(target);
    return true;
  }
};

const proxy1 = new Proxy(monster1, handler1);

console.log(monster1.canEvolve);
// expected output: true

Object.preventExtensions(proxy1);

console.log(monster1.canEvolve);
// expected output: false
```

#### Parameters
The following parameters are passed to the `preventExtensions` method. `this` is bound to the handler.
* `target`: The target object.

#### Return value
The `preventExtensions` method must return a boolean value.

#### Interceptions
This trap can intercept these operations:
* `Object.preventExtensions()`
* `Reflect.preventExtensions()`

#### Invariants
If the following invariants are violated, the proxy will throw a `TypeError`:
* `Object.preventExtensions(proxy)` only returns `true` if `Object.isExtensible(proxy)` is false.
    ```js
    var proxy = new Proxy({}, {
      preventExtensions: function(target) {
        return true;
      }
    });

    Object.preventExtensions(proxy)
    // Uncaught TypeError: 'preventExtensions' on proxy: trap returned truish but the proxy target is extensible
    ```
    为了防止出现这个问题，通常要在`handler.preventExtensions`方法里面，调用一次`Object.preventExtensions`。



### `handler.setPrototypeOf()`
The `handler.setPrototypeOf()` method is a trap for `Object.setPrototypeOf()`.
```js
const handler1 = {
  setPrototypeOf(monster1, monsterProto) {
    monster1.geneticallyModified = true;
    return false;
  }
};

const monsterProto = {};
const monster1 = {
  geneticallyModified : false
};

const proxy1 = new Proxy(monster1, handler1);
// Object.setPrototypeOf(proxy1, monsterProto); // throws a TypeError

console.log(Reflect.setPrototypeOf(proxy1, monsterProto));
// expected output: false

console.log(monster1.geneticallyModified);
// expected output: true
```

#### Parameters
The following parameters are passed to the `setPrototypeOf` method. `this` is bound to the handler.
* `target`: The target object.
* `prototype`: The object's new prototype or `null`.

#### Return value
The `setPrototypeOf` method returns `true` if the `[[Prototype]]` was successfully changed, otherwise `false`.

#### Interceptions
This trap can intercept these operations:
* `Object.setPrototypeOf()`
* `Reflect.setPrototypeOf()`

#### Invariants
If the following invariants are violated, the proxy will throw a `TypeError`:
* If `target` is not extensible, the `prototype` parameter must be the same value as `Object.getPrototypeOf(target)`.


## Methods
The `Proxy.revocable()` method is used to create a revocable `Proxy` object.
```js
let target = {};
let handler = {};

let {proxy, revoke} = Proxy.revocable(target, handler);

proxy.foo = 123;
proxy.foo // 123

revoke();
proxy.foo // TypeError: Revoked
```
`Proxy.revocable`的一个使用场景是，目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。

### Parameters
`target`: A target object to wrap with `Proxy`.
`handler`: An object whose properties are functions which define the behavior of the proxy when an operation is performed on it.

### Return value
A newly created revocable `Proxy` object is returned.

### Revocable `Proxy` object
1. A revocable `Proxy` is an object with following two properties `{proxy: proxy, revoke: revoke}`.
    * `proxy`: A `Proxy` object created with `new Proxy(target, handler)` call.
    * `revoke`: A function with no argument to invalidate (switch off) the `proxy`.
2. If the `revoke()` function gets called, the proxy becomes unusable: Any trap to a handler will throw a `TypeError`.
3. Once a proxy is revoked, it will remain revoked and can be garbage collected. Calling `revoke()` again has no effect.


## References
* [《ECMAScript 6 入门》](http://es6.ruanyifeng.com/#docs/proxy)
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
