# Extract Variable


<!-- TOC -->

- [Extract Variable](#extract-variable)
    - [原则](#原则)
    - [场景](#场景)
        - [复杂的逻辑判断](#复杂的逻辑判断)
        - [HTML 模板进行过多 JS 运算](#html-模板进行过多-js-运算)
    - [过度优化](#过度优化)

<!-- /TOC -->


## 原则
意图和实现分离


## 场景
### 复杂的逻辑判断
1. 看到一段这样可怕的的逻辑判断
    ```js
    if ((rootGetters['common/isWeixin'] && !urlParams.token && (!urlParams.code && !sessionStorage.getItem('last_code'))) || rootGetters['common/isWeixinWork']) {
                return true;
            }

    ```
2. 整理为
    ```js
    shouldDoSomeInweixin () {
        const noCode       = !urlParams.code && !sessionStorage.getItem('last_code');
        const isWeixin     = rootGetters['common/isWeixin'];
        const noParamToken = !urlParams.token;
    },

    const isWeixinWork = rootGetters['common/isWeixinWork'];

    if (shouldDoSomeInweixin() && isWeixinWork) {
        return true;
    }
    ```
3. 即使没那么复杂，提取为一个命名良好的变量，也是有帮助的。
4. 例如如下一段其实也不怎么复杂
    ```js
    if (!file && (historyId in state.historyCache)) {
        // ...
    }
    ```
5. 但你看起来还是不能一目了然：
    * 有一个且的逻辑和括号，你需要看清楚来区分后一个表达式的边界
    * 前一个表达式还取反了，你又要多一个逻辑转换
6. 重构为如下
    ```js
    const shouldUseCached = !file && (historyId in state.historyCache);
    if (shouldUseCached) {
        // ...
    }
    ```
7. 现在，只要你不是要了解这个判断的实现，你就不需要看那个稍复杂的判断，你就可以一目了然这个判断的意图。

### HTML 模板进行过多 JS 运算
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


## 过度优化