/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'

// 默认已经有了 0、1、2 三个 ID，用户真正添加的数据是从 3 开始
// TODO 输入 data 属性是数组或对象，则一次就会占用两个 ID
let uid = 0

/**
* A dep is an observable that can have multiple
* directives subscribing to it.
*/
// 相当于 Publisher & Subscriber 模式的 Publisher
export default class Dep {
    static target: ?Watcher;
    id: number;
    subs: Array<Watcher>;

    // TODO 如果一个 data 属性（不管是根属性还是子属性）是数组或对象，则会为该属性会创建两个 Dep 实例
    constructor () {
        // 每个 dep 都有唯一的数字 ID
        this.id = uid++
        // 依赖该数据属性的 subscriber，也就是 watcher
        this.subs = []
    }

    // 添加一个依赖该属性的 subscriber(watcher) 到当前依赖的订阅列表里
    /*
     * 侦听器属性的 subscriber 会被添加，因为有回调需要在依赖更新后执行
     * 计算属性如果不会被用到则不会被添加；如果被用到了（被渲染或者被watch）才会被添加
     */
    addSub (sub: Watcher) {
        this.subs.push(sub)
    }

    // 移除一个依赖该属性的 subscriber
    removeSub (sub: Watcher) {
        remove(this.subs, sub)
    }

    // 一个 watcher 会调用它所依赖的每个 dep 的 depend 方法，相应的 dep 会通过 Dep.target 找到当前操作的 watcher，调用其
    // addDep 方法进行订阅
    depend () {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }

    // 调用依赖该属性的每个 subscriber 的 update 进行更新
    notify () {
        // stabilize the subscriber list first
        const subs = this.subs.slice()
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update()
        }
    }
}

// 一个 watcher 会使用这里的 pushTarget 把自己设置为当前订阅依赖的 Dep.target，之后会调用 popTarget 让出该位置
// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null
const targetStack = []

export function pushTarget (_target: ?Watcher) {
    if (Dep.target) targetStack.push(Dep.target)
    Dep.target = _target
}

export function popTarget () {
    Dep.target = targetStack.pop()
}
