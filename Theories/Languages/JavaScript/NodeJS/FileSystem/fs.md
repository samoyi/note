# fs


<!-- vscode-markdown-toc -->
* 1. [读取信息](#)
* 2. [File descriptors](#Filedescriptors)
* 3. [Reading files](#Readingfiles)
* 4. [Writing a file](#Writingafile)
* 5. [Working with folders](#Workingwithfolders)
	* 5.1. [检查文件是否存在以及是否有读写权限](#-1)
	* 5.2. [创建文件夹](#-1)
	* 5.3. [读取目录](#-1)
	* 5.4. [重命名/移动 文件和文件夹](#-1)
	* 5.5. [删除文件夹和文件](#-1)
	* 5.6. [复制文件和目录](#-1)
* 6. [References](#References)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->


##  1. <a name=''></a>读取信息
1. 读取文件和目录信息
    ```js
    const fs = require('fs');
    fs.stat('package.json', function (err, stats) {
        if (err) {
            console.error(err);
        }
        console.log(stats);
        // Stats {
        //     dev: 2351615446,
        //     mode: 33206,
        //     nlink: 1,
        //     uid: 0,
        //     rdev: 0,
        //     blksize: 4096,
        //     ino: 1125899906939590,
        //     size: 112,
        //     blocks: 0,
        //     atimeMs: 1684651406528.7583,
        //     mtimeMs: 1684564681133.4363,
        //     ctimeMs: 1684564681133.4363,
        //     birthtimeMs: 1684515489624.6226,
        //     atime: 2023-05-21T06:43:26.529Z,
        //     mtime: 2023-05-20T06:38:01.133Z,
        //     ctime: 2023-05-20T06:38:01.133Z,
        //     birthtime: 2023-05-19T16:58:09.625Z
        // }
    });
    ```
    ```js
    const fs = require('fs');
    fs.stat('./', function (err, stats) {
        if (err) {
            console.error(err);
        }

        console.log(stats);
        // Stats {
        //   dev: 2351615446,
        //   mode: 16822,
        //   nlink: 1,
        //   uid: 0,
        //   gid: 0,
        //   rdev: 0,
        //   blksize: 4096,
        //   ino: 1970324837071394,
        //   size: 0,
        //   blocks: 0,
        //   atimeMs: 1684651482318.5952,
        //   mtimeMs: 1684515635836.8179,
        //   ctimeMs: 1684515635836.8179,
        //   birthtimeMs: 1684513864686.3162,
        //   atime: 2023-05-21T06:44:42.319Z,
        //   mtime: 2023-05-19T17:00:35.837Z,
        //   ctime: 2023-05-19T17:00:35.837Z,
        //   birthtime: 2023-05-19T16:31:04.686Z
        // }
    });
    ```
2. 对应的同步方法
    ```js
    try {
        const stats = fs.statSync('package.json');
    } 
    catch (err) {
        console.error(err);
    }
    ```
3. 通过返回对象的某些方法，可以获取更多有用的信息
    ```js
    fs.stat('package.json', function (err, stats) {
        if (err) {
            console.error(err);
        }
        console.log(stats.isFile())         // true
        console.log(stats.isDirectory())    // false
        console.log(stats.isSymbolicLink()) // false
    });
    ```
4. 基于 promise 的方法
    ```js
    const fs = require('fs/promises');

    async function example() {
        try {
            const stats = await fs.stat('package.json');
        } 
        catch (err) {
            console.log(err);
        }
    }
    ```


##  2. <a name='Filedescriptors'></a>File descriptors
1. 文件描述符是对一个打开的文件的引用，是通过 `fs.open()` 获得的一个数值。在一个操作系统中，每一个打开的文件都有不同的文件描述符
    ```js
    fs.open('package.json', 'r', (err, fd) => {
        console.log(fd); // 3
    });
    ```
2. 第二个 flag 参数的值包括：[File system flags](https://nodejs.org/docs/latest/api/fs.html#file-system-flags)
3. 同步方法
    ```js
    try {
        const fd = fs.openSync('/Users/joe/test.txt', 'r');
    } 
    catch (err) {
        console.error(err);
    }
    ```
4. promise 方法
    ```js
    const fs = require('fs/promises');

    async function example() {
        let filehandle;
        try {
            filehandle = await fs.open('/Users/joe/test.txt', 'r');
            console.log(filehandle.fd);
            console.log(await filehandle.readFile({ encoding: 'utf8' }));
        } 
        finally {
            if (filehandle) await filehandle.close();
        }
    }
    ```


##  3. <a name='Readingfiles'></a>Reading files
1. 回调方法
    ```js
    const fs = require('fs');

    fs.readFile('/Users/joe/test.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(data);
    });
    ```
2. 同步方法
    ```js
    try {
        const data = fs.readFileSync('/Users/joe/test.txt', 'utf8');
        console.log(data);
    } 
    catch (err) {
        console.error(err);
    }
    ```
3. promise 方法
    ```js
    const fs = require('fs/promises');

    async function example() {
        try {
            const data = await fs.readFile('/Users/joe/test.txt', { encoding: 'utf8' });
            console.log(data);
        } 
        catch (err) {
            console.log(err);
        }
    }
    ```
4. 这三个方法会在返回数据之前把整个文件的内容写入内存中，所以如果是大文件的话，对于内存消耗和程序执行速度就会有较大影响。一个更好的读取文件内容的方法是使用 stream。


##  4. <a name='Writingafile'></a>Writing a file
1. 回调方法
    ```js
    const fs = require('fs');

    const content = 'Some content!';

    fs.writeFile('/Users/joe/test.txt', content, err => {
        if (err) {
            console.error(err);
        }
        // file written successfully
    });
    ```
2. 同步方法
    ```js
    const fs = require('fs');

    const content = 'Some content!';

    try {
        fs.writeFileSync('/Users/joe/test.txt', content);
            // file written successfully
    } 
    catch (err) {
        console.error(err);
    }
    ```
3. promise 方法
    ```js
    const fs = require('fs/promises');

    async function example() {
        try {
            const content = 'Some content!';
            await fs.writeFile('/Users/joe/test.txt', content);
        } 
        catch (err) {
            console.log(err);
        }
    }
    ```
4. 如果文件没有则会先创建；如果文件已经有，默认会覆盖里面内容，可以通过设置 flag 改为追加
    ```js
    fs.writeFile('/Users/joe/test.txt', content, { flag: 'a+' }, err => {});
    ```
5. 还有直接追加写入的方法
    ```js
    const content = 'Some content!';

    fs.appendFile('file.log', content, err => {
        if (err) {
            console.error(err);
        }
        // done!
    });
    ```
6. 也有对应的 `fs.appendFileSync()` 和 `fsPromises.appendFile()`。


##  5. <a name='Workingwithfolders'></a>Working with folders
###  5.1. <a name='-1'></a>检查文件是否存在以及是否有读写权限
1. `fs.access(path[, mode], callback)`。
2. 不写 `mode` 参数时，默认为 `constants.F_OK`，用来检查文件是否存在；设置其他值可以检查读写权限。
3. 如果 `err` 为 `null`，则表明得到正向结果
    ```js
    const { access, constants } = require('fs');


    const file = 'package.json';

    // Check if the file exists in the current directory.
    access(file, constants.F_OK, (err) => {
        console.log(`${file} ${err ? 'does not exist' : 'exists'}`);
    });

    // Check if the file is readable.
    access(file, constants.R_OK, (err) => {
        console.log(`${file} ${err ? 'is not readable' : 'is readable'}`);
    });

    // Check if the file is writable.
    access(file, constants.W_OK, (err) => {
        console.log(`${file} ${err ? 'is not writable' : 'is writable'}`);
    });

    // Check if the file is readable and writable.
    access(file, constants.R_OK | constants.W_OK, (err) => {
        console.log(`${file} ${err ? 'is not' : 'is'} readable and writable`);
    });
    ```
4. `fs.exists()` 已经被弃用；另一个可以检查是否存在的方法是 ` fs.access()`。但 `fs.existsSync` 没有被弃用。

###  5.2. <a name='-1'></a>创建文件夹
`fs.mkdir()` or `fs.mkdirSync()` or `fsPromises.mkdir()`
```js
const fs = require('fs');

const folderName = '/Users/joe/test';

try {
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
    }
} 
catch (err) {
    console.error(err);
}
```

###  5.3. <a name='-1'></a>读取目录
1. `fs.readdir()` or `fs.readdirSync()` or `fsPromises.readdir()`，读取目录中的文件和子文件夹，默认返回它们的相对路径字符串。如果第二个参数设置了属性 `withFileTypes: true`，则返回的是 `Dirent` 对象
    ```js
    const fs = require('fs');

    const folderPath = '/Users/joe';

    fs.readdirSync(folderPath);
    ```
2. 可以过滤掉其中的子文件夹（或者文件）
    ```js
    const isFile = fileName => {
        return fs.lstatSync(fileName).isFile();
    };

    fs.readdirSync(folderPath).filter(isFile);
    ```

###  5.4. <a name='-1'></a>重命名/移动 文件和文件夹
1. `fs.rename()` or `fs.renameSync()` or `fsPromises.rename()`
2. 重命名文件
    ```js
    fs.rename('package.json', 'package1.json', err => {
        if (err) {
            console.error(err);
        }
        // done
    });
    ```
3. 移动文件
    ```js
    fs.rename('package.json', './hehe/package.json', err => {
        if (err) {
            console.error(err);
        }
        // done
    });
    ```
4. 重命名文件夹
    ```js
    fs.rename('hehe', 'hehe1', err => {
        if (err) {
            console.error(err);
        }
        // done
    });
    ```
5. 移动文件夹
    ```js
    fs.rename('hehe', './haha/hehe', err => {
        if (err) {
            console.error(err);
        }
        // done
    });
    ```

###  5.5. <a name='-1'></a>删除文件夹和文件
1. `fs.rmdir()` or `fs.rmdirSync()` or `fsPromises.rmdir()`，删除一个空文件夹 
    ```js
    const dir = 'haha'

    fs.rmdir(dir, err => {
        if (err) {
            throw err;
        }

        console.log(`${dir} is deleted!`);
    });
    ```
2. 删除整个有内容的文件夹，使用 `fs.rm()` 并带上如下例中的参数
    ```js
    fs.rm(dir, { recursive: true, force: true }, err => {
        if (err) {
            throw err;
        }

        console.log(`${dir} is deleted!`);
    });
    ```
3. `fs.rm()` 删除文件
    ```js
    fs.rm(file, err => {
        if (err) {
            throw err;
        }

        console.log(`${file} is deleted!`);
    });
    ```
4. 第二个对象参数是可选的，[四个属性值](https://nodejs.org/docs/latest/api/fs.html#fsrmpath-options-callback)。


###  5.6. <a name='-1'></a>复制文件和目录
#### 复制文件
1. 包括异步/同步/promise 三个方法。如果已有会替换。
    ```js
    fs.copyFile
    ```
2. `dest` 参数必须是具体的文件名，而不是其所在的目录，否则会报错 `EPERM: operation not permitted`、`errno: -4048`。

#### 复制目录
1. Experimental。
2. 包括异步/同步/promise 三个方法，如果已有会替换。
    ```js
    fs.cp
    ```
3. 至少在使用同步方法时，需要如下设置第三个参数
    ```js
    fs.cpSync(srcPath, destPath, { recursive: true })
    ```


##  6. <a name='References'></a>References
* [nodejs.dev](https://nodejs.dev/en/learn/)