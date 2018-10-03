# Strict Mode

1. 在严格模式下，无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误。这能
保证所有的状态变更都能被调试工具跟踪到。
2. 开启严格模式，仅需在创建 store 的时候传入 `strict: true`：
    ```js
    const store = new Vuex.Store({
        // ...
        strict: true
    })
    ```
3. 不要在发布环境下启用严格模式。严格模式会深度监测状态树来检测不合规的状态变更，发布环
境使用严格模式将造成性能损失
    ```js
    const store = new Vuex.Store({
        // ...
        strict: process.env.NODE_ENV !== 'production'
    })
    ```
