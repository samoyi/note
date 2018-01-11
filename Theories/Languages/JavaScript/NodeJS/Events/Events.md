# Events


## Basic
1. Much of the Node.js core API is built around an idiomatic asynchronous
event-driven architecture in which certain kinds of objects (called "emitters")
periodically emit named events that cause Function objects ("listeners") to be
called.
2. All objects that emit events are instances of the `EventEmitter` class.
3. These objects expose an `eventEmitter.on()` function that allows one or more
functions to be attached to named events emitted by the object.
4. Typically, event names are camel-cased strings but any valid JavaScript
property key can be used.
5. When the `EventEmitter` object emits an event, all of the functions attached
to that specific event are called synchronously. Any values returned by the
called listeners are ignored and will be discarded.



***
## Error events
[Doc](https://nodejs.org/api/events.html#events_error_events)

***
## References
* [Node.js v8.5.0 Documentation](https://nodejs.org/api/)
* [《Node.js开发指南》](https://book.douban.com/subject/10789820/)
