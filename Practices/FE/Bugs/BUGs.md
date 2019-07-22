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
* 现象：输入框定位在底部，使用搜狗输入法时，输入框大部分都被键盘挡住
* 原因：根据[这篇](https://juejin.im/post/5c07442f51882528c4469769)，键盘弹出后 body 上移，键盘后期
* 解决：键盘弹出后，执行`document.body.scrollTop = document.body.scrollTop;`

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

### 在触发键盘弹出时，页面会发生`scroll`



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
