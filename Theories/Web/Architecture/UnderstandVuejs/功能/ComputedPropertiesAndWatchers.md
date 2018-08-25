# Computed Properties and Watchers

## Watcher
### 节流
```js
const vm = new Vue({
    data: {
        num1: 22,
    },
    watch: {
        num1(n){
            console.log(n);
        },
    },
});

vm.num1 = 33; // 不会触发
vm.num1 = 44; // 会触发
vm.$nextTick(()=>{
    console.log('nextTick');
    vm.num1 = 55; // 会触发
});
```
1. 在同一个事件循环周期内，对一个属性的多次修改只会有最有一次触发 watcher 的回调。
2. 从先打印`44`再打印`nextTick`来看，watcher 的回调应该是在一个周期的末尾来执行。
3. 使用`vm.$watch`的 unwatch 函数取消 watch 的话，当前周期的改变都会失效，不会触发
watcher 的回调。因为 watcher 的回调是在一个周期的末尾来执行，再它要执行的时候，unwatch
已经执行过了。
    ```js
    const vm = new Vue({
        el: '#components-demo',
        data: {
            num1: 22,
        },
    });

    let unwatch = vm.$watch('num1', (n)=>{
        console.log(n);
    });

    // 不会触发 watcher 回调，因为虽然修改是在这里，但 watcher 回调是在 unwatch() 之后
    vm.num1 = 20;
    unwatch();
    ```

### 监听子属性
```js
new Vue({
    data: {
        profile:{
            age: 33,
        },
    },
    watch: {
        ['profile.age'](n){ console.log(n) },
        // 或者
        // 'profile.age': function(n){ console.log(n) },
    },
    created(){
        this.profile.age = 22;
    }
});
```

### 触发标准是 Same-value-zero equality
```js
new Vue({
    el: '#components-demo',
    data: {
        age: 0
    },
    watch: {
        age(n){
            console.log(n);
        },
    },
    created(){
        this.age = -0; // 不会触发
        setTimeout(()=>{
            this.age = NaN; // 会触发
        });
        setTimeout(()=>{
            this.age = NaN; // 不会触发
        });
    },
});
```

### Computed Setter
Computed properties are by default getter-only, but you can also provide a
setter when you need it:
