# Singleton

## 基本实现
```js
const Singleton = function( name ){
    this.name = name;
    this.instance = null;
};

Singleton.prototype.getName = function(){
    console.log( this.name );
};

Singleton.getInstance = function( name ){
    if ( !this.instance ){
        this.instance = new Singleton( name );
    }
    return this.instance;
};

var a = Singleton.getInstance( 'sven1' );
var b = Singleton.getInstance( 'sven2' );

console.log( a === b );  // true
a.getName();  // "sven1"
b.getName();  // "sven1"
```


## 透明的单例模式
1. 上面的方法，在创建单例的时候，必须要通过`getInstance`方法而不是`new`，因此必须要知道这个类是单例模式，不能直接`new`。
2. 透明性的实现，就是让用户不需要知道该类是否是单例模式还是普通类，只要按照普通的`new`方法创建实例即可。
3. 也就是说，使用`new`方法调用构造函数，但是每次调用都应该返回同一个实例

```js
let instance;

function Singleton( name ){
    if ( instance ){
        return instance;
    }
    this.name = name;
    return instance = this;
}

Singleton.prototype.getName = function () {
    return this.name;
};



const a = new Singleton( 'sven1' );
const b = new Singleton( 'sven2' );

console.log(a === b);    // true
console.log(a.name);     // "sven1"
console.log(b.name);     // "sven1"
```


## 用代理实现单例模式
1. 上面的逻辑中，构造函数的逻辑和单例管理的逻辑是混合在一起的，统一为一个单例构造函数。
2. 这有些违背单一职责原则，其实可以把这两个逻辑拆解耦，变成一个普通的构造函数和一个单例代理，任何普通的构造函数只要通过单例代理的包装，就可以变成一个单例构造函数。
3. **单一职责原则** 的 **代理模式** 提高了灵活性。

```js
function Singleton( name ){
    this.name = name;
}

Singleton.prototype.getName = function () {
    return this.name;
};


let instance;
function ProxySingleton( name ){
    if ( !instance ){
        instance = new Singleton( name );
    }
    return instance;
}


const a = new ProxySingleton( 'sven1' );
const b = new ProxySingleton( 'sven2' );

console.log(a === b);    // true
console.log(a.name);     // "sven1"
console.log(b.name);     // "sven1"
```


## JavaScript 中的单例模式
1. 因为 JavaScript 自身就可以实现不需要类实例，因此不需要使用构造函数的模式，可以直接创建一个单例实例。例如：
    ```js
    const Singleton = {
        name: '',
        setName(name){
            this.name = name;
        },
        getName(){
            return this.name;
        },
    };

    Singleton.setName('sven1');
    console.log(Singleton.getName()); // "sven1"
    Singleton.setName('sven2');
    console.log(Singleton.getName()); // "sven2"
    ```
2. 如果直接使用全局变量，会造成全局变量污染。可以考虑命名空间、闭包等方式来定义可全局访问但非全局变量的单例实例。


## 惰性单例
1. 惰性单例指的是在需要的时候才创建对象实例。
2. 其实上面的例子中，都不是一开始就创建对象，所以都是惰性单例。

### 通用的惰性单例
上面已经实现了代理单例模式，这里将实现一个通用的具备惰性功能的单例代理，让它可以代理任何普通构造函数并实现相应的代理模式。
```js
// 通用的惰性单例代理
const getSingle = function( fn ){
    let singleton;
    return function(){
        return singleton || ( singleton = fn.apply(this, arguments ) );
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

const CreateKing = getSingle(King);
const CreateQueen = getSingle(Queen);


const King1 = new CreateKing('David');
const King2 = new CreateKing('Charles');
const Queen1 = new CreateQueen('Athena');
const Queen2 = new CreateQueen('Judith');


console.log(King1 === King2);    // true
console.log(Queen1 === Queen2);  // true
King1.sayName();   // "David"
Queen1.sayName();  // "Athena"
```
