function Graph() {
    let vertices = [],
        adjList = new Map(),
        dfs_time = 0;

    function initializeColor(){
        let color = new Map(); // TODO 同样存在重复
        vertices.forEach(vertex=>{
            color.set(vertex, 'white');
        });
        return color;
    };

    function dfs_traversal_visit(u, color, callback){
        color.set(u, 'grey');
        callback && callback(u);
        let neighbors = adjList.get(u);
        neighbors.forEach(vertex=>{
            if (color.get(vertex) === 'white'){
                dfs_traversal_visit(vertex, color, callback);
            }
        });
        color.set(u, 'black');
    };

    function dfs_info_visit(u, color, discoveredTime, exploredTime, pred){
        console.log('discovered ' + u);
        color.set(u, 'grey');
        discoveredTime[u] = ++dfs_time;
        let neighbors = adjList.get(u);
        neighbors.forEach(vertex=>{
            if (color.get(vertex) === 'white'){
                pred[vertex] = u;
                dfs_info_visit(vertex, color, discoveredTime, exploredTime, pred);
            }
        });

        color.set(u, 'black');
        exploredTime[u] = ++dfs_time;
        console.log('explored ' + u);
    };



    // TODO 会重复添加顶点，没问题？
    this.addVertex = function(v){
       vertices.push(v);
       adjList.set(v, []);
    };


    // TODO  没有检查顶点是否存在
    this.addEdge = function(v, w, directed=false){
       adjList.get(v).push(w);
       if(!directed) adjList.get(w).push(v);
    };


    this.bfs_traversal = function(v, callback){
       let color = initializeColor(),
           queue = [];
       queue.push(v);
       while (queue.length){
            let u = queue.shift(),
                neighbors = adjList.get(u),
                len = neighbors.length
            color.set(u, 'grey');
            neighbors.forEach(vertex=>{
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


    this.bfs_info = function(v){
        let color = initializeColor(),
            queue = [],
            dis = new Map(),
            pred = new Map();
        queue.push(v);

        vertices.forEach(vertex=>{
            dis.set(vertex, 0);
            pred.set(vertex, null);
        });

        while (queue.length){
            let u = queue.shift(),
                neighbors = adjList.get(u);
            color.set(u, 'grey');
            neighbors.forEach(vertex=>{
                if (color.get(vertex) === 'white'){
                    color.set(vertex, 'grey');
                    dis.set(vertex, dis.get(u) + 1);
                    pred.set(vertex, u);
                    queue.push(vertex);
                }
            });
            color.set(u, 'black');
        }
        return {
            distances: dis,
            predecessors: pred
        };
    };


    this.bfs_getPath = function(v){
        let predecessors = this.bfs_info(v).predecessors;
        let oPath = new Map();
        let pred = null;
        predecessors.forEach((item, key)=>{
            pred = predecessors.get(key);
            oPath.set(key, []);
            while(pred !== null){
                oPath.get(key).unshift(pred);
                pred = predecessors.get(pred);
            }
            oPath.get(key).push(key);
        });
        return oPath;
    };


    this.dfs_traversal = function(callback){
        let color = initializeColor();
        vertices.forEach(vertex=>{
            if (color.get(vertex) === 'white'){
                dfs_traversal_visit(vertex, color, callback);
            }
        });
    };


    this.dfs_info = function(){
        let color = initializeColor(),
            discoveredTime = [],
            exploredTime = [],
            pred = [];
        dfs_time = 0;
        vertices.forEach(vertex=>{
            exploredTime[vertex] = 0;
            discoveredTime[vertex] = 0;
            pred[vertex] = null;
        });
        vertices.forEach(vertex=>{
            if (color.get(vertex) === 'white'){
                dfs_info_visit(vertex, color, discoveredTime, exploredTime, pred);
            }
        });
        return {
            discovery: discoveredTime,
            finished: exploredTime,
            predecessors: pred
        };
    };


    // dfs实现拓扑排序
    /*
     * Why toposort is the reverse order of dfs?
     *
     * A vertex in toposort must meet one of the following 2 conditions:
     *    1. This vertex has not previous vertex
     *    2. All the previous vertices of this vertex have be sorted already
     *
     * 就书上拓扑排序的例子来说：
     * 1. 如果试图以discovery的顺序进行排序，即排序结果为 A -> C -> F -> E -> D -> B。
     *    前三步都是符合上述两点要求的：A没有前溯节点，C和F的前溯节点 已经被排序了。但到了
     *    E，它有两个前溯节点，有一个并没有被排序。所以这种排序不是合理的拓扑排序。
     * 2. 如果试图以finish的顺序进行排序，即排序结果为 E -> F -> C -> D -> A -> B。显
     *    然第一步就已经不符合上面两个条件中的任意一个了。
     * 上述两种排序方式显然是最容易想到的，但都不符合。但是要怎么才能想到是finish的逆序？
     *
     */



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
