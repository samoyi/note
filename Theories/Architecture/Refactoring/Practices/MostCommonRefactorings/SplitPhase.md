# Combine Functions into Transform


<!-- TOC -->

- [Combine Functions into Transform](#combine-functions-into-transform)
    - [原则](#原则)
    - [场景](#场景)
        - [将处理请求参数的逻辑和发送请求的逻辑分离](#将处理请求参数的逻辑和发送请求的逻辑分离)
        - [Vue 计算属性获取数据和处理数据分离](#vue-计算属性获取数据和处理数据分离)
    - [过度优化](#过度优化)

<!-- /TOC -->


## 原则
一段逻辑如果有不同阶段的处理逻辑，特别是不同阶段的逻辑变动的频率不同，那就考虑按阶段拆分。


## 场景
### 将处理请求参数的逻辑和发送请求的逻辑分离
1. 经常看到一个 POST 请求的方法，里面因为参数有些多，而且要对本地数据变换成参数要求的形式，所以会有比较多的参数处理逻辑。
2. 而且参数逻辑经常会根据业务需求变动，而发送请求的逻辑一般都是封装好的公共方法，所以更应该把两者分离。

### Vue 计算属性获取数据和处理数据分离
1. 从组件内获取 store 中的数据时会用到计算属性，组件内也常常需要对取到的数据进行变形。那么，变形的逻辑是否应该放到同一个计算属性里？
2. 如果取到的数据不会有其他用处，只是这一种变形后使用，那么可以放在一起
    ```js
    validList () {
        let list = this.$store.state.list.slice();
        return list.filter(filterFn);
    },
    ```
3. 如果取到的数据还要用在其他地方，那显然还是应该有一个独立的计算数据作为组件内的数据源，组件内的其他地方再从这个数据源取数据使用
    ```js
    list () {
        return this.$store.state.list.slice();
    },
    validList () {
        return this.list.filter(filterFn);
    },
    top10List () {
        return this.list.slice(0, 10);
    },
    ```

    
## 过度优化