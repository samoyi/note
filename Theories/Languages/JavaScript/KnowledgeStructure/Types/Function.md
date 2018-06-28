# unction

## ``
ES6 为`new`命令引入了一个`new.target`属性，该属性一般用在构造函数之中，返回`new`命令
作用于的那个构造函数。如果构造函数不是通过`new`命令调用的，`new.target`会返回
`undefined`：
```js
function Foo(){
    console.log(new.target);
}

new Foo();
// ƒ Foo(){
//     console.log(new.target);
// }

Foo();
// undefined
```
这个属性可以用来确定构造函数是怎么调用的：
```js
function Person(name) {
    if (new.target === Person) {
        this.name = name;
    } else {
        throw new Error('必须使用 new 命令生成实例');
    }
}

Person('33');  // Error: 必须使用 new 命令生成实例
```
