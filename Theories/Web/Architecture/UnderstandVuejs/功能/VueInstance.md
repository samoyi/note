# Vue Instance

## 实例与 View 和 Model 的关系
* 实例不包含 View（HTML），但它会通过 `el` 来把已有的 HTML 节点定义为模板，或者自定义
HTML 并通过 `template` 将其指定为模板。
* 实例同样不包括 Model（数据），但它会通过 `data` 来引用数据。
