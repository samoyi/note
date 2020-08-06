# 跨组件的自定义confirm


<!-- TOC -->

- [跨组件的自定义confirm](#跨组件的自定义confirm)
    - [需求](#需求)
    - [解决](#解决)

<!-- /TOC -->


## 需求
1. 在 A 组件点击一个按钮，进入事件处理函数 `fn`。
2. `fn` 内部可能会触发 B 组件显示确认弹窗。如果显示，则 `fn` await，等待用户确认。
3. 在用户点击确定后，弹窗关闭，`fn` await 到正向结果，继续后面的逻辑；或者用户点击了取消，`fn` await 到负向结果，函数返回。


## 解决
1. 阻断式的确认使用 promise 来实现，这里有些麻烦的是，`new Promise()` 的地方和 `resolve()` 的地方不在同一个组件。
2. 所以需要在 A 组件中创建 promise 之后，把 `resolve` 函数传递给 B 组件。
    ```js
    const A = {
        async getConfirm () {
            let res = await new Promise(( resolve ) => {
                B.getResolveFn( resolve );
            });
            
            if ( res ) {
                console.log( '收到确认' );
            }
            else {
                console.log( '收到取消' );
            }
        }
    };

    const B = {
        resolveFn: null,

        getResolveFn ( fn ) {
            this.resolveFn = fn;
            this.customConfirm();
        },

        customConfirm () {
            let bool = Math.random() > 0.5;
            console.log( '模拟自定义确认弹窗。用户选择：', bool );
            setTimeout(() => {
                this.resolveFn( bool );
            }, 2000);
        },
    };

    A.getConfirm();
    ```
3. 或者直接把创建 promise 和 resolve 的工作都交给第三方 C，A 调用第三方的一个方法创建 promise 并保存在 C，resolve 函数也保存在 C，B 调用 C 的 resolve 解析结果
    ```js
    const A = {
        async getConfirm () {
            let res = await C.getPromise();
            if ( res ) {
                console.log( '收到确认' );
            }
            else {
                console.log( '收到取消' );
            }
        }
    };

    const B = {
        customConfirm () {
            let bool = Math.random() > 0.5;
            console.log( '模拟自定义确认弹窗。用户选择：', bool );
            setTimeout(() => {
                C.resolvePromise( bool );
            }, 2000);
        },
    };

    const C = {
        promise: null,
        resolveFn: null,

        getPromise () {
            this.promise = new Promise( (resolve) => {
                this.resolveFn = resolve;
            });
            B.customConfirm();
            return this.promise;
        },

        resolvePromise ( bool ) {
            this.resolveFn( bool );
        },
    }


    A.getConfirm();
    ```
4. 两种方法都有着不同的耦合。前者是两个对象直接的耦合，后者是两个对象和公共的第三方耦合。
5. 在这个例子中，第二个方法有个明显的问题，就是作为公共的第三方，居然在内部引用了对象 B。在实际中并不一定会这么强的耦合，比如实际中 C 可能是 Vuex 的 store，在创建 promise 的时候就会设置某个状态为 `true`，而 B 中会根据这个状态响应式的显示自定义确认弹窗
    ```js
    // store
    const C = {
        state: {
            // 省略其他属性
            bHasPromise: false,
        },

        mutations: {
            getPromise (state) {
                // 省略其他代码
                state.bHasPromise = true;
            },

            // 省略其他 mutation
        },
    };
    ```
    ```html
    // B.vue
    <CustomConrim v-show="$store.state.C.bHasPromise" />
    ```
