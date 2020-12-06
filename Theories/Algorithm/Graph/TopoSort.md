# 拓扑排序


<!-- TOC -->

- [拓扑排序](#拓扑排序)
    - [定义](#定义)
    - [算法](#算法)
    - [实现](#实现)
    - [性质](#性质)
        - [有向图的无环和无后向边（《算法导论》定理 22.11）](#有向图的无环和无后向边算法导论定理-2211)
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
6. 当我们需要以一定的顺序编排一些任务或步骤时，就可以使用拓扑排序。


## 算法
1. 根据拓扑排序的定义，排序有向图的所有节点时，都必须按照边的方向。也就是说要先执行一个子节点的若干个父节点，才能执行这个子节点。
2. 进一步的，在一组祖先节点和后代节点的关系中，必须要先执行祖先节点才能再执行后代节点。
3. 乍看起来这个顺序好像是深度优先搜索的节点发现顺序，因为肯定是先发现祖先节点再发现后代节点。
4. 如果深度优先森林只有一棵树的话，这样确实可以。但如果像上图那样有两棵树时，就不行了，因为如果从 A 开始搜索，那么 D 会在 B 之前被发现。
5. 根据深度优先搜索的算法，E 一定会在 B 和 F 之前完成，因为当探索到 B 或 F 时，就要再深度优先的探索和完成 E。
6. 假如从 A 开始遍历，则肯定是 E 完成了 A 才能完成；而 B 则会在 A 的所有后代节点及 A 本身完成之后才完成，因为 B 是在 A 深度遍历完之后重新开了一次遍历，而不是来自某个节点。
7. 即 DFS 的完成顺序是：一个节点完成之后，它的所有父节点才会完成。
8. 而拓扑排序的要求是：一个节点的所有父节点都完成了，这个节点才能完成。这正好和 DFS 的完成顺序相反，所以只要把 DFS 的完成顺序颠倒过来，就是拓扑排序要求的顺序。


## 实现
    ```js
    topoSort () {
        let {exploredTime} = this.DFSWidthMoreInfo();
        console.log(exploredTime)
        let entries = Object.entries(exploredTime).sort((a, b) => {
            return b[1] - a[1];
        })
        console.log(entries)
        return entries.map(item=>item[0]);
    }
    ```
9. 注意因为是有向图，所以实例化的时候需要实例化为有向的
    ```js
    let graph = new Graph(true);
    ```


## 性质
### 有向图的无环和无后向边（《算法导论》定理 22.11）
1. 有向图如果无环，那肯定没有后向边。因为根据后向边的定义，如果有后向边，那后向边的两个节点也会通过一个或多个树边相连，然后和后向边组合成为一个换。
2. 同样，有向图如果没有后向边也肯定没有环。因为如果有环 A-B-C-D-A，从节点 A 入环，那会有树边 A->B->C->D，但是不能有树边 D->A 了，因为 A 已经是灰色的了。那么 D->A 不是树边，D 现在作为 A 的后代，D->A 也不是前向边，只能是后向边了。


## 复杂度



## References
* [学习JavaScript数据结构与算法](https://book.douban.com/subject/26639401/)
* [算法（第4版）](https://book.douban.com/subject/19952400/)
* [Python数据结构与算法分析（第2版）](https://book.douban.com/subject/34785178/)
* [算法导论（原书第3版）](https://book.douban.com/subject/20432061/)