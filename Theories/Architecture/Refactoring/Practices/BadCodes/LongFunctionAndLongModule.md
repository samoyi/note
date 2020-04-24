# Long Function and Long Module


## 原则
1. 意图和实现分离——让其他人看一个函数或一个模块里的一小段代码时，知道它做了什么功能，而不需要知道它是怎么做的。如果要知道怎么做的，就去找相应的函数和模块。
2. 长短并不是绝对的，如果一个函数读起来比较费劲，那就可以考虑拆分了。以这个标准来说，一个函数常常不超过十行。


## 场景
### 过长的入口文件
1. 比如一个 Vue 项目的入口文件 `main.js`，除了会引入基本的模块和实例化 vue 根实例以外，可能还会需要加入其他一些功能。比如登陆校验、引入并注册第三方组件等等。
2. 之前的一个 `main.js` 中，出现了下面 vantUI 的引用和配置
    ```js
    import { Slider  } from 'vant';
    import { DropdownMenu, DropdownItem } from 'vant';
    import { Button } from 'vant';
    import { List } from 'vant';
    import { Search } from 'vant';
    import { Icon } from 'vant';
    import { Tab, Tabs } from 'vant';
    import { Loading } from 'vant';
    import { Checkbox, CheckboxGroup } from 'vant';
    import 'vant/lib/index.css';

    export default {
        use (Vue) {
            Vue.use(Slider);
            Vue.use(Button);
            Vue.use(DropdownMenu);
            Vue.use(DropdownItem);
            Vue.use(List);
            Vue.use(Search);
            Vue.use(Icon);
            Vue.use(Tab);
            Vue.use(Tabs);
            Vue.use(Loading);
            Vue.use(Checkbox);
            Vue.use(CheckboxGroup);
        }
    }
    ```
3. 确实是要在 `main.js` 中引入，但不用把具体的实现都写到这里。这样如果在引用其他第三方插件，还要在 `main.js` 里再写出来完整的实现。
4. 重构的方法是新建一个目录统一配置所有的第三方插件，只在 `main.js` 提供一个简单的引用方法，指定要启用哪些插件
    ```js
    import usePlugins from '@/plugins'
    usePlugins(Vue, ['vant', 'vConsole']);
    ```
5. `@/plugins/index.js` 会读取 `usePlugins` 的第二个参数，然后加载 `@/plugins/` 目录中对应的插件并进行使用。

### 提取复杂的成功和失败回调逻辑
1. 在处理一个请求时，如果对于其成功和（或）失败的处理逻辑很简单，那可以直接写在请求方法里。
2. 但如果有些复杂，都写在方法里就显得乱了，不如提取出独立的函数。

### 分离全局导航守卫
1. 经常会根据路由来做一些判断，因此可能会在 `afterEach` 之类的导航守卫函数里写各种逻辑，稍微一多就乱了。
2. 应该把所有的处理逻辑都提取到一个或多个（根据守卫类型 `afterEach`、`beforeEach` 等）模块中
    ```js
    // guards.js

    function setTitle (to, from) {
        document.title = to.meta.pageTitle;
    }

    function setGlobalClassName (to, from) {
        // ...
    }

    function setGlobalVisible (to, from) {
        // ...
    }

    export function afterEachGuard (to, from) {
        setTitle (to, from);
        setGlobalClassName(to, from);
        setGlobalVisible(to, from);
    }
    export function beforeEachGuard (to, from) {
        // ...
    }
    ```
3. 然后在路由核心模块中引用并插入
    ```js
    // router.js
    import {afterEachGuard} from './guards'

    router.afterEach((to, from, next) => {
        afterEachGuard(to, from);
    });
    ```
4. 甚至你还可以吧 `router.afterEach` 之类的函数也移进 `guards.js` 中，然后只暴露一个安装的方法
    ```js
    // guards.js

    // ...

    export function installGuards () {
        router.beforeEach((to, from, next) => {
            beforeEachGuard(to, from);
            next()
        });
        router.afterEach((to, from) => {
            afterEachGuard(to, from);
        })
    }
    ```
5. 在路由核心模块中只需要执行安装方法就行了
    ```js
    import {installGuards} from './guards'
    installGuards();
    ```

### 如果一个函数名里面有 `And` 之类的词，那就有可能是兼容了两个功能


## 过度优化





















































## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
