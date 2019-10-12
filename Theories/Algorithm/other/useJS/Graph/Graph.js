const Queue = require('../Queue/Queue');
const Dictionary = require('./Dictionary');

// 完全探索一个顶点要求我们查看该顶点的每一条边，对于每一条边所连接的没有被访问过的顶点，
// 将其标注为被发现的，并将其加进待访问顶点列表中。
// 为了保证算法的效率，务必访问每个顶点至多两次。连通图中每条边和顶点都会被访问到。

// 当要标注已经访问过的顶点时，我们用三种颜色来反映它们的状态。
// 白色：表示该顶点还没有被访问。
// 灰色：表示该顶点被访问过，但并未被探索过。
// 黑色：表示该顶点被访问过且被完全探索过。
// 这就是之前提到的务必访问每个顶点最多两次的原因。
function initializeColor (vertices) {
    let color = [];
    for (let i = 0; i < vertices.length; i++) {
        color[vertices[i]] = 'white';
    }
    return color;
}

let dfsIndent = 0;
function dfsVisit (u, adjList, colors, callback) {
    colors[u] = 'grey';
    callback && callback(u);

    console.log(' '.repeat(dfsIndent) + 'Discovered ' + u);
    dfsIndent += 4;

    let neighbors = adjList.get(u);
    for (let i = 0; i < neighbors.length; i++) {
        let w = neighbors[i];
        if (colors[w] === 'white') {
            dfsVisit(w, adjList, colors, callback);
        }
    }
    colors[u] = 'black';

    dfsIndent -= 4;
    console.log(' '.repeat(dfsIndent) + 'explored ' + u);
}

let DFSIndent = 0;
let DFSTime = 0;
function DFSVisit (u, adjList, colors, d, f, p) {
    colors[u] = 'grey';
    d[u] = ++DFSTime;

    console.log(' '.repeat(DFSIndent) + 'Discovered ' + u);
    DFSIndent += 4;

    let neighbors = adjList.get(u);
    for (let i = 0; i < neighbors.length; i++) {
        let w = neighbors[i];
        if (colors[w] === 'white') {
            p[w] = u;
            DFSVisit(w, adjList, colors, d, f, p);
        }
    }
    colors[u] = 'black';
    f[u] = ++DFSTime;
    
    DFSIndent -= 4;
    console.log(' '.repeat(DFSIndent) + 'explored ' + u);
};

class Graph {
    constructor(isDirected=false) {
        this.vertices = [];
        this.adjList = new Dictionary(); // 邻接表
        this.isDirected = isDirected;
    }


    addVertex (v) {
        this.vertices.push(v);
        this.adjList.set(v, []); // initialize adjacency list with array as well;
    }

    addEdge (v, w) {
        this.adjList.get(v).push(w);
        if (!this.isDirected) {
            this.adjList.get(w).push(v);
        }
    }

    toString () {
        let str = '';
        for (let i = 0; i < this.vertices.length; i++) {
            let v = this.vertices[i];
            str += v + ' -> ';
            let neighbors = this.adjList.get(v);
            for (let j = 0; j < neighbors.length; j++) {
                str += neighbors[j] + ' ';
            }
            str += '\n';
        }
        return str;
    }

    
    // Breadth-First Search
    bfs (v, callback) {
        let colors = initializeColor(this.vertices);
        let queue = new Queue();
        queue.enqueue(v); // 遍历起始顶点
        // 遍历每一个顶点
        while (!queue.isEmpty()) {
            let u = queue.dequeue();
            let neighbors = this.adjList.get(u);
            colors[u] = 'grey'; // 该顶点现在已经访问
            // 循环访问该顶点的相邻顶点
            for (let i = 0; i < neighbors.length; i++) {
                let n = neighbors[i];
                if (colors[n] === 'white') {
                    colors[n] = 'grey';
                    // 被访问的节点加入队列，之后会被探索
                    queue.enqueue(n);
                }
            }
            colors[u] = 'black'; // 该顶点的所有相邻节点都已经被访问，现在该节点就是被探索的状态
            if (callback) {
                callback(u);
            }
        }
    }

    // 遍历获得每个顶点距离起始顶点的距离以及每个顶点的前溯顶点
    BFS (v) {
        let colors = initializeColor(this.vertices);
        let queue = new Queue();
        let distances = {}; // 每个顶点距离起始顶点的距离
        let preVertex = {}; // 每个顶点的前溯顶点
        queue.enqueue(v);

        // 初始化
        for (let i = 0; i < this.vertices.length; i++) {
            distances[this.vertices[i]] = 0;
            preVertex[this.vertices[i]] = null;
        }

        while (!queue.isEmpty()) {
            let u = queue.dequeue();
            let neighbors = this.adjList.get(u);
            colors[u] = 'grey';
            for (let i = 0; i < neighbors.length; i++) {
                let n = neighbors[i];
                if (colors[n] === 'white') {
                    colors[n] = 'grey';
                    distances[n] = distances[u] + 1;
                    preVertex[n] = u;
                    queue.enqueue(n);
                }
            }
            colors[u] = 'black';
        }

        return {
            distances: distances,
            predecessors: preVertex
        };
    }

    // 使用 BFS 计算指定顶点 v 到其他所有顶点的最短路径
    getShortestPaths (v) {
      let {predecessors} = this.BFS(v);
      let pathes = {};
      for (let key in predecessors) {
        let vertex = predecessors[key];
        if (vertex === null) continue;
        pathes[key] = key;
        while (vertex) {
          pathes[key] = vertex + '-' + pathes[key];
          vertex = predecessors[vertex];
        }
      }
      return pathes;
    }

    // Depth-First Search
    dfs (callback) {
        let colors = initializeColor(this.vertices);
        for (let i = 0; i < this.vertices.length; i++) {
            if (colors[this.vertices[i]] === 'white') {
                dfsVisit(this.vertices[i], this.adjList, colors, callback);
            }
        }
    }
    
    // 计算 dfs 时每个顶点的发现时间和探索时间，以及其前溯节点
    DFS () {
        let colors = initializeColor(this.vertices);
        let d = {};
        let f = {};
        let p = {};
        DFSTime = 0;

        for (let i = 0; i < this.vertices.length; i++) {
            f[this.vertices[i]] = 0;
            d[this.vertices[i]] = 0;
            p[this.vertices[i]] = null;
        }

        for (let i = 0; i < this.vertices.length; i++) {
            if (colors[this.vertices[i]] === 'white') {
                DFSVisit(this.vertices[i], this.adjList, colors, d, f, p);
            }
        }

        return {
            discovery: d,
            finished: f,
            predecessors: p
        };
    }

    // 根据 DFS 实现拓扑排序
    toposort () {
        let {finished} = this.DFS();
        let entries = Object.entries(finished).sort((a, b) => {
            return b[1] - a[1];
        })
        return entries.map(item=>item[0]);
    }
    // E 一定会在 B 和 F 之前完成，因为当探索到 B 或 F 时，就要再深度优先的探索和完成 E
    // 所以在 DFS 遍历时 E 的完成时间一定排在 B 和 F 前面
    // 因为 DFS 的的完成顺序应该和拓扑排序的完成顺序相反，所以“E 的完成时间一定排在 B 和 F 前面”就保证了拓扑排序时 E 的完成时间一定排在 B 和 F 后面
}


module.exports = Graph;