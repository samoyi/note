# Duplicated Code


## 原则
意图和实现分离


## 场景
### 提取重复的属性链
1. 例如下面分别读取账号信息中的姓名、年龄和性别
    ```js
    name () {
        return this.$store.state.account.name;
    },
    age () {
        return this.$store.state.account.age;
    },
    sex () {
        return this.$store.state.account.sex;
    },
    ```
2. 里面重复的读取了 `this.$store.state.account`。
3. 重构为如下
    ```js
    account () {
        return this.$store.state.account;
    },
    name () {
        return this.account.name;
    },
    age () {
        return this.account.age;
    },
    sex () {
        return this.account.sex;
    },
    ```
4. 初步看起来，代码量其实并没有减少，而且行数还增多了。
5. 带这样的好处是，只需要访问一次 `account`，而不用分别去读取属性链。
6. 只访问一次，也许只会带来极小的可忽略的性能提升，但更大的好处是，`account` 方法代理的 store 中的 `account` 对象。之后如果 `account` 对象发生了什么变化，比如移到了其他模块，或者改名字了，那只需要在 `account` 方法进行一次修改就行，而不需要在那三个的方法里分别修改。
7. 这也是 Message Chains 、 Middle Man 和 ShotgunSurgery 这样的 bad code 的特征。

### 重复的逻辑判断
1. 比如有好几处都要依赖同一个逻辑判断，那么当然可以在这几个地方独立的进行判断。
2. 但是如果这一个判断逻辑发生了变化，则需要找到所有的地方进行修改。这样就有可能有漏改和错改。

### 整个项目级别的数据统一保存
1. 有些东西如果是整个项目通用的，则第一次读取的时候就要保存在公共的地方。
2. 比如 url 中的某些参数如果是项目通用的，则可以在入口就写进 store，之后用到的地方直接从 store 里读取。

### 提取重复的全局样式变量
1. 有时会遇到比如好几个页面都有一个公共的头部，然后这些页面的样式会根据这个这个头部的高度进行一些响应的位置计算。
2. 开始可能会直接把这个头部的高度像素值写在单独的页面里，但如果有好几个地方，则后期这个头部高度有变化，就要全局搜索修改。
3. 而且你单独在好几个地方写头部的像素值，比如这样 `calc(100% - 64px)`，之后阅读的时候也不知道这里为什么要减去 64 像素。
4. 所以，像这种全局的样式，就可以放在一个单独的全局样式文件里定义为变量，然后在需要的组件引用
    ```scss
    // variables.scss
    $PCHeaderHeight: 64px;
    ```
    ```scss
    @import "@/styles/variables.scss";
    .wrapper {
        height: calc(100% - #{$PCHeaderHeight});
    }
    ```


## 其他
* Vue 项目，重复的 dom 操作应该提取全局自定义指令
* Scss 该用变量就用变量，该用 mixin 就用 mixin




















































## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
