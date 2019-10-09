class Node {
    constructor(element) {
        this.element = element;
        this.next = null;
    }
}

class LinkedList {
    constructor(){
        this.length = 0;
        this.head = null;
    }

    append (element) {
        let node = new Node(element);
        let current;

        if (this.head === null) { // 当前列表为空
            this.head = node;
        } 
        else {
            current = this.head;

            // 循环列表，直到找到最后一项
            while (current.next) {
                current = current.next;
            }

            // 找到最后一项，将其 next 赋为 node，建立链接
            current.next = node;
        }

        this.length++; // 更新列表的长度
    }

    insert (position, element) {
        if (position < 0 || position > this.length) return false;

        let node = new Node(element);
        let current = this.head;
        let previous;
        let index = 0;

        if (position === 0) { // 在第一个位置添加
            node.next = current;
            this.head = node;
        } 
        else {
            while (index++ < position) {
                previous = current;
                current = current.next;
            }
            previous.next = node;
            node.next = current;
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
            this.head = current.next;
        } 
        else {
            while (index++ < position) {
                previous = current;
                current = current.next;
            }
            //将 previous 与 current 的下一项链接起来：跳过 current，从而移除它
            previous.next = current.next;
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

module.exports = LinkedList;