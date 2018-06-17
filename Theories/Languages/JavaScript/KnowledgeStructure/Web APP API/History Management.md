 `location.hash` and `HTML5 History API`


## location.hash
 * `location.hash`
 * `window.onhashchange`


## HTML5 History API
### Add a new history entry
```js
history.pushState(oStateObject, sTitle, sUrl)
```
使用该方法本身并不会触发 `onpopstate` 事件。

#### para `oStateObject`
* An object that contains all the state information necessary to restore the
current state of the document. Any object that can be converted to a string with
 `JSON.stringify()` will work, and certain other native types such as `Date` and
 `RegExp` should also work as well.
>In Gecko 2.0 (Firefox 4 / Thunderbird 3.3 / SeaMonkey 2.1) through Gecko 5.0
(Firefox 5.0 / Thunderbird 5.0 / SeaMonkey 2.2), the passed object is serialized
 using JSON. Starting in Gecko 6.0 (Firefox 6.0 / Thunderbird 6.0 / SeaMonkey
2.3), the object is serialized using the structured clone algorithm. This
allows a wider variety of objects to be safely passed.    

* Whenever the user navigates to the new state, a ```popstate``` event is fired,
 and the `state` property of the event contains a copy of the history entry's
 `oStateObject`.
* Firefox 对此参数的说明：The state object can be anything that can be serialized.
 Because Firefox saves state objects to the user's disk so they can be restored
after the user restarts the browser, we impose a size limit of 640k characters
on the serialized representation of a state object. If you pass a state object
whose serialized representation is larger than this to `pushState()`, the method
 will throw an exception. If you need more space than this, you're encouraged to
 use `sessionStorage` and/or `localStorage`.

#### para `sTitle`
*  An optional title (a plain text string) that the browser can use (in a
`<Back>` menu, for example) to identify the saved state in the browsing history.
* 看起来是想作为新创建的历史记录的页面 title ，但目前(2016.11)浏览器忽略该参数

#### para `sUrl`
* An optional URL that will be displayed as the location of the current state.
* A URL with each state allows the user to bookmark internal states of your
application, and if you include sufficient information in the URL, your
application can restore its state when loaded from a bookmark.
* 可以使用相对地址或绝对地址。但绝对地址不能跨域。
* 不管该路径文件是否存在都可以。但如果重新进入该页面则会报错，因为浏览器会真的试图加载指
定路径的文件。

#### Advantages
In a sense, calling `pushState()` is similar to setting
`window.location = "#foo"`, in that both will also create and activate another
history entry associated with the current document. But `pushState()` has a few
advantages:
* The new URL can be any URL in the same origin as the current URL. In contrast,
 setting `window.location` keeps you at the same document only if you modify
only the hash.
* You don't have to change the URL if you don't want to. In contrast, setting
`window.location = "#foo"` only creates a new history entry if the current hash
isn't `#foo`.
* You can associate arbitrary data with your new history entry. With the
hash-based approach, you need to encode all of the relevant data into a short
string.
* If `sTitle` is subsequently used by browsers, this data can be utilized
(independent of, say, the hash).

### Replace a history entry
```js
history.replaceState(oStateObject, sTitle, sUrl)
```
This method takes the same arguments but replaces the current history state
instead of adding a new state to the browsing history.

###  `popstate` event
```js
window.onpopstate
```
1. When the user navigates to saved history states using the Back or Forward
buttons, the browser fires a `popstate` event on the Window object.
2. The event object associated with the event has a property named `state`,
which contains a copy (another structured clone) of the state object you passed
to `pushState()`.

### Reading the current state
```js
history.state
```


## Traveling through history
* `window.history.back()`
* `window.history.forward()`
* `window.history.go()`
* `window.history.length`



[Ajax navigation example.](https://developer.mozilla.org/en-US/docs/Web/API/History_API/Example)
