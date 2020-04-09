# Global Data


## 原则
意图和实现分离


## 场景
### 其他
* Vue 项目，重复的 dom 操作应该提取全局自定义指令


## 过度优化
### 模块内部的变量名还带上模块标志名
1. 比如有一个 header 组件，你可能会往里面传 title，那么在 header 的父级里，这个 title 可以命名为 `headerTitle`，语义明确。
2. 那么在 header 组件内部，如果就只有一个 title，就没必要再命名为 `headerTitle` 了，因为这个 title 本身就已经在 header 里面了。




















































## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
