# 组件单元测试

## 最基本的组件测试
```html
<!-- src\components\HelloWorld.vue -->

<template>
    <div class="hello">
        <p>{{count}}</p>
    </div>
</template>

<script>
export default {
    data(){
        return {};
    },
    computed: {
        count(){
            return 0;
        },
    },
};
</script>
```
```js
// test\unit\specs\HelloWorld.spec.js

import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld'; // 引入组件选项

// 生成组件类，之后的测试会用到该类来创建组件实例
const Constructor = Vue.extend(HelloWorld);

describe('HelloWorld.vue', () => {
    it('data option should be a function', () => {
        // 测试组件选项的 data 类型
        expect(typeof HelloWorld.data).to.equal('function');
    });

    it('should render correct contents', () => {
        // 创建组件实例并挂载
        const vm = new Constructor().$mount();
        // 期望 textContent 为 '0'
        expect(vm.$el.textContent).to.equal('0');
    })
});
```


## 测试依赖 Vuex 的组件
1. 假设上面的组件的计算属性`count`是从 Vuex 获取的
    ```js
    count(){
        return this.$store.state.count;
    },
    ```
2. 现在如果还直接`npm run unit`进行测试的话就会看到第二条测试没用通过，报错
`[Vue warn]: Error in render: "TypeError: undefined is not an object (evaluating 'this.$store.state')"`。
3. 因为在其他不变的情况下，这个实例里并没有被注入 store，所以`this.$store`就是不存在的
。需要给该测试组件注入 store。
4. `descript()`不用变，只需要在上面引入 store，并且注入到组件类中即可
    ```js
    import Vue from 'vue';
    import store from '@/store';
    import HelloWorld from '@/components/HelloWorld';

    const Constructor = Vue.extend({
        ...HelloWorld,
        store,
    });
    ```
