const Graph = require('./Graph');

var graph = new Graph();
var myVertices = ['A','B','C','D','E','F','G','H','I'];

myVertices.forEach((vertex)=>{
    graph.addVertex(vertex);
});

graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('A', 'D');
graph.addEdge('C', 'D');
graph.addEdge('C', 'G');
graph.addEdge('D', 'G');
graph.addEdge('D', 'H');
graph.addEdge('B', 'E');
graph.addEdge('B', 'F');
graph.addEdge('E', 'I');

console.log(graph.toString());
console.log('===========visit all=============');


function printNode(value){ //{16}
    console.log('Visited vertex: ' + value); //{17}
}
graph.bfs(myVertices[0], printNode); //{18}
