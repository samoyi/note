# History Management

HTML5 defines two mechanisms for history management: `location.hash` and HTML5 History API.


<!-- TOC -->

- [History Management](#history-management)
    - [`location.hash`](#locationhash)
    - [HTML5 History API](#html5-history-api)
        - [Add a new history entry](#add-a-new-history-entry)
            - [para `oStateObject`](#para-ostateobject)
            - [para `sTitle`](#para-stitle)
            - [para `sUrl`](#para-surl)
        - [Replace a history entry](#replace-a-history-entry)
        - [`popstate` event](#popstate-event)
        - [Reading the current state](#reading-the-current-state)
        - [Advantages](#advantages)
    - [References](#references)

<!-- /TOC -->


## `location.hash`
1. The simpler history management technique involves `location.hash` and `hashchange` event on `window`.
2. Setting the `location.hash` property updates the URL displayed in the location bar and adds an entry to the browser’s history.
3. By setting the `location.hash` property, then, you allow the user to use the Back and Forward buttons to navigate between document states. For this to work, your application must have some way to detect these changes of state, so that it can read the state stored in the fragment identifier and update itself accordingly.
4. In HTML5, the browser fires a `hashchange` event at the `Window` whenever the fragment identifier changes. You can set `window.onhashchange` to a handler function that will be called whenever the fragment identifier changes as a result of history navigation.
5. When this handler function is called, your function would parse the
`location.hash` value and redisplay the application using the state information it contains.

```html
<div id="contain">This is home</div>
<div>
    <input type="button" value="page1" id="page1" />
    <input type="button" value="page2" id="page2" />
    <br />
    <input type="button" value="back" id="back" />
    <input type="button" value="forward" id="forward" />
</div>
```
```js
const oContain = document.querySelector('#contain');
const oPage1Btn = document.querySelector('#page1');
const oPage2Btn = document.querySelector('#page2');
const oForwardBtn = document.querySelector('#forward');
const oBackBtn = document.querySelector('#back');

oPage1Btn.addEventListener('click', function(){
    location.hash = 'page1';
});
oPage2Btn.addEventListener('click', function(){
    location.hash = 'page2';
});
oForwardBtn.addEventListener('click', function(){
    history.forward();
});
oBackBtn.addEventListener('click', function(){
    history.back();
});

window.addEventListener('hashchange', function(ev){
    let sHashValue = location.hash.slice(1);
    if (sHashValue){
        oContain.textContent = 'This is ' + sHashValue;
    }
    else {
        oContain.textContent = 'This is home';
    }
});
```


## HTML5 History API
`history.pushState()` and `popstate` event on `window`.

### Add a new history entry
```js
history.pushState(oStateObject, sTitle, sUrl)
```
使用该方法本身并不会触发 `popstate` 事件。当然不会了，push 怎么会触发 pop 事件。

#### para `oStateObject`
1. An object that contains all the state information necessary to restore the current state of the document. Any object that can be converted to a string with `JSON.stringify()` will work, and certain other native types such as `Date` and `RegExp` should also work as well.
2. >In Gecko 2.0 (Firefox 4 / Thunderbird 3.3 / SeaMonkey 2.1) through Gecko 5.0
(Firefox 5.0 / Thunderbird 5.0 / SeaMonkey 2.2), the passed object is serialized
 using JSON. Starting in Gecko 6.0 (Firefox 6.0 / Thunderbird 6.0 / SeaMonkey
2.3), the object is serialized using the structured clone algorithm. This
allows a wider variety of objects to be safely passed.    
3. Whenever the user navigates to the new state, a `popstate` event is fired, and the `state` property of the event contains a copy of the history entry's `oStateObject`.
4. Firefox 对此参数的说明：The state object can be anything that can be serialized. Because Firefox saves state objects to the user's disk so they can be restored after the user restarts the browser, we impose a size limit of 640k characters on the serialized representation of a state object. If you pass a state object whose serialized representation is larger than this to `pushState()`, the method will throw an exception. If you need more space than this, you're encouraged to use `sessionStorage` and/or `localStorage`.

#### para `sTitle`
1. An optional title (a plain text string) that the browser can use (in a `<Back>` menu, for example) to identify the saved state in the browsing history. 
2. 看起来是想作为新创建的历史记录的页面 title ，但目前(2016.11)浏览器忽略该参数

#### para `sUrl`
1. An optional URL that will be displayed as the location of the current state.
2. A URL with each state allows the user to bookmark internal states of your application, and if you include sufficient information in the URL, your application can restore its state when loaded from a bookmark.
3. 可以使用相对地址或绝对地址。但绝对地址只能同源。
4. 即使该路径的文件不存在也可以。但如果重新进入该页面则会报错，因为浏览器会真的试图加载指定路径的文件。

```js
// 假如当前页面 url 是 http://localhost/test/test.html

history.pushState({}, '', 'abc.html');        // http://localhost/test/abc.html
history.pushState({}, '', '/abc.html');       // http://localhost/abc.html
history.pushState({}, '', './abc.html');      // http://localhost/test/abc.html
history.pushState({}, '', '../abc.html');     // http://localhost/abc.html
history.pushState({}, '', '../abc/def.html'); // http://localhost/abc/def.html

history.pushState({}, '', 'http://localhost/abc.html');        // http://localhost/abc.html
history.pushState({}, '', 'http://localhost:3000/abc.html');   // 非同源 报错
```

### Replace a history entry
```js
history.replaceState(oStateObject, sTitle, sUrl)
```
This method takes the same arguments but replaces the current history state instead of adding a new state to the browsing history.

###  `popstate` event
```js
window.onpopstate
```
1. When the user navigates to saved history states using the Back or Forward buttons, the browser fires a `popstate` event on the `Window` object.
2. The event object associated with the event has a property named `state`, which contains a copy (another structured clone) of the state object you passed to `pushState()`.

```html
<div id="contain">This is home</div>
<div>
    <input type="button" value="page1" id="page1" />
    <input type="button" value="page2" id="page2" />
    <br />
    <input type="button" value="back" id="back" />
    <input type="button" value="forward" id="forward" />
</div>
```

```js
const oContain = document.querySelector('#contain');
const oPage1Btn = document.querySelector('#page1');
const oPage2Btn = document.querySelector('#page2');
const oForwardBtn = document.querySelector('#forward');
const oBackBtn = document.querySelector('#back');

oPage1Btn.addEventListener('click', function(){
    history.pushState({name: 'page1'}, '', './page1');
    oContain.textContent = 'This is page1';
});
oPage2Btn.addEventListener('click', function(){
    history.pushState({name: 'page2'}, '', './page2');
    oContain.textContent = 'This is page2';
});

window.addEventListener('popstate', function(ev){
    oContain.textContent = 'This is ' + ev.state.name;
});

oForwardBtn.addEventListener('click', function(){
    history.forward();
});
oBackBtn.addEventListener('click', function(){
    history.back();
});
```

### Reading the current state
```js
history.state
```

### Advantages
In a sense, calling `pushState()` is similar to setting `window.location = "#foo"`, in that both will also create and activate another history entry associated with the current document. But `pushState()` has a few advantages:
* The new URL can be any URL in the same origin as the current URL. In contrast,
setting `window.location` keeps you at the same document only if you modify only
the hash.
* You don't have to change the URL if you don't want to. In contrast, setting
`window.location = "#foo"` only creates a new history entry if the current hash
isn't `#foo`. 上面的例子中，如果`history.pushState`不指定第三个参数，则可以实现 url
不变化情况下的路由。
* You can associate arbitrary data with your new history entry. With the
hash-based approach, you need to encode all of the relevant data into a short
string.
* If `sTitle` is subsequently used by browsers, this data can be utilized
(independent of, say, the hash).


## References
* [JavaScript: The Definitive Guide](https://book.douban.com/subject/5303032/)
* [Ajax navigation example.](https://developer.mozilla.org/en-US/docs/Web/API/History_API/Example)
