/* @flow */

// 2.5.21

import Dep from "./dep";
import VNode from "../vdom/vnode";
import { arrayMethods } from "./array";
import {
    def,
    warn,
    hasOwn,
    hasProto,
    isObject,
    isPlainObject,
    isPrimitive,
    isUndef,
    isValidArrayIndex,
    isServerRendering
} from "../util/index";

const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
export let shouldObserve: boolean = true;

export function toggleObserving(value: boolean) {
    shouldObserve = value;
}

// 观察（Observe）一个 vue 实例，将它的 data 对象里面的属性转换为访问器属性。
// 将每一个属性设置为 publisher，从而实现在其值更新的时候通知依赖，也就是实现响应式
/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
export class Observer {
    value: any;
    dep: Dep;
    vmCount: number; // number of vms that have this object as root $data

    constructor(value: any) {
        this.value = value;
        // 为整个 data 对象创建一个 publisher，之后还会遍历为每个子属性创建对应的 publisher
        this.dep = new Dep();
        this.vmCount = 0;
        // def 函数出自 core/util/lang.js
        // 为 data 对象添加名为 __ob__ 的属性，指向这里被构建的观察者实例，用来标志该 data 对象已经被观察了
        def(value, "__ob__", this);
        // TODO 这里什么时候会出现是数组的情况？
        if (Array.isArray(value)) {
            if (hasProto) {
                protoAugment(value, arrayMethods);
            } else {
                copyAugment(value, arrayMethods, arrayKeys);
            }
            this.observeArray(value);
        } else {
            // 遍历 data 对象的每个属性，将其定义为访问器属性
            this.walk(value);
        }
    }

    /**
     * Walk through all properties and convert them into
     * getter/setters. This method should only be called when
     * value type is Object.
     */
    walk(obj: Object) {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i]);
        }
    }

    /**
     * Observe a list of Array items.
     */
    observeArray(items: Array<any>) {
        for (let i = 0, l = items.length; i < l; i++) {
            observe(items[i]);
        }
    }
}

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment(target, src: Object) {
    /* eslint-disable no-proto */
    target.__proto__ = src;
    /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment(target: Object, src: Object, keys: Array<string>) {
    for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        def(target, key, src[key]);
    }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
export function observe(value: any, asRootData: ?boolean): Observer | void {
    if (!isObject(value) || value instanceof VNode) {
        return;
    }
    let ob: Observer | void;
    if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
        ob = value.__ob__;
    } else if (
        // TODO
        shouldObserve &&
        !isServerRendering() &&
        (Array.isArray(value) || isPlainObject(value)) &&
        Object.isExtensible(value) &&
        !value._isVue
    ) {
        ob = new Observer(value);
    }
    // TODO
    if (asRootData && ob) {
        ob.vmCount++;
    }
    return ob;
}

/**
 * Define a reactive property on an Object.
 */
export function defineReactive(
    obj: Object,
    key: string,
    val: any,
    customSetter?: ?Function,
    shallow?: boolean
) {
    // 为每个数据属性创建一个 publisher，所有依赖该数据属性的 subscriber 都会订阅这个 publisher
    const dep = new Dep();

    // 跳过不可配置的属性
    const property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
        return;
    }

    // cater for pre-defined getter/setters
    // 如果该属性本来就定义了 getter，则以该 getter 为基础
    const getter = property && property.get;
    // 如果该属性本来就定义了 setter，则以该 setter 为基础
    const setter = property && property.set;

    // 如果当前属性不是访问器属性且是用户定义的属性，获取它的属性值，作为 getter 的返回值
    // 如果是用户自定义的数据属性，arguments 就只有两个，但内置的会更多，
    // 看到 Vue 对象上的 $listeners 的情况时，有 5 个参数
    if ((!getter || setter) && arguments.length === 2) {
        val = obj[key];
    }

    // TODO
    let childOb = !shallow && observe(val);

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
          // 如果属性已经有 getter，则使用本身 getter 返回值
            const value = getter ? getter.call(obj) : val;
            // TODO target
            // Dep.target 如果有对象，就说明当前有一个 watcher 正在求值
            if (Dep.target) {
                // 绑定依赖
                dep.depend();
                if (childOb) {
                    childOb.dep.depend();
                    if (Array.isArray(value)) {
                        dependArray(value);
                    }
                }
            }
            return value;
        },
        set: function reactiveSetter(newVal) {
            const value = getter ? getter.call(obj) : val;
            /* eslint-disable no-self-compare */
            // 试图设置相同的值时不更新。|| 前面不能排除 NaN，|| 后面排除掉 NaN = NaN 这样的赋值
            if (newVal === value || (newVal !== newVal && value !== value)) {
                return;
            }
            /* eslint-enable no-self-compare */
            // 什么时候会传自定义性 setter
            if (process.env.NODE_ENV !== "production" && customSetter) {
                customSetter();
            }
            // #7981: for accessor properties without setter
            if (getter && !setter) return;
            if (setter) {
                setter.call(obj, newVal);
            } else {
                val = newVal;
            }
            // TODO
            childOb = !shallow && observe(newVal);
            // 通知 subscriber
            dep.notify();
        }
    });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
export function set(target: Array<any> | Object, key: any, val: any): any {
    if (
        process.env.NODE_ENV !== "production" &&
        (isUndef(target) || isPrimitive(target))
    ) {
        warn(
            `Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`
        );
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.length = Math.max(target.length, key);
        target.splice(key, 1, val);
        return val;
    }
    if (key in target && !(key in Object.prototype)) {
        target[key] = val;
        return val;
    }
    const ob = (target: any).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
        process.env.NODE_ENV !== "production" &&
            warn(
                "Avoid adding reactive properties to a Vue instance or its root $data " +
                    "at runtime - declare it upfront in the data option."
            );
        return val;
    }
    if (!ob) {
        target[key] = val;
        return val;
    }
    defineReactive(ob.value, key, val);
    ob.dep.notify();
    return val;
}

/**
 * Delete a property and trigger change if necessary.
 */
export function del(target: Array<any> | Object, key: any) {
    if (
        process.env.NODE_ENV !== "production" &&
        (isUndef(target) || isPrimitive(target))
    ) {
        warn(
            `Cannot delete reactive property on undefined, null, or primitive value: ${(target: any)}`
        );
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.splice(key, 1);
        return;
    }
    const ob = (target: any).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
        process.env.NODE_ENV !== "production" &&
            warn(
                "Avoid deleting properties on a Vue instance or its root $data " +
                    "- just set it to null."
            );
        return;
    }
    if (!hasOwn(target, key)) {
        return;
    }
    delete target[key];
    if (!ob) {
        return;
    }
    ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray(value: Array<any>) {
    for (let e, i = 0, l = value.length; i < l; i++) {
        e = value[i];
        e && e.__ob__ && e.__ob__.dep.depend();
        if (Array.isArray(e)) {
            dependArray(e);
        }
    }
}
