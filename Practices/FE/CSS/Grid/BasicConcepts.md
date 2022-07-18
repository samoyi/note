# Basic Concepts


<!-- TOC -->

- [Basic Concepts](#basic-concepts)
    - [Grid tracks](#grid-tracks)
        - [Track listings with `repeat()` notation](#track-listings-with-repeat-notation)
        - [The implicit and explicit grid](#the-implicit-and-explicit-grid)
        - [minmax](#minmax)
    - [Grid lines](#grid-lines)
    - [Gutters](#gutters)
    - [Layering items with z-index](#layering-items-with-z-index)
    - [References](#references)

<!-- /TOC -->


## Grid tracks
1. We create a grid container by declaring `display: grid` or `display: inline-grid` on an element. As soon as we do this, all *direct* children of that element become grid items.
2. We define rows and columns on our grid with the `grid-template-rows` and `grid-template-columns` properties. 
3. These define grid tracks. A grid track is the space between any two lines on the grid. 
4. `grid-template-rows` 通过划分网格 “横线” 来定义网格的行，`grid-template-columns` 通过划分网格 “竖线” 来定义网格的列。
5. 可以使用其他已有的长度单位，也可以使用 `fr`，也可以混合使用。
6. 并不必须划分完整个容器，例如 `grid-template-columns: 30% 10% 30% 10%` 会划分出两宽两窄四列，然后最右边还有 20% 的空白区域不放置元素。

### Track listings with `repeat()` notation
1. 对于有很多网格的容器，如果直接写要写很长的样式值。而如果其中有很多都轨道值都是相同的，就是使用 `repeat()` 标记。
2. 例如 
    ```css
    /* grid-template-columns: 1fr 1fr 1fr; */
    grid-template-columns: repeat(3, 1fr);

    /* 可以只重复其中的一部分 */
    /* grid-template-columns: 20px 1fr 1fr 1fr 1fr 1fr 1fr 20px; */
    grid-template-columns: 20px repeat(6, 1fr) 20px;

    /* 可以重复多个值 */
    /* grid-template-columns: 1fr 2fr 1fr 2fr 1fr 2fr; */
    grid-template-columns: repeat(3, 1fr 2fr);
    ```

### The implicit and explicit grid
1. 例如容器内有 5 个元素，然后设置三列 `grid-template-columns: repeat(3, 1fr)`，那就会有两个元素被迫换到第二行，这样就是隐式的给容器设置了两行，相当于设置了 `grid-template-rows: repeat(2, 1fr)`。
2. 但是不懂只指定 `grid-template-rows` 怎么隐式的创建列。看下面的例子
    ```html
    <style>
    .wrapper {
        border: 2px solid #f76707;
        border-radius: 5px;
        background-color: #fff4e6;
    }
    .wrapper > div {
        border: 2px solid #ffa94d;
        border-radius: 5px;
        background-color: #ffd8a8;
        padding: 1em;
        color: #d9480f;
    }


    /* 只创建三行 */
    .wrapper {
        display: grid;
        grid-template-rows: 1fr 1fr 1fr;
    }
    /* 每个元素宽度都很窄 */
    .wrapper > div {
        width: 10%;
    }

    </style>
    </head>
    <body> 

    <div class="wrapper">
        <div>One</div>
        <div>Two</div>
        <div>Three</div>
        <div>Four</div>
        <div>Five</div>
    </div>

    </body>
    ```
    1. 显式创建了 3 行，前三个元素占据三行之后，后两个元素放不下之后并不会 “换列” 而隐式的创建两列。
    2. 后两个元素还是继续排在前三个元素下面，所以实际的效果相当于 `grid-template-rows: repeat(5, 1fr)`。
3. 对于隐式创建的行和列，可以通过 `grid-auto-rows` and `grid-auto-columns` 来规定它们的尺寸。

### minmax
1. 可以使用 `minmax()` 来设置显式或隐式轨道的最小和最大尺寸。
2. 以行为例，最小尺寸保证了该行的高度不能低于最小值，而最大尺寸保证了该行的高度不能高于最大值。因为一行中每个格子的高度必须一致，所以如果有格子不是最高的，也会自动加高到和最高的格子一样的高度。


## Grid lines
1. 通过网格线来规定网格容器里的子元素放置在什么位置，跨越几个轨道。[例子](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout#grid_lines)
2. [简写](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout#line-positioning_shorthands)


## Gutters
可以使用 `grid-column-gap` 和 `grid-row-gap` 属性来定义列间距和行间距。两个合并的缩写形式是 `grid-gap`。


## Layering items with z-index
1. If we return to our example with items positioned by line number, we can change this to make two items overlap.
2. We can control the order in which items stack up by using the z-index property - just like positioned items.


## References
* [Basic Concepts of grid layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout)