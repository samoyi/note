# Hot Reloading

不懂。按照文档上的例子，可以监听到模块的修改并获得新模块，但是在通过`store.hotUpdate`
更新时页面并不会变
```js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import hello from './hello'


const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'producton',
    modules: {
        hello,
    },
});


if (module.hot) {
    // 使 action 和 mutation 成为可热重载模块
    module.hot.accept(['./hello'], () => {
        // 获取更新后的模块
        // 因为 babel 6 的模块编译格式问题，这里需要加上 `.default`
        const newModuleA = require('./hello').default
        console.log(newModuleA); // 可以获得更新后的模块
        // 加载新模块
        store.hotUpdate({
            modules: {
                hello: newModuleA
            }
        })
    })
}

export default store
```
