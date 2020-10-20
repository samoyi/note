/* @flow */

// 2.5.21

import type Watcher from "./watcher";
import config from "../config";
import { callHook, activateChildComponent } from "../instance/lifecycle";

import { warn, nextTick, devtools } from "../util/index";

export const MAX_UPDATE_COUNT = 100;

const queue: Array<Watcher> = [];
const activatedChildren: Array<Component> = [];
let has: { [key: number]: ?true } = {};
let circular: { [key: number]: number } = {};
let waiting = false; // 是否有 watcher 队列在等待 flush
let flushing = false; // 是否有 watcher 队列正在 flush
let index = 0; // flush 队列是执行到第几个 watcher 更新了

// flush 完 watcher 队列后，初始化其状态标记
/**
 * Reset the scheduler's state.
 */
function resetSchedulerState() {
    index = queue.length = activatedChildren.length = 0;
    has = {};
    if (process.env.NODE_ENV !== "production") {
        circular = {};
    }
    waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue() {
    flushing = true;
    let watcher, id;

    // 按照 watcher 的 id 顺序来进行 flush
    // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child)
    // 2. A component's user watchers are run before its render watcher (because
    //    user watchers are created before the render watcher)
    // 3. If a component is destroyed during a parent component's watcher run,
    //    its watchers can be skipped.
    queue.sort((a, b) => a.id - b.id);

    // 遍历队列里的 watcher，依次通过其 run 方法调用其更新回调
    // do not cache length because more watchers might be pushed
    // as we run existing watchers
    for (index = 0; index < queue.length; index++) {
        watcher = queue[index];
        // watcher.before 是啥
        if (watcher.before) {
            watcher.before();
        }
        id = watcher.id;
        has[id] = null;
        watcher.run(); // 调用 watcher 的更新回调
        // in dev build, check and stop circular updates.
        if ( process.env.NODE_ENV !== "production" && has[id] != null ) {
            circular[id] = (circular[id] || 0) + 1;
            if (circular[id] > MAX_UPDATE_COUNT) {
                warn(
                    "You may have an infinite update loop " +
                        (watcher.user
                            ? `in watcher with expression "${watcher.expression}"`
                            : `in a component render function.`),
                    watcher.vm
                );
                break;
            }
        }
    }

    // TODO
    // keep copies of post queues before resetting state
    const activatedQueue = activatedChildren.slice();
    const updatedQueue = queue.slice();

    resetSchedulerState();

    // call component updated and activated hooks
    callActivatedHooks(activatedQueue);
    callUpdatedHooks(updatedQueue);

    // devtool hook
    /* istanbul ignore if */
    if (devtools && config.devtools) {
        devtools.emit("flush");
    }
}

// 调用 watcher 所在的 vue 实例的 updated 钩子函数
function callUpdatedHooks(queue) {
    let i = queue.length;
    while (i--) {
        const watcher = queue[i];
        const vm = watcher.vm;
        if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
            callHook(vm, "updated");
        }
    }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
export function queueActivatedComponent(vm: Component) {
    // setting _inactive to false here so that a render function can
    // rely on checking whether it's in an inactive tree (e.g. router-view)
    vm._inactive = false;
    activatedChildren.push(vm);
}

function callActivatedHooks(queue) {
    for (let i = 0; i < queue.length; i++) {
        queue[i]._inactive = true;
        activateChildComponent(queue[i], true /* true */);
    }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
// 如果 watcher 队列里没有当前 watcher，则将该 watcher 加入队列
export function queueWatcher(watcher: Watcher) {
    const id = watcher.id;
    if ( has[id] == null ) { // watcher 队列里没有当前 watcher
        has[id] = true; // 已入列标志

        // 如果没有正在 flush watcher 队列，则直接加入就行了，等待 flush
        if ( !flushing ) {
            queue.push(watcher);
        } 
        // 正在 flush watcher 队列，则麻烦一点。因为上面说到，在开始 flush 的时候，要先按照 watcher 的 id 排序，
        // 现在如果正在 flush 就说明已经排好序了，你再插入一个进来，就必须要插入到合适的位置
        else { 
            // if already flushing, splice the watcher based on its id
            // if already past its id, it will be run next immediately.
            let i = queue.length - 1;
            // index 是 flushSchedulerQueue 当前遍历执行到第几个 watcher 了
            // 通过 while 循环，根据当前要加入队列的 watcher 的 id ，将该 watcher 插入到队列合适的位置里，
            // 如果 while 一次都没执行，就说明当前 watcher 的 id 已经错过了，例如当前队里的 id 为
            // [3, 4, 6, 8, 9]，而要插入的 watcher 的 id 是 5，那么如果 index 已经是 2 了，也就是已经在
            // 执行 id 为 6 的 watcher 了，那当前 id 为 5 的 watcher 就不能插入了。
            // 不能插入，那通过下面的 queue.splice 会把它加到队尾，在队列最后一个执行。
            while (i > index && queue[i].id > watcher.id) {
                i--;
            }
            queue.splice(i + 1, 0, watcher);
        }

        // queue the flush
        if ( !waiting ) {
            waiting = true;

            if (process.env.NODE_ENV !== "production" && !config.async) {
                flushSchedulerQueue();
                return;
            }
            nextTick(flushSchedulerQueue);
        }
    }
}
