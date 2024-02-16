<!-- vscode-markdown-toc -->
* 1. [Nodejs 中的路径](#Nodejs)
* 2. [`basename()`](#basename)
* 3. [`extname()`](#extname)
* 4. [`dirname()`](#dirname)
* 5. [获取路径中的各部分信息](#)
* 6. [`join([...paths])`](#join...paths)
* 7. [`resolve([...paths])`](#resolve...paths)
* 8. [`normalize(path)`](#normalizepath)
* 9. [References](#References)

<!-- vscode-markdown-toc-config
	numbering=false
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->


##  1. <a name='Nodejs'></a>Nodejs 中的路径
* `__dirname`：文件所在的绝对路径目录
* `__filename`：文件的绝对路径
* `process.cwd()`：returns the current working directory of the Node.js process. `cwd` is the directory in which you are currently working. 在下面的例子里，因为是在 `D:\WWW\gits\Kaze-no-Toorimichi\Back` 运行的 node，所以这个目录就是 `cwd`。至于 node 调用其他目录的文件，那些目录只能算是资源所在的目录了。
* Relative paths will be resolved relative to the current working directory
* 不过 `require()` 中的相对路径并不是相对于 cwd，参考 [文档](https://nodejs.org/api/modules.html#modules_file_modules)
* `/` 是永远是绝对路径根目录

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
# 命令行调用 test.js 时的当前工作路径
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


##  2. <a name='basename'></a>`basename()` 
1. 获取路径中的文件名（包含扩展名），或者路径的最后一级路径。
2. 不包括前后的路径分隔符
    ```js
    const path = require('path');
    console.log( path.basename('/foo/bar/baz///') );       // 'baz'
    console.log( path.basename('/foo/bar/baz.html///') );  // 'baz.html'
    console.log( path.basename('htaccess') );    // 'htaccess'
    console.log( path.basename('.htaccess') );   // '.htaccess'
    console.log( path.basename('htaccess.') );   // 'htaccess.'
    ```

##  3. <a name='extname'></a>`extname()`
1. 获取文件扩展名。注意扩展名是包括 `.` 的
    ```js
    const path = require('path');
    console.log( path.extname('/foo/bar/baz.html///') );  // '.html'
    console.log( path.extname('htaccess.') );             // '.'
    ```
2. 如果参数是目录则结果为空字符串
    ```js
    console.log( path.extname('/foo/bar/baz///') );  // ''
    ```
3. If there is no `.` in the last portion of the path, or if the first character of the basename of path is `.`, then an empty string is returned. 也就是说，扩展名必须有 `.`，且不能只有扩展名
    ```js
    const path = require('path');

    console.log( path.extname('htaccess') );     // ''
    console.log( path.extname('.htaccess') );    // ''
    ```

##  4. <a name='dirname'></a>`dirname()`
1. 获取当前路径的父级目录。
    ```js
    console.log( path.dirname('/foo/bar/baz///') );       // '/foo/bar'
    console.log( path.dirname('/foo/bar/baz.html///') );  // '/foo/bar'
    ```
2. 根目录还是返回根目录
    ```js
    console.log( path.dirname('/foo') );                  // '/'
    console.log( path.dirname('/') );                     // '/'
    ```
3. 没有具体路径只有文件名的返回 `.`，表示当前工作目录
    ```js
    console.log( path.dirname('baz.html') );              // '.'
    console.log( path.dirname('.htaccess') );             // '.'
    ```

##  5. <a name=''></a>获取路径中的各部分信息
```js
path.parse('/home/user/dir/file.txt');
// Returns:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' } 
```


##  6. <a name='join...paths'></a>`join([...paths])`
1. 将多个路径连接到一起，返回一个合理的结果路径。
2. 路径分隔符会采用当前平台所使用的分隔符。比如在 windows 系统里是 `\` 而不是 `/`
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
4. 如果连接后的路径字符串是一个长度为零的字符串，则返回`.`，表示当前工作目录
    ```js
    let path = join('', '');
    console.log(path); // .
    ```
5. 如果任一路径片段不是一个字符串，则抛出 `TypeError`
    ```js
    let path = join('foo', {}, 'bar');
    console.log(path); // TypeError: Path must be a string. Received {}
    ```


##  7. <a name='resolve...paths'></a>`resolve([...paths])`
1. 根据参数解析出一个绝对路径。
2. 如果所有的路径参数中都不包含 `/`，则解析出的绝对路径是根据 CWD。假设当前 CWD 是 `/Users/joe/`
    ```js
    console.log( path.resolve('joe.txt') );                // '/Users/joe/joe.txt'
    console.log( path.resolve('foo', 'bar', 'joe.txt') );  // '/Users/joe/foo/bar/joe.txt'
    ```
3. 即使文件名出现在目录名前面，也照样解析
    ```js
    console.log( path.resolve('joe.txt', 'aa') );  // '/Users/joe/joe.txt/aa'
    ```
4. 如果从左到右有一个参数出现了一个 `/`，则表示根目录
    ```js
    console.log( path.resolve('/') );                                      // '/'
    console.log( path.resolve('/joe.txt') );                               // '/joe.txt'
    console.log( path.resolve('foo', '/bar', 'joe.txt') );                 // '/bar/joe.txt'
    console.log( path.resolve('foo', 'joe.txt', '/bar') );                 // '/bar'
    console.log( path.resolve('foo', '/bar', 'baz', '/qux', 'joe.txt') );  // '/qux/joe.txt'
    ```


##  8. <a name='normalizepath'></a>`normalize(path)`
1. 规范路径格式，处理里面的当前路径`./`、上级路径 `..` 和多余的分隔符，连续多个分隔符会被处理为一个。
2. 返回路径中的分隔符是基于当前系统的，并不需要和参数中的一致
    ```js
    console.log( path.normalize('/foo/bar//baz/asdf/quux/..') );     // \foo\bar\baz\asdf
    console.log( path.normalize('/foo/bar//./baz/asdf/quux/..') );   // \foo\bar\baz\asdf
    console.log( path.normalize('C:\\temp\\\\foo\\bar\\..\\baz') );  // C:\temp\foo\baz
    ```


##  9. <a name='References'></a>References
* [nodejs.dev](https://nodejs.dev/en/learn/)