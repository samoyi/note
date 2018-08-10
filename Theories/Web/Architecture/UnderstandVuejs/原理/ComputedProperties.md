# Computed Properties

还没明白原理，先存两个参考文章：
* [Vue.js Internals: How computed properties work](https://skyronic.com/blog/vuejs-internals-computed-properties)
* [深入理解 Vue Computed 计算属性](https://segmentfault.com/a/1190000010408657)




## 计算属性的特点
### 依赖
* 可以依赖`data`的属性，也可以依赖其他的计算属性。而且和顺序没有关系
    ```js
    new Vue({
        el: '#components-demo',
        computed: {
            total(){
                return this.temp + 1;
            },
            temp(){
                return this.num1 + this.num2;
            },
        },
        data: {
            num1: 22,
            num2: 33,
        },
    });
    ```

### 基于依赖的缓存
* 计算属性的函数类似于计算属性的 getter 函数，但又不完全相同。因为计算属性可以缓存结果。


## 实现原理猜想
```js
new Vue({
    el: '#example',
    data: {
        message: 'Hello'
    },
    computed: {
        reversedMessage: function () {
            return this.message.split('').reverse().join('')
        }
    }
})
```

### 依赖的实现
1. 创建实例的时候，Vue 会发现参数中有`computed`属性，进而发现有一个`reversedMessage`，
知道它是一个计算属性。
2. 但是 Vue 是怎么知道`reversedMessage`依赖谁的？

### 缓存的实现
1. 看起来是另外维护了一个依赖关系表，表中记录了若干个计算属性
2. 针对每个计算属性会记录两个值：该计算属性当前的值（缓存），依赖的若干个属性及其属性值。
3. 当读取一个计算属性的时候，先检查依赖的属性若干个属性的属性值是否有变化，如果没变化，
直接返回缓存的值，如果有变化，则重新计算，并缓存。
