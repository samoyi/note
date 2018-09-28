# 插件


1. Vue.js 的插件应该有一个公开方法`install`。这个方法的第一个参数是 Vue 构造器，第二个
参数是一个可选的选项对象：
```js
MyPlugin.install = function (Vue, options) {
    // 1. 添加全局方法或属性
    Vue.myGlobalMethod = function () {
        // 逻辑...
    }

    // 2. 添加全局资源
    Vue.directive('my-directive', {
        bind (el, binding, vnode, oldVnode) {
            // 逻辑...
        }
        ...
    })

    // 3. 注入组件
    Vue.mixin({
        created: function () {
            // 逻辑...
        }
        ...
    })

    // 4. 添加实例方法
    Vue.prototype.$myMethod = function (methodOptions) {
        // 逻辑...
    }
}
```
2. 通过全局方法`Vue.use()`使用插件。它需要在你调用`new Vue()`启动应用之前完成。可以传
第二个可选参数，对应插件`install`方法的第二个参数。
3. Vue.js 官方提供的一些插件 (例如`vue-router`) 在检测到 Vue 是可访问的全局变量时会自
动调用`Vue.use()`。然而在例如 CommonJS 的模块环境中，你应该始终显式地调用`Vue.use()`。
4. 根据上述模板做一个简单的插件，可以周期性的改变字体颜色
    ```js
    // FontColor.js
    let FontColor = {
        install (Vue, options) {

            // 通过 options 设定若干个初始的颜色。有默认值
            Vue.randomFontColors = (options && options.randomFontColors) || ['red', 'green', 'blue'];

            // 该方法可以在之后添加一个颜色
            Vue.addRandomFontColor = function(sColor){
                Vue.randomFontColors.push(sColor);
            };


            // 该指令给节点设定字体颜色，指令的值必须是 curFontColor
            Vue.directive('font-color', function(el, binding) {
                    el.style.color = binding.value;
                }
            )


            Vue.mixin({
                data(){
                    return {
                        // 当前字体颜色
                        curFontColor: 'royalblue',
                    };
                },
                mounted(){
                    setInterval(()=>{
                        // 周期性的改变字体颜色
                        this.$changeRandomFontColor();
                        // 周期可以通过 options 设置，有默认值
                    }, (options && options.interval) || 2000);
                },
            })


            // 一个变换随机色的实例方法
            Vue.prototype.$changeRandomFontColor = function () {
                let len;
                let index;

                do {
                    len = Vue.randomFontColors.length;
                    index = Math.floor(Math.random() * len);
                }
                // 保证随机不重复
                while (this.curFontColor === Vue.randomFontColors[index]);

                this.curFontColor = Vue.randomFontColors[index];
            }
        },
    };
    ```
    ```html
    <div id="components-demo" v-font-color="curFontColor">字符</div>
    <script>
    // Vue.use(FontColor); // 不传 options 的话就使用默认的初始色和变化周期

    Vue.use(FontColor, {
        randomFontColors: ['crimson', 'lime', 'indigo'],
        interval: 500,
    });

    Vue.addRandomFontColor('pink'); // 追加一个颜色

    new Vue({
        el: '#components-demo',
    });
    </script>
