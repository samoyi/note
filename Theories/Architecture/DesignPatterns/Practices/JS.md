# OCP


## 模块级别
### 原则
* 能动态改变一个非 widget 组件样式和行为的只能是其提供的`prop`参数。

### 实例
* `store`中`common.js`模块中有一些并非是全局的状态操作，抽出来放入单独的模块中
* `publicList`组件中之前还混杂着安卓收起键盘判断的逻辑，但这个逻辑其实是属于一个公用的逻辑，而不应该归属于`publicList`。所以将这部分逻辑取出，`publicList`使用时调用接口即可。



## 函数级别
写尽量纯的函数：函数结果的影响因素尽量只是其参数。

### 实例
* 只在 Android 或 iOS 中执行的方法，方法定义中不应该包括系统判断。判断是判断，行为是行为。
  * 折衷：`AndroidKeyboardHideEvent`这个构造函数虽然按照该原则内部不应该做判断，但如果不判断，每次使用该构造函数，都要做三次判断，而且如果有遗漏还会出错。同时，该构造函数作为公共 util，会被多次引用，所以还是在函数内部做判断更合理。
* 获取留言列表的 dispatch 中还包含了两种格式化数据的操作，将这两个操作都提取出来作为独立的格式化函数

