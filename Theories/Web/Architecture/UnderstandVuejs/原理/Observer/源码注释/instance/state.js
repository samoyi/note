/* @flow */

// 2.5.21

import config from "../config";
import Watcher from "../observer/watcher";
import Dep, { pushTarget, popTarget } from "../observer/dep";
import { isUpdatingChildComponent } from "./lifecycle";

import {
    set,
    del,
    observe,
    defineReactive,
    toggleObserving
} from "../observer/index";

import {
    warn,
    bind,
    noop,
    hasOwn,
    hyphenate,
    isReserved,
    handleError,
    nativeWatch,
    validateProp,
    isPlainObject,
    isServerRendering,
    isReservedAttribute
} from "../util/index";

const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
};

/**
 * data 的属性和 prop 的属性实际上是保存在实例的 _data 和 _props 属性上的，
 * 但是访问的时候并不是通过 this._data.name 和 this._props.age，而是直接通过 this.name 和 this.age。
 * 就是因为使用了这个 proxy 函数让实例对这两中属性的访问进行了代理。
 */
 
export function proxy(target: Object, sourceKey: string, key: string) {
    // 访问 `target[key]` 的时候，实际返回的是 `target[sourceKey][key]`
    sharedPropertyDefinition.get = function proxyGetter() {
        return this[sourceKey][key];
    };
    // 设置 `target[key]` 的时候，实际设置的是 `target[sourceKey][key]`
    sharedPropertyDefinition.set = function proxySetter(val) {
        this[sourceKey][key] = val;
    };
    Object.defineProperty(target, key, sharedPropertyDefinition);
}

export function initState(vm: Component) {
    vm._watchers = [];
    const opts = vm.$options;
    if (opts.props) initProps(vm, opts.props);
    if (opts.methods) initMethods(vm, opts.methods);
    if (opts.data) {
        initData(vm);
    } else {
        observe((vm._data = {}), true /* asRootData */);
    }
    if (opts.computed) initComputed(vm, opts.computed);
    if (opts.watch && opts.watch !== nativeWatch) {
        initWatch(vm, opts.watch);
    }
}

function initProps(vm: Component, propsOptions: Object) {
    const propsData = vm.$options.propsData || {};
    const props = (vm._props = {});
    // cache prop keys so that future props updates can iterate using Array
    // instead of dynamic object key enumeration.
    const keys = (vm.$options._propKeys = []);
    const isRoot = !vm.$parent;
    // root instance props should be converted
    if (!isRoot) {
        toggleObserving(false);
    }
    for (const key in propsOptions) {
        keys.push(key);
        const value = validateProp(key, propsOptions, propsData, vm);
        /* istanbul ignore else */
        if (process.env.NODE_ENV !== "production") {
            const hyphenatedKey = hyphenate(key);
            if (
                isReservedAttribute(hyphenatedKey) ||
                config.isReservedAttr(hyphenatedKey)
            ) {
                warn(
                    `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
                    vm
                );
            }
            defineReactive(props, key, value, () => {
                if (!isRoot && !isUpdatingChildComponent) {
                    warn(
                        `Avoid mutating a prop directly since the value will be ` +
                            `overwritten whenever the parent component re-renders. ` +
                            `Instead, use a data or computed property based on the prop's ` +
                            `value. Prop being mutated: "${key}"`,
                        vm
                    );
                }
            });
        } else {
            defineReactive(props, key, value);
        }
        // static props are already proxied on the component's prototype
        // during Vue.extend(). We only need to proxy props defined at
        // instantiation here.
        if (!(key in vm)) {
            proxy(vm, `_props`, key);
        }
    }
    toggleObserving(true);
}

function initData(vm: Component) {
    // 获取实例的 data 属性
    let data = vm.$options.data;

    // 该属性可能直接是个简单对象，也可能是一个返回简单对象的函数。如果是函数的话就调用并获得简单对象。
    data = vm._data = typeof data === "function" ? getData(data, vm) : data || {};

    // data 如果是函数必须要返回一个简单对象
    // 如果不是简单对象，会被赋值为一个空的简单对象
    if ( !isPlainObject(data) ) {
        data = {};
        process.env.NODE_ENV !== "production" &&
            warn(
                "data functions should return an object:\n" +
                    "https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function",
                vm
            );
    }

    // proxy data on instance
    const keys = Object.keys(data);
    const props = vm.$options.props;
    const methods = vm.$options.methods;
    let i = keys.length;
    // 遍历 data 对象
    while (i--) {
        const key = keys[i];

        // 不能定义和 data 属性名同名的 method
        if (process.env.NODE_ENV !== "production") {
            if (methods && hasOwn(methods, key)) {
                warn(
                    `Method "${key}" has already been defined as a data property.`,
                    vm
                );
            }
        }

        // 不能定义和 data 属性名同名的 prop
        if (props && hasOwn(props, key)) {
            process.env.NODE_ENV !== "production" &&
                warn(
                    `The data property "${key}" is already declared as a prop. ` +
                        `Use prop default value instead.`,
                    vm
                );
        } 
        // 属性名不能使保留字
        else if (!isReserved(key)) {
            // 将 _data 上面的属性代理到了 vm 实例上
            proxy(vm, `_data`, key);
        }
    }
    // observe data
    observe(data, true /* asRootData */);
}

export function getData(data: Function, vm: Component): any {
    // #7573 disable dep collection when invoking data getters
    pushTarget();
    try {
        return data.call(vm, vm);
    } catch (e) {
        handleError(e, vm, `data()`);
        return {};
    } finally {
        popTarget();
    }
}

