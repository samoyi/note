# Reconciliation


<!-- TOC -->

- [Reconciliation](#reconciliation)
    - [Motivation](#motivation)
    - [The Diffing Algorithm](#the-diffing-algorithm)
        - [Elements Of Different Types](#elements-of-different-types)
        - [DOM Elements Of The Same Type](#dom-elements-of-the-same-type)
        - [Component Elements Of The Same Type](#component-elements-of-the-same-type)
        - [Recursing On Children](#recursing-on-children)
        - [Keys](#keys)
    - [Tradeoffs](#tradeoffs)
    - [References](#references)

<!-- /TOC -->


## Motivation
1. 调用 `render()` 会生成一个 React 元素组成的树，下次再调用时会生成一个新树，React 需要尽可能高效的用新树去更新旧树，也就是只替换其中发生变化的部分而不是整体替换。
2. 通用的算法是 $O(n^3)$ 的复杂度，其中 $n$ 是树中的节点数量。对于更新 DOM 中的节点数来说这个复杂度太高了，因此 React 基于以下两个假设简化了对比算法，实现了一个 $O(n)$ 复杂度的启发式算法 
    * 两个不同类型的元素会产生出不同的树；
    * 开发者可以使用 `key` 属性标识哪些子元素在更新渲染中可能是不变的。
3. 在实践中，这两条假设对于几乎所有的场景都是成立的。


## The Diffing Algorithm
### Elements Of Different Types
1. Whenever the root elements have different types, React will tear down the old tree and build the new tree from scratch.
2. When tearing down a tree, old DOM nodes are destroyed. Component instances receive `componentWillUnmount()`. 
3. When building up a new tree, new DOM nodes are inserted into the DOM. Component instances receive `componentDidMount()`. 
4. Any state associated with the old tree is lost.

### DOM Elements Of The Same Type
1. When comparing two React DOM elements of the same type, React looks at the attributes of both, keeps the same underlying DOM node, and only updates the changed attributes. For example:
    ```js
    <div className="before" title="stuff" />

    <div className="after" title="stuff" />
    ```
    By comparing these two elements, React knows to only modify the `className` on the underlying DOM node.
2. When updating style, React also knows to update only the properties that changed. For example:
    ```js
    <div style={{color: 'red', fontWeight: 'bold'}} />

    <div style={{color: 'green', fontWeight: 'bold'}} />
    ```
    When converting between these two elements, React knows to only modify the `color` style, not the `fontWeight`.
3. After handling the DOM node, React then recurses on the children.

### Component Elements Of The Same Type
1. When a component updates, the instance stays the same, so that state is maintained across renders. 
2. React updates the props of the underlying component instance to match the new element, and calls `componentDidUpdate()` on the underlying instance.
3. Next, the `render()` method is called and the diff algorithm recurses on the previous result and the new result.

### Recursing On Children
1. By default, when recursing on the children of a DOM node, React just iterates over both lists of children at the same time and generates a mutation whenever there’s a difference.
2. For example, when adding an element at the end of the children, converting between these two trees works well:
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
    React will match the two `<li>first</li>` trees, match the two `<li>second</li>` trees, and then insert the `<li>third</li>` tree.
3. If you implement it naively, inserting an element at the beginning has worse performance. For example, converting between these two trees works poorly:
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
    React will mutate every child instead of realizing it can keep the `<li>Duke</li>` and `<li>Villanova</li>` subtrees intact. This inefficiency can be a problem.

### Keys
1. In order to solve this issue, React supports a `key` attribute. When children have keys, React uses the `key` to match children in the original tree with children in the subsequent tree. 
2. For example, adding a `key` to our inefficient example above can make the tree conversion efficient:
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
    Now React knows that the element with key `'2014'` is the new one, and the elements with the keys `'2015'` and `'2016' `have just moved.
3. The key only has to be unique among its siblings, not globally unique.
4. As a last resort, you can pass an item’s index in the array as a key. This can work well if the items are never reordered, but reorders will be slow.
5. Reorders can also cause issues with component state when indexes are used as keys. Component instances are updated and reused based on their key. If the key is an index, moving an item changes it. As a result, component state for things like uncontrolled inputs can get mixed up and updated in unexpected ways. 简单来说就是 key 相当于时一个元素的 ID，应该是稳定对应的。但如果使用 index 作为下标，而在列表里插入一个元素，那插入的这个元素的 key 就会占用它后面那个元素的 key，而之后所有元素的 key 也都会发生错位改变。


## Tradeoffs
1. It is important to remember that the reconciliation algorithm is an implementation detail. React could rerender the whole app on every action; the end result would be the same. Just to be clear, rerender in this context means calling render for all components, it doesn’t mean React will unmount and remount them. It will only apply the differences following the rules stated in the previous sections.
2. Because React relies on heuristics, if the assumptions behind them are not met, performance will suffer
    * The algorithm will not try to match subtrees of different component types. If you see yourself alternating between two component types with very similar output, you may want to make it the same type.
    * Keys should be stable, predictable, and unique. Unstable keys (like those produced by `Math.random()`) will cause many component instances and DOM nodes to be unnecessarily recreated, which can cause performance degradation and lost state in child components.


## References
* [Reconciliation](https://reactjs.org/docs/reconciliation.html)
