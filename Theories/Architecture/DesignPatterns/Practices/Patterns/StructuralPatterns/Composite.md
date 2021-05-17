# Composite



<!-- TOC -->

- [Composite](#composite)
    - [适用场景](#适用场景)
    - [要点](#要点)
    - [使用场景](#使用场景)
        - [实现 [Refactoring.Guru](https://refactoring.guru/design-patterns/composite) 中计算订单总价的例子](#实现-refactoringguruhttpsrefactoringgurudesign-patternscomposite-中计算订单总价的例子)
        - [一个练习](#一个练习)
    - [References](#references)

<!-- /TOC -->


## 适用场景


## 要点


## 使用场景
当有很多个方法可能存在多种灵活变化的组合宏命令时，尤其是多种顺序多种层次，可以用该模式很方便的任意组合

### 实现 [Refactoring.Guru](https://refactoring.guru/design-patterns/composite) 中计算订单总价的例子
```js
/******************** 定义类 ********************/

// 基类 定义箱子和商品的公共接口 calcPrice
class BaseProduct {
    calcPrice () {
        throw new Error('子类必须重写 calcPrice');
    }
}

// 箱子类
class BoxProduct extends BaseProduct {
    constructor () {
        super();
        this.contents = [];
    }

    add (content) {
        this.contents.push(content);
        return this;
    }

    calcPrice (cb) {
        this.contents.forEach((item) => {
            item.calcPrice(cb);
        });
    }
}

// 商品类
class Product extends BaseProduct {
    constructor (name, price) {
        super();
        this.name = name;
        this.price = price;
    }

    calcPrice (cb) {
        cb(this.price);
    }
}


/******************** 组装订单 ********************/

let box1 = new BoxProduct();
box1.add( new Product('hammer', 20) );

let box21 = new BoxProduct();
box21.add(new Product('phone', 2000)).add(new Product('headphones', 100));

let box22 = new BoxProduct();
box22.add( new Product('charger', 20) );

let box2 = new BoxProduct();
box2.add(box21).add(box22);

let orderBox = new BoxProduct();
orderBox.add(box1).add(box2);


/******************** 计算总价 ********************/

let total = 0;
function getOrderTotal (price) {
    total += price;
}

orderBox.calcPrice(getOrderTotal);
console.log(total); // 2140
```

### 一个练习
作为练习写了一个类似于 AST 的小东西，可以创建一个节点树并遍历所有的文本内容
```js
// 基类
// 有子节点的节点和没有子节点的节点都会继承这个类
class BaseNode {
    constructor () {}

    // 两种类型的节点统一实现的接口，遍历所有的文本内容
    showText () {
        throw new Error('子类必须重写 showText');
    }
}


class DivNode extends BaseNode {
    constructor () {
        super();
        this.children = [];
        this.tag = 'div';
    }

    // 添加父子关系
    addChild (child) {
        this.children.push(child);
        child.setParent(this);
        return this;
    }

    showText () {
        this.children.forEach((child) => {
            child.showText();
        });
    }
}

class PNode extends BaseNode {
    constructor () {
        super();
        this.parent = null;
        this.children = [];
        this.tag = 'p';
    }

    setParent (parent) {
        this.parent = parent;
    }

    addChild (child) {
        this.children.push(child);
        child.setParent(this);
        return this;
    }

    showText () {
        this.children.forEach((child) => {
            child.showText();
        });
    }
}

class SpanNode extends BaseNode {
    constructor (element) {
        super();
        this.parent = null;
        this.children = [];
        this.tag = 'span';
    }

    showText () {
        this.children.forEach((child) => {
            child.showText();
        }); 
    }

    setParent (parent) {
        this.parent = parent;
    }

    addChild (child) {
        this.children.push(child);
        child.setParent(this);
        return this;
    }
}

// 这个节点类没有子节点
class TextNode extends BaseNode {
    constructor (text) {
        super();
        this.parent = null;
        this.text = text;
    }

    setParent (parent) {
        this.parent = parent;
    }

    showText () {
        console.log(this.text);
    }
}


let div = new DivNode();
let p1 = new PNode();
let p2 = new PNode();
let span = new SpanNode();
let text1 = new TextNode('text1');
let text2 = new TextNode('text2');
let text3 = new TextNode('text3');
let text4 = new TextNode('text4');

p1.addChild(text1);
p2.addChild( span.addChild(text2).addChild(text3) );
div.addChild(p1).addChild(p2).addChild(text4);

div.showText();
console.log(div);
```

## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)
* [Refactoring.Guru](https://refactoring.guru/design-patterns/composite)