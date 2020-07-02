const Queue = require('../Queue/Queue');
const Dictionary = require('./Dictionary');

// 为了保证算法的效率，务必访问每个顶点至多两次。连通图中每条边和顶点都会被访问到。
// 当要标注已经访问过的顶点时，我们用三种颜色来反映它们的状态。
// 白色：表示该顶点还没有被访问。
// 灰色：表示该顶点被访问过，但并未被探索过。
// 黑色：表示该顶点被访问过且被完全探索过。

// 在构建图时，所有顶点都被初始化成白色。白色代表该顶点没有被访问过。
// 当顶点第一次被访问时，它就会被标记为灰色，并被加进待访问顶点列表中。
// 完全探索一个顶点要求我们查看该顶点的每一个相邻顶点。当完成对该顶点的完全探索之后，它就会被标记为黑色。
// 这意味着一旦顶点变为黑色，就没有白色顶点与之相连。灰色顶点仍然可能与一些白色顶点相连，这意味着还有额外的顶点可以访问。

function initializeColorMapping (vertices) {
    let colorMapping = {};
    vertices.forEach(vertex=>{
        colorMapping[vertex] = 'white';
    });
    return colorMapping;
}


let normalDFS_indent = 0;
function exploreForNormalDFS (vertex, adjacencyList, colorMapping, callback) {
    colorMapping[vertex] = 'grey';
    
    callback && callback(vertex);

    console.log(' '.repeat(normalDFS_indent) + 'Discovered ' + vertex);
    normalDFS_indent += 4;

    let neighborList = adjacencyList.get(vertex);
    neighborList.forEach((neighbor) => {
        if (colorMapping[neighbor] === 'white') {
            exploreForNormalDFS(neighbor, adjacencyList, colorMapping, callback);
        }
    });
    colorMapping[vertex] = 'black';

    normalDFS_indent -= 4;
    console.log(' '.repeat(normalDFS_indent) + 'explored ' + vertex);
}


let DFSWidthMoreInfo_indent = 0;
let DFSWidthMoreInfo_time = 0;
function exploreForDFSWidthMoreInfo (vertex, adjacencyList, colorMapping, info) {
    colorMapping[vertex] = 'grey';

    info.discoveredTime[vertex] = ++DFSWidthMoreInfo_time;

    console.log(' '.repeat(DFSWidthMoreInfo_indent) + 'Discovered ' + vertex);
    DFSWidthMoreInfo_indent += 4;

    let neighborList = adjacencyList.get(vertex);
    neighborList.forEach((neighbor) => {
        if (colorMapping[neighbor] === 'white') {
            // 记录 vertex 为其相邻节点的前溯节点
            info.predecessors[neighbor] = vertex; 
            // 递归
            exploreForDFSWidthMoreInfo(neighbor, adjacencyList, colorMapping, info);
        }
    });

    // vertex 节点的所有子节点都遍历完成
    colorMapping[vertex] = 'black';
    info.exploredTime[vertex] = ++DFSWidthMoreInfo_time;
    
    DFSWidthMoreInfo_indent -= 4;
    console.log(' '.repeat(DFSWidthMoreInfo_indent) + 'explored ' + vertex);
};



class Graph {

    constructor(isDirected=false) {
        this.vertices = [];
        this.adjacencyList = new Dictionary(); // 会使用顶点的名字作为键，邻接顶点列表作为值
        this.isDirected = isDirected;
    }

    addVertex (v) {
        this.vertices.push(v);
        this.adjacencyList.set(v, []);
    }

    addEdge (v, w) {
        this.adjacencyList.get(v).push(w);
        if (!this.isDirected) {
            this.adjacencyList.get(w).push(v);
        }
    }

    toString () {
        let str = '';
        for (let i = 0; i < this.vertices.length; i++) {
            let v = this.vertices[i];
            str += v + ' -> ';
            let neighbors = this.adjacencyList.get(v);
            for (let j = 0; j < neighbors.length; j++) {
                str += neighbors[j] + ' ';
            }
            str += '\n';
        }
        return str;
    }

    
    // Breadth-First Search
    bfs (v, callback) {
        let colorMapping = initializeColorMapping(this.vertices);
        let queue = new Queue();
        queue.enqueue(v); // 遍历起始节点

        // 遍历每一个节点
        while (!queue.isEmpty()) {
            let u = queue.dequeue();
            let neighbors = this.adjacencyList.get(u);
            colorMapping[u] = 'grey'; // 该节点现在已经访问
            // 访问该节点的相邻节点
            for (let i = 0; i < neighbors.length; i++) {
                let n = neighbors[i];
                // 过滤掉已经访问过的相邻节点
                if (colorMapping[n] === 'white') {
                    colorMapping[n] = 'grey';
                    // 被访问的节点加入队列，之后会被探索
                    queue.enqueue(n);
                }
            }
            colorMapping[u] = 'black'; // 该节点的所有相邻节点都已经被访问，现在该节点就是被完全探索的状态
            if (callback) {
                callback(u);
            }
        }
    }

