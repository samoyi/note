# Cross-Origin Messaging


## 用途
1. 一些浏览器窗口和标签之间都是完全相互独立的，在其中一个窗口或者标签中运行的代码在其他窗口或标签中完全无法识别。
2. 但是，在其他的一些场景下，当脚本通过`window.open()`显式打开一个新窗口或者在嵌套的`iframe`中运行的时候，多个窗口或者窗体之间是互相可识别的。如果它们包含的文档是来自同一台 Web 服务器，则在这些窗口和窗体中的脚本可以互相之间进行交互和操作对方的文档。
3. 然而，有的时候，尽管脚本可以引用其他的 Window 对象，但是由于那个窗口中的内容是来自于不同的源，Web 浏览器（遵循同源策略）不会允许访问其他窗口中的文档内容。大部分情况下，浏览器还不允许脚本读取其他窗口的属性或调用其他窗口方法。
4. 不过有个 window 方法，是允许来自非同源脚本调用的：`postMessage()`方法，该方法允许有限的通信——通过异步消息传递的方式——在来自不同源的脚本之间。
5. 简单来说，一个 window 可以引用另一个 window，并使用`targetWindow.postMessage()`向其发送消息；而接收窗口可以监听`message`事件并从事件对象上来获得接收到的消息。


## `targetWindow.postMessage()`
`targetWindow.postMessage(message, targetOrigin, [transfer])`  

### targetWindow
接收消息的窗口的引用，获得该引用有以下几种方法：
* 使用`Window.open()`方法打开一个窗口，该方法的返回值是被打开的窗口
* `Window.opener`：打开当前窗口的窗口
* `HTMLIFrameElement.contentWindow`：`<iframe>`的窗口
* `Window.parent`：嵌套当前窗口的窗口
* `Window.frames` + an index value (named or numeric)：某个嵌套窗口

### `message`
1. 将要发送到其他 window 的数据。
2. 规范要求它将会被[结构化克隆算法](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)序列化。这意味着你可以不受什么限制的将数据对象安全的传送给目标窗口而无需自己序列化。
3. 但实际上浏览器并没有实现，目前该参数还是只能接受字符串。所以你需要手动`JSON.stringify()`

### `targetOrigin`
1. 通过窗口的 origin 属性来指定哪些窗口能接收到消息事件，其值可以是字符串`*`（表示无限制）或者一个 URI。
2. 在发送消息的时候，如果目标窗口的协议、主机地址或端口这三者的任意一项不匹配`targetOrigin`提供的值，那么消息就不会被发送；只有三者完全匹配，消息才会被发送。
3. 这个机制用来控制消息可以发送到哪些窗口；例如，当用`postMessage`传送密码时，这个参数就显得尤为重要，必须保证它的值与这条包含密码的信息的预期接受者的 origin 属性完全一致，来防止密码被恶意的第三方截获。
4. 如果你明确的知道消息应该发送到哪个窗口，那么请始终提供一个有确切值的`targetOrigin`，而不是`*`。不提供确切的目标将导致数据泄露到任何对数据感兴趣的恶意站点。
5. 如果要指定和当前窗口同源，可以将值设为`/`。


## The dispatched event
1. 如果接收消息的窗口的 origin 和`postMessage()`方法设定的 origin 匹配的话，接收窗口就会触发一个`message`事件。
2. 因此在接收窗口的脚本里可以监听该事件来接收消息。
```js
window.addEventListener("message", receiveMessage, false);

function receiveMessage(event){
    if (event.origin !== "http://example.org:8080"){
      return;
    }
    // ...
}
```

### event
handler 的事件对象有以下相关属性：

#### `event.data`
`postMessage()`方法传递过来的第一个参数值的拷贝

#### `event.source`
发送消息的窗口的引用，可以使用该引用来回复消息

#### `event.origin`
1. The origin of the window that sent the message at the time `postMessage` was called.
2. This string is the concatenation of the protocol and "`://`", the host name if one exists, and "`:`" followed by a port number if a port is present and differs from the default port for the given protocol.
3. Examples of typical origins are `https://example.org` (implying port `443`), `http://example.net` (implying port `80`), and `http://example.com:8080`.
4. Note that this origin is not guaranteed to be the current or future origin of that window, which might have been navigated to a different location since `postMessage` was called.
5. The value of the `origin` property of the dispatched event is not affected by the current value of `document.domain` in the calling window.
6. For IDN host names only, the value of the `origin` property is not consistently Unicode or punycode; for greatest compatibility check for both the IDN and punycode values when using this property if you expect messages from IDN sites. This value will eventually be consistently IDN, but for now you should handle both IDN and punycode forms.
7. <mark>不懂</mark>这一段 The value of the `origin` when the sending window contains a `javascript:` or `data:` URL is the origin of the script that loaded the URL.


## Security concerns
1. 如果您不希望从其他网站接收 message，请不要为`message`事件添加任何事件侦听器。 这是一个完全万无一失的方式来避免安全问题。
2. 如果您确实希望从其他网站接收 message，请始终使用`event.origin`和`event.source`属性验证发件人的身份。任何窗口都可以向任何其他窗口发送消息，并且您不能保证未知发件人不会发送恶意消息。
3. 但是，验证身份后，仍然应该始终验证接收到的消息的语法。因为即使是信任的网站也有可能存在安全漏洞，可能会导致 XSS 的发生。
4. 当使用`postMessage`将数据发送到其他窗口时，始终指定精确的目标 origin，而不是`*`。恶意网站可以在你不知情的情况下更改窗口的位置，因此它可以拦截使用`postMessage`发送的数据。比如你只是指定了期望的 source 而没有指定该 source 的 origin，则恶意网站就可以将 source 更改为自己的想要的，虽然这时 origin 已经不匹配了，但依然可以通过。
