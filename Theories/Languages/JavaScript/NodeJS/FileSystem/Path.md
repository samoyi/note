- [Nodejs 中的路径](#nodejs-中的路径)
- [`basename(path [, suffix])`](#basenamepath--suffix)
- [`extname()`](#extname)
- [`dirname()`](#dirname)
- [获取路径中的各部分信息](#获取路径中的各部分信息)
- [`join([...paths])`](#joinpaths)
- [`resolve([...paths])`](#resolvepaths)
  - [解决相对路径的动态性](#解决相对路径的动态性)
    - [防止路径拼接被恶意利用](#防止路径拼接被恶意利用)
  - [跨平台路径格式兼容](#跨平台路径格式兼容)
  - [路径的确定性构建](#路径的确定性构建)
  - [处理参数中的绝对路径](#处理参数中的绝对路径)
- [`path.join()` 和 `path.resolve()` 的比较](#pathjoin-和-pathresolve-的比较)
  - [路径的「绝对性」](#路径的绝对性)
  - [对 `..` 和 `.` 的处理](#对--和--的处理)
  - [参数为空时的默认行为](#参数为空时的默认行为)
  - [跨平台兼容性](#跨平台兼容性)
- [`normalize(path)`](#normalizepath)
- [References](#references)

## Nodejs 中的路径
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


## `basename(path [, suffix])` 
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
3. 如果带上第二个参数 `suffix`，且路径的最后一级部分以该后缀结尾，则会将后缀去掉
    ```js
    console.log( path.basename('/foo/bar/baz.html///', '.html') );  // 'baz'
    console.log( path.basename('htaccess.', '.') );                 // 'htaccess'
    ```
   
   
## `extname()`
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

## `dirname()`
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

## 获取路径中的各部分信息
```js
path.parse('/home/user/dir/file.txt');
// Returns:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' } 
```


## `join([...paths])`
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


## `resolve([...paths])`
1. 根据参数解析出一个绝对路径。
2. The given sequence of paths is processed from right to left, with each subsequent path prepended until an absolute path is constructed.
3. 例如 `path.resolve('/foo', '/bar', 'baz')`，首先处理最后的路径 `baz`，它不是绝对路径，所以继续向左处理 `/bar`，它是绝对路径，所以停止处理，再左边的 `/foo` 就不要了。然后将 `/bar` 和 `baz` 连接起来，得到最终结果 `/bar/baz`。
4. 而如果处理完最左边的参数后，仍然没有得到一个绝对路径，则会将当前工作目录作为最左边的路径进行处理，直到得到一个绝对路径为止。例如当前当前工作目录是 `/home/user/dir`，则：
    ```js
    path.resolve('foo', 'bar'); // /home/user/dir/foo/bar
    ```
5. 如果没有提供任何参数，则返回当前工作目录的绝对路径
    ```js
    path.resolve(); // /home/user/dir
    ```

### 解决相对路径的动态性
1. 相对路径的基准路径是 **当前进程的工作目录**（即运行脚本时所在的目录，可通过 `process.cwd()` 获取），而不是代码文件所在的目录。
2. 所以，你在代码中使用了一个相对路径，但你无法确定它指向的是哪里。
3. 例如，当前的代码文件路径是 `/project/src/app.js`，它里面使用了相对路径
    ```js
    fs.readFileSync('./config.json');
    ```
    * 如果你在 `/project` 目录下运行 `node src/app.js`，相对路径会正确解析为 `/project/config.json`。
    * 如果用户在 `/project/src` 目录下运行 `node app.js`，相对路径会解析为 `/project/src/config.json`。
4. 而如果你使用 `resolve` 将它解析为绝对路径
    ```js
    const absolutePath = path.resolve(__dirname, 'config.json');
    // __dirname 始终是当前文件所在目录的绝对路径，在本例中就是 /project/src/
    ```
    现在，无论从哪里运行脚本，`config.json` 的路径都会解析为：`/project/src/config.json`

#### 防止路径拼接被恶意利用
TODO
   
### 跨平台路径格式兼容
1. 不同操作系统使用不同的路径分隔符：
    * Windows：`C:\\project\\src\\app.js`
    * Linux/macOS：`/project/src/app.js`
2. 如果手动拼接路径字符串，可能会写出不兼容的代码：
    ```js
    const badPath = __dirname + '/../data/file.txt'; // 在 Windows 上会生成错误的分隔符！
    ```
3. 使用 `path.resolve()` 自动处理分隔符，生成当前系统兼容的绝对路径
    ```js
    const safePath = path.resolve(__dirname, '../data', 'file.txt'); 
    ```

### 路径的确定性构建
1. `path.resolve()` 会按顺序处理参数，直到构造出绝对路径。例如：
    ```js
    path.resolve('src', 'app.js'); // 基于当前工作目录解析
    path.resolve('/project', 'src', 'app.js'); // 从根目录开始解析
    path.resolve(__dirname, 'app.js'); // 基于当前文件目录解析
    ```
2. 这比手动拼接路径更可靠，尤其是当路径中包含 `..` 或 `.` 时。

### 处理参数中的绝对路径
1. 如果所有的路径参数中都不包含 `/`，则解析出的绝对路径是根据 CWD。假设当前 CWD 是 `/Users/joe/`
    ```js
    console.log( path.resolve('joe.txt') );                // '/Users/joe/joe.txt'
    console.log( path.resolve('foo', 'bar', 'joe.txt') );  // '/Users/joe/foo/bar/joe.txt'
    ```
2. 即使文件名出现在目录名前面，也照样解析
    ```js
    console.log( path.resolve('joe.txt', 'aa') );  // '/Users/joe/joe.txt/aa'
    ```
3. 如果从右到左有一个参数出现了一个 `/`，则表示根目录
    ```js
    console.log( path.resolve('/') );                                      // '/'
    console.log( path.resolve('/joe.txt') );                               // '/joe.txt'
    console.log( path.resolve('foo', '/bar', 'joe.txt') );                 // '/bar/joe.txt'
    console.log( path.resolve('foo', 'joe.txt', '/bar') );                 // '/bar'
    console.log( path.resolve('foo', '/bar', 'baz', '/qux', 'joe.txt') );  // '/qux/joe.txt'
    ```


## `path.join()` 和 `path.resolve()` 的比较
### 路径的「绝对性」
1. 代码示例
    ```js
    // 假设当前工作目录是 /project
    const path = require('path');

    // 示例 1：处理相对路径
    path.join('src', 'app.js');        // 输出: 'src/app.js'（相对路径）
    path.resolve('src', 'app.js');     // 输出: '/project/src/app.js'（绝对路径）

    // 示例 2：参数中存在绝对路径
    path.join('/a', '/b', 'c.js');    // 输出: '/a/b/c.js'（直接拼接）
    path.resolve('/a', '/b', 'c.js');  // 输出: '/b/c.js'（以最后一个绝对路径 /b 为基准）
    ```
2. 可以看到，`path.join()` 只是单纯的拼接路径，在必要的时候添加 `/`，但不会把参数中的 `/` 理解为绝对路径。

### 对 `..` 和 `.` 的处理
1. 代码示例
    ```js
    // 示例 1：相对路径中的 ..
    path.join('src', '../app.js');      // 输出: 'app.js'（相对路径）
    path.resolve('src', '../app.js');   // 输出: '/project/app.js'（绝对路径）

    // 示例 2：绝对路径中的 ..
    path.join('/a', '../b', 'c.js');   // 输出: '/a/../b/c.js'（保留 .. 但未规范化）
    path.resolve('/a', '../b', 'c.js'); // 输出: '/b/c.js'（完全规范化后的绝对路径）
    ```
2. 看起来 `path.join()` 在拼接路径时，只在必要的时候添加 `/`，但并不会合并非必要的部分。

### 参数为空时的默认行为
1. `path.join()` 返回当前目录的相对路径，也就是	`.`；`path.resolve()` 返回当前工作目录的绝对路径。
2. 代码示例
    ```js
    // 假设当前工作目录是 /project
    path.join();     // 输出: '.'
    path.resolve();  // 输出: '/project'（当前工作目录的绝对路径）
    ```

### 跨平台兼容性
二者都会自动处理平台分隔符（Unix 的 `/` 和 Windows 的 `\`）。


## `normalize(path)`
1. 规范路径格式，处理里面的当前路径`./`、上级路径 `..` 和多余的分隔符，连续多个分隔符会被处理为一个。
2. 返回路径中的分隔符是基于当前系统的，并不需要和参数中的一致
    ```js
    console.log( path.normalize('/foo/bar//baz/asdf/quux/..') );     // \foo\bar\baz\asdf
    console.log( path.normalize('/foo/bar//./baz/asdf/quux/..') );   // \foo\bar\baz\asdf
    console.log( path.normalize('C:\\temp\\\\foo\\bar\\..\\baz') );  // C:\temp\foo\baz
    ```


## References
* [nodejs.dev](https://nodejs.dev/en/learn/)