# MutationObserver

* The MutationObserver interface provides the ability to watch for changes being made to the DOM tree.
* It is designed as a replacement for the older Mutation Events feature which was part of the DOM3 Events specification


## `MutationObserver()`
```js
var observer = new MutationObserver(callback);
```

1. The DOM `MutationObserver()` constructor — part of the `MutationObserver` interface — creates and returns a new observer which invokes a specified callback when DOM events occur.
2. DOM observation does not begin immediately; the `observe()` method must be called first to establish which portion of the DOM to watch and what kinds of changes to watch for.
3. If the element being observed is removed from the DOM and then subsequently released by the browser's garbage collection mechanism, the `MutationObserver` is likewise deleted.

### `callback`
1. A function which will be called on each DOM change that qualifies given the targeted node or subtree and options.
2. The callback function takes as input two parameters: an array of `MutationRecord` objects describing each change that occurred and the `MutationObserver` which invoked the callback.


## `observe()`
```js
mutationObserver.observe(target[, options])
```

1. The `MutationObserver` method `observe()` configures the `MutationObserver` callback to begin receiving notifications of changes to the DOM that match the given options.
2. Depending on the configuration, the observer may watch a single Node in the DOM tree, or that node and some or all of its descendant nodes.
3. To stop the `MutationObserver` (so that none of its callbacks will be triggered any longer), call `disconnect()`.

### `Parameters`
#### `target`
1. A DOM Node (which may be an `Element`) within the DOM tree to watch for changes, or to be the root of a subtree of nodes to be watched.
2. 上面说的“which may be an `Element`”，意思应该是通过`createElement()`创建的元素即使还没有被插入 DOM，也是可以监听到变化的。实测也确实可以。

#### `options`
1. An optional `MutationObserverInit` object providing options that describe what DOM mutations should be reported to the observer's `callback`.
2. At a minimum, one of `childList`, `attributes`, and/or `characterData` must be `true` when you call `observe()`. Otherwise, a `TypeError` exception will be thrown.

<table>
    <caption>`MutationObserverInit`</caption>
    <tr>
        <td>`attributeFilter `</td>
        <td>
            An array of specific attribute names to be monitored. <br />
            If this property isn't included, changes to all attributes cause mutation notifications. <br />
            No default value.
        </td>
    </tr>
    <tr>
        <td>`attributeOldValue `</td>
        <td>
            Set to `true` to record the previous value of any attribute that changes when monitoring the node or nodes for attribute changes <br />
            No default value.
        </td>
    </tr>
    <tr>
        <td>`attributes`</td>
        <td>
            Set to `true` to watch for changes to the value of attributes on the node or nodes being monitored. <br />
            The default value is `false`.
        </td>
    </tr>
    <tr>
        <td>`characterData`</td>
        <td>
            Set to `true` to monitor the specified target node or subtree for changes to the character data contained within the node or nodes. <br />
            No default value.
        </td>
    </tr>
    <tr>
        <td>`characterDataOldValue`</td>
        <td>
            Set to `true` to record the previous value of a node's text whenever the text changes on nodes being monitored. <br />
            No default value.
        </td>
    </tr>
    <tr>
        <td>`childList`</td>
        <td>
            Set to `true` to monitor the target node (and, if `subtree` is `true`, its descendants) for the addition or removal of new child nodes. <br />
            The default is false.
        </td>
    </tr>
    <tr>
        <td>`subtree`</td>
        <td>
            Set to `true` to extend monitoring to the entire subtree of nodes rooted at `target`. <br />
            All of the other `MutationObserverInit` properties are then extended to all of the nodes in the subtree instead of applying solely to the `target` node. <br />
            The default value is `false`.
        </td>
    </tr>
</table>

### Exceptions
Thrown `TypeError` in any of the following circumstances:
* The options are configured such that nothing will actually be monitored (for example, if `MutationObserverInit.childList`, `MutationObserverInit.attributes`, and `MutationObserverInit.characterData` are all `false`).
* The `attributes` option is `false` (indicating that attribute changes are not not to be monitored) but `attributeOldValue` is `true` and/or `attributeFilter` is present.
* The `characterDataOldValue` option is `true` but `MutationObserverInit.characterData` is `false` (indicating that character changes aren't to be tracked).


## `disconnect()`
1. The MutationObserver method `disconnect()` tells the observer to stop watching for mutations.
2. The observer can be reused by calling its `observe()` method again.
3. All notifications of mutations that have already been detected but not yet reported to the observer are discarded.


## `takeRecords()`
1. This method returns a list of all matching DOM changes that have been detected but not yet processed by the observer's callback function, leaving the mutation queue empty.
2. The most common use case for this is to immediately fetch all pending mutation records immediately prior to disconnecting the observer, so that any pending mutations can be processed when stopping down the observer.

### Return value
An array `MutationRecord` objects, each describing one change applied to the portion of the document's DOM tree.


## Reusing MutationObservers
1. You can call `observe()` multiple times on the same `MutationObserver` to watch for changes to different parts of the DOM tree and/or different types of changes.
2. There are some caveats to note:
    * If you call `observe()` on a node that's already being observed by the same `MutationObserver`, all existing observers are automatically removed from all targets being observed before the new observer is activated.
    * If the same `MutationObserver` is not already in use on the target, then the existing observers are left alone and the new one is added.


## Observation follows nodes when disconnected
1. Mutation observers are intended to let you be able to watch the desired set of nodes over time, even if the direct connections between those nodes are severed. If you begin watching a subtree of nodes, and a portion of that subtree is detached and moved elsewhere in the DOM, you continue to watch the detached segment of nodes, receiving the same callbacks as before the nodes were detached from the original subtree.
2. In other words, until you've been notified that nodes are being split off from your monitored subtree, you'll get notifications of changes to that split-off subtree and its nodes. This prevents you from missing changes that occur after the connection is severed and before you have a chance to specifically begin monitoring the moved node or subtree for changes.
3. This means that in theory if you keep track of the MutationRecord objects describing the changes that occur, and , you should be able to "undo" the changes, rewinding the DOM back to its initial state.


## References
* [MDN: MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
