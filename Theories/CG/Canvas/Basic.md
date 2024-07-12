# Basic


## Drawing shapes
不同于 SVG，`<canvas>` 只支持两种形式的图形绘制：矩形和路径（由一系列点连成的线段）。所有其他类型的图形都是通过一条或者多条路径组合而成的。

### Drawing rectangles
1. 绘制矩形路径的方法是 `rect(x, y, width, height)`：绘制一个左上角坐标为（x,y），宽高为 width 以及 height 的矩形路径。
2. 这个方法只是绘制路径，并不会渲染。还需要调用 `fill()` 或 `stroke()` 进行渲染。
3. 当该方法执行的时候，`moveTo()` 方法自动设置坐标参数 (0,0)。
4. 可以使用下面两个方法直接绘制并渲染出矩形
    * `fillRect(x, y, width, height)`：绘制一个填充的矩形
    * `strokeRect(x, y, width, height)`：绘制一个矩形的边框
5.  `clearRect(x, y, width, height)`：清除指定矩形区域，让清除部分完全透明。

### Drawing paths
1. 绘制路径的步骤如下
    1. 创建路径起始点。
    2. 使用画图命令去画出路径。
    3. 把路径封闭。
    4. 一旦路径生成，就能通过描边或填充路径区域来渲染图形。
2. 当前路径为空，即调用 `beginPath()` 之后，或者 canvas 刚建的时候，第一条路径构造命令通常是 `moveTo()`，也就是要将笔触移动到绘制的起点。
3. 路径本身是不显示的，它只是之后渲染的一个指导。实际渲染可以分为两种方法：只沿着路径渲染线条轮廓（`stroke()`）和填充路径的闭合区域渲染实心图形（`fill()`）。
4. 闭合路径 `closePath()` 不是必需的。这个方法会通过绘制一条从当前点到开始点的直线来闭合图形。如果图形是已经闭合了的，即当前点为开始点，该函数什么也不做。 当你调用 `fill()` 函数时，所有没有闭合的形状都会自动闭合，所以你不需要调用 `closePath()` 函数。但是调用 `stroke()` 时不会自动闭合。
5. 操作路径的函数（非实际绘制路径）
    * `beginPath()`：新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。
    * `closePath()`：闭合路径之后图形绘制命令又重新指向到上下文中。
    * `moveTo()`：移动笔触，也就是抬起笔不画然后将笔触移动到其他位置。
    * `stroke()`：通过线条来绘制图形轮廓。
    * `fill()`：通过填充路径的内容区域生成实心的图形。
6. 我们也能够使用 `moveTo()` 绘制一些不连续的路径

#### 绘制直线
`lineTo(x, y)`：绘制一条从当前位置到指定 x 以及 y 位置的直线。

#### 绘制圆弧或者圆
1. `arc(x, y, radius, startAngle, endAngle, anticlockwise)`：画一个以（x,y）为圆心的以 `radius` 为半径的圆弧（圆），从 `startAngle` 开始到 `endAngle` 结束，按照 `anticlockwise` 给定的方向（默认为顺时针）来生成。
2. `startAngle` 以及 `endAngle` 参数用弧度定义了开始以及结束的弧度。
3. 参数 `anticlockwise` 为一个布尔值。为 `true` 时，是逆时针方向，否则顺时针方向。

#### 贝塞尔曲线
[文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes)


#### Path2D 对象
将路径保存为一个变量，[文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes)


## References
* [使用 canvas 来绘制图形](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes)