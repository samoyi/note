# Flexbox


## Background
1. The Flexbox Layout module aims at providing a more efficient way to lay out,
align and distribute space among items in a container, even when their size is
unknown and/or dynamic (thus the word "flex").
2. The main idea behind the flex layout is to give the container the ability to
alter its items' width/height (and order) to best fill the available space
(mostly to accommodate to all kind of display devices and screen sizes).
3. A flex container expands items to fill available free space, or shrinks them
to prevent overflow.
4. Most importantly, the flexbox layout is direction-agnostic as opposed to the
regular layouts (block which is vertically-based and inline which is
horizontally-based). While those work well for pages, they lack flexibility (no
pun intended) to support large or complex applications (especially when it comes
to orientation changing, resizing, stretching, shrinking, etc.).
5. Flexbox layout is most appropriate to the components of an application, and
small-scale layouts, while the Grid layout is intended for larger scale layouts.


## Terminology
<table>
    <tr>
        <td nowrap="nowrap">flex container</td>
        <td>
            <img src="./images/container.svg" alt="container" width="400" />
        </td>
    </tr>
    <tr>
        <td nowrap="nowrap">flex item</td>
        <td>
            <img src="./images/items.svg" alt="items" width="400" />
        </td>
    </tr>
    <tr>
        <td nowrap="nowrap">main axis</td>
        <td>
            The main axis of a flex container is the primary axis along which
            flex items are laid out. Beware, it is not necessarily horizontal;
            it depends on the `flex-direction` property.
        </td>
    </tr>
    <tr>
        <td nowrap="nowrap">main-start | main-end</td>
        <td>
            The flex items are placed within the container starting from
            main-start and going to main-end.
        </td>
    </tr>
    <tr>
        <td nowrap="nowrap">main size</td>
        <td>
            A flex item's width or height, whichever is in the main dimension,
            is the item's main size. The flex item's main size property is
            either the ‘width’ or ‘height’ property, whichever is in the main
            dimension.
        </td>
    </tr>
    <tr>
        <td nowrap="nowrap">cross axis</td>
        <td>
            The axis perpendicular to the main axis is called the cross axis.
            Its direction depends on the main axis direction.
        </td>
    </tr>
    <tr>
        <td nowrap="nowrap">cross-start | cross-end</td>
        <td>
            Flex lines are filled with items and placed into the container
            starting on the cross-start side of the flex container and going
            toward the cross-end side.
        </td>
    </tr>
    <tr>
        <td nowrap="nowrap">cross size</td>
        <td>
            The width or height of a flex item, whichever is in the cross
            dimension, is the item's cross size. The cross size property is
            whichever of ‘width’ or ‘height’ that is in the cross dimension.
        </td>
    </tr>
</table>

<img src="./images/terminology.svg" alt="terminology" width="800" />


## Properties for the Parent(flex container)
* `display`: 是否为弹性布局
* `flex-direction`: 主轴方向
* `flex-wrap`：是否换行及换行方式
* `flex-flow`：上面两个属性的缩写
* `justify-content`：沿主轴的排列方式
* `align-content`：多行情况下，各行沿垂直轴的排列方式
* `align-items`：一行中元素的对齐方式

### `display`
1. This defines a flex container;
2. inline or block depending on the given value.
3. It enables a flex context for all its direct children.
4. Note that CSS columns have no effect on a flex container. 不懂

    ```css
    .container {
        display: flex; /* or inline-flex */
    }
    ```

### `flex-direction`
1. This establishes the main-axis, thus defining the direction flex items are
placed in the flex container.
2. Flexbox is (aside from optional wrapping) a single-direction layout concept.
3. Think of flex items as primarily laying out either in horizontal rows or
vertical columns.

    ```css
    .container {
      flex-direction: row | row-reverse | column | column-reverse;
    }
    ```
    <table>
        <tr>
            <td nowrap="nowrap">
                `row` (default)
            </td>
            <td>
                left to right in `direction: ltr`;
                right to left in `direction: rtl`
            </td>
        </tr>
        <tr>
            <td nowrap="nowrap">
                `row-reverse`
            </td>
            <td>
                right to left in `direction: ltr`;
                left to right in `direction: rtl`
            </td>
        </tr>
        <tr>
            <td>
                `column`
            </td>
            <td>
                same as `row` but top to bottom
            </td>
        </tr>
        <tr>
            <td nowrap="nowrap">
                `column-reverse`
            </td>
            <td>
                same as `row-reverse` but bottom to top
            </td>
        </tr>
    </table>


### `flex-wrap`
By default, flex items will all try to fit onto one line. You can change that
and allow the items to wrap as needed with this property.

```css
.container{
    flex-wrap: nowrap | wrap | wrap-reverse;
}
```

<table>
    <tr>
        <td nowrap="nowrap">
            `nowrap` (default)
        </td>
        <td>
            all flex items will be on one line
        </td>
    </tr>
    <tr>
        <td>
            `wrap`
        </td>
        <td>
            flex items will wrap onto multiple lines, from top to bottom.
        </td>
    </tr>
    <tr>
        <td nowrap="nowrap">
            `wrap-reverse`
        </td>
        <td>
            flex items will wrap onto multiple lines from bottom to top.
        </td>
    </tr>
</table>


### `flex-flow`
This is a shorthand `flex-direction` and `flex-wrap` properties, which together
define the flex container's main and cross axes. Default is `row nowrap`.