const computedWatcherOptions = { lazy: true };

function initComputed(vm: Component, computed: Object) {
    // $flow-disable-line
    const watchers = (vm._computedWatchers = Object.create(null));
    // computed properties are just getters during SSR
    const isSSR = isServerRendering();

    for (const key in computed) {
        const userDef = computed[key];
        const getter = typeof userDef === "function" ? userDef : userDef.get;
        if (process.env.NODE_ENV !== "production" && getter == null) {
            warn(`Getter is missing for computed property "${key}".`, vm);
        }

        if (!isSSR) {
            // create internal watcher for the computed property.
            watchers[key] = new Watcher(
                vm,
                getter || noop,
                noop,
                computedWatcherOptions
            );
        }

        // component-defined computed properties are already defined on the
        // component prototype. We only need to define computed properties defined
        // at instantiation here.
        if (!(key in vm)) {
            defineComputed(vm, key, userDef);
        } else if (process.env.NODE_ENV !== "production") {
            if (key in vm.$data) {
                warn(
                    `The computed property "${key}" is already defined in data.`,
                    vm
                );
            } else if (vm.$options.props && key in vm.$options.props) {
                warn(
                    `The computed property "${key}" is already defined as a prop.`,
                    vm
                );
            }
        }
    }
}

export function defineComputed(
    target: any,
    key: string,
    userDef: Object | Function
) {
    const shouldCache = !isServerRendering();
    if (typeof userDef === "function") {
        sharedPropertyDefinition.get = shouldCache
            ? createComputedGetter(key)
            : createGetterInvoker(userDef);
        sharedPropertyDefinition.set = noop;
    } else {
        sharedPropertyDefinition.get = userDef.get
            ? shouldCache && userDef.cache !== false
                ? createComputedGetter(key)
                : createGetterInvoker(userDef.get)
            : noop;
        sharedPropertyDefinition.set = userDef.set || noop;
    }
    if (
        process.env.NODE_ENV !== "production" &&
        sharedPropertyDefinition.set === noop
    ) {
        sharedPropertyDefinition.set = function() {
            warn(
                `Computed property "${key}" was assigned to but it has no setter.`,
                this
            );
        };
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter(key) {
    return function computedGetter() {
        const watcher = this._computedWatchers && this._computedWatchers[key];
        if (watcher) {
            if (watcher.dirty) {
                watcher.evaluate();
            }
            if (Dep.target) {
                watcher.depend();
            }
            return watcher.value;
        }
    };
}

function createGetterInvoker(fn) {
    return function computedGetter() {
        return fn.call(this, this);
    };
}

function initMethods(vm: Component, methods: Object) {
    const props = vm.$options.props;
    for (const key in methods) {
        if (process.env.NODE_ENV !== "production") {
            if (typeof methods[key] !== "function") {
                warn(
                    `Method "${key}" has type "${typeof methods[
                        key
                    ]}" in the component definition. ` +
                        `Did you reference the function correctly?`,
                    vm
                );
            }
            if (props && hasOwn(props, key)) {
                warn(`Method "${key}" has already been defined as a prop.`, vm);
            }
            if (key in vm && isReserved(key)) {
                warn(
                    `Method "${key}" conflicts with an existing Vue instance method. ` +
                        `Avoid defining component methods that start with _ or $.`
                );
            }
        }
        vm[key] =
            typeof methods[key] !== "function" ? noop : bind(methods[key], vm);
    }
}

function initWatch(vm: Component, watch: Object) {
    for (const key in watch) {
        const handler = watch[key];
        if (Array.isArray(handler)) {
            for (let i = 0; i < handler.length; i++) {
                createWatcher(vm, key, handler[i]);
            }
        } else {
            createWatcher(vm, key, handler);
        }
    }
}

function createWatcher(
    vm: Component,
    expOrFn: string | Function,
    handler: any,
    options?: Object
) {
    if (isPlainObject(handler)) {
        options = handler;
        handler = handler.handler;
    }
    if (typeof handler === "string") {
        handler = vm[handler];
    }
    return vm.$watch(expOrFn, handler, options);
}

export function stateMixin(Vue: Class<Component>) {
    // flow somehow has problems with directly declared definition object
    // when using Object.defineProperty, so we have to procedurally build up
    // the object here.
    const dataDef = {};
    dataDef.get = function() {
        return this._data;
    };
    const propsDef = {};
    propsDef.get = function() {
        return this._props;
    };
    if (process.env.NODE_ENV !== "production") {
        dataDef.set = function() {
            warn(
                "Avoid replacing instance root $data. " +
                    "Use nested data properties instead.",
                this
            );
        };
        propsDef.set = function() {
            warn(`$props is readonly.`, this);
        };
    }
    Object.defineProperty(Vue.prototype, "$data", dataDef);
    Object.defineProperty(Vue.prototype, "$props", propsDef);

    Vue.prototype.$set = set;
    Vue.prototype.$delete = del;

    Vue.prototype.$watch = function(
        expOrFn: string | Function,
        cb: any,
        options?: Object
    ): Function {
        const vm: Component = this;
        if (isPlainObject(cb)) {
            return createWatcher(vm, expOrFn, cb, options);
        }
        options = options || {};
        options.user = true;
        const watcher = new Watcher(vm, expOrFn, cb, options);
        if (options.immediate) {
            try {
                cb.call(vm, watcher.value);
            } catch (error) {
                handleError(
                    error,
                    vm,
                    `callback for immediate watcher "${watcher.expression}"`
                );
            }
        }
        return function unwatchFn() {
            watcher.teardown();
        };
    };
}
