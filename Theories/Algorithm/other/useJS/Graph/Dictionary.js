class Dictionary {

    constructor(){
        this.items = {};
    }

    set (key, value) {
        this.items[key] = value;
    }

    remove (key) {
        if (this.has(key)) {
            delete this.items[key];
            return true;
        }
        return false;
    }

    has (key) {
        return this.items.hasOwnProperty(key);
    }

    get (key) {
        return this.has(key) ? this.items[key] : undefined;
    }

    clear () {
        this.items = {};
    }

    size () {
        return Object.keys(this.items).length;
    }

    keys () {
        return Object.keys(this.items);
    }

    values () {
        let values = [];
        for (let k in this.items) {
            if (this.has(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    };

    each (fn) {
        for (let k in this.items) {
            if (this.has(k)) {
                fn(k, this.items[k]);
            }
        }
    }

    getItems () {
        return this.items;
    }
}

module.exports = Dictionary;