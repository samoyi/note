function BinarySearchTree(){

    let Node = function(key){
        this.key = key;
        this.left = null;
        this.right = null;
    };

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
    };

    var inOrderTraverseNode = function (node, callback) {
        if (node !== null) { //{2}
            inOrderTraverseNode(node.left, callback);  //{3}
            callback(node.key);                        //{4}
            inOrderTraverseNode(node.right, callback); //{5}
        }
    };

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
}


module.exports = BinarySearchTree;
