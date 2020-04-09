# Extract Variable

## 原则
意图和实现分离


## HTML 模板进行过多 JS 运算
1. 例如模板里有 `<p class="title">{{data.activityResponse.title || ''}}</p>`。
2. 在 HTML 里需要这么复杂的 JS 运算吗？HTML 需要知道标题的逻辑吗？这是 HTML 该负责的东西吗？
3. HTML 里的插值应该只关注意图，而不关注是怎么实现的。
4. 重构如下
    ```html
    <p class="title">{{title}}</p>
    ```
    ```js
    title () {
        return this.data.activityResponse.title || '';
    }
    ```
