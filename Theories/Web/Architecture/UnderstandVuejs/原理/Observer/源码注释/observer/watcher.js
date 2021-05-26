/* @flow */

// 2.5.21

import {
    warn,
    remove,
    isObject,
    parsePath,
    _Set as Set,
    handleError,
    noop
} from "../util/index";

import { traverse } from "./traverse";
import { queueWatcher } from "./scheduler";
import Dep, { pushTarget, popTarget } from "./dep";

import type { SimpleSet } from "../util/index";

let uid = 0;

/**
* A watcher parses an expression, collects dependencies,
* and fires callback when the expression value changes.
* This is used for both the $watch() api and directives.
*/
/**
 * 相当于 Publisher & Subscriber 模式的 Subscriber。
 * watcher 将一个表达式变成一个 subscriber，让它订阅若干个依赖的 dep。
 * watcher 负责解析表达式然后收集表达式的依赖，构造函数中的 expOrFn 就是这个表达式。
 * 当这个表达式的依赖发生变化时，watcher 会收到通知。
 * 如果依赖的变化让表达式的值发生了变化，watcher 就会调用针对该表达式的变化回调函数，即构造函数中的 cb。
 *
 * 如果是计算属性：expOrFn 就是这个计算属性函数，watcher 会收集函数内部依赖；cb 是空函数 ƒ noop (a, b, c) {}，因为计算属性变化
 *     完后没有直接要做的事情。
 * 如果是侦听器属性，expOrFn 就是这个属性名字符串，watcher 会找到被侦听属性的依赖；cb 就是侦听回调。
 * 除了上述两种情况，即使什么属性都没有，也至少会有一个 watcher，expOrFn 是一个看起来是更新渲染函数的东西
 *     ƒ () { vm._update(vm._render(), hydrating) }；而 cb 是空函数 ƒ noop (a, b, c) {}
 *
 * 没有被用到的计算属性也会生成 Watcher 实例，但不会被添加到它所依赖的数据的依赖列表里
 */
export default class Watcher {
    vm: Component;
    expression: string;
    cb: Function;
    id: number;
    deep: boolean;
    user: boolean;
    lazy: boolean;
    sync: boolean;
    dirty: boolean;
    active: boolean;
    deps: Array<Dep>;
    newDeps: Array<Dep>;
    depIds: SimpleSet;
    newDepIds: SimpleSet;
    before: ?Function;
    getter: Function;
    value: any;

    /**
     * @param isRenderWatcher 如果是在 watch 一个负责更新渲染的函数，则这个传 true
     */
    constructor(
        vm: Component,
        expOrFn: string | Function,
        cb: Function,
        options?: ?Object,
        isRenderWatcher?: boolean
    ) {
        // vm 实例和 watcher 实例互相关联
        this.vm = vm;

        // 所有的 watcher 实例都会被加入到 vm 实例的 _watchers
        // 但渲染 watcher 还会被单独保存在实例的 _watcher 属性上
        if (isRenderWatcher) {
            vm._watcher = this;
        }
        vm._watchers.push(this);

        // options
        // TODO 各参数的含义
        if (options) {
            this.deep = !!options.deep;
            this.user = !!options.user;
            this.lazy = !!options.lazy;
            this.sync = !!options.sync;
            // 实例化 watcher 时如果 options 中包含名为 before 的方法，则该方法会在 watcher 实际更新前调用
            // beforeUpdate 钩子函数就是定义在这个 before 方法里的，源码在 /src/core/instance/lifecycle.js
            // new Watcher(vm, updateComponent, noop, {
            //     before () {
            //       if (vm._isMounted && !vm._isDestroyed) {
            //         callHook(vm, 'beforeUpdate')
            //       }
            //     }
            //   }, true /* isRenderWatcher */)
            this.before = options.before; 
        } 
        else {
            this.deep = this.user = this.lazy = this.sync = false;
        }
        
        // TODO 各参数的含义
        // 数据变化后的回调函数
        // 如果是计算属性，cb 为计算属性函数；
        // 如果是侦听器属性，cb 为侦听器回调函数
        this.cb = cb;

        this.id = ++uid; // uid for batching // TODO 
        this.active = true; // TODO 
        this.dirty = this.lazy; // for lazy watchers // TODO 
        this.deps = []; // 当前 subscriber 所依赖的数据的 Dep 实例
        this.newDeps = []; // TODO 
        this.depIds = new Set(); // 所有被依赖数据的 Dep 实例都有一个全局唯一的 ID，这里的 ID 就对应 deps 中的每个 Dep 实例
        this.newDepIds = new Set(); // TODO 

        // TODO expression 的用处
        this.expression = process.env.NODE_ENV !== "production" ? expOrFn.toString() : "";

        // parse expression for getter
        // 获取 watch 的表达式的求值函数
        // 如果 expOrFn 是计算属性函数，则 getter 当然就是该函数；如果 watch 的是一个侦听器属性，则通过 parsePath 函数返回一个
        // getter 函数，该 getter 函数会根据侦听器属性的属性名（可能是多级的，例如 obj.name）找到具体 watch 的属性
        if (typeof expOrFn === "function") {
            this.getter = expOrFn;
        } 
        else {
            this.getter = parsePath(expOrFn);
            if (!this.getter) {
                this.getter = noop;
                process.env.NODE_ENV !== "production" &&
                    warn(
                        `Failed watching path: "${expOrFn}" ` +
                            "Watcher only accepts simple dot-delimited paths. " +
                            "For full control, use a function instead.",
                        vm
                    );
            }
        }
        this.value = this.lazy ? undefined : this.get();
    }

