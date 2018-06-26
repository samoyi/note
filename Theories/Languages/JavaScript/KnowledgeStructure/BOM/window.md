# window
* BOM的核心对象是window，它表示浏览器的一个实例。
* window对象具有双重角色，它既是通过JavaScript访问浏览器窗口的一个接口，又是ECMAScript规定的Global对象。


## The Global Scope
Despite global variables becoming properties of the `window` object, there is
a slight difference between defining a global variable and defining a property
directly on `window`:
* global variables cannot be removed using the `delete` operator, while
properties defined directly on window can.  

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

* 访问未声明的变量会出错，但访问为定义的 `window` 属性并不会
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
### 使用`setTimeout()` 替代 `setInterval()`
True intervals are rarely used in production environments because the time
between the end of one interval and the beginning of the next is not necessarily
 guaranteed, and some intervals may be skipped. Using timeouts ensures that
can’t happen. Generally speaking, it’s best to avoid intervals.

### 更多的参数
`delay` 参数之后可以传入若干的参数作为该回调函数的参数：
```js
setTimeout(function(a, b){
    console.log(a * b); // 15
}, 1000, 3, 5);
```

### `this`
Code executed by `setTimeout()` is called from an execution context separate
from the function from which `setTimeout` was called. The default this value of
a `setTimeout` callback will still be the `window` object, and not `undefined`,
even in strict mode.

### Minimum Delay and Maximum Delay
* 4ms 是 delay 的最短时间，即使设置了小于 4ms 的 delay，实际执行时也不会低于这个最低值。
* Inactive tabs throttled to >=1000ms. To reduce the load (and associated
battery usage) from background tabs, timeouts are throttled to firing no more
often than once per second (1000ms) in inactive tabs.
* Browsers store the delay as a 32-bit signed integer internally. This causes an
 integer overflow when using delays larger than 2147483647 (about 24.8 days),
resulting in the timeout being executed immediately.


## System Dialogs
* `confirm()` 点击取消或关闭时返回的是 `false`，`prompt()` 点击取消或关闭时返回的是
`null`
* `window.print()`：Starting with Chrome 46.0 this method is blocked inside an
`<iframe>` unless its sandbox attribute has the value allow-modals.
* `Window.find()` 可以查找页面文本。但因为是非标准方法且存在bug，所以不应该使用。


## 未整理内容，直接看《Professional JavaScript for Web Developers》第八章
* Window Position
* Window Size
* Navigating and Opening Windows
