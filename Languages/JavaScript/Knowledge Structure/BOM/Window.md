
# window
* BOM的核心对象是window，它表示浏览器的一个实例。
* window对象具有双重角色，它既是通过JavaScript访问浏览器窗口的一个接口，又是ECMAScript规定的Global对象。

***
## The Global Scope
* Despite global variables becoming properties of the  window object, there is a slight difference between defi ning a global variable and defi ning a property directly on  window : global variables cannot be removed using the  delete operator, while properties defi ned directly on window can.   

    全局变量的`configurable`值为`false`，而`window`属性的`configurable`值为`true`
    ```
    window.name = 33;
    var age = 22;

    console.log( window.name ); // 33
    console.log( window.age ); // 22

    delete window.name;
    delete window.age; // Uncaught TypeError: Cannot delete property 'age' of #<Window>
    ```

* 访问未声明的变量会出错，但访问为定义的window属性并不会
```
console.log( window.xyz ); // undefined
```

***
## Window Relationships and Frames
1. If a page contains frames, each frame has its own `window` object and is stored in the `frames` collection.
2. You would probably use the `top` object instead of `window` to refer to these frames. The top object always points to the very top (outermost) frame, which is the browser window itself. This ensures that you are pointing to the correct frame from which to access the others.  Any code written within a frame that references the window object is pointing to that frame’s unique instance rather than the topmost one.
3. Another `window` object is called `parent`. The `parent` object always points to the current frame’s immediate parent frame.
4. There is one final `window` object, called `self`, which always points to window. The two can, in fact, be used interchangeably.
5. Whenever frames are used, multiple Global objects exist in the browser. Global variables defined in each frame are defined to be properties of that frame’s window object. Since each `window` object contains the native type constructors, each frame has its own version of the constructors, which are not equal. For example, `top.Object` is not equal to `top.frames[0].Object`, which affects the use of `instanceof` when objects are passed across frames.

***
## Timer
### `setTimeout()`的实际情况
The second argument, the number of milliseconds to wait, is not necessarily when the specified code will execute. JavaScript is single-threaded and, as such, can execute only one piece of code at a time. To manage execution, there is a queue of JavaScript tasks to execute. The tasks are executed in the order in which they were added to the queue. The second argument of `setTimeout()` tells the JavaScript engine to add this task onto the queue after a set number of milliseconds. If the queue is empty, then that code is executed immediately; if the queue is not empty, the code must wait its turn.

### 使用`setTimeout()` 替代 `setInterval()`
True intervals are rarely used in production environments because the time between the end of one interval and the beginning of the next is not necessarily guaranteed, and some intervals may be skipped. Using timeouts  ensures that can’t happen. Generally speaking, it’s best to avoid intervals.
### 更多的参数
如果使用具名函数，则在delay参数之后可以传入若干的参数作为该具名函数的参数
```
function foo(m, n){
    console.log( m+n );
}
setTimeout(foo, 2000, 22, 33); // 55
```
### `this`
* 一个注意点是，作为`window`对象的方法，这两个方法的回调函数内部的`this`也默认指向`window`对象。但如果回调函数是箭头方式定义的，则其“内部`this`”并不指向`window`对象，而是指向与window.setTimeout相同环境的作用域对象
```
var obj = {
    foo: function(){
        window.setTimeout(()=>{
            console.log( this.name );
        }, 50);
    },
    name: 33
};
obj.foo();// 33
```
这里的“内部`this`”加了引号，是因为箭头函数内部没有`this`，它用的是外部的`this`。如果内部有`this`，这个`this`就会指向`setTimeout`方法的对象，也就是`window`对象。


***
## System Dialogs
* `confirm()`点击取消或关闭时返回的是`false`，`prompt()`点击取消或关闭时返回的是`null`
* `window.print()`：Starting with Chrome 46.0 this method is blocked inside an `<iframe>` unless its sandbox attribute has the value allow-modals.
* `Window.find()`可以查找页面文本。但因为是非标准方法且存在bug，所以不应该使用。
*


***
## 未整理内容，直接看《Professional JavaScript for Web Developers》第八章
* Window Position
* Window Size
* Navigating and Opening Windows
