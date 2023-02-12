# Web Storage


<!-- TOC -->

- [Web Storage](#web-storage)
    - [Basic](#basic)
    - [Storage Lifetime](#storage-lifetime)
    - [Storage Scope](#storage-scope)
        - [`localStorage`](#localstorage)
        - [`sessionStorage`](#sessionstorage)
    - [Storage API](#storage-api)
        - [读写方式](#读写方式)
        - [如果可以保存引用类型，保存和读取的都是该引用类型的副本](#如果可以保存引用类型保存和读取的都是该引用类型的副本)
    - [Storage Events](#storage-events)
        - [Event properties](#event-properties)
    - [References](#references)

<!-- /TOC -->


## Basic
* `window.localStorage` 和 `window.sessionStorage` 两者的区别在于存储的有效期和作用域的不同：数据可以存储多长时间以及谁拥有数据的访问权。
* The Web Storage draft specification says that we should be able to store structured data (objects and arrays) as well as primitive values and built-in types such as dates, regular expressions, and even File objects. At the time of this writing(2017.5), however, browsers only allow the storage of strings. 如果存储非字符串类型，该数据会先被自动转换为字符串（看起来是调用 `toString()` 方法）再进行存储。


## Storage Lifetime
1. 通过 `localStorage` 存储的数据是永久性的，除非 Web 应用刻意删除存储的数据，或者用户通过设置浏览器配置（浏览器提供的特定UI）来删除，否则数据将一直保留在用户的电脑上，永不过期。
2. `sessionStorage` 的有效期和存储数据的脚本所在的最顶层的窗口或者是浏览器标签页是一样的。一旦窗口或者标签页被永久关闭了，那么所有通过 `sessionStorage` 存储的数据也都被删除了。
3. 如果不关闭标签页而只是跳转到了其他域，也不会被删除。
4. 要注意的是，现代浏览器已经具备了重新打开最近关闭的标签页随后恢复上一次浏览的会话功能，因此，这些标签页以及与之相关的 `sessionStorage` 的有效期可能会更加长些。


## Storage Scope
### `localStorage`
1. `localStorage` 的作用域是限定在文档源级别的。
2. 文档源是通过协议、主机名以及端口三者来确定的，同源的文档间共享同样 `localStorage` 数据（不论该源的脚本是否真正地访问 `localStorage` ）。它们可以互相读取对方的数据，甚至可以覆盖对方的数据。但是，非同源的文档间互相都不能读取或者覆盖对方的数据（即使它们运行的脚本是来自同一台第三方服务器也不行）
3. 需要注意的是 `localStorage` 的作用域也受浏览器供应商限制。如果你使用 Firefox 访问站点，那么下次用另一个浏览器（比如，Chrome）再次访问的时候，那么本次是无法获取上次存储的数据的

### `sessionStorage`
1. 与 `localStorage` 一样，`sessionStorage` 的作用域也是限定在文档源中，因此非同源文档间都是无法共享 `sessionStorage` 的。
2. 不仅如此，`sessionStorage` 的作用域还被限定在窗口中。
3. 如果同源的文档渲染在不同的浏览器标签页中，那么它们互相之间拥有的是各自的 `sessionStorage` 数据，无法共享。
4. 一个标签页中的脚本是无法读取或者覆盖由另一个标签页脚本写入的数据，哪怕这两个标签页渲染的是同一个页面，运行的是同一个脚本也不行。
5. 要注意的是：这里提到的基于窗口作用域的 `sessionStorage` 指的窗口只是顶级窗口。如果一个浏览器标签页包含两个 `<iframe>` 元素，它们所包含的文档是同源的，那么这两者之间是可以共享 `sessionStorage` 的。 测试如下：
    ```js
    // frame1
    window.addEventListener('click', function(){
        sessionStorage.clear();
        let key = Math.random();
        let value = Math.random();
        document.body.innerHTML = `
        key: ${key}<br />
        value: ${value}
        `;
        sessionStorage[key] = value;
    });
    ```
    ```js
    // frame2
    window.addEventListener('storage', function(ev){
        document.body.innerHTML = `
        key: ${ev.key}<br />
        value: ${ev.newValue}<br />
        fromULR: ${ev.url}
        `;
    });
    ```


## Storage API
###　读写方式
1. `localStorage` 和 `sessionStorage` 通常被当做普通的 JavaScript 对象使用：通过设置属性来存储字符串值，查询该属性来读取该值。
2. 除此之外，这两个对象还提供了更加正式的方法形式的 API
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

### 如果可以保存引用类型，保存和读取的都是该引用类型的副本
1. 如果这两个对象可以保存引用类型，则其保存的是该引用类型的一个副本，读取的也是该副本的副本。
2. 所以不管是修改原始引用类型，还是修改从这两个对象中读取出来的值，都不会修改这两个对象中保存的引用类型。于是下面这个看起来奇怪的结果就是正常的了：
    ```js
    localStorage.o = {x:1}; // Store an object that has a property x
    localStorage.o.x = 2; // Attempt to set the property of the stored object
    localStorage.o.x // => 1: x is unchanged
    ```
3. 上面第二行的 `localStorage.o` 实际上并不是引用了 `localStorage` 里的对象 `o`，而是读取出来的一个副本对象。
4. 所以此时副本对象的 `x` 值虽然为 `2`，但 `localStorage` 里的对象 `o` 的 `x` 仍然是 `1`。如果第二行使用专用的 API，看起来就会更正常一些：
    ```js
    localStorage.getItem('o').x = 2;
    ```


## Storage Events
1. 无论什么时候存储在 `localStorage` 或者 `sessionStorage` 的数据发生改变，浏览器都会在其他对该数据可见的窗口对象上触发存储事件。
2. 但是，在对数据进行改变的窗口对象上是不会触发的。不过测试发现 IE 在当前窗口也会触发。
3. 要注意的是，只有当存储数据真正发生改变的时候才会触发存储事件。像给已经存在的存储项设置一个一模一样的值，抑或是删除一个本来就不存在的存储项都是不会触发存储事件的。
4. 虽然 FF 可以在本地环境中实现事件触发，但至少 Chrome 和 IE 只有在服务器环境才行。

### Event properties
* `key`: 被设置或者移除的项的名字或者键名。如果调用的是 `clear()` 函数，那么该属性值为 `null`。
* `newValue`: 保存该项的新值。如果调用 `removeItem()` 时，该属性值为 `null`。
* `oldValue`: 被改变或被删除的项的旧值。当插入一个新项的时候，该属性值为 `null`。
* `storageArea`: 共享的 localStorage 属性或者是 sessionStorage 属性
    ```js
    window.addEventListener("storage", function (ev) {
        console.log(ev.storageArea === localStorage); // true
    });
    ```
* `url`: 触发该存储变化脚本所在文档的 URL。


## References
* [《JavaScript权威指南(第6版)》](https://book.douban.com/subject/10549733/)
