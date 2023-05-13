# reflow


## 导致回流的操作
* 读取尺寸和距离
* 改变尺寸和距离（包括文字数量和大小）
* 添加或删除 **可见** 的 DOM 元素
* 激活 CSS 伪类


## 优化
* 一个元素的修改多个样式时使用 `cssText` 或 class
* documentFragment
* 缓存需要频繁读取的样式
* 让元素脱离文档流：
    * 需要移动位置的元素使用 `absolute` 或 `fixed`
    * `transform` 替代直接改变位置和尺寸（元素会被提升出主线程到一个单独的使用 GPU 运算的 layer）
    * `visibility`、`opacity` 替代 `display` 实现隐藏
* 避免使用 `table`，因为一个格子变化也会导致其他格子变化
* 图片设置尺寸


## References
* [What forces layout / reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)
* [Off main thread animation](https://developer.mozilla.org/en-US/docs/Web/Performance/CSS_JavaScript_animation_performance#off_main_thread_animation)