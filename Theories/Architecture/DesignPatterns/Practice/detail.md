
性能优化不能明显牺牲可读性！可读性的权重更高！
别为了复用写出庞大、难以理解的组件。

## SRP
在编写一个函数、一个类或一个模块时，要做到只用一句话就可以概括清楚其内容。

### 模块级别
#### 
* `store`细分模块，明确归类。没有查到很多模块是否会影响性能，但模块过少肯定会影响逻辑。
* 一个 widget 组件只负责一个独立的 UI 组件。
* 一个`store`模块只负责一类数据。
* 一个通用功能模块只负责同一类功能。

### 函数级别
* 只在 Android 或 iOS 中执行的方法，方法定义中不应该包括系统判断。判断是判断，行为是行为。
  * 折衷：`AndroidKeyboardHideEvent`这个构造函数虽然按照该原则内部不应该做判断，但如果不判断，每次使用该构造函数，都要做三次判断，而且如果有遗漏还会出错。同时，该构造函数作为公共 util，会被多次引用，所以还是在函数内部做判断更合理。
* `publicList`组件中之前还混杂着安卓收起键盘判断的逻辑，但这个逻辑其实是属于一个公用的逻辑，而不应该归属于`publicList`。所以将这部分逻辑取出，`publicList`使用时调用接口即可。
* 获取留言列表的 dispatch 中还包含了两种格式化数据的操作，将这两个操作都提取出来作为独立的格式化函数


## 函数式
* 组件里需要对从 store 取得的引用类型对象修改时，不能直接修改，要先复制


## 高内聚
* `publicList`组件中`winHeight`和`newHeight`都定义为了组件`data`属性，但其实这两个值都只是用来实现安卓收起键盘的判断的，在封装了安卓收起键盘判断的处理对象后，这两个属性也应该被内聚到该对象内部。

## 低耦合
输入框 autoheight 类似于 proxy，将其独立封装


## 公共部分
看见类似的，就应该考虑抽出相同的部分。之前大图相册列表和小图相册列表的所有实例属性都是相同的


## 算法
* `for-in`优化
* 大数组使用基本循环
* `if-else`尽快命中

## 其他
* 数据的格式化应该放在 store 里还是放在组件里？如果格式是通用的，则放在 store 里，如果只是某个组件需要这种格式，则放在相应的组件里。


## 好看
* vue 钩子函数按照顺序写
* 通用的计算属性（例如判断是否为iPhone的计算属性）和通用的方法（例如负责路由跳转的方法）写在前面，当前组件特有的写在后面
* 不在`<template>`里写复杂的计算，例如用若干值的或且非来赋值`v-if`，应该把这些判断都放在一个计算属性，`<template>`直接使用该计算属性。


## 删除冗余
* 没用使用或只 map 了一条数据的`mapState`、`mapGetters`等





## Vue
* 渲染级别的隐藏使用`v-if`，`display`级别的隐藏使用`v-show`
* 控制 widget 隐藏和显示的三种级别：
  * 配置文件级别：不同的模板不同的显示规则。直接在配置文件里使用 visible 控制。
  * 后台配置级别：后台是否显示的开关。这样的判断应该写在 getters 里，被 widget 引用。getter 命名最好带上`switch`。
  * 数据内容级别：例如根据列表是否为空来决定是否渲染，这样的判断应该写在 widget 内部。
* `v-for`渲染 list 时，不渲染的列表项直接从 list 里清除，而不是通过`v-if`隐藏
* 依赖项写在前面：例如计算属性`list`依赖计算属性`isShowIcon`，则`isShowIcon`应该写在前面，更符合阅读的逻辑。而且最好别写太远



1.widget内的任何一个元素不能使用position:fixed样式，widget的最外层元素不能是position:absolute样式，应设定为position:relative；
2.Container，Fixed，Dialogs, Service及其继承类不应直接调用store，layout应是通用的、业务无关的；
3.数据请求应在store中；业务状态判定应尽可能实现在store的getter里，避免后期出现多个相似功能组件产生的胶水代码；
5.为每个widget做一个props.styles.outer，已实现组件换位置后产生的margin，padding问题；
6.数据请求从connect,getModel 迁移至 dataget.getModel，并根据业务实际情况在接口model里设置cache:true开启缓存；gq已默认使用缓存，可在store.schema里设置noCache禁用对应数据段的缓存



## 样式

### widget 不能影响外层布局
* widget 内不包含`position: fixed`
* widget 容器不设置`position: absolute`
* widget 容器不设置`margin`
* widget 容器内部元素`margin`不能影响到 widget 外部：例如 widget 内第一个子元素如果设置`margin-top`，则整个 widget 会有顶边距
* widget 不能因为 container 布局而设置`padding`：例如 cover 有左右内边距，这个效果不能通过给 widget 设定左右`padding`来实现

### widget 样式可通过主题样式修改
* widget 内不设置`!important`样式

### 配置文件中的样式
* widget 的外边距应该统一由`margin-top`而非`margin-bottom`来设置，这样保证 container 中最上的 widget 不会有无用的顶边距、最下的 widget 不会有无用的底边距。如果最后一个 widget 被隐藏，整体底部也不会出现多余的边距


## 配置规范
* widget 配置第一行写`uniqueId`属性，方便折叠时查看



## 系统级别的配置定义在统一的常量文件 constans.js 中
### style.css
1. 之前该文件的匹配正则直接放在需要的 store 里，导致在更换开发环境的 static 资源路径时匹配失效。
2. 放在 constans.js 中之后，进一步直接引用 static 路径的常量，保证了后续再更换 static 路径也不会引起匹配失效。


## 通用 util 和 业务 util
1. 通用 util 是和业务无关的，例如判断环境、判断实际字符串长度。
2. 业务 util 适合当前项目业务有关的，移植到其他项目里很有可能就没用了。例如动态加载相册品牌色。
3. 通用 util 应该统一放在 helper.js 中；业务 util 应该独立出来。