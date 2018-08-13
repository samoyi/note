# Conditional Rendering


## `v-if`
### Conditional Groups with `v-if` on `<template>`

### `key`
1. Vue tries to render elements as efficiently as possible, often re-using them
instead of rendering from scratch.
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
2. 必须是相同的元素才能复用。如果是`input`的话，`type`如果不同，可能会不能共享值
下面在第一个`input`里输入纯数字的话，切换后是可以共享的；但如果包含字符串，则无法共享。
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
3. 复用的元素的对应关系，不是看它们在同辈元素中的位置顺序，而是在看它们在同级元素中相同
类型元素之间的顺序。而且看起来是从后往前数的？！
下面代码中，`realname`和`id`是各自同辈倒数第一个`input`，所以它俩复用，`username`和
`tel`是各自同辈倒数第二个`input`，所以它俩复用。
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
4. Beyond helping make Vue very fast, this can have some useful advantages.
5. This isn’t always desirable though, so Vue offers a way for you to say,
“These two elements are completely separate - don’t re-use them.” Add a `key`
attribute with unique values.
6. 需要源码


## `v-if` vs `v-show`
1. `v-if` is “real” conditional rendering because it ensures that event
listeners and child components inside the conditional block are properly
destroyed and re-created during toggles.; `v-show` only toggles the display CSS
property of the element, the element is always rendered regardless of initial
condition.
2. `v-if` is also lazy: if the condition is false on initial render, it will not
do anything - the conditional block won’t be rendered until the condition
becomes true for the first time.
3. `v-show` doesn’t support the `<template>` element。`<template>`是渲染级别的，肯
定不会支持。
4. Generally speaking, `v-if` has higher toggle costs while `v-show` has higher
initial render costs. So prefer `v-show` if you need to toggle something very
often, and prefer `v-if` if the condition is unlikely to change at runtime.
