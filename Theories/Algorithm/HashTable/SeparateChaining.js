const LinkedList = require('../LinkedList/LinkedList');
const geneDjb2HashFn = require('./djb2Hash');

const djb2HashCode = geneDjb2HashFn(1013);

class ValuePair {
    constructor(key, value) {
        this.key = key; // 用来在链表中区分
        this.value = value;
    }

    toString () {
        return '[' + this.key + ' - ' + this.value + ']';
    }
}

class SeparateChaining {
    constructor(){
        this.table = [];
    }
    
    put (key, value) {
        let position = djb2HashCode(key);
        if (this.table[position] == undefined) {
            this.table[position] = new LinkedList();
        }
        this.table[position].append(new ValuePair(key, value));
    }

    get (key) {
        let position = djb2HashCode(key);

        if (this.table[position] !== undefined) {
            let current = this.table[position].getHead();

            while (current.next) {
                if (current.element.key === key) {
                    return current.element.value;
                }
                current = current.next;
            }

            if (current.element.key === key) { // 元素是链表的最后一个节点（包括链表只有一个节点的情况）
                return current.element.value;
            }
        }
        return undefined;
    }

    remove (key) {
        let position = djb2HashCode(key);

        if (this.table[position] !== undefined) {
            let current = this.table[position].getHead();

            while (current.next) {
                if (current.element.key === key) {
                    this.table[position].remove(current.element);
                    if (this.table[position].isEmpty()) {
                        this.table[position] = undefined;
                    }
                    return true;
                }
                current = current.next;
            }

            if (current.element.key === key) {
                this.table[position].remove(current.element);
                if (this.table[position].isEmpty()) {
                    this.table[position] = undefined;
                }
                return true;
            }
        }
        return false;
    }


    print () {
        this.table.forEach((item) => {
            if (item !== undefined) {
                console.log(item.toString());
            }
        });
    }
}

module.exports = SeparateChaining;