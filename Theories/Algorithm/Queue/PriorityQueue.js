// 有优先级的队列（可以根据优先级插队）


// 优先级元素构造函数，包括元素值和优先级
class QueueElement {
    constructor(element, priority) {
        this.element = element;
        this.priority = priority;
    }
}

class PriorityQueue {
    constructor(){
        this.items = [];
    }

    enqueue (element, priority) {
        let queueElement = new QueueElement(element, priority);

        if (this.isEmpty()) {
            return this.items.push(queueElement);
        } 
        else {
            // 优先级数字越大则优先级越高
            for (let i = 0; i < this.items.length; i++) {
                if (queueElement.priority > this.items[i].priority) {
                    this.items.splice(i, 0, queueElement);
                    return this.items.length + 1;
                }
            }
            return this.items.push(queueElement);
        }
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

    priority (index) {
        return this.items[index].priority;
    }

    print () {
        console.log(this.items.map(item => item.element).toString());
    }
}

module.exports = PriorityQueue;