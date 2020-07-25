class Node {
    constructor(element) {
        this.element = element;
        this.next = null;
    }
}


let length = 0;
let head = null; // 列表的第一个节点


class LinkedList {
    constructor(){}

    // 向列表尾部添加一个元素
    // 可能有两种场景：列表为空，添加的是第一个元素；或者列表不为空，向其追加元素。
    append (element) {
        let node = new Node(element);
        // 因为链表的查询只能从头部开始一项一项的根据指针遍历，所以需要 current 记录遍历的当前位置
        let current; 

        if (head === null) { // 当前列表为空
            head = node;
        } 
        else {
            // 从头部开始
            current = head; 

            // 遍历列表，直到最后一项
            while (current.next) {
                current = current.next;
            }

            // 找到最后一项，将其 next 赋为 node，建立链接
            current.next = node;
        }

        length++; // 更新列表的长度

        return this;
    }

    insert (position, element) {
        if (position < 0 || position > length) return false;

        let node = new Node(element);
        let current = head;
        let previous;
        let index = 0;

        if (position === 0) { // 在第一个位置添加
            // 兼容了链表为空的情况
            node.next = current;
            head = node;
        } 
        else {
            while (index < position) {
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

    // 从指定 index 移除元素
    // 有两种场景：第一种是移除第一个元素，第二种是移除第一个以外的任一元素。
    removeAt (position) {
        if (position < 0 || position >= length) return null;

        // 以下三个变量用来遍历链表
        let current = head;
        let previous;
        let index = 0;

        if (position === 0) { // 移除的是第一项
            // head 本来是引用第一项的，现在让它引用第二项，则第一项失去了引用，就脱离了链表
            head = current.next;
        } 
        else {
            while (index++ < position) {
                previous = current;
                current = current.next;
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

        while (current) {
            if (element === current.element) {
                return index;
            }
            index++;
            current = current.next;
        }
        return -1;
    }

    // 使用迭代的方法反转链表
    reverse_iteration () {
        let prev = null;
        let next = null;
        let current = head;
        
        // 不断迭代改变 next 指向
        while ( current ) {
            next = current.next
            current.next = prev;
            prev = current;
            current = next;
        }

        head = prev;
    }

    // 使用递归的方式反转链表
    // 这里的递归思路是，把当前第一个（currHead）之后的链表递归的进行反转，然后把 currHead 接到后面
    reverse_recursion ( currHead ) {
        let next = currHead.next;

        if ( next ) {
            // 从 currHead 之后的 next 开始递归反转后面的
            this.reverse_recursion( next );
            // 反转后的链表的最后一个节点就是 next，把 currHead 连上
            next.next = currHead;
            currHead.next = null;
        }
        else {
            // 不存在 next 就说明当前 currHead 是原链表的最后一个，也就是反转后的第一个
            head = currHead;
        }
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
        let string = '';

        while (current) {
            string += ", " + current.element;
            current = current.next;
        }
        return string.slice(2);
    }
}


export {LinkedList};