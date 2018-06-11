# Render Functions & JSX

## TODO
* 文档上的[例子](https://vuejs.org/v2/guide/render-function.html#Complete-Example)
  为什么 `createElement` 的第二个对象参数直接省略掉了？难道会自动判断第二个参数的类型，
  如果是 String 或 Array 就认为第二个参数已经省略掉了？


## 模板渲染和渲染函数渲染的过程
### 模板渲染的过程：
1. 从 HTML 中找到组件标签
2. 从组件实例中找到模板
3. 根据模板上面的 directives 和 filters，结合数据，把模板编译成实际的 HTML
4. 用编译好的 HTML 替换之前的组件标签

### 渲染函数渲染的过程：
1. 从 HTML 中找到组件标签
2. 从组件实例中找到渲染函数 `render`
3. 根据 `render` 的内部逻辑，结合数据，把模板编译成实际的 HTML
4. 用编译好的 HTML 替换之前的组件标签


## 用法
直接看[文档](https://vuejs.org/v2/guide/render-function.html)
