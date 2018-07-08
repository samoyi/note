// 参考书上的图更容易理解


function BinarySearchTree(){

    function Node(key){
        this.key = key;
        this.left = null;
        this.right = null;
    }

    // 将新节点 newNode 插入根节点为 node 的树或子树
    function insertNode(node, newNode){
        if (newNode.key < node.key){ // 如果新节点的键小于当前节点的键，
            // 那么需要检查当前节点的左侧子节点
            if (node.left === null){ // 如果它没有左侧子节点，就在那里插入新的节点
                node.left = newNode;
            }
            else {
                // 如果有左侧子节点，需要通过递归调用 insertNode 方法继续找到树的下一层
                insertNode(node.left, newNode);
            }
        }
        else { // 如果新节点的键大于等于当前节点的键
            if (node.right === null){ // 当前节点没有右侧子节点
                node.right = newNode;
            }
            else { // 如果有右侧子节点
                insertNode(node.right, newNode);
            }
        }
    }

    // 中序遍历
    // 先向下递归到底，然后以上行顺序访问BST所有节点的遍历方式，也就是以从最小到最大的顺序访问所有节点
    // 中序遍历的一种应用就是对树进行排序操作
    function inOrderTraverseNode(node, callback) {
        if (node !== null) {
            inOrderTraverseNode(node.left, callback);
            callback(node.key);
            inOrderTraverseNode(node.right, callback);
        }
    }

    // 先序遍历
    // 先序遍历的一种应用是打印一个结构化的文档
    function preOrderTraverseNode(node, callback) {
        if (node !== null) {
            callback(node.key);
            preOrderTraverseNode(node.left, callback);
            preOrderTraverseNode(node.right, callback);
        }
    }

    // 后序遍历
    // 后序遍历的一种应用是计算一个目录和它的子目录中所有文件所占空间的大小。
    function postOrderTraverseNode(node, callback) {
        if (node !== null) {
            postOrderTraverseNode(node.left, callback);
            postOrderTraverseNode(node.right, callback);
            callback(node.key);
        }
    }

    function searchNode(node, key, parent=null){
        if(node===null) return null;

        if(node.key>key){
            return searchNode(node.left, key, node);
        }
        else if(node.key<key){
            return searchNode(node.right, key, node);
        }
        else{
            return [node, parent];
        }
    }

    function findMinNode(){
        if(root===null) return null;

        let currentNode = root;
        while(currentNode.left){
            currentNode = currentNode.left;
        }
        return currentNode;
    }

    // 从 node 开始搜索并移除
    function removeNode(node, key){
        if (node === null) return null;

        if (key < node.key){ // 比 node 的 key 小
            node.left = removeNode(node.left, key);
            return node;
        }
        else if (key > node.key){ // 比 node 的 key 大，
            // 所以从 node 的右侧子节点开始搜索并移除
            // 和 remove 方法一样，移除结果要赋给起始节点
            // 参考书上的配图，假设 node 这时是 11 节点，则 node.right 就是 18 节点
            // 同时假设我们就是要删除 18 节点
            // 进行一次递归，此时 node 是 15，进入下面所标记的 第三种情况
            // findMinNode 从 20 节点开始找最小的，找到了 18
            // 之后的 removeNode 又是第一种情况，返回 null
            node.right = removeNode(node.right, key);
            return node;
        }
        else {
            // 第一种情况，key 所在的节点是叶节点
            if (node.left === null && node.right === null){
                node = null;
                return node;
            }
            // 第二种情况，key 所在的节点是只有一个子节点
            if (node.left === null){
                node = node.right;
                return node;

            }
            else if (node.right === null){
                node = node.left;
                return node;
            }
            // 第三种情况，key 所在的节点有两个子节点
            let aux = findMinNode(node.right);
            node.key = aux.key;
            node.right = removeNode(node.right, aux.key);
            console.log(node)
            console.log('-------------')
            console.log(node.right)
            console.log('-------------')
            return node;
        }
    };


    let root = null; // 处置状态为空树


    this.insert = function(key){
        let newNode = new Node(key);
        if (root === null){
            root = newNode;
        }
        else{
            insertNode(root, newNode);
        }
    };


    this.inOrderTraverse = function(callback){
        inOrderTraverseNode(root, callback);
    };


    this.preOrderTraverse = function(callback){
        preOrderTraverseNode(root, callback);
    };


    this.postOrderTraverse = function(callback){
        postOrderTraverseNode(root, callback);
    };


    this.min = function(){
        if(root===null) return null;

        let currentNode = root;
        while(currentNode.left){
            currentNode = currentNode.left;
        }
        return currentNode.key;
    };


    this.max = function(){
        if(root===null) return null;

        let currentNode = root;
        while(currentNode.right){
            currentNode = currentNode.right;
        }
        return currentNode.key;
    };


    this.search = function(key){
        return searchNode(root, key);
    };


    this.check = function(key, node=root){
        if(node===null) return false;

        if(node.key>key){
            return this.check(key, node.left);
        }
        else if(node.key<key){
            return this.check(key, node.right);
        }
        else{
            return true;
        }
    };


    this.remove = function(key){
        // 从 root 开始搜索并移除，所以将返回值赋给 root
        // 如果从某子节点开始搜索其子树，则返回值会赋给该子节点
        // 即，从哪个节点开始搜索并移除，返回值就赋给该节点
        root = removeNode(root, key);
    };
    // 下面是我自己写的remove方法，没有书上的好
    // this.remove = function(key){
    //     let result = searchNode(root, key);
    //     if(result===null) return null;
    //
    //     let [node, parent] = result;
    //
    //     if(node.left===null && node.right===null){
    //         if( parent.key>node.key ){
    //             parent.left = null;
    //         }
    //         else{
    //             parent.right = null;
    //         }
    //     }
    //     else if(node.right===null){
    //         parent.left = node.left;
    //     }
    //     else if(node.left===null){
    //         parent.right = node.right;
    //     }
    //     else{
    //         let currentNode = node.right,
    //             lastParent = null;
    //         while(currentNode.left){
    //             lastParent = currentNode;
    //             currentNode = currentNode.left;
    //         }
    //         let newNode = currentNode;
    //
    //         if( node.key<parent.key ){
    //             parent.left = newNode;
    //         }
    //         else{
    //             parent.right = newNode;
    //         }
    //         newNode.left = node.left;
    //         newNode.right = node.right;
    //         currentNode = null;
    //         lastParent.left = null;
    //
    //         // 下面这种方法虽然也可以，但得到的树会多出一级
    //         // if( parent.key>node.key ){
    //         //     parent.left = node.left;
    //         // }
    //         // else{
    //         //     parent.right = node.left;
    //         // }
    //         //
    //         // let currentNode = node.left;
    //         // while(currentNode.right){
    //         //     currentNode = currentNode.right;
    //         // }
    //         // currentNode.right = node.right;
    //     }
    //     return parent;
    // };


    this.getRoot = function(){
        return root;
    }
}


module.exports = BinarySearchTree;
