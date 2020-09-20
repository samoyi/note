const geneDjb2HashFn = require('./djb2Hash');

const djb2HashCode = geneDjb2HashFn(1013);

class ValuePair {
    constructor(key, value) {
        this.key = key; // 用来在链表中区分
        this.value = value;
    }

    toString() {
        return '[' + this.key + ' - ' + this.value + ']';
    }
}

class LinearProbing {
    constructor(){
        this.table = [];
    }

    put (key, value) {
        let position = djb2HashCode(key);
        while (this.table[position] !== undefined) {
            position++;
        }
        this.table[position] = new ValuePair(key, value);;
    }

    get (key) {
        let position = djb2HashCode(key);

        if (this.table[position] === undefined) return undefined;

        while (this.table[position] === undefined || this.table[position].key !== key) {
            position++;
        }
        return this.table[position].value;
    }

    remove (key) {
        let position = djb2HashCode(key);

        if (this.table[position] === undefined) return false;

        while (this.table[position] === undefined || this.table[position].key !== key) {
            position++;
        }
        this.table[position] = undefined;
        return true;
    }

    print () {
        this.table.forEach(function (item) {
            if (item !== undefined) {
                console.log(item.toString());
            }
        });
    }
}


module.exports = LinearProbing;