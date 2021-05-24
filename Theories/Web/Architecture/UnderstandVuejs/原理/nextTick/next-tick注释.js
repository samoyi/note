/* @flow */
/* globals MessageChannel */

// 2.5.21

import { noop } from "shared/util";
import { handleError } from "./error";
import { isIOS, isNative } from "./env";

// 一个 tick 周期中所有通过 nextTick 方法传入的回调函数
const callbacks = [];

// pending 表示是否存在着没有被 flush 的回调。
// 一旦调用 nextTick 并传入一个回调时，pending 就会变为 true。
let pending = false;

// 执行 callbacks 中存储的所有函数
function flushCallbacks() {
    // 所有回调都会被 flush，不再会有 pending 的
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;

    // 逐个执行回调
    for (let i = 0; i < copies.length; i++) {
        copies[i]();
    }
}


// 使用 microtask 和 macrotask 两种方案来实现 nextTick 异步延迟。
// Here we have async deferring wrappers using both microtasks and (macro) tasks.
// In < 2.4 we used microtasks everywhere, but there are some scenarios where
// microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using (macro) tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use microtask by default, but expose a way to force (macro) task when
// needed (e.g. in event handlers attached by v-on).
// 在 2.5 版本之前，所有情况都是使用 microtask 来实现的，但在某些场景下，由于 microtask 优先级过高而会引发某些问题；
// 而如果都使用 macrotask 则同样会存在问题。在 ./nextTick.md 中会举例说明；
// 现在是默认使用 microtask，但在需要的时候(例如事件处理中修改模板依赖的数据)则强制使用 macrotask。
// 下面在实现以下这两个函数时，内部都会定义一个异步方法，异步回调时都会 flush 掉 callbacks 中的函数；
// 只不过一个是异步到 microtask，另一个是异步到 macrotask。
let microTimerFunc; // 调用这个函数时，callbacks 中的函数会在本轮 microtask 阶段被 flush
let macroTimerFunc; // 调用这个函数时，callbacks 中的函数会在下一轮 macrotask 阶段被 flush

// 在需要强制使用 macrotask 时，会用到下面的包装函数 withMacroTask 来包装回调函数；
// 其中会把 useMacroTask 设置为 ture，来指示 nextTick 直接使用 macrotask。
let useMacroTask = false;


// 定义 macroTimerFunc，使用 macrotask 实现 nextTick
// 三种实现的的差异需要看规范对比才能看明白，比较麻烦。
// Determine (macro) task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== "undefined" && isNative(setImmediate)) {
    // 如果支持原生 setImmediate 则使用它实现 macrotask 的 nextTick
    macroTimerFunc = () => {
        setImmediate(flushCallbacks);
    };
} 
else if (
    // 如果存在原生的或者 PhantomJS 提供的 MessageChannel API
    typeof MessageChannel !== "undefined" &&
    (isNative(MessageChannel) ||
        // PhantomJS
        MessageChannel.toString() === "[object MessageChannelConstructor]")
) {
    const channel = new MessageChannel();
    const port = channel.port2;
    // MessageChannel 的消息监听处理函数是 macrotask
    channel.port1.onmessage = flushCallbacks;
    macroTimerFunc = () => {
        port.postMessage(1);
    };
} 
else {
    /* istanbul ignore next */
    // 否则就使用 setTimeout
    macroTimerFunc = () => {
        setTimeout(flushCallbacks, 0);
    };
}


// 定义 microTimerFunc，microtask 实现 nextTick
// 如果原生支持 Promise 则用 microtask 实现 nextTick，否则用 macrotask
// Determine microtask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if ( typeof Promise !== "undefined" && isNative(Promise) ) {
    // 生成一个 fullfilled 状态的 promise，通过它的 then 方法，
    // 在本轮事件循环的结尾 flush 本轮事件循环的 nextTick 所有回调函数。
    const p = Promise.resolve();
    microTimerFunc = () => {
        p.then(flushCallbacks);
        // in problematic UIWebViews, Promise.then doesn't completely break, but
        // it can get stuck in a weird state where callbacks are pushed into the
        // microtask queue but the queue isn't being flushed, until the browser
        // needs to do some other work, e.g. handle a timer. Therefore we can
        // "force" the microtask queue to be flushed by adding an empty timer.
        // iOS 的 UIWebViews 中，在使用 Promise.then 将回调推入微任务序列时，如果没有其他操作，则该序列不会被刷新执行。
        // 因此下面使用一个空的定时器来强制刷新微任务序列。
        if (isIOS) setTimeout(noop);
    };
} 
else {
    // fallback to macro
    // 除了下面会通过调用 withMacroTask 来明确指定使用 macroTask 的情况，
    // 如果环境不支持 microTask，则试图使用 microTask 的地方也会由 macroTask 来执行。
    microTimerFunc = macroTimerFunc;
}