    // 对 watch 的表达式求值  
    /**
     * Evaluate the getter, and re-collect dependencies.
     */
    get() {
        // pushTarget 将当前 watcher 设置为 Dep 的静态属性 target，用以依赖收集。
        pushTarget(this);
        let value;
        const vm = this.vm;
        try {
            // 调用 watch 的表达式的 getter 函数进行求值
            // 这个过程就会访问到依赖的属性，进而完成依赖收集
            value = this.getter.call(vm, vm);
        } 
        catch (e) {
            if (this.user) {
                handleError(e, vm, `getter for watcher "${this.expression}"`);
            } 
            else {
                throw e;
            }
        } 
        finally {
            // "touch" every property so they are all tracked as
            // dependencies for deep watching

            // TODO 详细
            // 看到在使用 deep $watch 的时候，这个会是 true。比如下面这种情况
            // vm.$watch('someObject', callback, {
            //     deep: true
            // })
            // 比如这时 someObject 是
            // someObject: {
            //     name: '33',
            //     age: 22,
            // }
            // value 就是 someObject 对应的 observer
            // traverse 应该就是把 someObject 的子属性也作为当前 watcher 的依赖
            if (this.deep) {
                traverse(value);
            }
            popTarget(); // TODO
            this.cleanupDeps(); // TODO
        }
        return value;
    }

    // 接收参数 dep，让当前 watcher 订阅 dep
    // 应该命名为 addToDep ?
    /**
     * Add a dependency to this directive.
     */
    addDep(dep: Dep) {
        // TODO 除了最后一步 addSub，其他都是在干啥？
        const id = dep.id;
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id);
            this.newDeps.push(dep);
            if (!this.depIds.has(id)) {
                dep.addSub(this);
            }
        }
    }

    /**
     * Clean up for dependency collection.
     */
    cleanupDeps() {
        let i = this.deps.length;
        while (i--) {
            const dep = this.deps[i];
            if (!this.newDepIds.has(dep.id)) {
                dep.removeSub(this);
            }
        }
        let tmp = this.depIds;
        this.depIds = this.newDepIds;
        this.newDepIds = tmp;
        this.newDepIds.clear();
        tmp = this.deps;
        this.deps = this.newDeps;
        this.newDeps = tmp;
        this.newDeps.length = 0;
    }

    // 依赖更新后，依赖的 dep 会通过 notify 方法调用每个的 subscriber 的 update 方法
    // 这个方法会根据具体的情况，进行后续的更新操作
    /**
     * Subscriber interface.
     * Will be called when a dependency changes.
     */
    update() {
        /* istanbul ignore else */
        if (this.lazy) {
            this.dirty = true;
        } 
        // sync 更新立刻执行
        else if (this.sync) {
            this.run();
        } 
        else {
            // 加入队列等待执行
            queueWatcher(this);
        }
    }

    /**
     * Scheduler job interface.
     * Will be called by the scheduler.
     */
    run() {
        if (this.active) {
            const value = this.get();
            if (
                value !== this.value ||
                // Deep watchers and watchers on Object/Arrays should fire even
                // when the value is the same, because the value may
                // have mutated.
                isObject(value) ||
                this.deep
            ) {
                // set new value
                const oldValue = this.value;
                this.value = value;
                // 侦听器属性时，为 true，于是调用侦听器属性的回调函数
                if (this.user) {
                    try {
                        this.cb.call(this.vm, value, oldValue);
                    } 
                    catch (e) {
                        handleError(
                            e,
                            this.vm,
                            `callback for watcher "${this.expression}"`
                        );
                    }
                } 
                else {
                    this.cb.call(this.vm, value, oldValue);
                }
            }
        }
    }

    /**
     * Evaluate the value of the watcher.
     * This only gets called for lazy watchers.
     */
    evaluate() {
        this.value = this.get();
        this.dirty = false;
    }

    /**
     * Depend on all deps collected by this watcher.
     */
    // 调用每个依赖 dep(publisher) 的 depend 方法，该方法又会调用该 watcher 的 addDep 进行依赖收集
    depend() {
        let i = this.deps.length;
        while (i--) {
            this.deps[i].depend();
        }
    }

    /**
     * Remove self from all dependencies' subscriber list.
     */
    teardown() {
        if (this.active) {
            // remove self from vm's watcher list
            // this is a somewhat expensive operation so we skip it
            // if the vm is being destroyed.
            // TODO
            // 从 vm 实例的观察者列表中将自身移除，由于该操作比较耗费资源，所以如果vm实例正在被销毁则跳过该步骤
            if (!this.vm._isBeingDestroyed) {
                remove(this.vm._watchers, this);
            }
            let i = this.deps.length;
            // 遍历当前 watcher 的每一个依赖 dep，从其订阅列表中将当前 watcher 移除
            while (i--) {
                this.deps[i].removeSub(this);
            }
            this.active = false;
        }
    }
}
