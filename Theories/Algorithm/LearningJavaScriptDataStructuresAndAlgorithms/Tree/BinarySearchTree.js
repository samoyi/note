function BinarySearchTree(){

    function Node(key){
        this.key = key;
        this.left = null;
        this.right = null;
    }

    function insertNode(node, newNode){
        if (newNode.key < node.key){
            if (node.left === null){
                node.left = newNode;
            }
            else {
                insertNode(node.left, newNode);
            }
        }
        else {
            if (node.right === null){
                node.right = newNode;
            }
            else {
                insertNode(node.right, newNode);
            }
        }
    }

    function inOrderTraverseNode(node, callback) {
        if (node !== null) {
            inOrderTraverseNode(node.left, callback);
            callback(node.key);
            inOrderTraverseNode(node.right, callback);
        }
    }

    function preOrderTraverseNode(node, callback) {
        if (node !== null) {
            callback(node.key);
            preOrderTraverseNode(node.left, callback);
            preOrderTraverseNode(node.right, callback);
        }
    }

    function postOrderTraverseNode(node, callback) {
        if (node !== null) {
            postOrderTraverseNode(node.left, callback);
            postOrderTraverseNode(node.right, callback);
            callback(node.key);
        }
    }

    // function checkNode(node, key){
    //     if(node===null) return false;
    //
    //     if(node.key>key){
    //         checkNode(node.left, key);
    //     }
    //     else if(node.key<key){
    //         checkNode(node.right, key);
    //     }
    //     else{
    //         return true;
    //     }
    // }

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

    let root = null;


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
        let result = searchNode(root, key);
        if(result===null) return null;

        let [node, parent] = result;

        if(node.left===null && node.right===null){
            if( parent.key>node.key ){
                parent.left = null;
            }
            else{
                parent.right = null;
            }
        }
        else if(node.right===null){
            parent.left = node.left;
        }
        else if(node.left===null){
            parent.right = node.right;
        }
        else{
            let currentNode = node.right,
                lastParent = null;
            while(currentNode.left){
                lastParent = currentNode;
                currentNode = currentNode.left;
            }
            let newNode = currentNode;

            if( node.key<parent.key ){
                parent.left = newNode;
            }
            else{
                parent.right = newNode;
            }
            newNode.left = node.left;
            newNode.right = node.right;
            currentNode = null;
            lastParent.left = null;

            // 下面这种方法虽然也可以，但得到的树会多出一级
            // if( parent.key>node.key ){
            //     parent.left = node.left;
            // }
            // else{
            //     parent.right = node.left;
            // }
            //
            // let currentNode = node.left;
            // while(currentNode.right){
            //     currentNode = currentNode.right;
            // }
            // currentNode.right = node.right;
        }
        return parent;
    };


    this.getRoot = function(){
        return root;
    }
}


module.exports = BinarySearchTree;
