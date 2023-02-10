# viewport 移动端适配


## viewport 的概念
1. **布局视口**（layout viewport）是页面的实际范围，**可视视口**（visual viewport）是页面通过浏览器窗口看到的范围。
    <img src="./images/02.jpg" width="400" style="display: block; margin: 5px 0 10px;" />
    <img src="./images/01.jpg" width="400" style="display: block; margin: 5px 0 10px;" />
2. 下面的标签会让两种视口统一
`<meta name="viewport" content="width=device-width, initial-scale=1" />`
<img src="./images/03.jpg" width="400" style="display: block; margin: 5px 0 10px;" />


## `viewport` 标签属性
### `width`/`height`
控制布局视口的大小。这可以设置为特定像素数（如 `width=600`），也可以设置为可视视口宽度 `device-width`，即 100vw，100% 的视口宽度。

### `initial-scale`
控制页面首次加载时显示的缩放倍数。

### `minimum-scale`/`maximum-scale`
控制页面允许缩小/方法的倍数。`maximum-scale` 设置一个低于 3 的值将不具备无障碍访问性。

### `user-scalable`
控制是否允许页面上的放大和缩小操作。有效值为 0、1、yes 或 no。默认值为 1，与 yes 相同。将值设置为 0（即与 no 相同）将违反 Web 内容无障碍指南（WCAG）。

### `interactive-widget`
1. 指定交互式 UI 组件（如虚拟键盘）对页面视口的影响。Allowed values are:
    * `resizes-visual`: The visual viewport gets resized by the interactive widget.
    * `resizes-content`: The viewport gets resized by the interactive widget.
    * `overlays-content`: Neither the viewport nor the visual viewport gets resized by the interactive widget.
2. When the viewport gets resized, the initial containing block also gets resized, thereby affecting the computed size of viewport units.


## References
* [viewport移动端适配](https://juejin.cn/post/6844903721697017864)
* [Viewport meta tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag)
* [A tale of two viewports — part one](https://www.quirksmode.org/mobile/viewports.html)
* [A tale of two viewports — part two](https://www.quirksmode.org/mobile/viewports2.html)