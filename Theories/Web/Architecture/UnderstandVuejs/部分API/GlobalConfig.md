# Global Config

`Vue.config` is an object containing Vue’s global configurations. You can modify
its properties listed below before bootstrapping your application.


## `silent`
```js
Vue.config.silent = true; // 取消 Vue 所有的日志与警告。

const vm = new Vue({
    data: 22, // 不会触发 Vue warn
});
```
