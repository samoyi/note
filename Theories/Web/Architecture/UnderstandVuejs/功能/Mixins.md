# Mixins

## 实现公共 options
```js
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

new Vue({
    el: '#components-demo',
    mixins: [PublicOptions],
    created(){
        this.sayAge(this.age); // 触发输出 22
    },
});
```


## 选项合并规则
* data objects undergo a shallow merge (one property deep), with the component’s
data taking priority in cases of conflicts.
* Hook functions with the same name are merged into an array so that all of them
will be called. Mixin hooks will be called before the component’s own hooks. 大概
的原因是，钩子函数不会像数据属性那样必然冲突，所以可以共存。但 mixin 可能是别人写的，而
我自己的钩子函数是我自己写的，我应该对我自己的实例生命周期有绝对的控制，所以我自己的钩子
函数应该后触发，即便冲突了也可以覆盖 mixin 中同名钩子函数里的操作。
* Options that expect object values, for example `methods`, `components` and
`directives`, will be merged into the same object. The component’s options will
take priority when there are conflicting keys in these objects.
```js
const PublicOptions = {
    data(){
        return {
            profile: {
                age: 33,
                friends: [
                    {
                        name: 'hime',
                        age: 26,
                    },
                ],
            },
        };
    },
    methods: {
        sayProfile(profile){
            console.log(profile);
        },
    },
    mounted(){
        console.log('mixin mounted');
    }
};


new Vue({
    el: '#components-demo',
    mixins: [PublicOptions],
    data: {
        profile: {
            name: '33',
            age: 22, // 覆盖 PublicOptions 的 profile.age
            friends: [ // shallow merge，直接替换 PublicOptions 的 profile.friends
                {
                    name: 'hime',
                    age: 16,
                },
                {
                    name: 'hina',
                    age: 17,
                },
            ],
        }
    },
    methods: {
        sayProfile(profile){ // 覆盖 PublicOptions 中不带 stringify 的 sayProfile
            console.log(JSON.stringify(profile, null, 4));
        },
    },
    created(){
        this.sayProfile(this.profile);
        // {
        //     "name": "33",
        //     "age": 22,
        //     "friends": [
        //         {
        //             "name": "hime",
        //             "age": 16
        //         },
        //         {
        //             "name": "hina",
        //             "age": 17
        //         }
        //     ]
        // }
    },
    mounted(){
        // 先输出"mixin mounted"，后输出"own mounted"
        console.log('own mounted');
    }
});
```


## Global Mixin
1. You can also apply a mixin globally. Use with caution! Once you apply a mixin
globally, it will affect every Vue instance created afterwards. When used
properly, this can be used to inject processing logic for custom options
```js
new Vue({
    greeting: '不会输出',
});

Vue.mixin({
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
2. Use global mixins sparsely and carefully, because it affects every single Vue
instance created, including third party components. In most cases, you should
only use it for custom option handling like demonstrated in the example above.
It’s also a good idea to ship them as Plugins to avoid duplicate application.



## 使用方法
直接看[文档](https://vuejs.org/v2/guide/mixins.html)
