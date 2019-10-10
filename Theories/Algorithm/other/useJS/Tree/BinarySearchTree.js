function Node(key) {
    this.key = key;
    this.left = null;
    this.right = null;
}

// 将新节点 newNode 插入根节点为 node 的树或子树
function insertNode(node, newNode) {
    if (newNode.key < node.key) { // 如果新节点的键小于当前节点的键，
        // 那么需要检查当前节点的左侧子节点
        if (node.left === null) { // 如果它没有左侧子节点，就在那里插入新的节点
            node.left = newNode;
        } 
        else {
            // 如果有左侧子节点，需要通过递归调用 insertNode 方法继续找到树的下一层
            insertNode(node.left, newNode);
        }
    } 
    else { // 如果新节点的键大于等于当前节点的键
        if (node.right === null) { // 当前节点没有右侧子节点
            node.right = newNode;
        } 
        else {
            insertNode(node.right, newNode);
        }
    }
}

// 中序遍历
// 先向下递归到底，然后以上行顺序访问 BST 所有节点的遍历方式，也就是以从最小到最大的顺序访问所有节点
function inOrderTraverseNode(node, callback) {
    if (node !== null) {
        inOrderTraverseNode(node.left, callback); // 遍历左子树，先一路递归到左子树最小的一个节点
        callback(node.key);
        inOrderTraverseNode(node.right, callback); // 遍历右子树，先一路递归到右子树最小的一个节点
    }
}

// 先序遍历
function preOrderTraverseNode(node, callback) {
    if (node !== null) {
        callback(node.key);
        preOrderTraverseNode(node.left, callback);
        preOrderTraverseNode(node.right, callback);
    }
}

// 后序遍历
function postOrderTraverseNode(node, callback) {
    if (node !== null) {
        postOrderTraverseNode(node.left, callback);
        postOrderTraverseNode(node.right, callback);
        callback(node.key);
    }
}

function minNode (node) {
    if (node) {
        while (node && node.left !== null) {
            node = node.left;               
        }
        return node.key;
    }
    return null;
}

function maxNode (node) {
    if (node) {
        while (node && node.right !== null) {
            node = node.right;
        }
        return node.key;
    }
    return null;
}

function searchNode(node, key, parent = null) {
    if (node === null) return null;

    if (node.key > key) {
        return searchNode(node.left, key, node);
    } 
    else if (node.key < key) {
        return searchNode(node.right, key, node);
    } 
    else {
        return {node, parent};
    }
}

function findMinNode() {
    if (this.root === null) return null;

    let currentNode = this.root;
    while (currentNode.left) {
        currentNode = currentNode.left;
    }
    return currentNode;
}

// 从 node 开始搜索并移除
function removeNode(node, key) {
    if (node === null) return null;

    if (key < node.key) { // 比 node 的 key 小
        node.left = removeNode(node.left, key); // 递归左侧子节点 【1】
        return node;
    } 
    else if (key > node.key) { // 比 node 的 key 大
        node.right = removeNode(node.right, key); // 递归右侧子节点 【2】
        return node;
    } 
    else {
        // 第一种情况，key 所在的节点是叶节点
        if (node.left === null && node.right === null) {
            node = null;
            // 这里把 null 返回，因为本次调用很可能是从【1】或【2】里面递归来的，
            // 也就是说这里删除的节点是【1】或【2】中节点的子节点，【1】或【2】中节点就可以把对该子节点的引用设为 null
            return node;
        }
        // 第二种情况，key 所在的节点是只有一个子节点
        // 这时删除的操作就是直接让该节点的父节点的 left 或 right 引用该节点的子节点
        // 下面的代码先让 node 变量引用其子节点，再返回给它的父节点，供其引用
        if (node.left === null) {
            node = node.right;
            return node;

        } 
        else if (node.right === null) {
            node = node.left;
            return node;
        }
        // 第三种情况，key 所在的节点有两个子节点
        // 该节点现在的值，大于其左子树所有节点的值，小于其右子树所有节点的值
        // 有一个看起来合理但不好的方法是，将该节点的左子树设为该节点右子树最小值节点的 left，
        // 然后让该节点的父节点的 right 引用该节点的右子树。但这中移动整棵树的方法很可能会让某个分支明显长于其他的，
        // 在遍历时就可能带来性能损失，所以应该尽量避免分支的移动
        // 上面说到待删除节点的值左侧最大的和右侧最小的，那么在个节点被删除后，也可以找一个这样的节点来代替它的位置，
        // 也就是左子树的最大值或右子树的最小值。虽然书上是选择了右子树的最小值，
        // 但出于平衡的考虑，是不是每次移除是可以有不同的选择？
        let aux = findMinNode(node.right);
        // 其实并没有删除该节点，真正删除的是右子树的最小值节点
        node.key = aux.key;
        // 书上的那个例子，node.right 是不需要修改的。
        // 但如果右子树只有一个节点，该节点将被删除，所以 node.right 就要被设为 null
        // 但书上的例子，为什么这里的 removeNode 就是待删除节点右侧子节点呢？
        // 因为这里的 removeNode 会层层递归到右子树的最小节点，最后一次调用返回 null。
        // 然后再一层层的返回，最外层一次递归，也就是下面这一行的 removeNode 调用的返回值就是被删除节点的右侧子节点。
        // 也就是说，从 node.right 开始递归，最后最外层的返回值就是 node.right。从哪个节点开始递归，最外层的返回值就是那个节点。
        // 在下面 remove 方法中，因为是从 root 开始递归的，所以返回值要赋值给 root
        node.right = removeNode(node.right, aux.key);
        return node;
    }
}

class BinarySearchTree {

    constructor(){
        this.root = null; // 处置状态为空树
    }

    insert (key) {
        let newNode = new Node(key);
        if (this.root === null) {
            this.root = newNode;
        } 
        else {
            insertNode(this.root, newNode);
        }
    }

    insertKeys (keys) {
        keys.forEach(key=>{
            this.insert(key);
        });
    }

    inOrderTraverse (callback) {
        inOrderTraverseNode(this.root, callback);
    }

    preOrderTraverse (callback) {
        preOrderTraverseNode(this.root, callback);
    }

    postOrderTraverse (callback) {
        postOrderTraverseNode(this.root, callback);
    }

    min () {
        return minNode(this.root);
    }

    max () {
        return maxNode(this.root);
    }

    search (key) {
        return searchNode(this.root, key);
    }

    check (key, node = this.root) {
        if (node === null) return false;

        if (node.key > key) {
            return this.check(key, node.left);
        } else if (node.key < key) {
            return this.check(key, node.right);
        } else {
            return true;
        }
    }

    remove (key) {
        // 其实大多数情况下，这个赋值都是没用的。但如果移除的正好是根节点，则 root 会被重新赋值为 null
        this.root = removeNode(this.root, key);
    }

    getRoot () {
        return this.root;
    }
}


module.exports = BinarySearchTree;