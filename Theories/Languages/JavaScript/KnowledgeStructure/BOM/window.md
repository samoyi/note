
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
1. The second argument, the number of milliseconds to wait, is not necessarily when the specified code will execute.
2. JavaScript is single-threaded and, as such, can execute only one piece of code at a time.
3. To manage execution, there is a queue of JavaScript tasks to execute. The tasks are executed in the order in which they were added to the queue.
4. The second argument of `setTimeout()` tells the JavaScript engine to add this task onto the queue after a set number of milliseconds.
5. If the queue is empty, then that code is executed immediately; if the queue is not empty, the code must wait its turn.

    ```
    <body>
        <div id="first">
            <input type="text" />
            <span></span>
        </div>
        <div id="second">
            <input type="text" />
            <span></span>
        </div>
    </body>
    <script>
    "use strict";

    document.querySelector('#first input').onkeydown = function(ev) {
        document.querySelector('#first span').innerHTML = this.value;
        console.log( this.value );
    };

    document.querySelector('#second input').onkeydown = function() {
        let self = this;
        setTimeout(function() {
            document.querySelector('#second span').innerHTML = self.value;
        }, 0);
    };
    ```
    1. 在第一个输入框中输入字符，只有再次输入的时候，才会更新显示上一次输入之后的内容；但第二个输入框就是输入的之后就立刻更新显示。
    2. 在第一个显示输入代码中，通过`console.log`每次输出的也是上一次输入之后的内容，证明在事件处理函数的执行之前，输入框的`value`并没有改变，而事件处理函数执行过程中占据着唯一的线程，输入框的`value`更新也不会改变，而显示内容正好就是在事件处理函数执行过程中，所以此时不可能显示当次输入的内容。
    3. 在第二个显示输入代码中，将显示的代码放到了`setTimeout`中。所以，现在占据线程的任务就不再是“显示输入”而是“将显示输入的任务排到线程队列里面”。现在立即执行的是排队这个任务，而不是显示的任务。虽然不知道具体的顺序，但排到显示这个任务的时候，更新`value`的任务也已经完成了，所以这是再显示就是有新的输入了。
6. `setTimeout` in loop will not be excuted before the loop ends
```
for (var i=0; i<10; i++) {
    setTimeout( function timer() {
        console.log( i ); // 全是10
    });
}
```


### 使用`setTimeout()` 替代 `setInterval()`
True intervals are rarely used in production environments because the time between the end of one interval and the beginning of the next is not necessarily guaranteed, and some intervals may be skipped. Using timeouts  ensures that can’t happen. Generally speaking, it’s best to avoid intervals.

### 更多的参数
delay参数之后可以传入若干的参数作为该回调函数的参数
```
setTimeout(function(a, b){
    console.log( a*b ); // 15
}, 1000, 3, 5);
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

### Minimum Delay and Maximum Delay
* 4sm是delay的最短时间，即使设置了小于4ms的delay，实际执行时也不会低于这个最低值。
*  Inactive tabs throttled to >=1000ms. To reduce the load (and associated battery usage) from background tabs, timeouts are throttled to firing no more often than once per second (1000 ms) in inactive tabs.
* Browsers store the delay as a 32-bit signed integer internally. This causes an integer overflow when using delays larger than 2147483647 (about 24.8 days), resulting in the timeout being executed immediately.




***
## System Dialogs
* `confirm()`点击取消或关闭时返回的是`false`，`prompt()`点击取消或关闭时返回的是`null`
* `window.print()`：Starting with Chrome 46.0 this method is blocked inside an `<iframe>` unless its sandbox attribute has the value allow-modals.
* `Window.find()`可以查找页面文本。但因为是非标准方法且存在bug，所以不应该使用。


***
## 未整理内容，直接看《Professional JavaScript for Web Developers》第八章
* Window Position
* Window Size
* Navigating and Opening Windows
