# Module Reuse

1. 有时我们可能需要创建一个模块的多个实例，例如：
    * 创建多个 store，他们公用同一个模块
    * 在一个 store 中多次注册同一个模块
2. 如果我们使用一个纯对象来声明模块的状态，那么这个状态对象会通过引用被共享，导致状态对
象被修改时 store 或模块间数据互相污染的问题。实际上这和 Vue 组件内的`data`是同样的问题
。因此解决办法也是相同的——使用一个函数来声明模块状态。
3. 下面两个模块里都有各自的`ageUp`，在实例里 commit 时，两个模块都会调用各自的`ageUp`。
如果是按照注释中的方法来定义`state`，则两个`ageUp`中引用的同一个对象，也就是会连续在一
个对象上修改两次，即`age`每次加2；现在使用函数来定义，每个`ageUp`中引用的不同的对象，只
会在自己引用的对象上加1
    ```js
    // store
    const moduleA = {
        state(){
            return {
                age: 22,
            };
        },
        // state: {
        //     age: 22,
        // },
        mutations: {
            ageUp(state){
                state.age++;
            },
        },
    };

    export const store = new Vuex.Store({
        modules: {
            a: moduleA,
            b: moduleA,
        },
    });
    ```
