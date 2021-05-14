/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from "../util/index";

const arrayProto = Array.prototype;

// 创建一个新的数组对象，修改该对象上的数组的七个方法，防止污染原生数组方法
export const arrayMethods = Object.create(arrayProto);

// 重新包装下面的几个数组方法，让它们可以触发数组的变动监听
const methodsToPatch = [
    "push",
    "pop",
    "shift",
    "unshift",
    "splice",
    "sort",
    "reverse"
];

/**
 * Intercept mutating methods and emit events
 */
// 截获数组的成员发生的变化，执行原生数组操作的同时通过 dep 发布变化给订阅者
methodsToPatch.forEach(function(method) {
    // cache original method
    const original = arrayProto[method]; // 基本的数组操作还是要用原始的方法来执行
    // 把 `arrayMethods[method]` 这个数组方法重写为 `mutator` 函数
    def(arrayMethods, method, function mutator(...args) {
        const result = original.apply(this, args);
        const ob = this.__ob__;
        let inserted;
        // 如果是往数组里添加新数组项的方法，通过 inserted 记录被插入的数组项，
        // 然后通过 ob.observeArray 把这些数组项也变成响应式的。
        switch (method) {
            case "push":
            case "unshift":
                inserted = args;
                break;
            case "splice":
                inserted = args.slice(2);
                break;
        }
        if (inserted) ob.observeArray(inserted);
        // notify change
        ob.dep.notify();
        return result;
    });
});