// 基于 djb2 hash 算法

// TODO 该 hash 算法的原理
function djb2HashCode(key) {
    let hash = 5381; // 初始化一个 hash 变量并赋值为一个质数，大多数实现都使用 5381
    let chars = [...key];
    let len = chars.length;

    for (let i = 0; i < len; i++) {
        hash = hash * 33 + chars[i].codePointAt(0);
    }
    return hash % 1013; // 与另一个随机质数相除的余数作为散列值。这里选择的指数应该略大于数据总数
}

class HashTable {
    constructor(){
        this.table = [];
    }

    put (key, value) {
        let position = djb2HashCode(key);
        this.table[position] = value;
    }

    get (key) {
        return this.table[djb2HashCode(key)];
    }

    remove (key) {
        this.table[djb2HashCode(key)] = undefined;
    }
}

module.exports = HashTable;