# Diff Algorithm

<!-- TOC -->

- [Diff Algorithm](#diff-algorithm)
    - [Level by Level](#level-by-level)
    - [List](#list)
        - [Diff 算法并不知道用户操作](#diff-算法并不知道用户操作)
        - [使用 key 给节点一个身边标识](#使用-key-给节点一个身边标识)
    - [References](#references)

<!-- /TOC -->


## Level by Level
1. Finding the minimal number of modifications between two arbitrary trees is a $O(n^3)$ problem. As you can imagine, this isn’t tractable for our use case. React uses simple and yet powerful heuristics to find a very good approximation in $O(n)$. TODO 复杂度分析，[参考](https://www.zhihu.com/question/66851503/answer/246766239)
2. React only tries to reconcile trees level by level. This drastically reduces the complexity and isn’t a big loss as it is very rare in web applications to have a component being moved to a different level in the tree. They usually only move laterally among children. 也就是说，不会进行深度 diff 比较。
    <img src="./images/01.png" width="400" style="display: block; margin: 5px 0 10px 0;" />
3. 比如如下变动
    ```html
    <!-- 变动前 -->
    <div>                       <!-- 层级1 -->
        <p>                     <!-- 层级2 -->
            <b> aoy </b>        <!-- 层级3 -->   
            <span>diff</span>   <!-- 层级3 -->
        </p> 
    </div>

    <!-- 变动后 -->
    <div>                       <!-- 层级1 -->
        <p>                     <!-- 层级2 -->
            <b> aoy </b>        <!-- 层级3 -->
        </p>
        <span>diff</span>       <!-- 层级2 -->
    </div>
    ```
4. 如果 diff 算法会进行深度比较的话，它就会直接把 `<span>diff</span>` 从第三层提出来放到 `<p>` 后面，这样移动起来很高效，但是比较起来缺很低效。
5. 实际上，因为它只能同层比较，所以它在比较第二层的时候会发现多了一个 `<span>diff</span>`，所以就新加一个；然后再比较第三层的时候发现 `<span>diff</span>` 没了，于是就删除该节点。


## List
### Diff 算法并不知道用户操作
1. 比如根据一个数组 `[1, 2, 3, 4, 5]` 循环渲染出一个列表。之后往数组里又插入了一项，变成了 `[1, 2, 3, 3.5, 4, 5]`。
2. 你插入的时候当然是知道插入的 index 是 3，但是 diff 算法只是监听数据变化，它并不知道你插入的位置。
3. 所以，它对比两个数组的差异，会发现：前三项 `1`、`2`、`3` 都没变，第四项 `4` 变成了 `3.5`，第五项 `5` 变成了 `4`，后面新加了一个第六项 `5`。
4. 删除的时候也是同样的问题。
5. 当然如果只是这样的话，就算 diff 算法没有正确理解插入，它重新渲染列表后也是符合预期的。
6. 比如说本来通过 `<li v-for="item in array">{{item}}</li>` 渲染出这个列表
    ```html
    <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
    </ul>
    ```
7. 数组改变后，按照 diff 算法的理解，它会复用前三个，然后更改之后的两个，最后再加一个新的。渲染为
    ```html
    <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>3.5</li>
        <li>4</li>
        <li>5</li>
    </ul>
    ```
7. 但是如果在列表项里再加一个输入框 `<li v-for="item in array"><input>{{item}}</li>`，渲染好之后再往每个输入框里输入不一样的内容，比如这样
    <img src="./images/02.png" width="200" style="display: block; margin: 5px 0 10px 0;" />
8. 然后再改变数组触发重渲染，就成了下面的样子
    <img src="./images/03.png" width="200" style="display: block; margin: 5px 0 10px 0;" />
9. Diff 算法直接复用的前三个，没问题。
10. 因为 diff 算法并不知道你是插在哪个位置，所以只要按顺序继续往后比较，然后发现第四项的值从 `4` 变成了 `3.5`，所以它并不需要重新渲染整个`<li>`，只需要修改里面的文本节点值就行了。
11. 因为前面说了 diff 算法是 Level by Level 的，所以不会去看子节点 `<input>`，而且 `<input>` 也没有依赖什么数据，所以就直接复用它了，就出现了问题。

### 使用 key 给节点一个身边标识
1. 为了解决这个问题，需要给每个列表元素提供一个身份标识，diff 算法根据这个标识来判断到底发生了什么改变
    ```js
    <li v-for="item in array" :key="item"><input>{{item}}</li>
    ```
2. 现在五个列表项的 key 分别是 `1`、`2`、`3`、`4`、`5`。列表更新后，diff 算法发现这五个 key 所在的列表项都在，然后在第三项后面多了一个节点，现在就能正确的插入了。
3. 因为 key 必须是唯一的表明节点身份的，所以不能用列表循环的索引作为 key。


## References
* [React’s diff algorithm](https://calendar.perfplanet.com/2013/diff/)
* [React’s diff algorithm 翻译](https://zhuanlan.zhihu.com/p/82506257)
* [Vue2.0 v-for 中 :key 到底有什么用？ - 方应杭的回答 - 知乎](https://www.zhihu.com/question/61064119/answer/766607894)
* [解析vue2.0的diff算法](https://github.com/aooy/blog/issues/2)