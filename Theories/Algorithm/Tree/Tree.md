# Tree


<!-- TOC -->

- [Tree](#tree)
    - [思想](#思想)
    - [1. 示例](#1-示例)
    - [2. 树元素的定义](#2-树元素的定义)
    - [3. 树的定义](#3-树的定义)
        - [定义一：基于点和边的定义](#定义一基于点和边的定义)
        - [定义二：递归定义](#定义二递归定义)
    - [4. 根据递归定义实现二叉树](#4-根据递归定义实现二叉树)
    - [5. 解析树](#5-解析树)
        - [解析规则](#解析规则)
            - [如果当前标记是 `(`](#如果当前标记是-)
            - [如果当前标记在列表 `['+', '-', '/', '*']` 中](#如果当前标记在列表------中)
            - [如果当前标记是数字](#如果当前标记是数字)
            - [如果当前标记是 `)`](#如果当前标记是-)
        - [实现树解析器](#实现树解析器)
        - [对解析树求值](#对解析树求值)
    - [References](#references)

<!-- /TOC -->


## 思想


## 1. 示例
1. 树是一种 **存储数据** 的结构，它存储 **树状结构** 的数据
2. 下面的这个树状结构里存储了动物类别的数据，数据的结构是树状的
    <img src="./images/01.png" width="400"  style="display: block; margin: 5px 0 10px;" />
3. 下面的这个树状结构里存储了网页节点的数据，数据的结构也是树状的
    <img src="./images/02.png" width="400"  style="display: block; margin: 5px 0 10px;" />


## 2. 树元素的定义
*  **节点**：也称为 “键”（key）
*  **边**：
    * 两个节点通过一条边相连，表示它们之间存在关系。
    * 除了根节点以外，其他每个节点都仅有一条入边，出边则可能有多条。 
    * 一种非树结构的边的情况
        <img src="./images/03.jpg" width="400"  style="display: block; margin: 5px 0 10px;" />
* **根节点**：树中唯一没有入边的节点。
* **子节点**：一个节点通过出边与子节点相连。
* **叶子节点**：叶子节点没有子节点。
* **父节点**：一个节点是其所有子节点的父节点。
* **兄弟节点**：具有同一父节点的节点互称为兄弟节点。
* **路径**：路径是由边连接的有序节点列表。比如，哺乳纲→食肉目→猫科→猫属→家猫 就是一条路径。
* **子树**：一个父节点及其所有后代的节点和边构成一棵子树。
* **层数**：节点 n 的层数是从根节点到 n 的唯一路径长度。根节点的层数是 0。
* **高度**：树的高度是其中节点层数的最大值。


## 3. 树的定义
### 定义一：基于点和边的定义
1. 树由节点及连接节点的边构成。
2. 树有以下属性：
    * 有一个根节点；
    * 除根节点外，其他每个节点都与其唯一的父节点相连；
    * 从根节点到其他每个节点都有且仅有一条路径；
    * 如果每个节点最多有两个子节点，我们就称这样的树为 **二叉树**。

### 定义二：递归定义
1. 一棵树要么为空，要么由一个根节点和零棵或多棵子树构成，子树本身也是一棵树。
    <img src="./images/05.png" width="600"  style="display: block; margin: 5px 0 10px;" />
    * 每个单独的节点都可以是一棵树
    * abc 可以是一棵树
    * abcdef 可以是一棵树
    * bde 可以是一棵树
    * cf 可以是一棵树
2. 每棵子树的根节点通过一条边连到父树的根节点。
3. 图示 
    <img src="./images/04.png" width="400"  style="display: block; margin: 5px 0 10px;" />
    从树的递归定义可知，图中的树至少有4个节点，因为三角形代表的子树必定有一个根节点。这棵树或许有更多的节点，但必须更深入地查看子树后才能确定。
    

## 4. 根据递归定义实现二叉树
```js
class BinaryTree {
    constructor ( rootKey ) {
        this.key = rootKey;
        this.leftChild = null;
        this.rightChild = null;
    }

    insertLeft ( newKey ) {
        if ( this.leftChild ) {
            let newTree = new BinaryTree( newKey );
            newTree.leftChild = this.leftChild;
            this.leftChild = newTree;
        }
        else {
            this.leftChild = new BinaryTree( newKey );
        }
    }

    insertRight ( newKey ) {
        if ( this.rightChild ) {
            let newTree = new BinaryTree( newKey );
            newTree.rightChild = this.rightChild;
            this.rightChild = newTree;
        }
        else {
            this.rightChild = new BinaryTree( newKey );
        }
    }

    getLeftChild () {
        return this.leftChild;
    }

    getRightChild () {
        return this.rightChild;
    }

    getRootKey () {
        return this.key;
    }

    setRootKey ( val ) {
        this.key = val;
    }
}


let root = new BinaryTree('a')
console.log( root.getRootKey() );                  // a
console.log( root.getLeftChild() );                // null

root.insertLeft('b')
console.log( root.getLeftChild().getRootKey() );   // b

root.insertRight('c')
console.log( root.getRightChild().getRootKey() );  // c

root.getRightChild().setRootKey('hello')
console.log( root.getRightChild().getRootKey() );  // hello

console.log( JSON.stringify(root, null, 4) );
// {
//     "key": "a",
//     "leftChild": {
//         "key": "b",
//         "leftChild": null,
//         "rightChild": null
//     },
//     "rightChild": {
//         "key": "hello",
//         "leftChild": null,
//         "rightChild": null
//     }
// }
```


## 5. 解析树
1. 将 $((7 + 3) * (5 - 2))$ 这样的数学表达式表示成解析树，如下图所示
    <img src="./images/10.png" width="400"  style="display: block; margin: 5px 0 10px;" />
2. 构建解析树的第一步是将表达式字符串拆分成标记列表。需要考虑 4 种标记：左括号、右括号、运算符和操作数。
3. 我们知道，左括号代表新表达式的起点，所以应该创建一棵对应该表达式的新树。反之，遇到右括号则意味着到达该表达式的终点。我们也知道，操作数既是叶子节点，也是其运算符的子节点。此外，每个运算符都有左右子节点。

### 解析规则
#### 如果当前标记是 `(`
1. 说明需要新建一个表达式，就为当前节点添加一个左子节点。
2. 并下沉至该子节点，该子节点可能是表达式的左操作数，也可能是一个表达式。

#### 如果当前标记在列表 `['+', '-', '/', '*']` 中
1. 说明刚才解析了当前表达式的左操作数，现在解析到了表达式的运算符，将当前节点的值设为当前标记对应的运算符。
2. 为当前节点添加一个右子节点，并下沉至该子节点。该子节点可能是表达式的右操作数，也可能是另一个表达式。

#### 如果当前标记是数字
1. 可能是左操作数也可能是右操作数。
2. 将当前节点的值设为这个数并返回至父节点的运算符。
3. 如果是左操作，返回父节点后等待解析之后的运算符；如果是右操作数，返回父节点后等待之后的 `)`。

#### 如果当前标记是 `)`
1. 说明当前表达式已经计算完成，需要返回到上一层的表达式；或者整个表达式都计算完成了。
2. 跳到当前节点的父节点。如果没有父节点，则说明解析完成。

### 实现树解析器
```js
function buildParseTree ( exp ) {
    const operatorList = ['+', '-', '*', '/'];
    
    let tokenList = exp.split('');
    let parentNodeStack = [];

    let parseTree = new BinaryTree('');
    parentNodeStack.push( parseTree );

    let currTree = parseTree;

    tokenList.forEach( (token) => {
        if ( token === '(' ) {
            currTree.insertLeft('');
            parentNodeStack.push( currTree );
            currTree = currTree.getLeftChild();
        }
        else if ( isNumStr(token) ) {
            currTree.setRootKey( Number.parseFloat(token) );
            currTree = parentNodeStack.pop();
        }
        else if ( operatorList.includes(token) ) {
            currTree.setRootKey(token);
            currTree.insertRight('');
            parentNodeStack.push(currTree);
            currTree = currTree.getRightChild();
        }
        else if ( token === ')' ) {
            currTree = parentNodeStack.pop();
        }
        else {
            throw new SyntaxError("Unknown Operator: " + token);
        }
    });

    return parseTree;
}

function isNumStr ( str ) {
    let f = Number.parseFloat(str);
    return !Number.isNaN(f);
}


let exp = '((7+3)*(5-2))';
let parseTree = buildParseTree(exp);
console.log( JSON.stringify(parseTree, null, 4) );
// {
//     "key": "*",
//     "leftChild": {
//         "key": "+",
//         "leftChild": {
//             "key": 7,
//             "leftChild": null,
//             "rightChild": null
//         },
//         "rightChild": {
//             "key": 3,
//             "leftChild": null,
//             "rightChild": null
//         }
//     },
//     "rightChild": {
//         "key": "-",
//         "leftChild": {
//             "key": 5,
//             "leftChild": null,
//             "rightChild": null
//         },
//         "rightChild": {
//             "key": 2,
//             "leftChild": null,
//             "rightChild": null
//         }
//     }
// }
```

### 对解析树求值
1. 整棵树就是一个表达式，可以说是根表达式。
2. 它有一个操作符和两个操作数，这两个操作数可能是真的数字，也有可能是子表达式。
3. 我们要对这个根表达式求值，就要对它的两个操作数求值。如果操作数是数字就直接返回，如果是表达式就要按照同样的规则求值。
4. 基于同样规则得出的前提，使用这些前提再应用相同的规则，这就是递归的思路。
5. 所以，如果一个节点不是叶节点，那肯定就是操作符所在的节点。这时就要用操作符和它的两个子节点进行计算。
6. 计算的时候，需要先递归的对它的两个子节点求值
    ```js
    function evaluate (parseTree) {
        let leftChild = parseTree.getLeftChild();
        let rightChild = parseTree.getRightChild();

        if ( leftChild && rightChild ) {
            let operator = parseTree.getRootKey();
            return genCalcFn(operator)( evaluate(leftChild), evaluate(rightChild) );
        }
        else {
            return parseTree.getRootKey();
        }
    }

    function genCalcFn (operator) {
        switch (operator) {
            case '+': return (m, n) => m + n;
            case '-': return (m, n) => m - n;
            case '*': return (m, n) => m * n;
            case '/': return (m, n) => m / n;
        }
    }


    console.log( evaluate (parseTree) ); // 30
    ```


## References
* [《Python数据结构与算法分析（第2版）》](https://book.douban.com/subject/34785178/)