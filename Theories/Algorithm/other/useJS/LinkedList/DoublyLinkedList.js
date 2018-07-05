function LinkedList() {

    function Node(element){
        this.element = element;
        this.next = null;
        this.prev = null;
    };


    let length = 0;
    let head = null;
    let tail = null;


    this.append = function(element){
        let node = new Node(element);
        let current = null;

        if (head === null){ // 空链表
            head = node;
            tail = node;
        }
        else {
            tail.next = node;
            node.prev = tail;
            tail = node;
        }
        return ++length;
    };


    this.removeAt = function(position){
        if (position > -1 && position < length){
            let current = head;

            if (position === 0){
                head = current.next;
                if (1 === length){
                    // 链表只有一项的话，现在 head 也是 null 了
                    tail = null;
                }
                else {
                    head.prev = null;
                }
            }
            else if (position === length - 1){
                current = tail; // 将被移除的项保存下来，之后返回
                tail = tail.prev;
                tail.next = null;
            }
            else {
                let previous = null;
                let index = 0;

                while (index++ < position){
                    previous = current;
                    current = current.next;
                }
                previous.next = current.next;
                current.next.prev = previous;
            }

            length--;
            return current.element;
        }
        else {
            return null;
        }
    };


    this.insert = function(position, element){
        if(position > -1 && position <= length){
            let node = new Node(element);
            let current = head;

            if (position){
                let previous = null;
                let index = 0;

                while ( index++ !== position ){
                    previous = current;
                    current = current.next;
                    // 在判断时，index 如果是 0，此时 current 就是索引为 1 的节点。
                    // 在判断时，index 如果是最后一个节点的索引，此时 current 就是
                    // null；index 自增之后就是 length，循环停止。
                }
                previous.next = node;
                if (current){
                    current.prev = node
                }
                else { // 添加到最后
                    tail = node;
                }
                node.prev = previous;
                node.next = current; // 如果 node 是最后一个节点，则 current 就是 null
            }
            else { // 插入到头部
                if (head){
                    node.next = current;
                    current.prev = node;
                    head = node;
                }
                else { // 空链表
                    head = node;
                    tail = node;
                }
            }

            length++;
            return true;
        }
        else{
            return false;
        }
    };


    this.indexOf = function(element){
        let current = head;
        let index = -1;
        while (current){
            index++;
            if (current.element === element){
                return index;
            }
            current = current.next;
        }
        return -1;
    };


    this.remove = function(element){
        return this.removeAt( this.indexOf(element) );
    };


    this.isEmpty = function() {
        return length === 0;
    };


    this.size = function() {
        return length;
    };


    this.getHead = function(){
        return head;
    };


    this.getTail = function(){
        return tail;
    };


    this.reverse = function(){
        if (length > 1){
            let current = head,
                aEle = [],
                index = -1;

            while (current){
                aEle.push(current.element);
                index++;
                current = current.next;
            }

            current = head;

            while (current){
                current.element = aEle[index--];
                current = current.next;
            }
        }
    };


    this.toString = function(){
        let current = head;
        let string = '';

        while (current) {
            string += "," + current.element;
            current = current.next;
        }
        return string.slice(1);
    };


    this.print = function(){
        console.log( this.toString() );
    };
}


module.exports = LinkedList;
