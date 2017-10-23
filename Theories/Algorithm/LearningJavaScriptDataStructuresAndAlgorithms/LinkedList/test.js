const CircularLinkedList = require('./CircularLinkedList');

var circularLinkedList = new CircularLinkedList();

circularLinkedList.append(15);
circularLinkedList.print();

circularLinkedList.append(16);
circularLinkedList.print();


circularLinkedList.insert(0,14);
circularLinkedList.print();


circularLinkedList.insert(3,17);
circularLinkedList.print();

circularLinkedList.reverse();
circularLinkedList.print();


// 各种reverse之后的head和tail对不对



//
//
// console.log(circularLinkedList.indexOf(14.5));
// console.log(circularLinkedList.indexOf(17));
