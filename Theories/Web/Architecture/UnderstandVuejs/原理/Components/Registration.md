# Registration

## Global Registration
### 源码
1. 源码版本：`v2.5.17`
2. 示例代码
```js
Vue.component('my-div', {
    data: function () {
        return {
            num: 22
        }
    },
    template: '<div></div>'
})
```
3. 通过`initAssetRegisters`函数注册全局组件
```js
function initAssetRegisters (Vue) {
	/**
	* Create asset registration methods.
	*/
	// 没有看到关于 ASSET_TYPES 的明确说明，但总之就是以下三种类型
	// console.log(ASSET_TYPES); // ["component", "directive", "filter"]
	ASSET_TYPES.forEach(function (type) {
		// 针对组件类型，这里的 Vue[type] 就是全局注册时的 Vue.component
		Vue[type] = function (
			id, // 组件ID
			definition // 定义组件的选项
		) {
			// console.log(id); // "my-div"
			// console.log(definition); // {data: ƒ, template: "<div></div>"}

			if (!definition) {
				return this.options[type + 's'][id]
			} else {
				/* istanbul ignore if */
				if ("development" !== 'production' && type === 'component') {
					validateComponentName(id); // 验证组件名是否合法
				}
				if (type === 'component' && isPlainObject(definition)) {
					// 定义组件的 name 属性
					definition.name = definition.name || id;

					// 源码中对 Vue.options._base的说明是：this is used to
					// identify the "base" constructor to extend all plain-object
					// components with in Weex's multi-instance scenarios.

					// 看到这篇文章（https://www.jb51.net/article/115741.htm）对下
					// 面这行的解释是：如果第二个参数是简单对象，则需要通过 Vue.extend
					// 创建组件构造函数

					// 总之通过这行 definition 从创建组件时的选项对象变成了一个函数
					// ƒ VueComponent (options) {
					// 	this._init(options);
					// }
					// 看起来类似于一个组件构造函数
					definition = this.options._base.extend(definition);
				}
				if (type === 'directive' && typeof definition === 'function') {
					definition = { bind: definition, update: definition };
				}
				// 将该组件 definition 函数的加入到全局属性 Vue.options.component
				// 中，key 为组件 ID "my-div"
				this.options[type + 's'][id] = definition;
				// console.log(Vue.options.components);
				return definition
			}
		};
	});
}
```


## Local Registration
