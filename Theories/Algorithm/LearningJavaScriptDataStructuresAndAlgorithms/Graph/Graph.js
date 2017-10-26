function Graph() {
    let vertices = [],
        adjList = new Map();

    function initializeColor(){
        let color = new Map(); // TODO 同样存在重复
        vertices.forEach((vertex)=>{
            color.set(vertex, 'white');
        });
        return color;
    };


    // TODO 会重复添加顶点，没问题？
    this.addVertex = function(v){
       vertices.push(v);
       adjList.set(v, []);
    };


    // TODO  没有检查顶点是否存在
    this.addEdge = function(v, w){
       adjList.get(v).push(w);
       adjList.get(w).push(v);
    };


    this.bfs = function(v, callback){
       let color = initializeColor(),
           queue = [];
       queue.push(v);
       while (queue.length){
            let u = queue.shift(),
                neighbors = adjList.get(u),
                len = neighbors.length
            color.set(u, 'grey');
            neighbors.forEach((vertex)=>{
                if(color.get(vertex)==='white'){
                    color.set(vertex, 'grey');
                    queue.push(vertex);
                }
            });
            color.set(u, 'black');
            if (callback) {
                callback(u);
            }
        }
    };


    this.toString = function(){
        let s = '',
            len = vertices.length;
        for (let i=0; i<len; i++){
            s += vertices[i] + ' -> ';
            adjList.get(vertices[i]).forEach((vertex)=>{
                s += vertex + ' ';
            });
            s += '\n';
        }
        return s;
    };
}


module.exports = Graph;
