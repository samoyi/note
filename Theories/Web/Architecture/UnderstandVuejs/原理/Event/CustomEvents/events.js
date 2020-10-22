/* @flow */

// 2.5.21

import {
    tip,
    toArray,
    hyphenate,
    handleError,
    formatComponentName
} from "../util/index";
import { updateListeners } from "../vdom/helpers/index";


// 为组件初始化自定义事件
// 每个组件实例都会进行初始化
export function initEvents(vm: Component) {
    // 为每个子组件实例创建一个 _events 对象，该对象将保存绑定于其上的自定义事件。
    // 对象的 key 为自定义事件的名称，对应的 value 是一个数组，包含该事件的所有处理函数。
    // 一个自定义事件可以通过两种方法添加处理函数：
    //     一个是定义父组件引用该子组件时通过指令在子组件标签上添加的，通过这个方法只能为子组件添加一个事件监听；
    //     一个是在子组件里通过 $on 方法添加的，通过这个方法可以添加任意数量的事件监听。
    vm._events = Object.create(null);

    // 用于标记该实例是否绑定了对生命周期`hook:`函数的监听，见下
    vm._hasHookEvent = false;

    // init parent attached events
    // 父组件通过指令添加的自定义事件监听。结构为对象。
    // 因为通过指令不能为一个事件绑定多个回调，事件名 key 对应的 value 是一个函数而非数组。
    // 即使子组件不会 emit 某个事件，只要父组件监听了，就会出现在这里。
    const listeners = vm.$options._parentListeners;

    // 如果有的话，将事件名和回调函数加入到新创建的 vm._events
    // TODO
    if (listeners) {
        updateComponentListeners(vm, listeners);
    }
}


// target 以及下面的三个函数都是用于合并通过指令绑定的自定义事件
let target: any;

function add(event, fn) {
    target.$on(event, fn);
}

function remove(event, fn) {
    target.$off(event, fn);
}

function createOnceHandler(event, fn) {
    const _target = target;
    return function onceHandler() {
        const res = fn.apply(null, arguments);
        if (res !== null) {
            _target.$off(event, onceHandler);
        }
    };
}


export function updateComponentListeners(
    vm: Component,
    listeners: Object,
    oldListeners: ?Object
) {
    target = vm;
    updateListeners(
        listeners,
        oldListeners || {},
        add,
        remove,
        createOnceHandler,
        vm
    );
    target = undefined;
}