    // 兼容有向图的广度优先搜索
    bfsCompatibleWithDirected (callback) {
        let colorMapping = initializeColorMapping(this.vertices);

        this.vertices.forEach((vertex)=>{
            if (colorMapping[vertex] === 'white') {
                let queue = new Queue();
                queue.enqueue(vertex);

                while (!queue.isEmpty()) {
                    let u = queue.dequeue();
                    let neighbors = this.adjacencyList.get(u);
                    colorMapping[u] = 'grey';

                    for (let i = 0; i < neighbors.length; i++) {
                        let n = neighbors[i];
                        if (colorMapping[n] === 'white') {
                            colorMapping[n] = 'grey';
                            queue.enqueue(n);
                        }
                    }

                    colorMapping[u] = 'black';

                    if (callback) {
                        callback(u);
                    }
                }
            }
        });
    }

    // 遍历获得每个节点距离起始节点的距离以及每个节点的前溯节点
    BFSWidthMoreInfo (v) {
        let colorMapping = initializeColorMapping(this.vertices);
        let queue = new Queue();
        queue.enqueue(v);

        let distances = {};   // 记录每个节点距离起始节点的距离
        let predecessors = {}; // 记录每个节点的前溯节点

        // 初始化每个节点距离起始节点的距离和前溯节点
        this.vertices.forEach((vertex) => {
            distances[vertex] = 0;
            predecessors[vertex] = null;
        });

        while (!queue.isEmpty()) {
            let u = queue.dequeue();
            colorMapping[u] = 'grey';

            this.adjacencyList.get(u).forEach((item) => {
                if (colorMapping[item] === 'white') {
                    colorMapping[item] = 'grey';

                    // 因为节点 item 是 u 的相邻节点，所以距离起始节点的距离就比 u 大一
                    distances[item] = distances[u] + 1;
                    predecessors[item] = u;
                    queue.enqueue(item);
                }
            });

            colorMapping[u] = 'black';
        }

        return {
            distances,
            predecessors,
        };
    }

    // 使用 BFSWidthMoreInfo 计算指定顶点 v 到其他所有顶点的最短路径
    getShortestPaths (v) {
        let {predecessors} = this.BFSWidthMoreInfo(v); // 获得每个节点的前溯节点
        let pathes = {};
        for (let key in predecessors) { // 遍历记录每个节点距离顶点的最短路径
            let predecessor = predecessors[key];
            if (predecessor === null) continue;
            pathes[key] = key;
            while (predecessor) {
                pathes[key] = predecessor + '-' + pathes[key];
                predecessor = predecessors[predecessor];
            }
        }
        return pathes;
    }

    // 深度遍历
    normalDFS (callback) {
        let colorMapping = initializeColorMapping(this.vertices);
        // 遍历每一个节点，如果某个节点还未被探索，则对它进行深度探索。
        // 但因为是递归遍历，如果图是无向的，那么从一个节点开始的第一轮 forEach 里面，就会遍历了所有后代节点，
        // 所以其实之后轮的 forEach 里面 vertex 都已经不是 white 了。
        // 但是在无向图中，从一个节点开始并不一定会遍历到所有节点。
        // 所以还是要用 forEach，在一次遍历到无可遍历但还有节点没有遍历到的时候，再从其他没有遍历的节点新开一轮遍历。
        this.vertices = [...this.vertices.splice(1, 1), ...this.vertices]
        console.log(this.vertices)
        
        this.vertices.forEach((vertex)=>{
            if (colorMapping[vertex] === 'white') {
                console.log('forEach -------------------------', vertex)
                exploreForNormalDFS(vertex, this.adjacencyList, colorMapping, callback);
            }
        });
    }
    
    // 记录更多信息的深度遍历
    DFSWidthMoreInfo () {
        let colorMapping = initializeColorMapping(this.vertices);
        const info = {
            discoveredTime: {},
            exploredTime: {},
            predecessors: {},
        }
        DFSWidthMoreInfo_time = 0;

        // 初始化每个顶点的发现时间、探索完成时间和前溯节点
        this.vertices.forEach((vertex) => {
            info.exploredTime[vertex] = 0;
            info.discoveredTime[vertex] = 0;
            info.predecessors[vertex] = null;
        });

        this.vertices.forEach((vertex) => {
            if (colorMapping[vertex] === 'white') {
                exploreForDFSWidthMoreInfo(vertex, this.adjacencyList, colorMapping, info);
            }
        });
        return info;
    }


    // 根据 DFS 实现拓扑排序
    // Graph 需要实例化为有向图
    topoSort () {
        let {exploredTime} = this.DFSWidthMoreInfo();
        let entries = Object.entries(exploredTime).sort((a, b) => {
            return b[1] - a[1];
        })
        return entries.map(item=>item[0]);
    }
}


module.exports = Graph;