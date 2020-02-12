# BUGs


## Android 特有
### 某些安卓手机，同一个链接无法多次跳转
* 现象：6.0 集合页入口只有前两次点击可以进入集合页，即对同一个链接无法多次点击跳转
* 原因：
* 解决：动态的给每次链接加上时间戳之类的随机字符串参数

### 短链接解析后缺少后面的路由 hash
* 现象：集合页短链接在微信中解析后缺少了后面的`#/multialbum`
* 原因：
* 解决：动态判断并添加

### 某些安卓手机，在离开项目后`localStorage`无法保存
* 现象：相册`token`存入`localStorage`，跳转到管理端再跳转回来，读取不到`token`
* 原因：微信运行网页只是相当于 webview 而非浏览器，不能保证数据存储的持久性。[参考1](https://www.cnblogs.com/flyfly/p/4739565.html)、[参考2](https://www.cnblogs.com/hjj2ldq/p/8639490.html)
* 解决：目前在安卓环境中使用 cookie 保存需要的数据（通过`helper.AndroidStorageProxy`包装`storage`）

### 安卓微信分享设置在路由切换后失效
* 现象：关闭分享或打开分享后，刚进入相册时分享设置生效，跳转到其他页面失效
* 原因：
* 解决：每次路由结束后都设置一次微信分享


## iOS 特有
### `focus()`无法调用键盘 / `play()`无法播放音频
* 现象：使用 Vue 自定义指令设置输入框焦点时，安卓可以但 iOS 不行
* 原因：发起该函数的调用栈的第一个函数必须是用户操作调用的，参考[这个回答](https://stackoverflow.com/a/7332160)。如果使用 Vue 自定义指令来设置焦点，就会发现这个问题。
* 解决：直接引用节点并调用`focus()`方法

### 第三方挡住底部输入框
* 现象：输入框定位在底部，使用搜狗输入法时，输入框大部分都被键盘挡住
* 原因：
* 解决：键盘弹出后，执行`document.body.scrollTop = document.body.scrollHeight;`
* 注意：但是在像教育培训那样的样式中，`document.body.scrollHeight`远远超过了窗口高度，这时滚动的话就会滚到太靠下。 而且，在这种状态下，第三方键盘并不会被遮挡。看起来像是以为内高度足够，所以就不会被遮挡。

### iOS12 键盘收起后页面无法点击
* 现象：输入框收起后页面无法点击
* 原因：参考[这篇](https://juejin.im/post/5c07442f51882528c4469769)、[这篇](https://blog.csdn.net/u013558749/article/details/100991786)和[这篇](https://developers.weixin.qq.com/community/develop/doc/00040a43cd4290dedbc7e7f1851400?_at=1559089628289)
* 解决：键盘收起后，执行`document.body.scrollTop = document.body.scrollTop;`。如果还不行，加上`window.scrollTo(0, 0)`。

### 在输入框内滑动时，滑动后面的页面
* 现象：如果在输入框里滑动到最顶部或最底部而继续滑动时，都会滑动后面的页面
* 解决：判断是否滑动到底，如果到底了就禁止继续同方向滑动时的默认事件
  ```js
  // touchstart 事件回调，记录开始滑动的位置
  textareaTouchstart(ev){
    ev.currentTarget.ts = ev.touches[0].clientY;
  },
  // touchmove 事件回调
  textareaTouchmove(ev){
    const te = ev.changedTouches[0].clientY;
    const curr = ev.currentTarget;
    if (curr.ts > te){// 手指向上
      // 已经滑动到了最底部
      if (curr.scrollHeight - curr.scrollTop === curr.clientHeight) {
        ev.preventDefault();
      }
    }
    else if (curr.ts < te){ // 手指向下
      // 已经滚动到了最顶部
      if (curr.scrollTop === 0) {
        ev.preventDefault();
      }
    }
  },
  ```

### `Date`对象实例方法返回`NaN`，以及有8小时时差
* 现象：日期字符串经过`new Date`转换为`Date`实例后，调用其他方法返回`NaN`
* 原因：iOS 不支持非标准的日期字符串，如`2019-03-28 20:59:03`。[规范](https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.15)
* 解决：使用标准的时间格式`2019-03-28T20:59:03.000+08:00`（东八区）

### input 透明度降低
* 现象：Safari Mobile 的透明度会比电脑和安卓更低（更透明）
* 原因：Safari Mobile 中设置了`disabled`的`input`的`oapcity`会被设置为`0.4`

### iOS10（及以下？）absolute 定位元素向右偏移
* 现象：在只设置了`absolute`定位而没有设置具体位置时，会出现向右偏移，左边缘对齐父级的中间而非左边缘
* 解决：再设置`left: 0; right: 0; margin: auto;`

### 键盘收起后被顶起的页面不自动下落
* 解决：`window.scroll(0,0)`

### iOS 微信分享，使用自定义 link 时， invalid signature
* 现象：history 模式路由的情况，分享时配置自定义 link 时会出现这种情况
* 原因：[可能的原因](https://www.cnblogs.com/dengxiaolei/p/8143838.html)
* 解决：项目中发现，从 A 页面 push 到 B 页面，再 push 到 C 页面，在 C 页面发起分享配置时，会出现这种情况；但如果从 A 到 B 是通过 `location.href`，从 B 到 C 依然通过 push，则在 C 页面可以正常分享。

## 事件
### `blur`和`click`事件同时存在时，`click`事件不响应或响应非预期
* 原因：`blur`事件会在`click`事件之前执行
* 解决：使用`mousedown`替换`click`，或者延迟`blur`的事件处理


## 音视频
### Chrome 播放音频抛出错误
* 现象：音频节点调用`.play()`方法，抛出错误`Uncaught (in promise) DOMException`
* 原因：`.play()`方法返回 promise，如果不能播放，会被 rejected。Chrome 默认不会自动播放，因此会抛出错误。[参考](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play)
* 解决：
  ```js
  try {
    await el.play();
  }
  catch (err) {
    // 播放失败
    // 样式、数据等改为停止播放时的状态
  }
  ```

## 样式
### 多行溢出省略号 CSS 方案
```scss
// white-space: nowrap;
// height: 0.36rem; 限制高度会导致第二行显示不全或显示一点点第三行
// 设置 font-size 和 line-height 看起来也有可能出现这个问题。但可以把 font-size 设置在父级
text-overflow: ellipsis;
display: -webkit-box;
// autoprefixer 插件在打包时会移除下面这个样式，这里通过如下两个注释在这一行样式的位置关闭该插件
/*! autoprefixer: off */
-webkit-box-orient: vertical;
-moz-box-orient: vertical;
/*! autoprefixer: on */
-webkit-line-clamp: 3;
overflow: hidden;
word-break: break-word;
// 省略号有可能也被截断，这应该是浏览器的 bug。 Chrome 曾经有但已经修复
// 通过以下方法可以解决   参考 https://stackoverflow.com/a/43859485
padding-right: 4px;
// 内容初始渲染时如果 visibility 是 hidden，则该样式效果不会生效。
// 可以测试直接在浏览器里测试编辑一些文本或者样式，引发重渲染后样式就会生效
// 不一定是显式的设置了 hidden，在使用 v-html 设置内容是似乎就会隐式的设置 hidden
visibility: visible;
```