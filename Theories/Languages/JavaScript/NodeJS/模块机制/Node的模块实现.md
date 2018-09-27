# Node 的模块实现

Node 在实现中并非完全按照规范实现，而是对模块规范进行了一定的取舍，同时也增加了少许自身
需要的特性。


## Node 引用模块的基本步骤
1. 标识符（`require()`的参数）分析
2. 文件查找
3. 编译执行


## Node 模块类型
在Node中，模块分为两类：一类是 Node 提供的模块，称为核心模块；另一类是用户编写的模块，
称为文件模块。
* 核心模块部分在 Node 源代码的编译过程中，编译进了二进制执行文件。在 Node 进程启动时，
部分核心模块就被直接加载进内存中，所以这部分核心模块引入时，文件查找和编译执行这两个步骤
可以省略掉，并且在路径分析中优先判断，所以它的加载速度是最快的。
* 文件模块则是在运行时动态加载，需要完整的标识符分析、文件查找、编译执行过程，速度比核心
模块慢。
* 如果试图加载一个与核心模块标识符相同的自定义模块，那是不会成功的。如果自己编写了一个
`http`用户模块，想要加载成功，必须选择一个不同的标识符或者换用路径的方式。


## 优先从缓存加载
1. 与前端浏览器会缓存静态脚本文件以提高性能一样，Node 对引入过的模块都会进行缓存，以减
少二次引入时的开销。
2. 不同的地方在于，浏览器仅仅缓存文件，而 Node 缓存的是编译和执行之后的对象。
3. 不论是核心模块还是文件模块，`require()`方法对相同模块的二次加载都一律采用缓存优先的
方式，这是第一优先级的。不同之处在于核心模块的缓存检查先于文件模块的缓存检查。


## 标识符类型
因为标识符有几种形式，对于不同的标识符，模块的查找和定位有不同程度上的差异
* 核心模块标识符，如`http`、`fs`等
* 以`.`、`..`或`/`开头，用于引用文件模块的相对或绝对路径标识符
* 非路径形式，如`require('vue')`，同样用于引用文件模块，该文件模块需存放在
`node_modules`目录下


## 模块引用逻辑
当 Node 遇到`require(X)`时，按下面的顺序处理

### 如果`X`是核心模块标识符
直接返回该模块

### 如果`X`是路径
首先进行路径分析，然后进行文件查找

#### 路径分析
* 相对路径或绝对路径会被转换为真实路径，并以真实路径作为索引
* 这里说到的“真实路径”，可能是指比如 windows 系统中绝对路径`/a.js`会被转换为`D:\a.js`
* 由于文件模块给 Node 指明了确切的文件位置，所以在查找过程中可以节约大量时间，其加载速
度慢于核心模块。

#### 文件查找
1. 首先认为它是文件，依次查找下面文件，只要其中有一个存在，就返回该文件，不再继续执行：
    ```
    X
    X.js
    X.json
    X.node
    ```
    注意这里先查找`X`再查找`X.js`，是因为 Node 无法判断`X`带不带扩展名。例如一个文件是
    `a.js.js`，在你`require('a.js')`时，Node 如果断定标识符是带扩展名的那显然就错了。
2. 如果没有找到，则将`X`当成目录，查找`X/package.json`文件，解析`package.json`文件并
读取`main`字段，查找`main`字段指定的文件。
3. 如果`X/package.json`不存在或者其中`main`指定的文件不存在，则依次查找
    ```
    X/index.js
    X/index.json
    X/index.node
    ```

### 如果`X`是非路径形式
首先获取`module.paths`中的若干路径，然后根据这些路径进行查找

#### 获取`module.paths`
1. 在查找非核心非路径的模块时，需要从该属性指定的若干条路径里去查找
2. 在任何路径下的一个模块中，查看`module.paths`，就可以看到该路径下查找非路径模块时的
查找路径。例如：
    ```js
    // 当前文件路径为 D:\\WWW\\test\\test.js
    console.log(module.paths);
    // [
    //     'D:\\WWW\\test\\node_modules',
    //     'D:\\WWW\\node_modules',
    //     'D:\\node_modules'
    // ]
    ```
3. 例如，当你`D:\\WWW\\test\\test.js`文件里`require('vue')`，就会先查找本级目录的
`node_modules`文件夹。如果没找到`node_modules`或者`node_modules`里没有`vue`模块，就
找父级目录下的，依次查找，直到根目录。

#### 在某个`module.paths`目录里查找文件
查找方法和路径标识符时的查找方法，即先把`X`当做文件名查找，找不到就再当做目录名查找。


## 文件扩展名分析
1. 上面在说查找文件的时候可以看到，允许三类文件不带扩展名，即`.js`、`.json`和`.node`。
2. CommonJS 模块规范也允许在标识符中不包含文件扩展名。这种情况下，Node 会首先假定该标
识符是带扩展名的来进行查找；找不到之后会为其加上`.js`，再进行查找；如果还没找到，则以此
类推尝试后两种扩展名。
3. 在尝试的过程中，需要调用`fs`模块同步阻塞式地判断文件是否存在。因为 Node 是单线程的，
所以这里是一个会引起性能问题的地方。
4. 小诀窍是：在传递给`require()`的标识符中带上扩展名，会加快一点速度。另一个诀窍是：同
步配合缓存，可以大幅度缓解 Node 单线程中阻塞式调用的缺陷。不懂什么是同步配合缓存。


## 模块编译
这里我们提到的模块编译都是指文件模块，即用户自己编写的模块。

### 模块对象
1. 在 Node 中，每个文件模块都是一个对象，它的定义如下：
    ```js
    function Module(id, parent) {
        this.id = id;
        this.exports = {};
        this.parent = parent;
        if (parent && parent.children) {
            parent.children.push(this);
        }

        this.filename = null;
        this.loaded = false;
        this.children = [];
    }
    ```
