class Queue {
    constructor(){
        this.items = [];
    }

    enqueue (el) {
        return this.items.push(el);
    }

    dequeue () {
        return this.items.shift();
    }

    front () {
        return this.items[0];
    }

    isEmpty () {
        return this.items.length === 0;
    }

    size () {
        return this.items.length;
    }

    clear () {
        this.items = [];
    }

    print () {
        console.log(this.items.toString());
    }
}

module.exports = Queue;