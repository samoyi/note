# 拓扑排序


<!-- TOC -->

- [拓扑排序](#拓扑排序)
    - [定义](#定义)
    - [算法](#算法)
    - [实现](#实现)
    - [复杂度](#复杂度)
    - [References](#references)

<!-- /TOC -->


## 定义
1. 给定下图，假定每个顶点都是一个我们需要去执行的任务：
    <img src="./images/toposort.png" width="300" style="display: block; margin: 5px 0 10px;" />
2. 这是一个有向图，意味着任务的执行是有顺序的。例如，任务 F 不能在任务 A 之前执行；只有 A 和 B 都完成之后才能执行 D。
3. 注意这个图没有环，意味着这是一个无环图。所以，我们可以说该图是一个 **有向无环图**（directed acyclic graph, DAG）。
4. A **topological sort** of a DAG $G=(V,E)$ is a linear ordering of all its vertices such that if $G$ contains an edge $(u, v)$, then $u$ appears before $v$ in the ordering.
5. If the graph contains a cycle, then no linear ordering is possible. 所以拓扑排序只能应用于 DAG。
6. 所以拓扑排序可以满足上面的任务要求。也就是当要执行一个节点之前，必须要先执行完该节点的所有前溯节点。


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


## References
* [学习JavaScript数据结构与算法](https://book.douban.com/subject/26639401/)
* [算法（第4版）](https://book.douban.com/subject/19952400/)
* [Python数据结构与算法分析（第2版）](https://book.douban.com/subject/34785178/)
* [算法导论（原书第3版）](https://book.douban.com/subject/20432061/)