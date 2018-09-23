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


## 方法
### `basename()` and `extname()`
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


### `path.join([...paths])`
1. 将多个路径连接到一起，返回一个合理的结果路径。
2. 路径分隔符会采用当前平台所使用的分隔符。比如在 windows 系统里是`\`而不是`/`
    ```js
    const {join} = require('path');
    let path = join('/foo', 'bar', 'baz/asdf', 'quux', '..');
    console.log(path); // \foo\bar\baz\asdf
    ```
3. 长度为零的路径片段会被忽略
    ```js
    let path = join('/foo', '', 'baz/asdf');
    console.log(path); // \foo\baz\asdf
    ```
4. 如果连接后的路径字符串是一个长度为零的字符串，则返回`'.'`，表示当前工作目录
    ```js
    let path = join('', '');
    console.log(path); // .
    ```
5. 如果任一路径片段不是一个字符串，则抛出`TypeError`
    ```js
    let path = join('foo', {}, 'bar');
    console.log(path); // TypeError: Path must be a string. Received {}
    ```
