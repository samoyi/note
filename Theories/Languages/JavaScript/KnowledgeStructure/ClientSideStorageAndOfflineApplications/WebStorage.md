# Web Storage


## Basic
* `window.localStorage` and `window.sessionStorage`
* Both properties refer to a storage object: a persistent associative array that
 maps string keys to string values.
* The difference between `localStorage` and `sessionStorage` has to do with
lifetime and scope: how long the data is saved for and who the data is
accessible to.
* The Web Storage draft specification says that we should be able to store
structured data (objects and arrays) as well as primitive values and built-in
types such as dates, regular expressions, and even File objects. At the time of
this writing(2017.5), however, browsers only allow the storage of strings.   
如果存储非字符串类型，该数据会先被自动转换为字符串（看起来是调用 `toString()` 方法）再
进行存储。


## Storage Lifetime
* Data stored through `localStorage` is permanent: it does not expire and
remains stored on the user’s computer until a web app deletes it or the user
asks the browser (through some browser-specific UI) to delete it.
* Data stored through `sessionStorage` has the same lifetime as the top-level
window or browser tab in which the script that stored it is running. When the
window or tab is permanently closed, any data stored through `sessionStorage` is
 deleted. Note, however, that modern browsers have the ability to reopen
recently closed tabs and restore the last browsing session, so the lifetime of
these tabs and their associated `sessionStorage` may be longer than it seems.


## Storage Scope
* `localStorage` is scoped to the document origin. All documents with the same
origin share the same `localStorage` data. They can read each other’s data. And
they can overwrite each other’s data. But documents with different origins can
never read or overwrite each other’s data.
* Like `localStorage`, `sessionStorage` is scoped to the document origin so that
 documents with different origins will never share sessionStorage. But
`sessionStorage` is also scoped on a per-window basis. If a user has two
browser tabs displaying documents from the same origin, those two tabs have
separate `sessionStorage` data: the scripts running in one tab cannot read or
overwrite the data written by scripts in the other tab, even if both tabs are
visiting exactly the same page and are running exactly the same scripts.
* Note that this window-based scoping of `sessionStorage` is only for top-level
windows. If one browser tab contains two `<iframe>` elements, and those frames
hold two documents with the same origin, those two framed documents will share
`sessionStorage`.


## Storage API
1. `localStorage` and `sessionStorage` are often used as if they were regular
JavaScript objects: set a property to store a string and query the property to
retrieve it.
2. But these objects also define a more formal method-based API:
    ```js
    // The same code would work using sessionStorage instead:

    localStorage.setItem("x", 1); // Store an number with the name "x"
    localStorage.getItem("x"); // Retrieve a value

    // Enumerate all stored name/value pairs
    for(var i = 0; i < localStorage.length; i++) { // Length gives the # of pairs
        var name = localStorage.key(i); // Get the name of pair i
        var value = localStorage.getItem(name); // Get the value of that pair
    }

    localStorage.removeItem("x"); // Delete the item "x"
    localStorage.clear(); // Delete any other items, too
    ```
3. 根据《权威指南》上说的，如果这两个对象可以保存引用类型，则其保存的是该引用类型的一个
副本，读取的也是该副本的副本。所以不管是修改原始引用类型，还是修改从这两个对象中读取出来
的值，都不会修改这两个对象中保存的引用类型。于是下面这个看起来奇怪的结果就是正常的了：
    ```js
    localStorage.o = {x:1}; // Store an object that has a property x
    localStorage.o.x = 2; // Attempt to set the property of the stored object
    localStorage.o.x // => 1: x is unchanged
    ```
上面第二行的 `localStorage.o` 实际上并不是引用了 `localStorage` 里的对象 `o`，而是读
取出来的一个副本对象。所以此时副本对象的 `x` 值虽然为 `2`，但 `localStorage` 里的对象
 `o` 的 `x` 仍然是 `1`。如果第二行使用专用的 API，看起来就会更正常一些：
    ```js
    localStorage.getItem('o').x = 2;
    ```


## Storage Events
1. Whenever the data stored in `localStorage` or `sessionStorage` changes, the
browser triggers a `storage` event on any other `window` objects to which that
data is visible (but not on the window that made the change，但测试发现IE在当前窗
口也会触发).
2. Remember that `sessionStorage` is scoped to the top-level window, so storage
events are only triggered for `sessionStorage` changes when there are frames
involved.
3. Also note that storage events are only triggered when storage actually
changes. Setting an existing stored item to its current value does not trigger
an event, nor does removing an item that does not exist in storage.
4. 虽然FF可以在本地环境中实现事件触发，但至少Chrome和IE只有在服务器环境才行。

### Event properties
* `key`: the name or key of the item that was set or removed. If the `clear()`
method was called, this property will be `null`.
* `newValue`: holds the new value of the item, or `null` if `removeItem()` was
called.
* `oldValue`: holds the old value of an existing item that changed or was
deleted, or `null` if a new item was inserted.
* `storageArea`: this property will equal either the `localStorage` or the
`sessionStorage` property of the target Window object. 不知道为什么要说 target
Window object，明明共享的是同样的数据啊，而且根本就是同一个对象：
    ```js
    window.addEventListener("storage", function (ev) {
        console.log(ev.storageArea === localStorage); // true
    });
    ```
* `url`: the URL of the document whose script made this storage change.
