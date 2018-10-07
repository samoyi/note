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
2. 使用`vm.$watch`返回的`unwatch`函数取消 watch 的话，当前周期的改变都会失效，不会触
发 watcher 的回调。由此可以看出，watcher 的回调是在一个事件循环周期的末尾来执行，在它
要执行的时候，`unwatch`已经执行过了。
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

### 计算属性的 setter
1. 计算属性默认是定义为一个 getter 函数，因此是只读的。
2. 但也可以定义为可写的。只要把计算属性定义为一个对象，并定义 setter 即可
    ```js
    computed: {
        fullName: {
            // getter
            get: function () {
                return this.firstName + ' ' + this.lastName
            },
            // setter
            set: function (newValue) {
                var names = newValue.split(' ')
                this.firstName = names[0]
                this.lastName = names[names.length - 1]
            }
        }
    }
    ```
