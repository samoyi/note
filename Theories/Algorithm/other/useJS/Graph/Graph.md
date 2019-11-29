# Graph

## 设计思想
1. 任何表示若干对象关系的逻辑都可以抽象成图的数据结构。
2. 或者说，任何现实事物都可以抽象成任何数据结构模型，就看合适程度。


## 广度优先遍历
### 遍历思想
1. 从图中的任意一个点开始，找到和它联系的所有相邻点，因此完成对该点的探索。
2. 再依次探索刚才找到的每一个相邻点，找到每个相邻点的所有相邻点。
3. 像涟漪一样一层一层的向外扩散。这种层次感是最关键的**设计美学**。

### 关键词
#### 广度优先
1. 每次探索一个顶点，都要先找到它的所有相邻顶点，才会再探索其中每一个相邻顶点。
2. 先优先探索完一个顶点，再探索它的相邻节点。探索完它的相邻节点后，在探索这些相邻节点的相邻节点。

#### 一层一层
1. 在一个关系网中，是可以用层次关系来表示的。例如：我的朋友——我的朋友的朋友——我的朋友的朋友的朋友，广度优先就是按照这种层次关系来遍历的，因此可以很好的反应出整个关系网中的每个节点和起始节点的层次关系。
2. 又因为这种从起点逐层向外扩展的遍历方式，所以也很方便确定起始点距离任何节点的层级距离。


## 深度优先遍历
### 遍历思想
1. 相比于广度优先是从内到外的一层一层完成探索，深度优先是访问到一个节点时先不完成探索，而是先访问它的“子节点”。
2. 只要有子节点，就优先递归访问子节点。最后再反向递归完成探索。
3. 广度优先保证了层状结构，而深度优先保证了子节点先于它的所有父节点完成探索。因为遍历到它的任何父节点时，父节点都会优先访问子节点，而不会自己先完成探索。

### 关键词
#### 先递归到底
先根据路线追查到底，再进行实际的工作

#### 子节点优先完成
<img src="./images/toposort.png" width="600" />

1. 一个子节点完成探索前，它的父节点都不可能完成探索。因此上图只看 ABD 之间的完成顺序，只能是 D-A-B 或者是 D-B-A，不可能是其他顺序。
2. 反过来也可以说，如果一个节点的父节点完成了探索，则它的所有子节点也肯定已经完成了。也就是说如果 A 完成了，则 C、D、F、E 也肯定完成了。
3. 实现拓扑排序时，要求一个节点的所有的父节点都完成之后才能完成该节点，即 A 和 B 先完成，然后才能完成 D。这正好和第一点是相反的。所以只要把深度优先遍历的完成顺序颠倒过来，就可以实现拓扑排序。

    