// 全局混入事件实例方法
export function eventsMixin(Vue: Class<Component>) {
    // 查询绑定的是否是实例生命周期 emit 出的事件
    const hookRE = /^hook:/;

    Vue.prototype.$on = function(
        event: string | Array<string>,
        fn: Function
    ): Component {
        const vm: Component = this;

        // 如果直接通过实例方法绑定且第一个参数传字符串数组一次绑定多个事件
        if (Array.isArray(event)) {
            // 则通过该方法遍历绑定这些事件
            for (let i = 0, l = event.length; i < l; i++) {
                vm.$on(event[i], fn);
            }
        } 
        // 如果是通过指令绑定或者通过实例方法但第一个参数传字符串
        else {
            // 如果该实例的 _events 中已经有了该事件，则将这次绑定的事件处理函数加入到该事件的事件处理函数数组中，
            // 否则在 _events 创建该事件，并把回调函数加入事件 key 对应的数组。
            (vm._events[event] || (vm._events[event] = [])).push(fn);
            // optimize hook:event cost by using a boolean flag marked at registration
            // instead of a hash lookup
            // 如果是监听了组件生命周期的 emit 的事件，则在实例上标记，生命周期会根据其是否为 true 来决定是否 emit `hook:`事件
            // 只要监听了任意一个 `hook:`事件，生命周期在调用每个钩子函数时都会 emit 对应的 `hook:`事件，但只有监听的才会接受。
            // 这样做的好处就是上面英文中说到的，虽然会每个生命周期都 emit `hook:`事件，但不需要维护一个 hash 来查找具体监听了哪
            // 些 `hook:`事件
            if (hookRE.test(event)) {
                vm._hasHookEvent = true;
            }
        }
        return vm;
    };

    Vue.prototype.$once = function(event: string, fn: Function): Component {
        const vm: Component = this;
        // 包装一个事件处理函数，实际为 event 事件绑定的不是用户指定的回调而是这里包装后的回调
        function on() {
            // 在第一次执行该包装回调时就解绑该事件上的这一包装回调
            vm.$off(event, on);
            // 然后执行用户指定的实际回调
            fn.apply(vm, arguments);
        }
        // 因为实际绑定的是包装后的回调函数，而用户要解绑该 once 事件时，传给 $off 方法的仍然是原始的 fn 而非这里包装后的 on
        // 回调函数，所以这里必须要把原始的 fn 回调记录到实际绑定的 on 包装回调中。在执行 $off 解除某回调时，除了检查指定事件的
        // 回调数组里是否有要解除的回调，还要同时检查回调数组里是否某个回调拥有 fn 属性且该属性恰好就是要解除的回调
        on.fn = fn;
        // 为事件绑定包装回调
        vm.$on(event, on);
        return vm;
    };

    Vue.prototype.$off = function(
        event?: string | Array<string>,
        fn?: Function
    ): Component {
        const vm: Component = this;
        // all
        // 如果没有传参，则删除该实例上的所有自定义事件
        if (!arguments.length) {
            vm._events = Object.create(null);
            return vm;
        }
        // array of events
        // 如果传参数组，表示要为多个事件解绑监听，因此遍历这些事件进行解绑
        if (Array.isArray(event)) {
            for (let i = 0, l = event.length; i < l; i++) {
                vm.$off(event[i], fn);
            }
            return vm;
        }

        // 上面是全部解绑或遍历调用 $off 解绑的逻辑，下面是进行具体的解绑

        // specific event
        // 查找要解绑的事件对应的所有回调
        const cbs = vm._events[event];

        // 如果实例并没有绑定过该事件的回调
        if (!cbs) {
            return vm;
        }

        // 如果没有传第二个参数，即没有指定要为该事件解绑哪个回调，则解绑该事件的所有回调，即完全清除对该事件的监听
        if (!fn) {
            vm._events[event] = null;
            return vm;
        }

        // 如果指定为该事件解绑某个回调函数
        if (fn) {
            // specific handler
            let cb;
            let i = cbs.length;
            // 遍历回调
            while (i--) {
                cb = cbs[i];
                // 如果某个回调就是要解绑的回调，或者该回调是要解绑的 $once 回调，
                // 则从指定事件对应的回调数组中删除该回调并跳出循环。
                if (cb === fn || cb.fn === fn) {
                    cbs.splice(i, 1);
                    break;
                }
            }
        }
        return vm;
    };

    Vue.prototype.$emit = function(event: string): Component {
        const vm: Component = this;
        if (process.env.NODE_ENV !== "production") {
            const lowerCaseEvent = event.toLowerCase();
            // 如果 emit 的事件名包含大写字母并且注册的事件是纯小写
            // 因为通过 v-on 注册的事件名如果包含大写字母，也会被 HTML 规则转换为小写的事件名。在这种情况下，用户还会以为自己注
            // 册的是包含大写字母的用户名而 emit 大写的事件名，就会导致下面的提示
            if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
                tip(
                    `Event "${lowerCaseEvent}" is emitted in component ` +
                        `${formatComponentName(
                            vm
                        )} but the handler is registered for "${event}". ` +
                        `Note that HTML attributes are case-insensitive and you cannot use ` +
                        `v-on to listen to camelCase events when using in-DOM templates. ` +
                        `You should probably use "${hyphenate(
                            event
                        )}" instead of "${event}".`
                );
            }
        }
        let cbs = vm._events[event];
        if (cbs) { // 如果 event 事件已经的所有回调都已经解绑，那么 cbs 就是 null
            cbs = cbs.length > 1 ? toArray(cbs) : cbs;
            // 把事件名之后的参数(如果有)转为数组，用于传给每个回调
            const args = toArray(arguments, 1);
            // 遍历执行所有的回调
            for (let i = 0, l = cbs.length; i < l; i++) {
                try {
                    cbs[i].apply(vm, args);
                } catch (e) {
                    handleError(e, vm, `event handler for "${event}"`);
                }
            }
        }
        return vm;
    };
}