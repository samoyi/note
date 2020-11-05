# Dynamic & Async Components


<!-- TOC -->

- [Dynamic & Async Components](#dynamic--async-components)
    - [Dynamic Components](#dynamic-components)
        - [维持组件状态](#维持组件状态)
            - [切换回调](#切换回调)
            - [props](#props)
                - [`max`](#max)
                - [`include` and `exclude`](#include-and-exclude)
    - [Async Components](#async-components)
        - [处理加载状态](#处理加载状态)

<!-- /TOC -->


## Dynamic Components
1. 有时一个组件位置，可能你会期望它可以在不同的组件之间切换。比如一个登陆控件，你可能希望它在邮箱登录组件和手机号登陆组件之间切换。
2. 那么你可以在当前位置随便放一个标签，然后为其添加 `is` 特性。`is` 的值设定为哪个组件名，当前就会渲染为哪个组件：
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
3. `is` 特性除了可以设定为组件名以外，也可以直接设定为组件的选项对象。下面这个例子有些复杂，不过能说明这一点
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
1. 在使用上的登陆控件时，可能会发现一个问题：组件内部的输入在切换回来的时候就不存在了。
2. 现在再看那两个 `console.log`，能看出来，每次切换都是重新创建组件实例。
3. 只要给组件标签外面再加上 `<keep-alive>` 就可以维持状态，只在最开始创建一次实例
    ```html
    <div id="components-demo">
        <keep-alive>
            <any-name :is="currentComponentName"></any-name>
        </keep-alive>
        <input type="button" value="switch" @click="switchComponent" />
    </div>
    ```
4. Note that `<keep-alive>` requires the components being switched between to all have names, either using the `name` option on a component, or through local/global registration. 不懂，怎么创建没有名字的组件？

#### 切换回调
When a component is toggled inside `<keep-alive>`, its `activated` and `deactivated` lifecycle hooks will be invoked accordingly
```html
<div id="components-demo">
    <keep-alive>
        <any-name :is="currentComponentName"></any-name>
    </keep-alive>
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
            activated(){
                console.log('child-component1 activated');
            },
            deactivated(){
                console.log('child-component1 deactivated');
            },
        },
        'child-component2': {
            template: `<div>
                            <h2>使用手机号登录</h2>
                            <input type="tel" placeholder="输入手机号" />
                        </div>`,
            activated(){
                console.log('child-component2 activated');
            },
            deactivated(){
                console.log('child-component2 deactivated');
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

#### props   
##### `max`
1. The maximum number of component instances to cache. Once this number is reached, the cached component instance that was least recently accessed will be destroyed before creating a new instance.
2. 下面的示例中，依次访问 1、2、3、4、5 并填写内容，之后当访问 6 的时候，1 就不会 keep alive 了，再访问 1 就会发现表单空了
    ```html
    <div id="components-demo">
        <keep-alive :max="5">
            <any-name :is="'child-component' + currIndex"></any-name>
        </keep-alive>

        <input type="button" value="1" @click="switchComponent(1)" />
        <input type="button" value="2" @click="switchComponent(2)" />
        <input type="button" value="3" @click="switchComponent(3)" />
        <input type="button" value="4" @click="switchComponent(4)" />
        <input type="button" value="5" @click="switchComponent(5)" />
        <input type="button" value="6" @click="switchComponent(6)" />
    </div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        components: {
            'child-component1': {
                template: `<h2>
                        child-component1
                        <input />
                    </h2>`,
            },
            'child-component2': {
                template: `<h2>
                        child-component2
                        <input />
                    </h2>`,
            },
            'child-component3': {
                template: `<h2>
                        child-component3
                        <input />
                    </h2>`,
            },
            'child-component4': {
                template: `<h2>
                        child-component4
                        <input />
                    </h2>`,
            },
            'child-component5': {
                template: `<h2>
                        child-component5
                        <input />
                    </h2>`,
            },
            'child-component6': {
                template: `<h2>
                        child-component6
                        <input />
                    </h2>`,
            },
        },
        data: {
            currIndex: 1,
        },
        methods: {
            switchComponent(index){
                this.currIndex = index;
            }
        },
    });
    ```

##### `include` and `exclude`
1. The `include` and `exclude` props allow components to be conditionally cached. Both props can be a comma-delimited string, a RegExp or an Array
    ```html
    <!-- comma-delimited string -->
    <!-- 逗号前后不能有空格 -->
    <keep-alive include="a,b">
        <component :is="view"></component>
    </keep-alive>

    <!-- regex (use `v-bind`) -->
    <keep-alive :include="/a|b/">
        <component :is="view"></component>
    </keep-alive>

    <!-- Array (use `v-bind`) -->
    <keep-alive :include="['a', 'b']">
        <component :is="view"></component>
    </keep-alive>
    ```
2. Only components with matching names in `include` will be cached。使用上面 `max` 中的例子，如果如下设置，则只有前两个组件会被 keep alive
    ```html
    <keep-alive include="child-component1,child-component2">
        <any-name :is="'child-component' + currIndex"></any-name>
    </keep-alive>
    ```
3. Any component with a matching name in `exclude` will not be cached。使用上面 `max` 中的例子，如果如下设置，则前两个组件不会被 keep alive
    ```html
    <keep-alive exclude="child-component1,child-component2">
        <any-name :is="'child-component' + currIndex"></any-name>
    </keep-alive>
    ```
4. The match is first checked on the component’s own `name` option, then its local registration name (the key in the parent’s `components` option) if the `name` option is not available. Anonymous components cannot be matched against.


## Async Components
1. 在大型应用中，我们可能需要将应用分割成小一些的代码块，并且只在需要的时候才从服务器加载一个模块。
2. 为了简化，Vue 允许你以一个工厂函数的方式定义你的组件，这个工厂函数会异步解析你的组件定义。
3. Vue 只有在这个组件需要被渲染的时候才会触发该工厂函数，且会把结果缓存起来供未来重渲染。
4. 在工厂函数内部可以异步加载组件选项对象。之后调用第一个参数 `resolve` 函数对组件选项对象进行解析，或者调用第二个参数 `reject` 来表示加载失败。
    ```js
    components: {
        'async-component': (resolve, reject)=>{
            import('./component1.js')
            .then(res=>{
                // 其实`res.default`才是选项对象，不过可以如下省略
                resolve(res);
            })
            .catch(err=>{
                reject(err);
            });
        },
    },
    ```
5. 其实 Vue 根本不关心你是不是动态加载组件，它只是提供给你一个函数 `resolve`，你只要调用这个函数并传参组件选项对象，Vue 就会解析这个组件。所以下面的用法也是可以的
    ```js
    components: {
        'async-component':  (resolve, reject)=>{
            setTimeout(() => {
                resolve({
                    template: `<p>async p</p>`,
                });
            }, 2222);
        },
    },
    ```
6. 或者更方便的，你可以直接让该工厂函数返回一个 Promise 实例，该实例的解析结果应该为异步加载的组件选项对象
    ```js
    components: {
        'async-component': () => import('./component.js'),
    },
    ```
7. 下面是一个完整的例子
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
8. 从打印结果可以看出来，异步组件内的打印是最后执行的，证明是异步加载。    
    ```
    "父实例创建"
    "父实例挂载"
    "当前事件循环"
    "子实例 beforeCreate"
    ```

### 处理加载状态
不懂怎么用
