# SRP
在编写一个函数、一个类或一个模块时，要做到只用一句话就可以概括清楚其内容。


## 模块级别
### 原则
* `store`细分模块，明确归类，一个`store`模块只负责一类数据。没有查到很多模块是否会影响性能，但模块过少肯定会影响逻辑。
* 一个 widget 组件只负责一个独立的 UI 组件。
* 一个通用功能模块只负责同一类功能。
* 非 widget 组件即使一开始不拆分为单一职责，在试图对其复用的时候，也不得不拆分。


## 函数级别
### 纯函数
* 输入：函数体内部的东西是永远不会变的，有可能会变得都在参数里面
* 输出：函数不修改任何外部的东西，只返回结果


