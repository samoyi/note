# Reconciliatio algorithm

1. React provides a declarative API so that you don’t have to worry about
exactly what changes on every update.
2. This makes writing applications a lot easier, but it might not be obvious how
this is implemented within React.
3. This article explains the choices we made in React’s “diffing” algorithm so
that component updates are predictable while being fast enough for
high-performance apps.


## 目的
1. When you use React, at a single point in time you can think of the `render()`
function as creating a tree of React elements.
2. On the next state or props update, that `render()` function will return a
different tree of React elements.
3. React then needs to figure out how to efficiently update the UI to match the
most recent tree.
4. There are some generic solutions to this algorithmic problem of generating
the minimum number of operations to transform one tree into another. However,
the state of the art algorithms have a complexity in the order of O(n3) where n
is the number of elements in the tree. If we used this in React, displaying 1000
elements would require in the order of one billion comparisons. This is far too
expensive.
5. Instead, React implements a heuristic O(n) algorithm based on two assumptions:
    * Two elements of different types will produce different trees. 基于这点假设，
    如果发现一个元素的类型发生变化了，就不用再比较它的后代节点了，因为已经是两棵不同的树
    了。这样就会省掉很多节点遍历比较。
    * The developer can hint at which child elements may be stable across
    different renders with a `key` prop.
6. In practice, these assumptions are valid for almost all practical use cases.
7. 这里，reconciliation 的意思应该是说：如果要严格前后比较 DOM 树的话，复杂度太高；于
是这里就不那么严格了，通过预设两个假定的情况，如果可以遵守这两个假定的情况，那么比较 DOM
树的复杂度就会从 O(n3) 变为 O(n)。


## The Diffing Algorithm
### Elements Of Different Types
1. Whenever the root elements have different types, React will tear down the old
tree and build the new tree from scratch.
2. Going from `<a>` to `<img>`, or from `<Article>` to `<Comment>` - any of
those will lead to a full rebuild.
3. When tearing down a tree, old DOM nodes are destroyed. Component instances
receive `componentWillUnmount()`.
4. When building up a new tree, new DOM nodes are inserted into the DOM.
Component instances receive `componentWillMount()` and then `componentDidMount()`
5. Any state associated with the old tree is lost.
6. Any components below the root will also get unmounted and have their state
destroyed.

### DOM Elements Of The Same Type
1. When comparing two React DOM elements of the same type, React looks at the
attributes of both, keeps the same underlying DOM node, and only updates the
changed attributes.
    ```html
    <div className="before" title="stuff" />

    <div className="after" title="stuff" />
    ```
    By comparing these two elements, React knows to only modify the `className`
    on the underlying DOM node.
2. 实际上还可以进行更细致的比较
    ```html
    <div style={{color: 'red', fontWeight: 'bold'}} />

    <div style={{color: 'green', fontWeight: 'bold'}} />
    ```
    When converting between these two elements, React knows to only modify the
    `color` style, not the `fontWeight`.
3. After handling the DOM node, React then recurses on the children.

### Component Elements Of The Same Type
1. When a component updates, the instance stays the same, so that state is
maintained across renders.
2. React updates the props of the underlying component instance to match the new
element, and calls `componentWillReceiveProps()` and `componentWillUpdate()` on
the underlying instance.
3. 这里说的同类型组件其实就是一个组件实例接收了不同的 prop 参数。那么这是所谓的同类型更
新，实际上就是更新传入的参数。
4. Next, the `render()` method is called and the diff algorithm recurses on the
previous result and the new result.


### Recursing On Children
1. By default, when recursing on the children of a DOM node, React just iterates
over both lists of children at the same time and generates a mutation whenever
there’s a difference.
    ```html
    <ul>
        <li>first</li>
        <li>second</li>
    </ul>

    <ul>
        <li>first</li>
        <li>second</li>
        <li>third</li>
    </ul>
    ```
2. React 同时检测两边`<ul>`的子节点：
    1. 检查之前列表的第一个`<li>`和之后列表的第一个`<li>`，没发现变化；
    2. 检查之前列表的第二个`<li>`和之后列表的第二个`<li>`，没发现变化；
    3. 继续检查之前，发现已经没有子节点了，但检查第二个列表时发现还有一个
        `<li>third</li>`
    4. 于是不改变旧列表的其他部分，仅仅是在它后面加上新的`<li>`，就很轻松的完成了更新。
3. 但如果插入的子节点不是位于尾部，那就会有性能随时，比如下面的更新情况
    ```html
    <ul>
        <li>Duke</li>
        <li>Villanova</li>
    </ul>

    <ul>
        <li>Connecticut</li>
        <li>Duke</li>
        <li>Villanova</li>
    </ul>
    ```
4. 虽然我们一眼就能看出来新节点是查到了头部，但 React 依然会按照上面顺序检测：
    1. 检查之前列表的第一个`<li>`和之后列表的第一个`<li>`，发现变化从`Duke`变成了
        `Connecticut`。更新该子节点。
    2. 检查之前列表的第二个`<li>`和之后列表的第二个`<li>`，发现变化从`Villanova`变成了
        `Duke`。更新该子节点。
    3. 继续检查之前，发现已经没有子节点了，但检查第二个列表时发现还有一个
        `<li>Villanova</li>`。添加该子节点。
    4. 本来这次更新仍然只需要在头部插入新节点就完事了，但 React 还是进行了 3 次更新。
5. 为了避免这种更新子节点时的浪费，所以需要在渲染列表时，给每个列表项加上`key`属性
    ```html
    <ul>
        <li key="2015">Duke</li>
        <li key="2016">Villanova</li>
    </ul>

    <ul>
        <li key="2014">Connecticut</li>
        <li key="2015">Duke</li>
        <li key="2016">Villanova</li>
    </ul>
    ```
6. 现在，React 就知道了子节点之间的对应关系。现在比较的时候，就不会用
`<li key="2015">Duke</li>`去和`<li key="2014">Connecticut</li>`比较，而是按照相同
的`key`来比较。因此也就知道了有一个新加的项应该直接插入到最前面。
7. 即使不是列表渲染，也可以给每个子节点都加上`key`属性。在任何需要给节点一个身份标识的
时候都可以加上`key`
    ```js
    class NumberList extends React.Component {
        constructor(props){
            super(props);

            this.state = {
                list: [
                    <h2 key="2">2</h2>,
                    <h3 key="3">3</h3>,
                    <h4 key="4">4</h4>,
                ],
            };
        }

        componentDidMount(){
            setTimeout(()=>{
                this.setState({
                    list: [<h1 key="1">1</h1>, ...this.state.list]
                });
            }, 3000);
        }

        render(){
            return <div>{ this.state.list }</div>;
        }
    }

    ReactDOM.render(
        <NumberList />,
        document.getElementById('root')
    );
    ```


## Tradeoffs
### 不满足 reconciliation algorithm 的情况
Because React relies on heuristics, if the assumptions behind them are not met,
performance will suffer.

* The algorithm will not try to match subtrees of different component types.
看起来，结合上面讲算法的情况是，如果发现前后是两个不同类型的 DOM 元素，这不在递归检查，
直接替换树；而如果前后是两个不同的组件元素，则不会直接替换树，而是会递归检查。
If you see yourself alternating between two component types with very
similar output, you may want to make it the same type. In practice, we
haven’t found this to be an issue.
* Keys should be stable, predictable, and unique. Unstable keys (like those
produced by `Math.random()`) will cause many component instances and DOM nodes
to be unnecessarily recreated, which can cause performance degradation and lost
state in child components.
