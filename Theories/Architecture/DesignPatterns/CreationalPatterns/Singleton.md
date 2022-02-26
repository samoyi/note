# Singleton

单例模式是一种创建型设计模式，让你能够保证一个类只有一个实例，并提供一个访问该实例的全局节点。

<!-- TOC -->

- [Singleton](#singleton)
    - [思想](#思想)
        - [对使用者透明](#对使用者透明)
        - [特殊情况使用代理——SRP](#特殊情况使用代理srp)
        - [通用代理](#通用代理)
    - [适用场景](#适用场景)
    - [基本实现](#基本实现)
    - [透明的单例模式](#透明的单例模式)
        - [如果很明确的只作为单例，就不要用 `new`](#如果很明确的只作为单例就不要用-new)
    - [用代理实现单例模式](#用代理实现单例模式)
    - [JavaScript 中的单例模式](#javascript-中的单例模式)
        - [直接使用对象实例](#直接使用对象实例)
        - [使用类](#使用类)
        - [使用静态方法](#使用静态方法)
    - [惰性单例](#惰性单例)
        - [通用的惰性单例代理](#通用的惰性单例代理)
    - [与其他模式的关系](#与其他模式的关系)
    - [References](#references)

<!-- /TOC -->



## 思想
### 对使用者透明
1. 如果想对一个类实现单例化，那么之前以非单例模式使用该类的使用者，不应该受到影响。
2. 使用非单例的使用者对本次修改没有感知，本次修改对旧的使用者保持透明。
3. 不过如果一个对象就是很明确的只作为单例，比如 Vuex 的 store，那就不需要这样。

### 特殊情况使用代理——SRP
1. 单例模式相比于普通的类，算是一种特殊情况。
2. 为了兼容一个特殊情况，我们不应该直接改造普通情况的逻辑，而是应该使用代理之类的方式，让处理特殊情况的逻辑更加独立，让整体更加灵活。

### 通用代理
如果一个特殊的代理模式可能出现在好几个地方，那么就可以考虑设计通用的代理。


## 适用场景
唯一的数据源，统一的状态管理，统一进行行为管理，统筹规划。就像 Vuex 的设计。


## 基本实现
1. ES5 实现
    ```js
    const Singleton = function( name ){
        this.name = name;
        // this.instance = null; // 不需要这个
    };

    Singleton.prototype.getName = function(){
        return this.name;
    };

    Singleton.getInstance = function( name ){
        // this 指向 Singleton 对象
        if (!this.instance){ 
            this.instance = new Singleton( name ); // 创建的实例（单例）保存为 Singleton 的属性，也就是静态属性
        }
        return this.instance;
    };

    let a = Singleton.getInstance( 'sven1' );
    let b = Singleton.getInstance( 'sven2' );

    console.log( a === b );   // true
    console.log(a.getName()); // "sven1"
    console.log(b.getName()); // "sven1"
    ```
2. `name` 保存为实例属性，`getName` 是原型方法，`getInstance` 是静态方法。
3. 调用静态方法，内部的 `this` 指向 `Singleton` 对象，而非实例。
4. `new Singleton( name )` 创建实例，并把实例保存为 `Singleton` 对象的静态属性，并返回该实例。
5. 使用 ES6 来实现
    ```js
    class Singleton {
        constructor (name) {
            this.name = name;
        }

        static getInstance(name) {
            // 这里的 this 是类而非实例
            if (this.instance) {
                return this.instance;
            }
            else {
                return this.instance = new this(name);
            }
        }

        getName () {
            return this.name;
        }
    }
    ```


## 透明的单例模式
1. 上面的方法，在创建单例的时候，必须要通过 `getInstance` 方法而不是 `new`，因此使用者必须要知道这个类是单例模式，不能直接 `new`。
2. 透明性的实现，就是让用户不需要知道该类是否是单例模式还是普通类，只要按照普通的 `new` 方法创建实例即可。
3. 也就是说，使用 `new` 方法调用构造函数，但是每次调用都应该返回同一个实例
    ```js
    // User.js

    let singletonUser;

    function User( name ){
        if ( singletonUser ){
            return singletonUser;
        }
        this.name = name;
        return singletonUser = this;
    }

    User.prototype.getName = function () {
        return this.name;
    };

    export {User};
    ```

    ```js
    // main.js

    import {User} from 'User.js'

    const a = new User( 'sven1' );
    const b = new User( 'sven2' );

    console.log(a === b);    // true
    console.log(a.name);     // "sven1"
    console.log(b.name);     // "sven1"
    ```

### 如果很明确的只作为单例，就不要用 `new`
1. 不过如果一个东西很明确的就 **只是** 单例的，那就不应该封装为 `new` 调用的方式。
2. 这种情况下使用 `new` 反而会引起误会，因为很显然 `new` 的语义就是创建一个新的。
3. 比如 Vuex 的 store，你用它你就很明确的知道它就是单例，所以此时就是提供了一个全局的属性 `$store`。


## 用代理实现单例模式
1. 上面的逻辑中，构造函数的逻辑和单例管理的逻辑是混合在一起的，统一为一个单例构造函数。
2. 这有些违背单一职责原则，`User.js` 实际上做了两件事：定义一个 `User` 类，把这个类改造为单例模式。
3. 其实可以把这两个逻辑解耦，变成一个普通的构造函数和一个单例代理。需要使用单例 User 的时候就加上代理，不需要就还可以继续使用原有的普通 `User` 类。
4. **单一职责原则** 的 **代理模式** 提高了灵活性。

```js
// User.js

function User( name ){
    this.name = name;
}

User.prototype.getName = function () {
    return this.name;
};
```

```js
// SingletonUser.js

import {User} from 'User.js'

let instance;
function SingletonUser( name ){
    if ( !instance ){
        instance = new User( name );
    }
    return instance;
}

import {SingletonUser};
```

```js
// main.js

import {SingletonUser} from 'SingletonUser.js'
import {User} from 'User.js'

const a = new SingletonUser( 'sven1' );
const b = new SingletonUser( 'sven2' );
const c = new User( 'sven3' );
const d = new User( 'sven4' );

console.log(a === b);    // true
console.log(a.name);     // "sven1"
console.log(b.name);     // "sven1"
console.log(c === d);    // false
console.log(c.name);     // "sven3"
console.log(d.name);     // "sven4"
```


## JavaScript 中的单例模式
### 直接使用对象实例
因为 JavaScript 自身就可以实现不需要类的实例，因此不需要使用构造函数的模式，可以直接创建一个单例实例
```js
// Singleton.js
export const Singleton = {
    name: '',
    setName(name){
        this.name = name;
    },
    getName(){
        return this.name;
    },
};
```

```js
// main.js
import {Singleton} from 'Singleton'

Singleton.setName('sven1');
console.log(Singleton.getName()); // "sven1"
Singleton.setName('sven2');
console.log(Singleton.getName()); // "sven2"
```

### 使用类
可以使用 `new` 操作符
```js
// Singleton.js
let instance = null;

export class Singleton {
    constructor (name)　{
        if (instance) {
            instance.name = name;
            return instance;
        }
        else {
            this.name = name;
            instance = this;
            return instance;
        }
    }
}
```

```js
// main.js

import {Singleton} from 'Singleton'
let user1 = new Singleton('22');
console.log(user1.name);      // 22
let user2 = new Singleton('33');
console.log(user2.name);      // 33
console.log(user1.name);      // 33
console.log(user1 === user2); // true
```

### 使用静态方法
相比于可以使用 `new` 操作符这种语义不太明确的方法，使用构造函数的静态方法更有单例的感觉
```js
// Singleton.js

let instance = null;

export class Singleton {
    constructor (name)　{
        if (instance) {
            return instance;
        }
        else {
            this.name = name;
            instance = this
            return instance;
        }
    }

    static getSingleton (name) {
        if (instance) {
            instance.name = name;
            return instance;
        }
        else {
            return new Singleton(name);
        }
    }
}
```
```js
// main.js

import {Singleton} from 'Singleton'
let user1 = Singleton.getSingleton('22');
console.log(user1.name);      // 22
let user2 = Singleton.getSingleton('33');
console.log(user2.name);      // 33
console.log(user1.name);      // 33
console.log(user1 === user2); // true
```


## 惰性单例
1. 惰性单例指的是在需要的时候才创建对象实例。
2. 其实上面的例子中，都不是一开始就创建对象，所以都是惰性单例。

### 通用的惰性单例代理
上面已经实现了代理单例模式，这里将实现一个通用的具备惰性功能的单例代理，让它可以代理任何普通构造函数并实现相应的代理模式。
```js
// 通用的惰性单例代理
const getSingleton = function ( fn ) {
    let singleton = null;
    return function (...args) {
        return singleton || (singleton = fn.apply(this, args));
    }
};


function King( name ){
    return {
        name,
        sayName(){
            console.log(this.name);
        },
    };
}
function Queen( name ){
    return {
        name,
        sayName(){
            console.log(this.name);
        },
    };
}

const SingletonKing  = getSingleton(King);
const SingletonQueen = getSingleton(Queen);


const King1  = new SingletonKing('David');
const King2  = new SingletonKing('Charles');
const Queen1 = new SingletonQueen('Athena');
const Queen2 = new SingletonQueen('Judith');


King1.sayName();   // "David"
Queen1.sayName();  // "Athena"
King2.sayName();   // "David"
Queen2.sayName();  // "Athena"
console.log(King1 === King2);    // true
console.log(Queen1 === Queen2);  // true
```


## 与其他模式的关系


## References
* [JavaScript设计模式与开发实践](https://book.douban.com/subject/26382780/)
* [Head First 设计模式（中文版）](https://book.douban.com/subject/2243615/)
* [Refactoring.Guru](https://refactoringguru.cn/design-patterns/singleton)
* [《设计模式》](https://book.douban.com/subject/1052241/)