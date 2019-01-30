# Misc

## 事件绑定
1. `target.addEventListener`的第三个参数可以是一个布尔值，也可以是一个对象。
2. 如果是布尔值，则表示将时间注册在冒泡阶段（`false`）或捕获阶段（`true`）。
3. 如果是对象，则是一个 option 对象，有以下三个属性：
    * `capture`：布尔值，是否注册到捕获阶段
    * `once`：A Boolean indicating that the listener should be invoked at most once after being added. If `true`, the listener would be automatically removed when invoked.
    * `passive`: A Boolean which, if `true`, indicates that the function specified by listener will never call `preventDefault()`. If a passive listener does call `preventDefault()`, the user agent will do nothing other than generate a console warning.

### Passive Event Listeners
先看一下 Chrome Update 的[这篇文章](https://developers.google.com/web/updates/2016/06/passive-event-listeners?hl=zh-cn)
1. 触摸事件默认是会滚动页面的，但也可以通过`preventDefault()`来阻止其滚动
2. 当你触发了一个触摸事件，浏览器会等待滑动结束并执行完你的回调函数，才能确定你有没有调用`preventDefault()`。而在等待滑动结束和等待执行完整的回调函数期间，浏览器只能安静的等待，不能擅自滚动页面。
3. Passive Event Listeners 意味着你向浏览器说明自己不会调用`preventDefault()`，这样当你在执行滑动操作时，浏览器知道默认的滚动不会被阻止，所以就可以及时的滚动页面。
