# Channel messaging

## Channel messaging concepts
1. The Channel Messaging API allows two separate scripts running in different browsing contexts attached to the same document (e.g., two IFrames, or the main document and an IFrame, two documents via a SharedWorker, or two workers) to communicate directly, passing messages between one another through two-way channels (or pipes) with a port at each end.
2. A message channel is created using the `MessageChannel()` constructor. Once created, the two ports of the channel can be accessed through the `MessageChannel.port1` and `MessageChannel.port2` properties (which both return `MessagePort` objects.)
3. The app that created the channel uses `port1`, and the app at the other end of the port uses `port2` — you send a message to `port2`, and transfer the port over to the other browsing context using `window.postMessage` along with two arguments (the message to send, and the object to transfer ownership of, in this case the port itself.)
4. When these transferable objects are transferred, they are 'neutered' on the previous context — the one they previously belonged to. For instance a port, when is sent, cannot be used anymore by the original context.
5. Note that the only two objects that can currently be transferred are `ArrayBuffer` and `MessagePort`.
6. The other browsing context can listen for the message using `MessagePort.onmessage`, and grab the contents of the message using the event's `data` attribute. You could then respond by sending a message back to the original document using `MessagePort.postMessage`.
7. When you want to stop sending messages down the channel, you can invoke `MessagePort.close` to close the ports.


## `MessageChannel()`
<!-- main -->
```js
var channel = new MessageChannel();
var output = document.querySelector('.output');
var iframe = document.querySelector('iframe');

// Wait for the iframe to load
iframe.addEventListener("load", onLoad);

function onLoad() {
    // Listen for messages on port1
    channel.port1.onmessage = onMessage;

    // Transfer port2 to the iframe
    iframe.contentWindow.postMessage('Hello from the main page!', '*', [channel.port2]);
}
```
<!-- frame -->
```js
window.addEventListener('message', onMessage);

function onMessage(e) {
    output.innerHTML = e.data;
    // Use the transfered port to post a message back to the main frame
    e.ports[0].postMessage('Message back from the IFrame');
}
```


## MessagePort
The `MessagePort` interface of the Channel Messaging API represents one of the two ports of a `MessageChannel`, allowing messages to be sent from one port and listening out for them arriving at the other.

### Methods
Inherits methods from its parent, `EventTarget`

#### `MessagePort.postMessage()`
Sends a message from the port, and optionally, transfers ownership of objects to other browsing contexts.

#### `MessagePort.start`
Starts the sending of messages queued on the port (only needed when using `EventTarget.addEventListener`; it is implied when using `MessagePort.onmessage`.)

#### `MessagePort.close`
Disconnects the port, so it is no longer active.

### Event handlers
Inherits event handlers from its parent, `EventTarget`

#### `MessagePort.onmessage`
An `EventListener` called when a `MessageEvent` of type `message` is fired on the port—that is, when the port receives a message.

#### `MessagePort.onmessageerror`
An `EventListener` called when a `MessageEvent` of type `MessageError` is fired—that is, when it receives a message that cannot be deserialized.


## References
* [Channel Messaging API](https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API)