2. 以下测试输出了一个模块内的`module`对象
    ```js
    require('./a');
    ```
    ```js
    // a.js
    setTimeout(function(){
        console.log(module)
    })
    ```
    打印出的对象为:
    ```js
    {
        id: 'D:\\WWW\\test\\a.js',
        exports: {},
        parent: {
            id: '.',
            exports: {},
            parent: null,
            filename: 'D:\\WWW\\test\\test.js',
            loaded: true,
            children: [ [Circular] ],
            paths: [
                'D:\\WWW\\test\\node_modules',
                'D:\\WWW\\node_modules',
                'D:\\node_modules'
            ]
        },
        filename: 'D:\\WWW\\test\\a.js',
        loaded: true,
        children: [],
        paths: [
            'D:\\WWW\\test\\node_modules',
            'D:\\WWW\\node_modules',
            'D:\\node_modules'
        ]
    }
    ```

### 编译流程
1. 编译和执行是引入文件模块的最后一个阶段。定位到具体的文件后，Node会新建一个模块对象，
然后根据路径载入并编译。
2. 对于不同的文件扩展名，其载入方法也有所不同，具体如下所示。
    * **`.js`文件**：通过`fs`模块同步读取文件后编译执行。
    * **`.node`文件**：这是用C/C++编写的扩展文件，通过`dlopen()`方法加载最后编译生成
                        的文件。
    * **`.json`文件**：通过`fs`模块同步读取文件后，用`JSON.parse()`解析返回结果。
    * **其余扩展名文件**：它们都被当做`.js`文件载入。
3. 每一个编译成功的模块都会将其文件路径作为索引缓存在`Module._cache`对象上，以提高二次引入的性能。

#### JavaScript 模块的编译
1. 在编译的过程中，Node 对获取的 JavaScript 文件内容进行了头尾包装。在头部添加了
`(function (exports, require, module, __filename, __dirname) {\n`，在尾部添加了
`\n});`。
2. 例如下面这个 JS 文件
    ```js
    exports.area = function (radius) {
        return Math.PI * radius * radius;
    };
    ```
    经过包装后会变成
    ```js
    (function (exports, require, module, __filename, __dirname) {
        exports.area = function (radius) {
            return Math.PI * radius * radius;
        };
    });
    ```
3. 这个包装的过程有明显的两个内容：进行了作用域封装，注入了5个全局变量。这也就是为什么
Node 的模块是局部作用域以及在模块内不定义就可以使用以上5个变量的原因。
4. 包装之后的代码会通过原生模块`vm`的`runInThisContext()`方法执行（类似`eval`，只是具
有明确上下文，不污染全局），返回一个具体的`function`对象。
5. 最后，将当前模块对象的`exports`属性、`require()`方法、`module`（模块对象自身），以
及在文件定位中得到的完整文件路径和文件目录作为参数传递给这个`function()`执行。
6. 在执行之后，模块的`exports`属性被返回给了调用方。`exports`属性上的任何方法和属性都
可以被外部调用到，但是模块中的其余变量或属性则不可直接被调用。

#### `module.exports` vs `exports`
1. 以下三种输出值的方式都没问题
    ```js
    module.exports = {age: 22}; // require() 的返回值是对象 {age: 22}
    exports.age = 22;           // require() 的返回值是对象 {age: 22}
    module.exports = 22;        // require() 的返回值是数值 22
    module.exports.age = 22;    // require() 的返回值是对象 {age: 22}
    ```
2. 但以下两种输出值的方式，`require()`的返回值都是空对象
    ```js
    exports = {age: 22};
    exports = 22;
    ```
3. 从形式上来看：你可以给`module.exports`的属性赋值，也可以`exports`的属性赋值；但是
你只能给`module.exports`直接赋值，而不能给`exports`直接赋值。
4. 原因是
    ```js
    console.log(module.exports === exports); // true
    ```
5. 上面说到将模块包装为函数时，形参有`exports`和`module`。在实际传参时，传给形参
`exports`的实参实际上就是`module.exports`。所以`exports`是指向`module.exports`的。
6. 你给`exports`添加属性，实际上就是个`module.exports`属性。但如果你直接给`exports`
赋值，`exports`就不再指向`module.exports`了。
7. 而根据前面打印`module`对象来看，`module.exports`的初始值是个空对象。所以最终
`require()`的返回值就是个空对象。如果像下面这样，输出的对象就只有`name`而没有`age`
    ```js
    module.exports.name = '33';
    exports = {age: 22};
    ```

### C/C++ 模块的编译
1. Node 调用`process.dlopen()`方法进行加载和执行。在 Node 的架构下，`dlopen()`方法在
Windows 和 \*nix 平台下分别有不同的实现，通过 libuv 兼容层进行了封装。
2. 实际上，`.node`的模块文件并不需要编译，因为它是编写 C/C++ 模块之后编译生成的，所以
这里只有加载和执行的过程。在执行的过程中，模块的`exports`对象与`.node`模块产生联系，然
后返回给调用者。
3. C/C++ 模块给 Node 使用者带来的优势主要是执行效率方面的，劣势则是 C/C++ 模块的编写门
槛比 JavaScript 高。

### JSON 文件的编译
1. Node 利用`fs`模块同步读取 JSON 文件的内容之后，调用`JSON.parse()`方法得到对象，然
后将它赋给模块对象的`exports`，以供外部调用。


## References
* [《深入浅出Node.js》 2.2章节](https://book.douban.com/subject/25768396/)
* [require() 源码解读](http://www.ruanyifeng.com/blog/2015/05/require.html)
* [廖雪峰 JavaScript 教程](http://t.cn/RK0jHNY)
