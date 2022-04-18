# window


<!-- TOC -->

- [window](#window)
    - [The Global Scope](#the-global-scope)
    - [Window Relationships and Frames](#window-relationships-and-frames)
        - [Pros & Cons of using frames](#pros--cons-of-using-frames)
    - [Timer](#timer)
        - [使用 `window.setTimeout()` 替代 `window.setInterval()`](#使用-windowsettimeout-替代-windowsetinterval)
        - [setInterval 的几个缺点](#setinterval-的几个缺点)
            - [`setInterval` 无视代码错误](#setinterval-无视代码错误)
            - [`setInterval` 无视延迟](#setinterval-无视延迟)
            - [`setInterval` 无法保证每一个 interval 都会执行回调](#setinterval-无法保证每一个-interval-都会执行回调)
        - [更多的参数](#更多的参数)
        - [使用 `setTimout` 模拟 `setInterval`](#使用-settimout-模拟-setinterval)
        - [`this` 只是省略惯了 `window` 就忘了是全局方法调用而已](#this-只是省略惯了-window-就忘了是全局方法调用而已)
        - [Minimum Delay and Maximum Delay](#minimum-delay-and-maximum-delay)
        - [参数的迷惑性](#参数的迷惑性)
        - [返回值的问题](#返回值的问题)
    - [URI-Encoding Methods](#uri-encoding-methods)
        - [`encodeURI()` 和 `encodeURIComponent()`](#encodeuri-和-encodeuricomponent)
        - [`encodeURI()` 和 `encodeURIComponent()` 的区别](#encodeuri-和-encodeuricomponent-的区别)
        - [`encodeURIComponent()` 和 `decodeURIComponent()` 对非字符串值的处理](#encodeuricomponent-和-decodeuricomponent-对非字符串值的处理)
            - [`encodeURIComponent`](#encodeuricomponent)
            - [`decodeURIComponent`](#decodeuricomponent)
    - [System Dialogs](#system-dialogs)
    - [未整理内容，直接看《Professional JavaScript for Web Developers》第八章](#未整理内容直接看professional-javascript-for-web-developers第八章)

<!-- /TOC -->


* `window` 对象具有双重角色，它既是通过 JavaScript 访问浏览器窗口的一个接口，又是 ECMAScript 规定的 Global 对象。


## The Global Scope
Despite global variables becoming properties of the `window` object, there is a slight difference between defining a global variable and defining a property directly on `window`:
* global variables cannot be removed using the `delete` operator, while properties defined directly on `window` can.  

    Delete global variables:
    ```js
    // 'use strict';

    var age = 22;

    console.log(age); // 22
    console.log(window.age); // 22

    // 静默失败。严格模式下直接报错：SyntaxError: Delete of an unqualified
    // identifier in strict mode.
    delete age;

    console.log(age); // 22
    console.log(window.age); // 22

    delete window.age;

    console.log(age); // 22
    console.log(window.age); // 22
    ```

    Delete window properties:
    ```js
    // 'use strict';

    window.age = 22;

    console.log(age); // 22
    console.log(window.age); // 22

    // 因为是 window 属性，所以会删除成功
    // 但形式上是删除变量而不是属性，所以在严格模式下会报错：SyntaxError: Delete of an
    // unqualified identifier in strict mode.
    delete age;

    console.log(typeof age); // 'undefined'
    console.log(window.age); // undefined
    ```

    应该是和它们的 `configurable` 不同有关：
    ```js
    window.name = 33;
    var age = 22;

    console.log(Object.getOwnPropertyDescriptor(window, 'name').configurable); // true
    console.log(Object.getOwnPropertyDescriptor(window, 'age').configurable); // false
    ```

* 访问未声明的变量会出错，但访问未定义的 `window` 属性并不会
    ```js
    console.log(window.undefinedVar); // undefined
    console.log(undefinedVar); // ReferenceError: undefinedVar is not defined
    ```


## Window Relationships and Frames
1. If a page contains frames, each frame has its own `window` object and is stored in the `frames` collection.
2. You would probably use the `top` object instead of `window` to refer to these frames. The `top` object always points to the very top (outermost) frame, which is the browser window itself. This ensures that you are pointing to the correct
frame from which to access the others. Any code written within a frame that references the `window` object is pointing to that frame’s unique instance rather than the topmost one.
3. Another `window` object is called `parent`. The `parent` object always points to the current frame’s immediate parent frame.
4. There is one final `window` object, called `self`, which always points to `window`. The two can, in fact, be used interchangeably.
5. Whenever frames are used, multiple Global objects exist in the browser. Global variables defined in each frame are defined to be properties of that frame’s `window` object. Since each `window` object contains the native type constructors, each frame has its own version of the constructors, which are not equal. For example, `top.Object` is not equal to `top.frames[0].Object`, which affects the use of `instanceof` when objects are passed across frames.

### Pros & Cons of using frames


## Timer
### 使用 `window.setTimeout()` 替代 `window.setInterval()`
True intervals are rarely used in production environments because the time between the end of one interval and the beginning of the next is not necessarily guaranteed, and some intervals may be skipped. Using timeouts ensures that can’t happen. Generally speaking, it’s best to avoid intervals.

### setInterval 的几个缺点
#### `setInterval` 无视代码错误
1. 使用 `setInterval`    
    ```js
    // 一直报错，一直重复
    setInterval(()=>{
        console.log(hehe);
        console.log(666); // 虽然会中断当前执行环境之后的代码执行
    }, 1111);
    ```
2. 使用 `setTimeout`
   ```js
    // 一旦报错，就会停止
    let obj = {
        name: '33',
    };
    function foo () {
        console.log(obj.name);
        setTimeout(()=>{
            foo();
        }, 1111);
    }
    foo();

    setTimeout(()=>{
        obj = null;
    }, 3333);
    ```
3. 原因见 `Theories/Languages/JavaScript/UnderstandJS/Client-SideJavaScriptThreadingModel/ConcurrencyModel&EventLoop.md` 中的异常处理。`setInterval` 调用后，负责定期循环的是浏览器，不受当前执行环境影响；而使用 `setTimeout` 模拟，每次都要在当前执行环境手动调用 `setTimeout`，因此会中断。

#### `setInterval` 无视延迟
1. 比如希望两秒钟轮询一次服务器，期望的情况肯定是请求一次获得结果后再请求另一次。
2. 但如果请求延迟，两秒钟还没有得到响应，那 `setInterval` 并不会等待响应，而是继续发起下一次请求
    ```js
    let n = 0;

    // 2s 中请求一次服务器
    setInterval(()=>{
        n++;
    }, 2000);

    // 服务器某个时间开始由于延迟，2.5s 才能处理一个请求
    setInterval(()=>{
        n--;
        console.log('未及时处理的响应：' + n);
    }, 2500);
    ```
3. 使用 `setTimeout`
    ```js
    let n = 0;
    function request () {
        n++;
        setTimeout(()=>{
            n--;
            console.log('未及时处理的响应：' + n);
            // 等待响应回来后，再进行计时
            setTimeout(()=>{
                request();
            }, 2000);
        }, 2500);
    }
    request();
    ```

#### `setInterval` 无法保证每一个 interval 都会执行回调
据说当回调耗时很长时，interval 就有跳过的可能。不懂，没试出来。


### 更多的参数
`delay` 参数之后可以传入若干的参数作为该回调函数的参数：
```js
setTimeout(function(a, b){
    console.log(a * b); // 15
}, 1000, 3, 5);
```

### 使用 `setTimout` 模拟 `setInterval` 
1. 最初是这样实现
    ```js
    function my_setInterval (cb, ms) {
        let timer = setTimeout(function () {
            if (timer) {
                cb();
                timer = my_setInterval(cb, ms)
            }
        }, ms);
        return timer;
    }


    let timer = my_setInterval(function () {
        console.log(22);
    }, 1111)

    setTimeout(() => {
        timer = null;
    }, 5555)
    ```
2. 首先，这样嵌套调用，每一个 `timer` 都是新的，而返回的只有第一个。
3. 其次，让返回的 `timer` 等于 `null` 并没有用，只是让外部声明的 `timer` 指向了空而已，并不会影响 `my_setInterval` 内部的 `timer`。因为返回的是指针的副本，而不是指针的引用。
4. 所以不能每次嵌套调用都创建一个 `timer`，然后需要在外部可以控制函数内部的那个变量。
5. 针对第一点就需要在嵌套调用外面声明一个变量，但是又不想声明到 `my_setInterval` 外面，所以在 `my_setInterval` 在创建一个用来嵌套调用的函数。
6. 针对第二点，典型的闭包应用。
7. 实现如下
    ```js
    function my_setInterval (cb, ms, ...cbArgs) {
        let status = true;

        function run () {
            setTimeout(()=>{
                if (status) {
                    cb(...cbArgs);
                    run();
                }
            }, ms);
        }

        run();

        return function clearInterval () {
            status = false;
        }
    }
    ```

### `this` 只是省略惯了 `window` 就忘了是全局方法调用而已
Code executed by `window.setTimeout()` is called from an execution context separate from the function from which `window.setTimeout` was called. The default this value of a `window.setTimeout` callback will still be the `window` object, and not `undefined`, even in strict mode.

### Minimum Delay and Maximum Delay
* 4ms 是 delay 的最短时间，即使设置了小于 4ms 的 delay，实际执行时也不会低于这个最低值。
* Inactive tabs throttled to >=1000ms. To reduce the load (and associated battery usage) from background tabs, timeouts are throttled to firing no more often than once per second (1000ms) in inactive tabs.
* Browsers store the delay as a 32-bit signed integer internally. This causes an integer overflow when using delays larger than 2147483647 (about 24.8 days), resulting in the timeout being executed immediately.

### 参数的迷惑性
1. 下面两个 `setTimeout`，`22` 和 `33`都是立刻输出的
    ```js
    setTimeout((function() { console.log(22);})(), 3000);
    setTimeout(console.log(33), 3000);
    ```
2. 因为这里的 `(function() { console.log(22);})()` 和 `console.log(33)` 并不是参数本身，而是参数的求值表达式，或者说是传参表达式。
3. 虽然参数本身是在三秒钟后异步执行，但传参行为是同步的，立刻执行的。
4. 这两个 `setTimeout` 的参数实际上都是 `undefined`。
5. 再看下面两个例子
    ```js
    setTimeout(a, 3000);
    ```
    ```js
    setTimeout('a', 3000);
    ```
6. 第一个立刻就会报错，因为传参的时候，传参表达式 `a` 未定义。第二个会在三秒后报错，因为传参表达式是个字符串，没错，但编译成可执行代码后，也变成了未定义的变量 `a`，三秒钟后执行的时候就会报错。

### 返回值的问题
1. 虽然经常用到返回值来取消定时器，但是之前还没有看过返回值到底是什么值。
2. 根据 MDN 说的，返回值是一个正整数。实测当然也是。
3. 这个返回值是当前定时器的一个 ID，同一个全局对象（window 或 worker）里，保持一个唯一的 ID 池。但不同的全局对象有各自独立的 ID 池。
4. 每次调用 `setTimeout` 或 `setInterval` 时，会返回一个递增的正整数 ID。这两个方法共用同一个 ID 池。
5. 有趣的是，第一次定时器函数返回值不一定是 `1`，而且比如刷新页面时，也不保证每次的初始返回值都是一样
    ```js
    let j = setTimeout(()=>{console.log(666)});
    let k = setInterval(()=>{});
    let m = setTimeout(()=>{});
    let n = setInterval(()=>{});
    console.log(j, k, m, n); // 2 3 4 5
    clearTimeout(2); // 取消了第一个 setTimeout 的回调
    ```
    因为两个方法通用同一个 ID 池，所以都会加一；我这里就是从 `2` 开始的，网上有人一开始就是一千多，而且每次刷新还都不一样。
6. 规范里关于返回值这块说了很多也没看懂。网上也没有明确说到更详细的返回值规则的，还有人说规范里就没说详细规则。


## URI-Encoding Methods
### `encodeURI()` 和 `encodeURIComponent()`
1. 需要转码的字符会被替换为十六进制转义序列。
2. 由于 `encodeURI()` 是用于编码转换完整的 URI，所以不会转义 URI 中的特殊符号 `;/?:@&=+$,#`

### `encodeURI()` 和 `encodeURIComponent()` 的区别
1. 先看一下正确的使用方法
    ```js
    const uri1 = 'http://www.a.com?name=有道';
    const uri2 = 'http://www.b.com?url=http://www.a.com?name=有道';
    // 如果希望编码上述两个 URI 并输出浏览器可用的 URI，应该按照下面的方式

    console.log(encodeURI(uri1));
    // http://www.a.com?name=%E6%9C%89%E9%81%93

    console.log('http://www.b.com?url=' + encodeURIComponent(uri1));
    // http://www.b.com?url=http%3A%2F%2Fwww.a.com%3Fname%3D%E6%9C%89%E9%81%93
    ```
2. `encodeURI` 是用于编码转换完整的 URI，它的输出是直接可以用于浏览器等使用的，所以不会转码 URI 中本身的符号。如果你用 `encodeURIComponent` 转换 `uri1`，它就会变成不合理的 URI 格式。
3. `encodeURIComponent` 是用于转码 URI 组件的，如上面例子中，是用来转码查询参数 `url` 的值的，这时如果还使用 `encodeURI` 转码，结果中就会保留 URI 中的符号，而这些符号并不是给浏览器用的。这样就和本身 `http://www.b.com` 中本身给浏览器用的符号发生了冲突。

### `encodeURIComponent()` 和 `decodeURIComponent()` 对非字符串值的处理
#### `encodeURIComponent`
```js
console.log(encodeURIComponent(1))
console.log(typeof encodeURIComponent(1))
console.log(encodeURIComponent(0))
console.log(typeof encodeURIComponent(0))
console.log(encodeURIComponent(true))
console.log(typeof encodeURIComponent(true))
console.log(encodeURIComponent(false))
console.log(typeof encodeURIComponent(false))
console.log(encodeURIComponent(NaN))
console.log(typeof encodeURIComponent(NaN))
console.log(encodeURIComponent(null))
console.log(typeof encodeURIComponent(null))
console.log(encodeURIComponent(undefined))
console.log(typeof encodeURIComponent(undefined))
console.log(encodeURIComponent([]))
console.log(typeof encodeURIComponent([]))
console.log(encodeURIComponent([1]))
console.log(typeof encodeURIComponent([1]))
console.log(encodeURIComponent({}))
console.log(typeof encodeURIComponent({}))
console.log(encodeURIComponent({age: 22}))
console.log(typeof encodeURIComponent({age: 22}))

// 1
// string
// 0
// string
// true
// string
// false
// string
// NaN
// string
// null
// string
// undefined
// string
//
// string
// 1
// string
// %5Bobject%20Object%5D
// string
// %5Bobject%20Object%5D
// string
```

#### `decodeURIComponent`
```js
console.log(decodeURIComponent(1))
console.log(typeof decodeURIComponent(1))
console.log(decodeURIComponent(0))
console.log(typeof decodeURIComponent(0))
console.log(decodeURIComponent(true))
console.log(typeof decodeURIComponent(true))
console.log(decodeURIComponent(false))
console.log(typeof decodeURIComponent(false))
console.log(decodeURIComponent(NaN))
console.log(typeof decodeURIComponent(NaN))
console.log(decodeURIComponent(null))
console.log(typeof decodeURIComponent(null))
console.log(decodeURIComponent(undefined))
console.log(typeof decodeURIComponent(undefined))
console.log(decodeURIComponent([]))
console.log(typeof decodeURIComponent([]))
console.log(decodeURIComponent({}))
console.log(typeof decodeURIComponent({}))
console.log(decodeURIComponent({}))
console.log(typeof decodeURIComponent({}))
console.log(decodeURIComponent({age: 22}))
console.log(typeof decodeURIComponent({age: 22}))

// 1
// string
// 0
// string
// true
// string
// false
// string
// NaN
// string
// null
// string
// undefined
// string
//
// string
// [object Object]
// string
// [object Object]
// string
// [object Object]
// string
```


## System Dialogs
* `confirm()` 点击取消或关闭时返回的是 `false`，`prompt()` 点击取消或关闭时返回的是 `null`
* `window.print()`：Starting with Chrome 46.0 this method is blocked inside an `<iframe>` unless its sandbox attribute has the value allow-modals.
* `Window.find()` 可以查找页面文本。但因为是非标准方法且存在 bug，所以不应该使用。


## 未整理内容，直接看《Professional JavaScript for Web Developers》第八章
* Window Position
* Window Size
* Navigating and Opening Windows
