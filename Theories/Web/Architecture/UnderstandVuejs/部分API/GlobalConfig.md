# Global Config

`Vue.config` is an object containing Vue’s global configurations. You can modify
its properties listed below before bootstrapping your application.


## `silent`
```js
Vue.config.silent = true

const vm = new Vue({
    data: 22, // 不会触发 Vue warn
});
```
