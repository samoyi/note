# Basic


## 坐标定位
可以实现缩放、旋转、倾斜、反转。[文档](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Positions)


## 基本形状
* [文档](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Basic_Shapes)
* 注意折线和多边形的点坐标中，逗号并不是分割一组坐标的。


## Paths
* 注意在属性 `d` 中，同样的，逗号和空格都是一样的分隔符。
* 每一个命令都有两种表示方式，一种是用大写字母，表示采用绝对定位。另一种是用小写字母，表示采用相对定位
* 因为属性 `d` 采用的是用户坐标系统，所以不需标明单位。
* M/m 命令用来移动笔触
* [文档](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths)

### 直线命令
* L/l：绘制直线。例如 `L x y`
* H/h：绘制水平线。例如 `H x`
* V/v：绘制垂直线。例如 `V y`
* Z/z：闭合路径。没有参数，从但前位置绘制直线到路径起点。

### 三次贝塞尔曲线
* C/c：例如 `C x1 y1, x2 y2, x y`。前两组是控制点，最后一组是终点。
* S/s：例如 `S x2 y2, x y`。不需要设置第一个控制点。单独使用的不懂，测试结果不对，TODO。跟在 C/c 后面使用的话，它的第一个控制点是前一个曲线第二个控制点关于此时笔触位置的对称点
    ```xml
    <svg width="190" height="160" xmlns="http://www.w3.org/2000/svg">
        <path d="M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80" stroke="black" fill="transparent" />
        
        <circle cx="10" cy="80" r="2" fill="red" />
        <circle cx="40" cy="10" r="2" fill="red" />
        <circle cx="65" cy="10" r="2" fill="red" />
        <circle cx="95" cy="80" r="2" fill="red" />
        <circle cx="150" cy="150" r="2" fill="red" />
        <circle cx="180" cy="80" r="2" fill="red" />
    </svg>
    ```

### 二次贝塞尔曲线
* Q/q：例如 `Q x1 y1, x y`
* T/t：对应三次中的 S/s，即只需要设置终点，控制点是前一个曲线的控制点关于当前笔触位置的对称点。但不同的是，T 命令前面必须是一个 Q 命令，或者是另一个 T 命令，才能达到这种效果。如果 T 单独使用，那么控制点就会被认为和终点是同一个点，所以画出来的将是一条直线
    ```xml
    <svg width="190" height="160" xmlns="http://www.w3.org/2000/svg">
        <path d="M 10 80 Q 52.5 10, 95 80 T 180 80" stroke="black" fill="transparent" />

        <circle cx="10" cy="80" r="2" fill="red" />
        <circle cx="52.5" cy="10" r="2" fill="red" />
        <circle cx="95" cy="80" r="2" fill="red" />
        <circle cx="180" cy="80" r="2" fill="red" />
    </svg>
    ```

### 弧形
[文档](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths)