const Graph = require('./Graph');

graph = new Graph();
myVertices = ['A','B','C','D','E','F'];
for (i=0; i<myVertices.length; i++){
    graph.addVertex(myVertices[i]);
}
graph.addEdge('A', 'C', true);
graph.addEdge('A', 'D', true);
graph.addEdge('B', 'D', true);
graph.addEdge('B', 'E', true);
graph.addEdge('C', 'F', true);
graph.addEdge('F', 'E', true);
var result = graph.dfs_info();
console.log(result);
