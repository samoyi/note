# Asynchronous Work


<!-- TOC -->

- [Asynchronous Work](#asynchronous-work)
    - [`process.nextTick()`](#processnexttick)
    - [`setImmediate()`](#setimmediate)
    - [EventEmitter](#eventemitter)
    - [References](#references)

<!-- /TOC -->


## `process.nextTick()`
1. Every time the event loop takes a full trip, we call it a tick.
2. When we pass a function to `process.nextTick()`, we instruct the engine to invoke this function at the end of the current operation, before the next event loop tick starts.
3. 比 promise 回调更早执行：A `process.nextTick` callback is added to `process.nextTick queue`. A `Promise.then()` callback is added to promises `microtask queue`. Event loop executes tasks in `process.nextTick queue` first, and then executes `promises microtask queue`.


## `setImmediate()`
是创建宏任务，且和 `setTimeout(() => {}, 0)` 和先后顺序不一定。
```js
const baz = () => console.log('baz');

const foo = () => console.log('foo');

const zoo = () => console.log('zoo');

const start = () => {
  console.log('start');

  setImmediate(baz);
  
  new Promise((resolve, reject) => {
    resolve('bar');
  })
  .then((resolve) => {
    console.log(resolve);
    process.nextTick(zoo);
  });

  process.nextTick(foo);
};

start();

// 打印顺序为：start foo bar zoo baz
```


## EventEmitter
1. Node.js 通过 events 模块的 `EventEmitter` 类来实现事件机制。
2. 实例化
    ```js
    const EventEmitter = require('events');

    const eventEmitter = new EventEmitter();
    ```
3. 这个实例通过其上的 `emit` 方法和 `on` 方法来触发和监听事件
    ```js
    eventEmitter.on('start', (start, end) => {
        console.log(`started from ${start} to ${end}`);
    });

    eventEmitter.emit('start', 1, 100);
    ```
4. 还有其他一些方法，例如
    * `once()`: add a one-time listener
    * `removeListener() / off()`: remove an event listener from an event
    * `removeAllListeners()`: remove all listeners for an event


## References
* [Understanding process.nextTick()](https://nodejs.dev/en/learn/understanding-processnexttick/)
* [Understanding setImmediate()](https://nodejs.dev/en/learn/understanding-setimmediate/)