# Cross-Origin Messaging

1. cross-origin communication between different `window` object in cross-origin
or same-origin
2. You can communicate with another `window`, which in `iframe` or in a new
browse window(or tab) opened by `window.open`.
3. Broadly, one window may obtain a reference to another, and then dispatch a
`MessageEvent` on it with `targetWindow.postMessage()`. The receiving window is
then free to handle this event as needed. The arguments passed to
`window.postMessage()` are exposed to the receiving window through the event
object.

## targetWindow.postMessage
`targetWindow.postMessage(message, targetOrigin, [transfer])`  

### targetWindow
A reference to the window that will receive the message. Methods for obtaining
such a reference include:
* `Window.open` (to spawn a new window and then reference it)
* `Window.opener` (to reference the window that spawned this one)
* `HTMLIFrameElement.contentWindow` (to reference an embedded `<iframe>` from
    its parent window)
* `Window.parent` (to reference the parent window from within an embedded
    `<iframe>`)
* `Window.frames` + an index value (named or numeric)

### `message`
Data to be sent to the other window. The data is serialized using the
[structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm).
This means you can pass a broad variety of data objects safely to the
destination window without having to serialize them yourself.
(Prior to Gecko 6.0, the message parameter must be a string. )

### `targetOrigin`
1. Specifies what the origin of `otherWindow` must be for the event to be
dispatched, either as the literal string `*` or as a URI.
2. If at the time the event is scheduled to be dispatched, the scheme, hostname,
 or port of `otherWindow`'s document does not match that provided in
`targetOrigin`, the event will not be dispatched.
3. Failing to provide a specific target discloses the data you send to any
interested malicious site. A malicious site can change the location of the
window without your knowledge, and therefore it can intercept the data sent
using postMessage.
4. If you want to specify the same origin as the current
window, you can simply use `/`.


## The dispatched event
If the origins match, the call to `postMessage()` will result in a message event
being fired at the target Window object. A script in that window can define an
event handler function to be notified of message events.
```js
window.addEventListener("message", receiveMessage, false);

function receiveMessage(event){
    if (event.origin !== "http://example.org:8080"){
      return;
    }

  // ...
}
```

### handler
This handler is passed an event object with the following properties:
#### `data`
This is a copy of the message that was passed as the first argument to
`postMessage()`

#### `source`
The Window object from which the message was sent. You can use it to reply
message by `postMessage()`

#### `origin`
1. The origin of the window that sent the message at the time `postMessage` was
called.
2. Note that this origin is not guaranteed to be the current or future origin of
 that window, which might have been navigated to a different location since
`postMessage` was called.
3. The value of the origin property of the dispatched event is not affected by
the current value of document.domain in the calling window.
4. <mark>不懂</mark>这一段 For IDN host names only, the value of the `origin`
property is not consistently Unicode or punycode; for greatest compatibility
check for both the IDN and punycode values when using this property if you
expect messages from IDN sites. This value will eventually be consistently IDN,
but for now you should handle both IDN and punycode forms.
5. <mark>不懂</mark>这一段 The value of the `origin` when the sending window
contains a `javascript:` or `data:` URL is the origin of the script that loaded
the URL.

### Security
1. Any window may access `postMessage` method on any other window, at any time
, regardless of the location of the document in the window, to send it a message.
2. Consequently, any event listener used to receive messages must first check
the identity of the sender of the message, using the `origin` and possibly
`source` properties.
3. Failure to check the `origin` and possibly `source` properties enables
cross-site scripting attacks.


## Security concerns
1. If you do not expect to receive messages from other sites, do not add any
event listeners for message events. This is a completely foolproof way to avoid
security problems.
2. If you do expect to receive messages from other sites, always verify the
sender's identity using the origin and possibly source properties.
3. Having verified identity, however, you still should always verify the syntax
of the received message. Otherwise, a security hole in the site you trusted to
send only trusted messages could then open a cross-site scripting hole in your
site.
4. Always specify an exact target origin, not `*`, when you use `postMessage` to
send data to other windows. A malicious site can change the location of the
window without your knowledge, and therefore it can intercept the data sent
using `postMessage`.
