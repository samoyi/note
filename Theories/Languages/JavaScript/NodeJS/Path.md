# Path

## Nodejs中的路径
* `__dirname`：文件所在的绝对路径目录
* `__filename`：文件的绝对路径
* `process.cwd()`：returns the current working directory of the Node.js process.
`cwd` is the directory in which you are currently working. 在下面的例子里，因为是
在`D:\WWW\gits\Kaze-no-Toorimichi\Back`运行的node，所以这个目录就是`cwd`。至于node
调用其他目录的文件，那些目录只能算是资源所在的目录了。
* Relative paths will be resolved relative to the current working directory
* 不过`require()`中的相对路径并不是相对于cwd，参考[文档](https://nodejs.org/api/modules.html#modules_file_modules)
* `/`是永远是绝对路径根目录

```js
// D:\WWW\gits\Kaze-no-Toorimichi\Back\foo.js
console.log('This is foo.js');
```

```js
// D:\WWW\gits\Kaze-no-Toorimichi\Back\module\test.js
console.log(__dirname);
console.log(__filename);
console.log(process.cwd());
console.log(path.resolve('./'));
console.log(path.resolve('../'));
require('../foo');
console.log(path.resolve('/'));
```

```shell
# 命令行调用test.js时的当前工作路径
D:\WWW\gits\Kaze-no-Toorimichi\Back>node module/test
```

```shell
# 输出
D:\WWW\gits\Kaze-no-Toorimichi\Back\module
D:\WWW\gits\Kaze-no-Toorimichi\Back\module\test.js
D:\WWW\gits\Kaze-no-Toorimichi\Back
D:\WWW\gits\Kaze-no-Toorimichi\Back
D:\WWW\gits\Kaze-no-Toorimichi
This is foo.js
D:\
```



## `basename()` and `extname()`
* `path.basename`: trailing directory separators are ignored
    ```js
    const path = require('path');
    console.log( path.basename('/foo/bar/baz///') );       // 'baz'
    console.log( path.basename('/foo/bar/baz.html///') );  // 'baz.html'
    ```
* `path.extname`If there is no `.` in the last portion of the path, or if the first character of
 the basename of path is `.`, then an empty string is returned.
    ```js
    const path = require('path');

    console.log( path.basename('.htaccess') );   // '.htaccess'
    console.log( path.extname('.htaccess') );    // ''
    console.log( path.basename('htaccess.') );   // 'htaccess.'
    console.log( path.extname('htaccess.') );    // '.'
    console.log( path.basename('htaccess') );    // 'htaccess'
    console.log( path.extname('htaccess') );     // ''
    ```
