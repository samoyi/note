# Virtual DOM

## DOM is a bad translator
1. HTML and JS can not communicate with each other directly, they need DOM.
2. DOM, a model of HTML document, is more complicated and more abstract than
HTML itself.
3. HTML document is a structure which is visible, logical and well-organized.
The use of DOM will, undoubtedly, undermine the visuality, logic and
organization, and will also add extra code.
4. DOM operation is very inefficent.


## Virtual DOM
The DOM can be represented as a data structure in Javascript.  
Pseudo-code:
```js
// An unordered list represented as Javascript
let domNode = {
    tag: 'ul',
    attributes: { id: 'myId' },
    children: [
        // where the LI's would go
    ]
};
```
使用类似于这样的思路，就可以把整个 DOM 映射为 JS 对象


## Virtual DOM 的优点
### 避免分次更新 DOM
一个操作可能会涉及若干个 DOM 更新，每次都调用 DOM API 进行更新渲染的话，会很耗时。如果
使用 Virtual DOM，则这若干次的更新先在 JS 中进行，速度会很快。最后只需要进行一次实际的
 DOM API 调用更新，整体会省下好几次耗时的 DOM API 更新。

### 避免不必要的 DOM 更新
有些 DOM 更新后，相比于之前的状态，会有一些元素（包括数据）实际上并未没有变化。这些元素
的重复更新是没有必要的。而 Virtual DOM 可以识别那些没有变化的元素，在更新 DOM 的时候不
更新这些元素，从而节省了更新时间。

### Make your code universal
Since your Vue instance does not really on an HTML file, it is also renderable
by a server for server-side rendering.
```js
new Vue({
    el: '#app',
    data: {
        message: 'hello world'
    },
    render(createElement) {
        return createElement(
            'div',
            { attrs: { id: 'myId' } },
            this.message
        );
    }
});
```

### JSX  
<mark>不懂</mark>
JSX. Render functions allow JS extensions like JSX which may be desirable for
architecting a component-based app.


## Diff algorithms



## References
* [What’s The Deal With Vue’s Virtual DOM?](https://medium.com/js-dojo/whats-the-deal-with-vue-s-virtual-dom-3ed4fc0dbb20)