### `justify-content`
1. This defines the alignment along the main axis.
2. It helps distribute extra free space left over when either all the flex items
on a line are inflexible, or are flexible but have reached their maximum size.
3. It also exerts some control over the alignment of items when they overflow
the line.

    <table>
        <tr>
            <td nowrap="nowrap">
                `flex-start` (default)
            </td>
            <td>
                items are packed toward the start line
            </td>
        <tr>
            <td>
                `flex-end`
            </td>
            <td>
                items are packed toward to end line
            </td>
        <tr>
            <td>
                `center`
            </td>
            <td>
                items are centered along the line
            </td>
        <tr>
            <td nowrap="nowrap">
                `space-between`
            </td>
            <td>
                items are evenly distributed in the line;
                first item is on the start line, last item on the end line
            </td>
        <tr>
            <td nowrap="nowrap">
                `space-around`
            </td>
            <td>
                items are evenly distributed in the line with equal space around
                them.
                Note that visually the spaces aren't equal, since all the items
                have equal space on both sides.
                The first item will have one unit of space against the container
                edge, but two units of space between the next item because that
                next item has its own spacing that applies.
            </td>
        <tr>
            <td nowrap="nowrap">
                `space-evenly`
            </td>
            <td>
                items are distributed so that the spacing between any two items
                (and the space to the edges) is equal.
            </td>
        </tr>
    </table>

    <img src="./images/justify-content.svg" alt="justify-content" width="400"
    style="background: white" />

### `align-content`
1. This aligns a flex container's lines within when there is extra space in the
cross-axis, similar to how `justify-content` aligns individual items within the
main-axis.
2. This property has no effect when there is only one line of flex items.

    <img src="./images/align-content.svg" alt="align-content" width="400"
    style="background: white" />

### `align-items`
1. This defines the default behavior for how flex items are laid out along the
cross axis on the current line.
2. Think of it as the `justify-content` version for the cross-axis
(perpendicular to the main-axis).

    <img src="./images/align-items.svg" alt="align-items" width="400"
    style="background: white" />


## Properties for the Children(flex items)
Note that `float`, `clear` and `vertical-align` have no effect on a flex item.

* `order`：item 的排序
* `flex-grow`：item 按什么比例瓜分多余空间
* `flex-shrink`：item 按什么比例负责缩小超出的空间
* `flex-basis`：item 在弹性变动之前的尺寸
* `flex`：上面三个的缩写
* `align-self`：

### `order`
1. By default, flex items are laid out in the source order.
2. However, the `order` property controls the order in which they appear in the
flex container.
3. 该项的值是一个整数。默认为`0`，越小则越往前排。

### `flex-grow`
#### 默认
1. 默认值为`0`。意为如果 item 们以目前的宽度排列后，如果还不足以充满 main size，也不会
试图充满。
2. 假设 container 宽度为 600px，有6个 item，每个宽度为 50px，则默认情况下6个 item 会
挨着排列到左边，不会占用剩余的 300px 空间。每个 item 宽度仍为 50px。

#### 如果所有 item 的该值都设为一个相同的非零值
1. 即各 item 该值所占相同，那么剩余的 300px 空间将被所有 item 平分。
2. 那么6个 item 会占满 main size，每个 item 现在的宽度变为 100px

#### 如果有 item 的该值与其他的不相同
假设6个 item 的该值被分别设为了`2 0 1 1 1 1`，那剩余的 300px 空间将被按照这个比例瓜分
，即`100 0 50 50 50 50`，并被分给6个 item。每个 item 最终的宽度会变为
`150 50 100 100 100 100`

### `flex-shrink`
默认值为`1`。

#### 如果所有 item 的该值都设为一个相同的非零值
1. 假设 container 宽度为 600px，有6个 item，每个宽度为 200px，则默认情况下6个 item
排下来会的宽度会达到 1200px，超出了 600px。
2. 因为每个 item 的该值都相同，所以超出的 600px 会按照相同的比例平分，即分为 100px。
每个 item 都要负责缩小 100px。所以每个 item 最终的宽度会变为 100px。

#### 如果有 item 的该值与其他的不相同
假设6个 item 的该值被分别设为了`3 3 3 2 2 2`，那剩余的 600px 空间将被按照这个比例分割
，即`120 120 120 80 80 80`，6个 item 要对应的减去这么多宽度。每个 item 最终的宽度会
变为`80 80 80 120 120 120`.

### `flex-basis`
1. item 在 grow 或 shrink 之前的尺寸。
2. 默认值为`auto`，即元素本来的尺寸。也可以设为其他数值。

### `align-self`
1. This allows the default alignment (or the one specified by `align-items`) to
be overridden for individual flex items.


## 其他
### item 在 cross axis 方向上默认会被设为 cross size
比如`flex-direction`默认值得情况下，在不设置其他 flex 属性情况下，如果一个 item 没有
设置宽高，则其宽度（main axis 方向的尺寸）会保持是其内部元素的尺寸；而其高度（cross
axis 方向上的尺寸）会被拉伸到和父级一样的高度（cross size）
```html
<style>
    #container{
        display: flex;
        width: 600px; height: 600px;
        border: solid 1px red;
    }
    #container>div{
        border: solid 1px royalblue;
    }
</style>
<div id="container">
    <div>item</div>
</div>
```


## References
* [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
* [Codepen](https://codepen.io/LandonSchropp/pen/KpzzGo)
* [Flex 布局教程：实例篇](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html)
* [Flexbox 布局的最简单表单](http://www.ruanyifeng.com/blog/2018/10/flexbox-form.html)
