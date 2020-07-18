class Node {
    constructor(element) {
        this.element = element;
        this.prev = null;
        this.next = null;
    }
}


let length = 0;
let head = null;
let tail = null;


class DoublyLinkedList {
    constructor(){}

    append (element) {
        let node = new Node(element);
        let current;

        if (head === null) { // 当前列表为空
            head = node;
            tail = node;
        } 
        else {
            tail.next = node;
            node.prev = tail;
            tail = node;
        }

        length++;

        return this;
    }

    insert (position, element) {
        if (position < 0 || position > length) return false;

        let node = new Node(element);
        let current = head;
        let previous;
        // 注意这里 index 和 current 指向同一个节点，下面迭代的时候它俩也是指向同一个。明确一下位置关系。
        let index = 0;

        if (position === 0) { // 在第一个位置添加
            if (!length) { // 当前列表为空
                tail = node;
                head = node;
            }
            else {
                node.next = current;
                current.prev = node;
                head = node;
            }
        } 
        else if (position === length) { // append
            current = tail;
            current.next = node;
            node.prev = current;
            tail = node;
            // 下面这种写法也可以。哪种更明确呢？
            // tail.next = node;
            // node.prev = tail;
            // tail = node;
        }
        else {
            if (position < length/2) { // 从前向后找到所在位置
                while (index < position) {
                    // 正如上面说的，index 和 current 在迭代过程中始终保持指向同一个节点
                    // 所以当迭代停止，index 等于 position 是，current 所在的位置就应该是新节点的位置
                    // 当前 current 的节点应该是新节点的 next，而 previous 的节点应该是新节点的 prev
                    previous = current;
                    current = current.next;
                    index++;
                }
            }
            else { // 从后向前找到所在位置
                current = tail;
                previous = current.prev;
                index = length - 1;
                while (index > position) {
                    current = previous;
                    previous = previous.prev;
                    index--;
                }
            }

            // 插入新节点
            previous.next = node;
            node.prev = previous;
            node.next = current;
            current.prev = node;
        }

        length++;

        return true;
    }

    removeAt (position) {
        if (position < 0 || position >= length) return null;

        let current = head;
        let previous;
        let index = 0;

        if (position === 0) { // 移除第一项
            if (length === 1) { // 当前列表只有一项
                tail = null;
                head = null;
            } 
            else {
                head = current.next;
                head.prev = null;
            }
        } 
        else if (position === length-1) {
            tail = tail.prev;
            tail.next = null
        }
        else {
            if (position < length / 2) {
                while (index < position) {
                    previous = current;
                    current = current.next;
                    index++;
                }
            }
            else {
                current = tail.prev;
                previous = current.prev;
                index = length - 2;
                while (index > position) {
                    current = previous;
                    previous = previous.prev;
                    index--;
                }
            }
            previous.next = current.next;
            current.next.prev = previous;
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

        while (current) {
            if (element === current.element) {
                return index;
            }
            index++;
            current = current.next;
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

    getTail () {
        return tail;
    }

    toString () {
        let current = head;
        let string = '';

        while (current) {
            string += ", " + current.element;
            current = current.next;
        }
        return string.slice(2);
    }
}


export {DoublyLinkedList};