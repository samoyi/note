# Re-render a component


## Terrible way: the `v-if` hack
1. 示例
    ```html
    <template>
        <MyComponent v-if="renderComponent" />
    </template>
    ```
    ```js
    import { nextTick, ref } from 'vue';
    const renderComponent = ref(true);

    const forceRerender = async () => {
    // Remove MyComponent from the DOM
    renderComponent.value = false;

        // Wait for the change to get flushed to the DOM
        await nextTick();

        // Add the component back in
    renderComponent.value = true;
    };
    ```
2. 看到说这个方法不好的原因是它会完全的销毁并重建该组件，但我测试的时候发现 `created` 钩子并没有被重复调用。不懂


## Better way: You can use `forceUpdate`


## The best way: The Key-Changing Technique
1. 示例
    ```html
    <template>
        <MyComponent :key="componentKey" />
    </template>
    ```
    ```js
    import { ref } from 'vue';
    const componentKey = ref(0);

    const forceRerender = () => {
        componentKey.value += 1;
    };
    ```
2. 并没有看到这个比 `forceUpdate` 好在哪里，钩子函数的调用情况也是一样的。不懂
    

## References
* [The correct way to force Vue to re-render a component](https://michaelnthiessen.com/force-re-render/)