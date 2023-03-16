# Conditional Rendering


## `v-if`
### 在 `<template>` 元素上使用 `v-if` 条件渲染分组
1. 因为 `v-if` 是一个指令，所以必须将它添加到一个元素上。
    2. 如果想切换多个元素呢，可以把一个 `<template>` 元素当做不可见的包裹元素，并在上面使用 `v-if`。最终的渲染结果将不包含 `<template>` 元素。
    ```html
    <div id="app">
        <template v-if="bool">
            <h1>标题</h1>
            <p>内容</p>
        </template>
    </div>
    ```
    ```js
    new Vue({
        el: '#app',
        data: {
            bool: true,
        },
        mounted(){
            setInterval(()=>{
                this.bool = !this.bool;
            }, 2000);
        },
    });
    ```

### `v-else` 和 `v-else-if`
`v-if`、`v-else` 和 `v-else-if` 三者所在节点之间不能插入其他元素
```html
<div id="app">
    <h1 v-if="sex === 'f'">女</h1>
    <!-- <p></p> -->
    <h1 v-else-if="sex === 'm'">男</h1>
    <!-- <p></p> -->
    <h1 v-else>娚</h1>
</div>
```
```js
new Vue({
	el: '#app',
    data: {
        sex: 'b',
    },
    mounted(){
		setInterval(()=>{
			let n = Math.random();
			if (n >0.66){
				this.sex = 'f';
			}
			else if (n < 0.33){
				this.sex = 'm'
			}
			else {
				this.sex = 'b';
			}
		}, 1000);
	},
});
```

### 元素复用和 `key`
1. Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。
    ```html
    <div id="components-demo">
        <template v-if="loginType === 'username'">
            <label>Username</label>
            <!-- 虽然这个 input 绑定了事件但下面那个没有绑定，
            但也不影响复用，而且事件也不会共享 -->
            <input placeholder="username" @click="foo" type="text" />
        </template>
        <template v-else>
            <label>Email</label>
            <input placeholder="email" type="text" />
        </template>
        <input type="button" value="toggle" @click="toggle" />
    </div>
    ```
    ```js
    new Vue({
        el: '#components-demo',
        data: {
            loginType: 'username'
        },
        methods: {
            toggle(){
                if (this.loginType === 'username'){
                    this.loginType = 'email';
                }
                else {
                    this.loginType = 'username';
                }
            },
            foo(){
                console.log('foo')
            },
        },
    });
    ```
2. 必须是相同的元素才能复用。如果是 `input` 的话，`type` 如果不同，可能会不能共享值下面在第一个 `input` 里输入纯数字的话，切换后是可以共享的；但如果包含字符串，则无法共享。
    ```html
    <div id="components-demo">
        <template v-if="loginType === 'username'">
            <label>Username</label>
            <input placeholder="username" type="text" />
        </template>
        <template v-else>
            <label>Email</label>
            <input placeholder="email" type="number" />
        </template>
        <input type="button" value="toggle" @click="toggle" />
    </div>
    ```
3. 复用的元素的对应关系，不是看它们在同辈元素中的位置顺序，而是在看它们在同级元素中相同类型元素之间的顺序。而且看起来是从后往前数的？！
3. 下面代码中，`realname` 和 `id` 是各自同辈倒数第一个 `input`，所以它俩复用，`username` 和 `tel` 是各自同辈倒数第二个 `input`，所以它俩复用。
    ```html
    <div id="components-demo">
        <template v-if="loginType === 'username'">
            <input placeholder="username" type="text" /> <br />
            <input placeholder="realname" type="text" /> <br />
            <label>Username</label>
        </template>
        <template v-else>
            <label>Email</label> <br />
            <textarea>textarea</textarea> <br />
            <input placeholder="email" type="text" /> <br />
            <input placeholder="tel" type="text" /> <br />
            <input placeholder="id" type="text" /> <br />
        </template>
        <input type="button" value="toggle" @click="toggle" />
    </div>
    ```
4. 但可能并不总是想要这种复用。所以 Vue 提供了 `key` 属性来禁止这种复用。给不想复用的元素设置不同的 `key` 值，即可阻止它们复用
    ```html
    <div id="components-demo">
        <template v-if="loginType === 'username'">
            <label>Username</label>
            <input placeholder="username" type="text" key="username-input" />
        </template>
        <template v-else>
            <label>Email</label>
            <input placeholder="email" type="text" key="email-input" />
        </template>
        <input type="button" value="toggle" @click="toggle" />
    </div>
    ```
    ```js
    new Vue({
    	el: '#components-demo',
    	data: {
    		loginType: 'username'
    	},
    	methods: {
    		toggle(){
    			if (this.loginType === 'username'){
    				this.loginType = 'email';
    			}
    			else {
    				this.loginType = 'username';
    			}
    		},
    	},
    });
    ```
    `<input>` 因为有了不同的 `key` 于是不再复用，而 `<label>` 则可以继续复用。


## `v-if` vs `v-show`
1. `v-if` 是 “真正” 的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建; `v-show`只是简单地切换元素的 CSS 属性 `display`。
2. `v-if` 是惰性的，如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块；`v-show` 不管初始条件是什么，元素总是会被渲染。
3. 也是基于这一点，如果想用 `v-if` 控制一个组件是否渲染，应该用在引用该组件的地方，这样这个组件就不会被创建；而不是在组件内的根元素上，这样组件仍然会被创建，只是根元素不会被渲染。例如想控制一个 `BottomNav` 是否渲染：
    ```html
    <!-- 不应该 -->
    <template>
        <section v-if="false"></section>
    </template>
    <script>
        export default {
            name: "BottomNav",
            created() {
                // 仍然会被触发
            }
        }
    </script>
    ```
    ```html
    <!-- 应该 -->
    <BottomNav v-if="false" />
    ```
4. `v-show` 不能想 `v-if` 那样用在 `<template>` 之上，因为 `<template>` 是渲染级别的，而 `v-show` 是负责渲染之后的事情。
5. 一般来说，`v-if` 有更高的切换开销，而 `v-show` 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 `v-show` 较好；如果在运行时条件很少改变，则使用 `v-if` 较好。