# window

* `window`对象具有双重角色，它既是通过 JavaScript 访问浏览器窗口的一个接口，又是
ECMAScript 规定的 Global 对象。


## The Global Scope
Despite global variables becoming properties of the `window` object, there is
a slight difference between defining a global variable and defining a property
directly on `window`:
* global variables cannot be removed using the `delete` operator, while
properties defined directly on `window` can.  

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

* 访问未声明的变量会出错，但访问未定义的`window`属性并不会
    ```js
    console.log(window.undefinedVar); // undefined
    console.log(undefinedVar); // ReferenceError: undefinedVar is not defined
    ```


## Window Relationships and Frames
1. If a page contains frames, each frame has its own `window` object and is
stored in the `frames` collection.
2. You would probably use the `top` object instead of `window` to refer to these
frames. The `top` object always points to the very top (outermost) frame, which
is the browser window itself. This ensures that you are pointing to the correct
frame from which to access the others. Any code written within a frame that
references the `window` object is pointing to that frame’s unique instance
rather than the topmost one.
3. Another `window` object is called `parent`. The `parent` object always points
to the current frame’s immediate parent frame.
4. There is one final `window` object, called `self`, which always points to
`window`. The two can, in fact, be used interchangeably.
5. Whenever frames are used, multiple Global objects exist in the browser.
Global variables defined in each frame are defined to be properties of that
frame’s `window` object. Since each `window` object contains the native type
constructors, each frame has its own version of the constructors, which are not
equal. For example, `top.Object` is not equal to `top.frames[0].Object`, which
affects the use of `instanceof` when objects are passed across frames.

### Pros & Cons of using frames


## Timer
### 使用`window.setTimeout()` 替代 `window.setInterval()`
True intervals are rarely used in production environments because the time
between the end of one interval and the beginning of the next is not necessarily
guaranteed, and some intervals may be skipped. Using timeouts ensures that can’t
happen. Generally speaking, it’s best to avoid intervals.

### 更多的参数
`delay` 参数之后可以传入若干的参数作为该回调函数的参数：
```js
setTimeout(function(a, b){
    console.log(a * b); // 15
}, 1000, 3, 5);
```

### `this` 只是省略惯了`window`就忘了是全局方法调用而已
Code executed by `window.setTimeout()` is called from an execution context
separate from the function from which `window.setTimeout` was called. The
default this value of a `window.setTimeout` callback will still be the `window`
object, and not `undefined`, even in strict mode.

### Minimum Delay and Maximum Delay
* 4ms 是 delay 的最短时间，即使设置了小于 4ms 的 delay，实际执行时也不会低于这个最低值。
* Inactive tabs throttled to >=1000ms. To reduce the load (and associated
battery usage) from background tabs, timeouts are throttled to firing no more
often than once per second (1000ms) in inactive tabs.
* Browsers store the delay as a 32-bit signed integer internally. This causes an
integer overflow when using delays larger than 2147483647 (about 24.8 days),
resulting in the timeout being executed immediately.

### 参数的迷惑性
1. 下面两个`setTimeout`，`22`和`33`都是立刻输出的
    ```js
    setTimeout((function() { console.log(22);})(), 3000);
    setTimeout(console.log(33), 3000);
    ```
2. 因为这里的`(function() { console.log(22);})()`和`console.log(33)`并不是参数本身
，而是参数的求值表达式，或者说是传参表达式。
3. 虽然参数本身是在三秒钟后异步执行，但传参行为是同步的，立刻执行的。
3. 这两个`setTimeout`的参数实际上都是`undefined`。
4. 再看下面两个例子
    ```js
    setTimeout(a, 3000);
    ```
    ```js
    setTimeout('a', 3000);
    ```
5. 第一个立刻就会报错，因为传参的时候，传参表达式`a`未定义。第二个会在三秒后报错，因为
传参表达式是个字符串，没错，但变异成可执行代码后，也变成了未定义的变量`a`，三秒钟后执行
的时候就会报错。


## URI-Encoding Methods
### `encodeURI()`和`encodeURIComponent()`
1. 需要转码的字符会被替换为十六进制转义序列。
2. 由于`encodeURI()`是用于编码转换完整的 URI，所以不会转义 URI 中的特殊符号
    `;/?:@&=+$,#`

### `encodeURI()`和`encodeURIComponent()`的区别
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
2. `encodeURI`是用于编码转换完整的 URI，它的输出是直接可以用于浏览器等使用的，所以不会
转码 URI 中本身的符号。如果你用`encodeURIComponent`转换`uri1`，它就会变成不合理的 URI
格式。
3. `encodeURIComponent`是用于转码 URI 组件的，如上面例子中，是用来转码查询参数`url`的
值的，这时如果还使用`encodeURI`转码，结果中就会保留 URI 中的符号，而这些符号并不是给浏
览器用的。这样就和本身`http://www.b.com`中本身给浏览器用的符号发生了冲突。

### `decodeURI()`和`decodeURIComponent()`


## System Dialogs
* `confirm()` 点击取消或关闭时返回的是 `false`，`prompt()` 点击取消或关闭时返回的是
`null`
* `window.print()`：Starting with Chrome 46.0 this method is blocked inside an
`<iframe>` unless its sandbox attribute has the value allow-modals.
* `Window.find()` 可以查找页面文本。但因为是非标准方法且存在 bug，所以不应该使用。


## 未整理内容，直接看《Professional JavaScript for Web Developers》第八章
* Window Position
* Window Size
* Navigating and Opening Windows
