# 拓扑排序


<!-- TOC -->

- [拓扑排序](#拓扑排序)
    - [TODO](#todo)
    - [定义](#定义)
    - [判断是否有环](#判断是否有环)
    - [算法](#算法)
    - [实现](#实现)
    - [复杂度](#复杂度)
    - [根据入度实现拓扑排序](#根据入度实现拓扑排序)
    - [References](#references)

<!-- /TOC -->


## TODO
* 练习 22.4-2


## 定义
1. 给定下图，假定每个顶点都是一个我们需要去执行的任务：
    <img src="./images/toposort.png" width="300" style="display: block; margin: 5px 0 10px;" />
2. 这是一个有向图，意味着任务的执行是有顺序的。例如，任务 F 不能在任务 A 之前执行；只有 A 和 B 都完成之后才能执行 D。
3. 注意这个图没有环，意味着这是一个无环图。所以，我们可以说该图是一个 **有向无环图**（directed acyclic graph, DAG）。
4. A **topological sort** of a DAG $G=(V,E)$ is a linear ordering of all its vertices such that if $G$ contains an edge $(u, v)$, then $u$ appears before $v$ in the ordering.
5. If the graph contains a cycle, then no linear ordering is possible. 所以拓扑排序只能应用于 DAG。
6. 所以拓扑排序可以满足上面的任务要求。也就是当要执行一个节点之前，必须要先执行完该节点的所有前溯节点。


## 判断是否有环
1. 《算法导论》356 页引理 22.11。
2. 因此可以根据 DFS 时是否有后向边来判断是否有环。也就是首次探索边 $(u, v)$ 时，$v$ 是否为灰色。
3. 但是对于无向图来说，可以说任何两个节点的边都是一个环。所以不仅需要 $v$ 为灰色，还需要 $v$ 不是 $u$ 的前溯节点
    ```js
    isCyclic () {
        let adjacencyList = this.adjacencyList;
        let isDirected = this.isDirected;

        let searchedStateColors = {};
        let predecessors = {};
        this.vertices.forEach((v) => {
            searchedStateColors[v] = "white";
            predecessors[v] = null;
        });

        let hasBackEdge = false;

        this.vertices.forEach((v) => {
            if (hasBackEdge) {
                return;
            }
            if ( searchedStateColors[v] === "white") {
                _dfs(v, searchedStateColors);
            }
        });

        function _dfs (vertex, searchedStateColors) {
            searchedStateColors[vertex] = "gray";
            let neighbors = adjacencyList.get(vertex);
            neighbors.forEach((n)=>{
                if ( searchedStateColors[n] === "gray" ) {
                    if (isDirected) {
                        hasBackEdge = true;
                        return;
                    }
                    else if (n !== predecessors[vertex]) {
                        hasBackEdge = true;
                        return;
                    }
                }
                if ( searchedStateColors[n] === "white" ) {
                    predecessors[n] = vertex;
                    _dfs(n, searchedStateColors);
                }
            });
            searchedStateColors[vertex] = "black";
        }

        return hasBackEdge
    }
    ```
4. 测试有向图。《算法导论》351 页的图本来是有环的，但是删掉两个边就是无环的了
    ```js
    let graph = new Graph(true);

    graph.addEdge('u', 'v');
    graph.addEdge('u', 'x');
    // graph.addEdge('x', 'v');
    graph.addEdge('v', 'y');
    graph.addEdge('y', 'x');
    graph.addEdge('w', 'y');
    graph.addEdge('w', 'z');
    // graph.addEdge('z', 'z');

    console.log(graph.isCyclic()); // false
    ```
4. 测试无向图
    ```js
    let graph = new Graph();

    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    graph.addEdge('A', 'D');
    graph.addEdge('B', 'E');
    graph.addEdge('B', 'F');
    // graph.addEdge('C', 'D');
    graph.addEdge('C', 'G');
    // graph.addEdge('D', 'G');
    graph.addEdge('D', 'H');
    graph.addEdge('E', 'I');

    console.log(graph.isCyclic()); // false
    ```


## 算法
1. 根据拓扑排序的定义，排序有向图的所有节点时，都必须按照边的方向。也就是说要先执行一个子节点的所有个父节点，才能执行这个子节点。
2. 进一步的，在一组祖先节点和后代节点的关系中，必须要先执行祖先节点才能再执行后代节点。
3. 乍看起来这个顺序好像是深度优先搜索的节点发现顺序，因为肯定是先发现祖先节点再发现后代节点。
4. 但这个祖先和后代，只是对于深度优先树中树边的关系。例如《算法导论》352 页的图，对于同一棵深度优先树的树边来说，是先发现祖先节点后发现后代节点。但是显然对于横向边 $(w, x)$ 或 $(v, w)$ 来说，显然不遵守这个顺序。
5. 再看看深度优先搜索的节点完成顺序，后代节点一定是在所有的祖先节点之前完成。
6. 因为对于任何一条边 $(u, v)$ 来说，它要么是树边，要么是前向边，要么是横向边，而不可能是后向边。因为 DAG 不能存在后向边。
7. 如果是树边和前向边，那肯定后代节点 $v$ 先完成；如果是横向边，那么后代节点 $v$ 就是黑色，也就是说后代节点先完成了。
8. 也就是说，DFS 的完成顺序是：一个节点完成之后，它的所有父节点才会完成。
8. 而拓扑排序的要求是：一个节点的所有父节点都完成了，这个节点才能完成。这正好和 DFS 的完成顺序相反，所以只要把 DFS 的完成顺序颠倒过来，就是拓扑排序要求的顺序。


## 实现
1. JS 实现
    ```js
    topological_sort () {
        return Object.keys(this.dfs().finishedTime).reverse();
    }
    ```
2. 测试
    ```js
    let graph = new Graph(true);

    graph.addEdge('A', 'C');
    graph.addEdge('A', 'D');
    graph.addEdge('B', 'D');
    graph.addEdge('B', 'E');
    graph.addEdge('C', 'F');
    graph.addEdge('F', 'E');

    console.log(graph.topological_sort()); // ['B', 'A', 'D', 'C', 'F', 'E']
    ```


## 复杂度
用 $O(V+E)$ 的时间完成深度优先搜索，再用 $O(V)$ 的时间反转列表。


## 根据入度实现拓扑排序
1. 根据拓扑排序的要求，当前可以执行的节点就是不依赖其他节点的，也就是没有前溯节点的，也就是入度为 0 的节点。
2. 那么我们可以先执行当前入度为 0 的节点，然后再把这些节点以及它们的边删掉，这样，它们的相邻节点就没有这些前溯节点了，也就不依赖它们了。
3. 删除了当前入度为 0 的节点后，肯定就会有一些之前入度不为 0 的节点变为 0 了，也就是说这些节点要依赖的节点已经执行完成了。
4. 那么我们就再次按照前面的步骤删除当前入度为 0 的节点。以此类推，直到删除所有的节点。
5. 其实这种算法感觉上更符合拓扑排序的语义，就是先执行并移除不依赖其他节点的节点，以此类推。
6. 实现
    ```js
    in_degree_topological_sort () {
        let sortedList = [];

        // 计算各个节点的入度
        let indegrees = {};
        this.vertices.forEach((v) => {
            indegrees[v] = 0;
        });
        this.adjacencyList.forEach((list)=>{
            list.forEach((key) => {
                indegrees[key]++;
            });
        })

        let vertices = this.vertices; // 计算的时候要不断删除节点，所以拷贝一份
        while (vertices.length) {
            vertices.forEach((v) => {
                if ( indegrees[v] === 0 ) {
                    sortedList.push(v);
                    vertices.splice(vertices.indexOf(v), 1);

                    // 删除入度为 0 的节点后不需要重新计算图的入度，直接把相邻的节点入度减一即可
                    let neighbors = this.adjacencyList.get(v);
                    neighbors.forEach((n)=>{
                        indegrees[n]--;
                    });
                }
            });
        }

        return sortedList;
    }
    ```
7. 计算入度的时间为 $O(E)$；删除节点时要用时 $O(V)$ 遍历每一个节点，还要用时 $O(E)$ 删除所有的边；因此总的用时为 $O(V+E)$。


## References
* [学习JavaScript数据结构与算法](https://book.douban.com/subject/26639401/)
* [算法（第4版）](https://book.douban.com/subject/19952400/)
* [Python数据结构与算法分析（第2版）](https://book.douban.com/subject/34785178/)
* [算法导论（原书第3版）](https://book.douban.com/subject/20432061/)
* [github.com/gzc/CLRS](https://github.com/gzc/CLRS/blob/master/C22-Elementary-Graph-Algorithms/22.4.md)