# Function


<!-- TOC -->

- [Function](#function)
    - [Debouncing and Throttling](#debouncing-and-throttling)
        - [debounce](#debounce)
        - [Throttle](#throttle)
    - [Curring](#curring)
    - [bind](#bind)
    - [References](#references)

<!-- /TOC -->


## Debouncing and Throttling
### debounce
1. 原型
    ```js
    function debounce (fn, ms) {

    }
    ```
2. 逻辑
    1. 返回一个包装后的函数 `debounced`;
    2. 每次调用这个函数后首先 `clearTimeout` 停止之前 `ms` 内可能存在的计时器，然后开始新的延迟为 `ms` 的 `setTimeout` 计时，`ms` 后调用实际的 `fn`（如果没有被下一次调用的 `clearTimeout` 停止的话）。这样就保证了只有在调用 `debounced` 等待 `ms` 才会实际的执行 `fn`。
    3. 返回的 `debounced` 可以接收 `this` 设置，调用 `debounced` 时设置的 `this`，也应该传入实际调用的 `fn` 中。
3. 边界
参数类型

4. 实现
    ```js
    function debounce (fn, ms) {
        // assertArgsType();

        let timer;
        return function (...args) { // 普通函数保证能设置 this
            clearTimeout(timer);
            timer = setTimeout( () => { // 箭头函数保证这里使用词法 this，也就是上面匿名函数的 this
                fn.call(this, ...args);
            }, ms);
        }
    }
    ```

### Throttle
1. 原型
    ```js
    function throttle (fn, ms) {

    }
    ```
2. 逻辑
    1. 返回一个包装后的函数 `throttled`
    2. 每次调用这个函数时，如果没有正在进行的 `setTimeout` 则启动 `setTimeout`，`ms` 再实际的调用 `fn`。
    3. 实际调用 `fn` 之后，要把计时器清空，下一次调用 `throttled` 时会重新计时。
    4. 返回的 `throttled` 可以接收 this 设置，调用 `throttled` 时设置的 `this`，也应该传入实际调用的 `fn` 中。
3. 边界
    * 参数类型
4. 实现
    ```js
    function throttle (fn, ms) {
        // assertArgsType();
        
        let timer;
        return function (...args) {
            if ( !timer ) {
                timer = setTimeout(() => {
                    fn.call(this, ...args);
                    timer = null;
                }, ms);
            }
        }
    }
    ```


## Curring
1. 原型
    ```js
    function curry (fn, ...initArgs) {
        return function inner (...args) {};
    }
    ```
2. 逻辑
    1. `curry` 函数本身可以通过 `initArgs` 接收可选的若干参数作为 `fn` 的初始参数；
    2. `curry` 函数返回一个柯里化的包装函数 `inner` 给用户，用户调用 `inner` 并传参 `args` 后，`inner` 内部会合并初始参数 `initArgs` 和 `args`：
        * 如果参数数量已经到达了 `fn` 需要的参数，则调用 `fn`；
        * 如果还没有达到，则需要继续返回一个函数去接收更多的参数；这个返回的函数在逻辑上其实就是 `inner`，但是如果直接返回 `inner`，就不能带上之前已经有的参数来进行合并；所以应该返回 `curry` 的调用来带上现有的参数；
    3. 为了让用户可以设置 `this`，调用 `fn` 时使用 `apply` 传递用户可能设置在 `inner` 上的 `this`。
3. 边界
    第一个参数类型
4. 实现
    ```js
    function curry (fn, ...initArgs) {
        return function inner (...args) {
            let arr = initArgs.concat(args);

            if (arr.length >= fn.length) {
                fn.apply(this, arr);
            }
            else {
                return curry(fn, ...arr);
            }
        };
    }


    function xyz (x, y, z) {
        console.log(x, y, z);
    }
    let fn0 = curry(xyz);
    let fn1 = curry(xyz, 1);
    let fn2 = curry(xyz, 1, 2);
    let fn3 = curry(xyz, 1, 2, 3);
    let fn4 = curry(xyz, 1, 2, 3, 4);


    fn0();               // 没有输出
    fn0(1, 2);           // 没有输出
    fn0(1, 2, 3);        // 1 2 3
    fn0(1, 2, 3, 4);     // 1 2 3
    fn0(1)(2);           // 没有输出
    fn0(1)(2)(3);        // 1 2 3
    fn0(1, 2)(3, 4);     // 1 2 3
    fn0(1, 2)(3, 4, 5);  // 1 2 3
    fn0(1, 2, 3)(4, 5);  // 先打印 1 2 3 再报错 TypeError: fn0(...) is not a function
    fn0(1)(2)(3)(4);     // 先打印 1 2 3 再报错 TypeError: fn0(...)(...)(...) is not a function 

    fn1(2, 3);           // 1 2 3

    fn2(3);              // 1 2 3

    fn3();               // 1 2 3

    fn3(4);              // 1 2 3

    fn4();               // 1 2 3
    ```


## bind
1. `my_bind` 接收一个原函数 `fn` 和绑定的环境 `ctx`，返回一个函数 `bound`；
2. 普通调用 `bound` 时，内部调动 `fn`，使用 `ctx` 作为 `this`;
3. 作为构造函数调用 `bound` 时，因为要把 `ctx` 作为构造函数的 `this`，所以不能直接 `new fn()`，只能手动实现创造实例：
    1. 以 `fn` 的原型作为原型创建实例对象 `obj`；
    2. 以 `ctx` 作为 `this` 调用函数 `fn`；
    3. 如果 `fn` 没有返回对象，就返回 `obj`。
4. 实现
    ```js
    function my_bind (fn, ctx, ...args) {
        return function (...innerArgs) {
            if (new.target) {
                let obj = Object.create(fn.prototype);
                let re = fn.call(obj, ...innerArgs);
                if (typeof re === "object" && re !== "null" ) {
                    return re;
                }
                else {
                    return obj;
                }
            }
            else {
                return fn.call(ctx, ...args, ...innerArgs);
            }
        };
    }
    ```


## References