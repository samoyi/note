class Node {
    constructor(element) {
        this.element = element;
        this.prev = null;
        this.next = null;
    }
}

class DoublyLinkedList {
    constructor(){
        this.length = 0;
        this.head = null;
        this.tail = null;
    }

    append (element) {
        let node = new Node(element);
        let current;

        if (this.head === null) { // 当前列表为空
            this.head = node;
            this.tail = node;
        } 
        else {
            this.tail.next = node;
            node.prev = this.tail;
            this.tail = node;
        }

        this.length++;
    }

    insert (position, element) {
        if (position < 0 || position > this.length) return false;

        let node = new Node(element);
        let current = this.head;
        let previous;
        let index = 0;

        if (position === 0) { // 在第一个位置添加
            if (!this.length) { // 当前列表为空
                this.tail = node;
            }
            else {
                current.prev = node;
            }
            this.head = node;
            node.next = current;
        } 
        else if (position === this.length) {
            current = this.tail;
            current.next = node;
            node.prev = current;
            this.tail = node;
        }
        else {
            if (position < this.length/2) {
                while (index++ < position) {
                    previous = current;
                    current = current.next;
                }
            }
            else {
                index = this.length;
                previous = this.tail;
                while (index-- > position) {
                    current = previous;
                    previous = previous.prev;
                }
            }
            previous.next = node;
            node.prev = previous;
            node.next = current;
            current.prev = node;
        }

        this.length++;
        return true;
    }

    removeAt (position) {
        if (position < 0 || position >= this.length) return null;

        let current = this.head;
        let previous;
        let index = 0;

        if (position === 0) { // 移除第一项
            if (this.length === 1) { // 当前列表只有一项
                this.tail = null;
            } 
            else {
                this.head.prev = null;
            }
            this.head = current.next;
        } 
        else if (position === this.length-1) {
            this.tail = this.tail.prev;
            this.tail.next = null
        }
        else {
            if (position < this.length / 2) {
                while (index++ < position) {
                    previous = current;
                    current = current.next;
                }
            }
            else {
                index = this.length;
                previous = this.tail;
                while (index-- > position) {
                    current = previous;
                    previous = previous.prev;
                }
            }
            previous.next = current.next;
            current.next.prev = previous;
        }

        this.length--;
        return current.element;
    }

    remove (element) {
        let index = this.indexOf(element);
        return this.removeAt(index);
    }

    indexOf (element) {
        let current = this.head;
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
        return this.length === 0;
    }

    size () {
        return this.length;
    }

    getHead () {
        return this.head;
    }

    getTail () {
        return this.tail;
    }

    toString () {
        let current = this.head;
        let string = '';

        while (current) {
            string += ", " + current.element;
            current = current.next;
        }
        return string.slice(2);
    }
}

module.exports = DoublyLinkedList;