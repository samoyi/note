# Event


<!-- TOC -->

- [Event](#event)
    - [合成事件](#合成事件)
    - [与原生事件不同](#与原生事件不同)
    - [References](#references)

<!-- /TOC -->


## 合成事件
1. SyntheticEvent 实例将被传递给你的事件处理函数，它是浏览器的原生事件的跨浏览器包装器。除兼容所有浏览器外，它还拥有和浏览器原生事件相同的接口，包括 `stopPropagation()` 和 p`reventDefault()`。
2. 当你需要使用浏览器的底层事件时，只需要使用 `nativeEvent` 属性来获取即可。
3. 事件处理函数在冒泡阶段被触发。如需注册捕获阶段的事件处理函数，则应为事件名添加 `Capture`。例如，处理捕获阶段的点击事件请使用 `onClickCapture`。注意有些事件原生的即没有冒泡，因此也没有捕获阶段。
4. React 17 中移除了 event pooling（事件池）。


## 与原生事件不同
1. 合成事件与浏览器的原生事件不同，也不会直接映射到原生事件。
2. 看下面组件中的事件绑定
    ```js
    function Foo () {
        return <div className="outer">
                    outer
                    <div className="middle">
                        middle
                        <div className="inner" onMouseEnter={handleMouseEnter}>
                            inner
                        </div>
                    </div>
                </div>
    }
    ```
3. 合成事件中：`type` 是 "mouseenter"，`relatedTarget` 是 `div.middle`，`target` 是 `div.inner`；是从 middle 进入 inner。
4. `nativeEvent` 中：`type` 是 "mouseout"，`target` 是 `div.middle`，`relatedTarget` 是 `div.inner`；是离开 middle 到 inner。
5. 事件本身都是从 middle 到 inner，只不过合成事件是按照预期的绑定在了 inner 上，所以就正常的是 mouseenter 事件；而原生事件被绑定到了父级，所以按照鼠标的移动顺序就只能是 mouseout。不懂。
6. 而且，合成事件的 `eventPhase` 是 3，也就是正常的冒泡阶段；但原生事件不同的 `eventPhase` 是 0。



## References
* [React 事件机制](https://juejin.cn/post/6941546135827775525#heading-2)
* [合成事件](https://zh-hans.legacy.reactjs.org/docs/events.html)