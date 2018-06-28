# ES6 Inheritance




## 子类new.target会返回子类
```js
class Rectangle {
    constructor() {
        console.log(new.target);
    }
}

class Square extends Rectangle {}

new Rectangle();
// class Rectangle {
//     constructor() {
//         console.log(new.target);
//     }
// }

new Square();
// class Square extends Rectangle {}
```
利用这个特点，可以写出不能独立使用、必须继承后才能使用的类：
```js
class Shape {
    constructor() {
        if (new.target === Shape) {
            throw new Error('本类不能实例化');
        }
        console.log('实例化');
    }
}

class Rectangle extends Shape {
    constructor(length, width) {
        super();
    }
}

let y = new Rectangle(3, 4); // "实例化"
let x = new Shape();  // Error: 本类不能实例化
```
