# 混入

## 功能
1. 实现复用的组件选项
2. 混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被混入该组件
本身的选项。
```js
// 通过 PublicOptions 定义了两个公共的组件选项：一个 age 数据，一个 sayAge 方法
const PublicOptions = {
    data(){
        return {
            age: 22,
        };
    },
    methods: {
        sayAge(n){
            console.log(m);
        },
    },
};

// 任何组件都可以通过 mixins 选项来混入若干个待混入对象
new Vue({
    el: '#components-demo',
    mixins: [PublicOptions],
    created(){
        this.sayAge(this.age); // 触发输出 22
    },
});
```


## 选项合并规则
### 混入 data 对象
* 混入数据对象时，在和组件的数据发生冲突时以组件数据优先。
* 文档中说数据对象混入是浅合并(一层属性深度)，但实测发现并不是。不懂

```js
let MyPlugin = {
	data(){
		return {
			age: 33,
			obj: {
				a: 1,
				b: 2,
				o: {
					foo: 111,
					bar: 222,
				},
			},
		};
	},
};
new Vue({
	data(){
		return {
			age: 22,
			obj: {
				a: 1,
				c: 3,
				o: {
					foo: 111,
					baz: 333,
				},
			},
		};
	},
	mixins: [MyPlugin],
	created(){
		console.log(this.age); // 22
        // 下面可以看到，就连 $data.obj.o 里面的属性都合并了。
		console.log(JSON.stringify(this.obj, null, 4));
		// {
		//     "a": 1,
		//     "c": 3,
		//     "o": {
		//         "foo": 111,
		//         "baz": 333,
		//         "bar": 222
		//     },
		//     "b": 2
		// }
	},
}).$mount('#app')
```

### 混入钩子函数
1. 同名钩子函数将混合为一个数组，因此都将被调用。
2. 混入对象的钩子将在组件自身钩子之前调用。
3. 大概的原因是，钩子函数不会像数据属性那样必然冲突，所以可以共存。但 mixin 可能是别人写
的，而我自己的钩子函数是我自己写的，我应该对我自己的实例生命周期有绝对的控制，所以我自己
的钩子函数应该后触发，即便冲突了也可以覆盖 mixin 中同名钩子函数里的操作。

```js
let MyPlugin = {
	created(){
		console.log('先打印'); //
	},
};
new Vue({
	mixins: [MyPlugin],
	created(){
		console.log('后打印');
	},
	router,
}).$mount('#app')
```

### 值为对象的选项
1. 将被混合为同一个对象。
2. 两个对象键名冲突时，取组件对象的键值对。

```html
<div id="app" v-d1 v-d2 v-d3>
    <!-- 三个指令打印结果为
        "d111"
        "d2"
        "d3"
    -->

	<com1></com1>
	<com2></com2>
	<com3></com3>
    <!-- 渲染为
        <div>com111</div>
        <div>com2</div>
        <div>com3</div>
    -->
</div>
```
```js
const com1 = {template: `<div>com1</div>`};
const com111 = {template: `<div>com111</div>`};
const com2 = {template: `<div>com2</div>`};
const com3 = {template: `<div>com3</div>`};

let MyPlugin = {
	computed: {
		c1(){
			return 'c1';
		},
		c2(){
			return 'c2';
		},
	},
	methods: {
		m1(){
			return 'm1';
		},
		m2(){
			return 'm2';
		},
	},
	directives: {
		d1: {
			bind(){
				console.log('d1');
			},
		},
		d2: {
			bind(){
				console.log('d2');
			},
		},
	},
	components: {
		com1: com1,
		com2: com2,
	},
};
new Vue({
	mixins: [MyPlugin],
	computed: {
		c1(){
			return 'c111';
		},
		c3(){
			return 'c3';
		},
	},
	methods: {
		m1(){
			return 'm111';
		},
		m3(){
			return 'm3';
		},
	},
	directives: {
		d1: {
			bind(){
				console.log('d111');
			},
		},
		d3: {
			bind(){
				console.log('d3');
			},
		},
	},
	components: {
		com1: com111,
		com3: com3,
	},

	created(){
		console.log(this.c1); // "c111"
		console.log(this.c2); // "c2"
		console.log(this.c3); // "c3"

		console.log(this.m1()); // m111
		console.log(this.m2()); // m2
		console.log(this.m3()); // m3
	},
}).$mount('#app')
```


## 全局混入
1. 也可以全局注册混入对象。但要注意，一旦使用全局混入对象，将会影响到所有之后创建的 Vue
实例。
    ```js
    new Vue({
        greeting: '不会输出',
    });

    Vue.mixin({
        // 之后所有生成的实例，只要带有 greeting 属性，在实例 created 时，都会自动打印
        // greeting 的值
        created(){
            let greeting = this.$options.greeting;
            greeting && console.log(greeting);
        },
    });

    new Vue({
        nogreeting: '也不会输出',
    });

    new Vue({
        greeting: 'hello world',
    });
    ```
2. 谨慎使用全局混入对象，因为会影响到每个单独创建的 Vue 实例 (包括第三方模板)。大多数情
况下，只应当应用于自定义选项，就像上面示例一样，只有使用了`greeting`这个自定义选项的实
例才会收到全局混入的影响。也可以将其用作 Plugins 以避免产生重复应用（不懂这句什么意思）。



## 使用方法
直接看[文档](https://vuejs.org/v2/guide/mixins.html)