/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a (macro) task instead of a microtask.
 */
// 前面说了，有时要强制使用 macrotask，例如事件处理函数。
// 输出的 withMacroTask 函数将接收一个函数并输出一个包装函数。
// 该包装函数在作为 nextTick 回调执行时，会先把 useMacroTask 设置为 true，从而让该包装函数在在 macrotask 阶段执行。
// 在当前的版本中，也只有事件处理函数会用到该包装函数，/src/platforms/web/runtime/modules/events.js。
// 而且事件处理函数修改的数据必须要导致模板重绘才行，否则事件处理函数不会异步执行
// 下面这行非原生 JS 的语法是 Flow(https://flow.org/) 的语法，表示接收一个 Function 类型的参数，且返回值是 Function 类型
export function withMacroTask(fn: Function): Function {
    // 如果被包装函数已经有了 _withTask 属性，说明已经被包装过了，则直接返回该属性，即包装后的函数；
    // 否则，则为被包装函数定义该属性，属性值为包装后的函数，并返回该函数。
    return (
        fn._withTask ||
        (fn._withTask = function() {
            // 将 useMacroTask 设为 true，根据下面 nextTick 函数可以看到，这会导致 nextTick 使用 macrotask 来实现。
            useMacroTask = true;
            try {
                // 实际执行被包装的函数
                return fn.apply(null, arguments);
            } 
            finally {
                // 因为 useMacroTask 只是用在强制使用 macrotask 的场合，所以用完后还要将其恢复到默认的 false，
                // 从而让 nextTick 默认使用 microtask。
                useMacroTask = false;
            }
        })
    );
}


// 实际输出的 nextTick 函数
// 参数语法和 withMacroTask 一样是 Flow 语法，两个可选参数，并指定了类型
export function nextTick(cb?: Function, ctx?: Object) {
    let _resolve;

    // 不管有没有传回调函数，都包装一个函数并推入 callbacks 中
    callbacks.push(() => {
        if (cb) { // 传了回调函数则调用
            try {
                cb.call(ctx);
            } 
            catch (e) {
                handleError(e, ctx, "nextTick");
            }
        } 
        // 如果没传回调，则在下一个 macroTask 或 microTask 解析下面的 Promise
        // 不懂，用处是什么？
        else if (_resolve) {
            _resolve(ctx);
        }
    });

    // 下面这个 if 块的功能是设定在下一个 microTask 或 macroTask 时 flush 所有传入的回调
    // 只在 pending 为 false 时才执行，因为在一个事件循环只需要在第一次调用 nextTick 的时候才执行 macroTimerFunc 或
    // microTimerFunc 来建立 macroTask 或 microTask 回调，之后再调用 nextTick 只需要往 callbacks 推入新函数即可
    if ( !pending ) {
        pending = true // flushCallbacks 调用后 pending 会被设为 false
        // 如果 withMacroTask 被调用，则 useMacroTask 会为 true
        if (useMacroTask) {
            macroTimerFunc();
        } 
        else {
            // 注意这里只是没有强制使用 macroTask，但如果不支持 Promise，也会回退使用 macroTask，
            // 因为在这种环境下上面的 microTimerFunc 是引用的 macroTimerFunc
            microTimerFunc();
        }
    }

    // 如果没有回调函数，并且环境支持 Promise，则会使用 Promise 构建一个 microTask，
    // 在调用上面的 _resolve 时 resolve 该 Promise。
    // $flow-disable-line
    if ( !cb && typeof Promise !== "undefined" ) {
        return new Promise(resolve => {
            _resolve = resolve;
        });
    }
}
