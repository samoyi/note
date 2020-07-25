class Node {
    constructor( element ) {
        this.element = element;
        this.next = null;
    }
}


let length = 0;
let head = null; // 列表的第一个节点


class CircularLinkedList {
    constructor () {}

    append (element) {
        let node = new Node( element );
        let current; 

        if ( head === null ) {
            head = node;
        } 
        else {
            current = head; 
            
            // 遍历列表，直到环形的最后一项
            while ( current.next !== head ) {
                current = current.next;
            }
            
            current.next = node;
        }

        node.next = head;

        length++;

        return this;
    }

    insert ( position, element ) {
        if ( position < 0 || position > length ) return false;

        let node = new Node(element);
        let current = head;
        let previous;
        let index = 0;

        if ( position === 0 ) {
            if ( head === null ) {
                node.next = node;
            }
            else {
                node.next = current;
                
                // 找到尾部，连接到新节点上
                while ( current.next !== head ) {
                    current = current.next;
                }
                
                current.next = node;
            }
            head = node;
        } 
        else {
            while ( index < position ) {
                previous = current;
                current = current.next;
                index++;
            }

            previous.next = node;
            node.next = current;

        }

        length++;
        return true;
    }

    removeAt ( position ) {
        if ( position < 0 || position >= length ) return null;

        let current = head;
        let previous;
        let index = 0;

        if ( position === 0 ) { // 移除的是第一项
            if ( length === 1 ) {
                head = null;
            }
            else {
                // head 本来是引用第一项的，现在让它引用第二项，则第一项失去了引用，就脱离了链表
                while ( current.next !== head ) {
                    previous = current;
                    current = current.next;
                    index++
                }
                head = head.next;
                current.next = head;
            }
        } 
        else {
            while (index < position) {
                previous = current;
                current = current.next;
                index++
            }
            // 将 previous 与 current 的下一项链接起来：跳过 current，从而移除它
            previous.next = current.next;
        }

        length--;
        return current.element;
    }

    remove (element) {
        let index = this.indexOf(element);
        return this.removeAt(index);
    }

    indexOf (element) {
        let current = head;
        let index = 0;

        if ( head === null ) {
            return -1;
        }

        if ( head.element === element ) {
            return 0;
        }

        // while 内部不会比较最后一个元素
        while ( current.next !== head ) {
            if (element === current.element) {
                return index;
            }
            index++;
            current = current.next;
        }

        // 比较最后一个元素
        if ( current.element === element ) {
            return index;
        }

        return -1;
    }

    isEmpty () {
        return length === 0;
    }

    size () {
        return length;
    }

    getHead () {
        return head;
    }

    toString () {
        let current = head;

        if ( head === null ) {
            return '';
        }

        // 链表如果只有一项，则下面 while 中条件不会成立，所以这里先把第一项的值作为 string 的初始值
        let string = head.element;

        while ( current.next !== head ) {
            current = current.next;
            string += ", " + current.element;
        }
        return string;
    }
}


export {CircularLinkedList};