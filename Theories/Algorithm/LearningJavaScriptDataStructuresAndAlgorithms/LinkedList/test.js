const PriorityQueue = require('./PriorityQueue');

var priorityQueue = new PriorityQueue();
priorityQueue.enqueue("John", 2);
priorityQueue.enqueue("Jack", 1);
priorityQueue.enqueue("Camila", 5);
priorityQueue.print();
console.log(priorityQueue.priority(0));
console.log(priorityQueue.priority(1));
console.log(priorityQueue.priority(2));
