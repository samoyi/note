/* @flow */

// 2.5.21


import { isRegExp, remove } from "shared/util";
import { getFirstComponentChild } from "core/vdom/helpers/index";

type VNodeCache = { [key: string]: ?VNode };


// 获取组件名
// 优先使用 options 中的 name，如果没有则使用 tag 名
function getComponentName(opts: ?VNodeComponentOptions): ?string {
    return opts && (opts.Ctor.options.name || opts.tag);
}


// 是否匹配到 include/exclude 指定的规则
function matches(
    pattern: string | RegExp | Array<string>,
    name: string
): boolean {
    if (Array.isArray(pattern)) { // 在数组里
        return pattern.indexOf(name) > -1;
    } 
    else if (typeof pattern === "string") { // 在逗号分隔的字符串里
        return pattern.split(",").indexOf(name) > -1;
    } 
    else if (isRegExp(pattern)) { // 能匹配到正则
        return pattern.test(name);
    }
    /* istanbul ignore next */
    return false;
}


// 删除缓存里的子组件，filter 函数返回 true 的子组件不会被删除
function pruneCache(keepAliveInstance: any, filter: Function) {
    const { cache, keys, _vnode } = keepAliveInstance;
    // 遍历已缓存的子组件
    for (const key in cache) {
        const cachedNode: ?VNode = cache[key];
        if (cachedNode) {
            const name: ?string = getComponentName(cachedNode.componentOptions);
            if (name && !filter(name)) {
                pruneCacheEntry(cache, key, keys, _vnode);
            }
        }
    }
}


// 删除一个缓存
function pruneCacheEntry(
    cache: VNodeCache,
    key: string,
    keys: Array<string>,
    current?: VNode
) {
    const cached = cache[key]; // 缓存中将要被删除的子组件
    if (cached && (!current || cached.tag !== current.tag)) { // TODO
        cached.componentInstance.$destroy(); // 销毁该组件的实例
    }

    // 删除该子组件的缓存记录
    cache[key] = null;
    remove(keys, key);
}


const patternTypes: Array<Function> = [String, RegExp, Array];


// 定义 keep-alive 组件
export default {
    name: "keep-alive",

    // Similar to <transition>, <keep-alive> is an abstract component: it doesn’t render a DOM element itself, 
    // and doesn’t show up in the component parent chain.
    abstract: true,

    props: {
        include: patternTypes,
        exclude: patternTypes,
        max: [String, Number]
    },

    created() {
        this.cache = Object.create(null); // 创建 keep-alive 的缓存
        // 每个动态渲染的子组件有一个唯一的 key，如果一个子组件要加入缓存，则记录它的 key
        this.keys = []; 
    },

    destroyed() {
        // 清空缓存
        for (const key in this.cache) {
            pruneCacheEntry(this.cache, key, this.keys);
        }
    },

    mounted() {
        // 当 include 或 exclude 的值发生变化时，要修改需要 keep-alive 的子组件
        this.$watch("include", val => {
            // 除了匹配到新的 include 里的子组件，其他的都会被从缓存里删除
            pruneCache(this, name => matches(val, name));
        });
        this.$watch("exclude", val => {
            // 除了没有匹配到新的 exclude 里的子组件，其他的都会被从缓存里删除
            pruneCache(this, name => !matches(val, name));
        });
    },

    render() {
        // <keep-alive> 插槽插入的内容，数组
        // 例如下面的 <keep-alive> 插槽中有三个节点（包括空格）
        // <keep-alive>
        //     <div>123</div>
        //     <any-name :is="'child' + currIndex"></any-name>
        // </keep-alive>
        const slot = this.$slots.default;

        // 通过 getFirstComponentChild 获取其中的动态组件
        // 要渲染的具体的子组件，也就是替换叫上面 any-name 的组件
        // 但并不是实际的组件实例，因为在它之上的 componentInstance 属性引用的才是真正的组件实例
        const vnode: VNode = getFirstComponentChild(slot);

        const componentOptions: ?VNodeComponentOptions =
            vnode && vnode.componentOptions;

        if (componentOptions) {
            // check pattern
            // 获得具体要渲染的那个组件的组件名。例如这里的 child1
            const name: ?string = getComponentName(componentOptions);

            // include 和 exclude 两个 prop
            const { include, exclude } = this;
            // 如果当前子组件不包括在 include 里或者包括在 exclude 里，也就是说当前子组件不会被 keep alive，
            // 则直接 return，不进行后面 keep alive 的缓存操作。
            if (
                // not included
                (include && (!name || !matches(include, name))) ||
                // excluded
                (exclude && name && matches(exclude, name))
            ) {
                return vnode;
            }

            const { cache, keys } = this;

            // 获取每个子组件唯一的 key。
            const key: ?string =
                vnode.key == null
                    ? // same constructor may get registered as different local components
                      // so cid alone is not enough (#3269)
                        //   TODO
                      componentOptions.Ctor.cid +
                      (componentOptions.tag ? `::${componentOptions.tag}` : "")
                    : vnode.key;

            // 如果缓存里面有当前子组件
            if ( cache[key] ) {
                // 该组件直接引用缓存的组件实例作为实例
                vnode.componentInstance = cache[key].componentInstance;
                // make current key freshest
                // 把当前子组件刷新到缓存中最新的位置
                remove(keys, key);
                keys.push(key);
            } 
            else {
                cache[key] = vnode; // 当前子节点加入缓存
                keys.push(key); // 记录加入缓存的子节点的 key

                // 如果使用了 max 且当前新加入缓存导致长度超过 max
                // prune oldest entry
                if (this.max && keys.length > parseInt(this.max)) {
                    // 删除掉最旧的一条缓存
                    pruneCacheEntry(cache, keys[0], keys, this._vnode);
                }
            }

            vnode.data.keepAlive = true; // 标记为 keepAlive 组件，其他地方会用到
        }
        
        // 根据 getFirstComponentChild 的实现，keep-alive 里面没有带有 is 的子组件的时候，
        // getFirstComponentChild 优先会返回第一个自定义子组件给 vnode。
        // 如果连自定义组件都没有，getFirstComponentChild 返回值是 undefined，这里 return 的 slot[0] 会是第一个非自定义节点。
        return vnode || (slot && slot[0]);
    }
};
