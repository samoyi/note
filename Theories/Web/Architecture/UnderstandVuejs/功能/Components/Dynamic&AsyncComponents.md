# Dynamic & Async Components

## Dynamic Components
1. 有时一个组件位置，可能你会期望它可以在不同的组件之间切换。比如一个登陆控件，你
可能希望它在邮箱登录组件和手机号登陆组件之间切换。
2. 那么你可以在当前位置随便放一个标签，然后为其添加`is`特性。`is`的值设定为哪个组
件名，当前就会显示哪个组件：
```html
<div id="components-demo">
    <any-name :is="currentComponentName"></any-name>
    <input type="button" value="switch" @click="switchComponent" />
</div>
```
```js
new Vue({
    el: '#components-demo',
    components: {
        'child-component1': {
            template: `<div>
                            <h2>使用邮箱登录</h2>
                            <input type="email" placeholder="输入邮箱" />
                        </div>`,
            created(){ // 先不用管这里
                console.log('child-component1 has been created');
            },
        },
        'child-component2': {
            template: `<div>
                            <h2>使用手机号登录</h2>
                            <input type="tel" placeholder="输入手机号" />
                        </div>`,
            created(){ // 先不用管这里
                console.log('child-component2 has been created');
            },
        },
    },
    data: {
        currentComponentName: 'child-component1',
    },
    methods: {
        switchComponent(){
            if (this.currentComponentName === 'child-component1'){
                this.currentComponentName = 'child-component2';
            }
            else {
                this.currentComponentName = 'child-component1';
            }
        }
    },
});
```
3. `is`特性除了可以设定为组件名以外，也可以直接设定为组件的选项对象。下面这个例子有些复
杂，不过能说明这一点
    ```html
    <div id="components-demo">
        <!-- 传给 is 的不是组件名，而是组件选项对象 -->
	    <any-name :is="currentComponent"></any-name>
	    <input type="button" value="switch" @click="switchComponent" />
	</div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        components: {
            'child-component1': {
                template: `<div>
                                <h2>使用邮箱登录</h2>
                                <input type="email" placeholder="输入邮箱" />
                            </div>`,
            },
            'child-component2': {
                template: `<div>
                                <h2>使用手机号登录</h2>
                                <input type="tel" placeholder="输入手机号" />
                            </div>`,
            },
        },
        data: {
            // 当前要显示的组件选项对象
            // 因为要要实例创建完后才能访问 this.$options.components
            currentComponent: null,
            // 当前要显示的组件选项对象的组件名
    		currentComponentName: 'child-component1',
        },
        methods: {
            switchComponent(){
    			const components = this.$options.components;
                if (this.currentComponentName === 'child-component1'){
                    this.currentComponent = components['child-component2'];
    				this.currentComponentName = 'child-component2';
                }
                else {
                    this.currentComponent = components['child-component1'];
    				this.currentComponentName = 'child-component1';
                }
            }
        },
    	created(){
    		this.currentComponent = this.$options.components['child-component1'];
    	}
    });
    ```

### 维持组件状态
1. 在使用上的登陆控件时，可能会发现一个问题。组件内部的输入在切换回来的时候就不存
在了。
2. 现在再看那两个`console.log`，能看出来，每次切换都是重新创建组件实例。
3. 只要给组件标签外面再加上`<keep-alive>`就可以维持状态，只在最开始创建一次实例
```html
<div id="components-demo">
    <keep-alive>
        <any-name :is="currentComponentName"></any-name>
    </keep-alive>
    <input type="button" value="switch" @click="switchComponent" />
</div>
```
4. Note that `<keep-alive>` requires the components being switched between
to all have names, either using the `name` option on a component, or
through local/global registration. 不懂，怎么创建没有名字的组件？



## Async Components
1. 在大型应用中，我们可能需要将应用分割成小一些的代码块，并且只在需要的时候才从服务器加
载一个模块。
2. 为了简化，Vue 允许你以一个工厂函数的方式定义你的组件，这个工厂函数会异步解析你的组件
定义。
3. Vue 只有在这个组件需要被渲染的时候才会触发该工厂函数，且会把结果缓存起来供未来重渲染
4. 在工厂函数内部可以异步加载组件选项对象。之后调用第一个参数`resolve`函数对组件选项对
象进行解析，或者调用第二个参数`reject`来表示加载失败。

```js
components: {
    'async-component': (resolve, reject)=>{
        import('./component1.js')
        .then(res=>{
            resolve(res);
        })
        .catch(err=>{
            reject(err);
        });
    },
},
```

5. 或者更方便的，你可以直接让该工厂函数返回一个 Promise 实例，该实例的解析结果应该为异
步加载的组件选项对象
    ```js
    components: {
        'async-component': () => import('./component.js'),
    },
    ```
6. 下面是一个完整的例子
    ```js
    // component.js
    export default {
        template: '<div>I am {{ name }}</div>',
        data(){
            return {name: '33'};
        },
        beforeCreate(){
            console.log('子实例 beforeCreate');
        },
    };
    ```
    ```js
    // main.js
    new Vue({
        el: '#components-demo',
        components: {
    		'async-component': () => import('./component.js'),
        },
        created(){
            console.log('父实例创建')
        },
        mounted(){
            console.log('父实例挂载')
        },
    });
    console.log('当前事件循环');
    ```
    ```html
    <div id="components-demo">
        <!-- 在组件异步加载解析完成之前，不会被渲染 -->
		<async-component></async-component>
	</div>
    ```
7. 从打印结果可以看出来，异步组件内的打印是最后执行的，证明是异步加载。    
    ```
    "父实例创建"
    "父实例挂载"
    "当前事件循环"
    "子实例 beforeCreate"
    ```

### 处理加载状态
不懂怎么用
