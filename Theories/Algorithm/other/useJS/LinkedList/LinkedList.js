function LinkedList() {

    function Node(element){
        this.element = element;
        this.next = null;
    };

    let length = 0;
    // 指针，指向第一个节点。如果链表第一个节点改变了，则需要把 head 指向新的第一个节点
    let head = null;


    this.append = function(element){
        let node = new Node(element);
        let current = null; // 遍历链表过程中的当前项

        if (null === head){ // 该元素将是第一个元素
            head = node;
        }
        else {
            current = head; // 从头开始遍历
            while(current.next !== null){
                current = current.next;
            }
            // 遍历结束，最后一个节点的 next 为 null
            current.next = node; // 最后一个节点链上新加节点
        }

        return ++length;
    };


    this.removeAt = function(position){
        if (position > -1 && position < length){
            let current = head;

            if (position === 0){ // 要移除第一个节点
                head = current.next; // 将 head 指向第二个节点
                // 第一个节点因为失去了引用，之后会被回收
            }
            else {
                let previous = null;
                let index = 0;
                // 通过不断移动 current 和 previous 的指向来遍历链表
                while (index++ < position){ // 如果当前项不是要删除的项
                    // 就把指针向后移动一部
                    previous = current;
                    current = current.next;
                }
                // 遍历结束，当前项就是要移除的项
                // 把当前项的前一项链接上当前项的下一项，当前项失去引用
                previous.next = current.next;
            }

            length--;
            return current.element;
        }
        else {
            return null;
        }
    };


    this.insert = function(position, element){
        if (position > -1 && position <= length){

            let node = new Node(element);
            let current = head;

            if (position){ // 插入到中间或末尾
                let previous = null;
                let index = 0;

                while( index++ !== position ){ // 遍历链表
                    previous = current;
                    current = current.next;
                    // 在判断时，index 如果是 0，此时 current 就是索引为 1 的节点。
                    // 在判断时，index 如果是最后一个节点的索引，此时 current 就是
                    // null，previous 就是最后一个节点；index 自增之后就是 length，
                    // 循环停止。
                }
                // 遍历时，current 是对想要插入新元素的位置之后一个元素的引用，
                // previous 是对想要插入新元素的位置之前一个元素的引用。
                previous.next = node;
                node.next = current; // 如果 node 是最后一个节点，则 current 就是 null
            }
            else { // 插入到最前面
                node.next = current;
                head = node;
            }

            length++;
            return true;
        }
        else{
            return false;
        }
    };


    // 找到首个 element 的索引
    this.indexOf = function(element){
        let current = head;
        let index = -1;

        while(current){
            index++;
            if (current.element === element){
                return index;
            }
            current = current.next;
        }
        return -1;
    };


    // 移除首个 element
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


    this.reverse = function(){
        if (length > 1){
            // 第一种方法：从第二项开始遍历，把每一项的 next 都指向前一项
            let previous = head;
            let current = head.next;
            let next = null;

            previous.next = null; // 第一项变成最后一项

            while (current){
                next = current.next; // 将翻转前的下一项保存下来
                current.next = previous; // 当前项指向前一项
                // 以下两行使得遍历指针向前走一步
                previous = current;
                current = next;
            }
            // 遍历结束后，previous 是翻转前的最后一项，翻转后的第一项
            head = previous;


            // 第二种方法：next 指针不变，把元素的位置翻转
            // let aEle = [];
            // let current = head;
            //
            // while (current){
            //     aEle.push(current.element);
            //     current = current.next;
            // }
            //
            // current = head;
            // aEle.reverse();
            //
            // let index = 0;
            // while (current){
            //     current.element = aEle[index++];
            //     current = current.next;
            // }
        }
    };


    this.toString = function(){
        let current = head,
            string = '';

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
