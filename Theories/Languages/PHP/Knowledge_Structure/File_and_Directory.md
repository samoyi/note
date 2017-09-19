# File_and_Directory

## Directory infomation
### `is_dir()` Returns TRUE if the filename exists and is a directory
```
bool is_dir ( string $filename )
```

### `file_exists` Checks whether a file or directory exists
```
bool file_exists ( string $filename )
```
* This function returns FALSE for files inaccessible due to safe mode restrictions. However these files still can be included if they are located in safe_mode_include_dir.

### `getcwd()` Gets the current working directory
* On some Unix variants, `getcwd()` will return `FALSE` if any one of the parent directories does not have the readable or search mode set, even if the current directory does. See `chmod()` for more information on modes and permissions.

### `chdir()` Changes PHP's current directory to directory.
* 参数相对地址和绝对地址都可以

### `dirname()` Returns a parent directory's path
```
string dirname ( string $path [, int $levels = 1 ] )
```
*  `levels` is the number of parent directories to go up.

### `basename()` Returns trailing name component of path
```
string basename ( string $path [, string $suffix ] )
```
* If the name component ends in `suffix` this will also be cut off.

### `pathinfo()` Returns information about a path or a file
```
mixed pathinfo ( string $path [, int $options] )
```  
#### `options`
* If present, specifies a specific element to be returned; one of `PATHINFO_DIRNAME`, `PATHINFO_BASENAME`, `PATHINFO_EXTENSION` or `PATHINFO_FILENAME`.
* If the options parameter is not passed, an associative array containing the following elements is returned: dirname, basename, extension (if any), and filename.
* If the path has more than one extension, PATHINFO_EXTENSION` returns only the last one and PATHINFO_FILENAME` only strips the last one.
* If the basename of the path starts with a dot, the following characters are interpreted as extension, and the filename is empty
* `pathinfo()` is locale aware, so for it to parse a path containing multibyte characters correctly, the matching locale must be set using the `setlocale()` function.

### `disk_free_space()` Returns available space on filesystem or disk partition


***
## File infomation
### Infomation in array
#### `stat()` Gives information about a file
```
array stat ( string $filename )
```
* Gathers the statistics of the file named by filename. If filename is a symbolic link, statistics are from the file itself, not the symlink.    

#### `fstat()` Gets information about a file using an open file pointer
```
array fstat ( resource $handle )
```
* This function is similar to the `stat()` function except that it operates on an open file pointer instead of a filename.

#### `lstat()`
```
array lstat ( string $filename )
```  
* identical to `stat()` except it would instead be based off the symlinks status.  

Numeric | Associative |	Description
---|---|---
0 |	dev | device number
1 |	ino | inode number *
2 |	mode | inode protection mode
3 |	nlink |	number of links
4 |	uid | userid of owner *
5 |	gid | groupid of owner *
6 |	rdev | device type, if inode device
7 |	size | size in bytes
8 |	atime | time of last access (Unix timestamp)
9 |	mtime |	time of last modification (Unix timestamp)
10 | ctime | time of last inode change (Unix timestamp)
11 | blksize | blocksize of filesystem IO **
12 | blocks | number of 512-byte blocks allocated **
*\* On Windows this will always be 0.*  
*\*\* Only valid on systems supporting the st_blksize type - other systems (e.g. Windows) return -1.*

### `filetype()` Returns the type of the given file.
```
string filetype ( string $filename )
```
返回类型 | 类型说明
-- | --
block | block special device
char | character special device
dir | directory
fifo | FIFO (named pipe)
file | regular file
link | symbolic link
unknown | unknown file type

### `is_file()` Tells whether the filename is a regular file
```
bool is_file ( string $filename )
```

### `is_link()`
```
bool is_link ( string $filename )
```

### `filesize()` Returns the size of the file in bytes
```
int filesize ( string $filename )
```

### `is_readable()` Tells whether a file exists and is readable
```
bool is_readable ( string $filename )
```

### `is_executable()` Tells whether the filename is executable
```
bool is_executable ( string $filename )
```

### `is_writable()` Tells whether the filename is writable
```
bool is_writable ( string $filename )
```
* The filename argument may be a directory name allowing you to check if a directory is writable.

### `fileperms()` Gets file permissions
* 返回的是十进制数，而一般UNIX系统文件权限是八进制，可以使用`decoct()`来转换

### `fileatime()` Gets last access time of file

### `filemtime()` Gets file modification time

### `fileowner()` Returns the user ID of the owner of the file, or FALSE on failure.

### `filegroup()` Returns the group ID of the file, or FALSE if an error occurs.

### `posix_getpwuid()` Return info about a user by user id
```
array posix_getpwuid ( int $uid )
```
return | description
--- | ---
name | The name element contains the username of the user. This is a short, usually less than 16 character "handle" of the user, not the real, full name.
passwd | The passwd element contains the user's password in an encrypted format. Often, for example on a system employing "shadow" passwords, an asterisk is returned instead.
uid | User ID, should be the same as the uid parameter used when calling the function, and hence redundant.
gid | The group ID of the user. Use the function posix_getgrgid() to resolve the group name and a list of its members.
gecos | GECOS is an obsolete term that refers to the finger information field on a Honeywell batch processing system. The field, however, lives on, and its contents have been formalized by POSIX. The field contains a comma separated list containing the user's full name, office phone, office number, and home phone number. On most systems, only the user's full name is available.
dir | This element contains the absolute path to the home directory of the user.
shell | The shell element contains the absolute path to the executable of the user's default shell.

### `posix_getgrgid()` Return info about a group by group id
```
array posix_getgrgid ( int $gid )
```
return | description
--- | ---
name | The name element contains the name of the group. This is a short, usually less than 16 character "handle" of the group, not the real, full name.
passwd | The passwd element contains the group's password in an encrypted format. Often, for example on a system employing "shadow" passwords, an asterisk is returned instead.
gid | Group ID, should be the same as the gid parameter used when calling the function, and hence redundant.
members | This consists of an array of string's for all the members in the group.

### `clearstatcache()` Clears file status cache
```
void clearstatcache ([ bool $clear_realpath_cache = false [, string $filename ]] )
```
1. When you use `stat()`, `lstat()`, or any of the other functions listed in the affected functions list (below), PHP caches the information those functions return in order to provide faster performance.
2. This function caches information about specific filenames, so you only need to call `clearstatcache()` if you are performing multiple operations on the same filename and require the information about that particular file to not be cached.
3. Affected functions include `stat()`, `lstat()`, `file_exists()`, `is_writable()`, `is_readable()`, `is_executable()`, `is_file()`, `is_dir()`, `is_link()`, `filectime()`, `fileatime()`, `filemtime()`, `fileinode()`, `filegroup()`, `fileowner()`, `filesize()`, `filetype()`, and `fileperms()`.



***
## 操作路径
### `opendir()`  Open directory handle
```
resource opendir ( string $path [, resource $context ] )
```
Returns a directory handle resource on success, or FALSE on failure.

### `readdir()` Read entry from directory handle
* 通过反复调用来逐个读取目录下所有文件
* .（当前目录）和..（上一级）也会被返回
* 判断返回值时，应使用全等。因为任何目录项的名称求值为 FALSE 的文件都会使得返回值 == false

### `closedir()`  Close directory handle

### `ftell()`  Returns the current position of the file read/write pointer
* Returns the position of the file pointer referenced by handle as an integer

### `fseek()`  Seeks on a file pointer（ファイルポインタを移動する）
```
int fseek ( resource $handle , int $offset [, int $whence = SEEK_SET ] )
```
<mark>不懂，没看太明白</mark>

### `rewind()` Rewind the position of a file pointer
* If you have opened the file in append ("a" or "a+") mode, any data you write to the file will always be appended, regardless of the file position.

### `scandir()` List files and directories inside the specified path
```
array scandir ( string $directory [, int $sorting_order = SCANDIR_SORT_ASCENDING [, resource $context ]] )
```
* 默认ASCENDING，可改为DESCENDING

### `mkdir()`  Makes directory
```
bool mkdir ( string $pathname [, int $mode = 0777 [, bool $recursive = false [, resource $context ]]] )
```
#### `mode`
The mode is 0777 by default, which means the widest possible access.

####  `recursive`
Allows the creation of nested directories specified in the pathname.

```
// Desired folder structure
$structure = './depth1/depth2/depth3/';

// To create the nested structure, the $recursive parameter
// to mkdir() must be specified.

if (!mkdir($structure, 0777, true)) {
    die('Failed to create folders...');
}
```

### `rmdir()` Removes directory

### Directory class  Pseudo-object oriented mechanism
* `dir()` : Return an instance of the Directory class
* `path` property : The directory that was opened.
* `handle` property : Can be used with other directory functions
* `read` method : 和`readdir()`函数相同
* `rewind` method : 和`rewinddir()`函数相同
* `close`  method : 和`closedir()`函数相同



***
## 操作文件
### `chgrp()`  Changes file group
```
bool chgrp ( string $filename , mixed $group )
```
* Only the superuser may change the group of a file arbitrarily; other users may change the group of a file to any group of which that user is a member.   
* 不能在Windows中使用

### `chmod()`  Changes file mode
```
bool chmod ( string $filename , int $mode )
```
* Note that mode is not automatically assumed to be an octal value, so to ensure the expected operation, you need to prefix mode with a zero (0). Strings such as "g+w" will not work properly.
* 不能在Windows中使用

### `chown()`  Changes file owner
```
bool chown ( string $filename , mixed $user )
```
* Only the superuser may change the owner of a file.
* 不能在Windows中使用

### `touch()` Sets access and modification time of file
```
bool touch ( string $filename [, int $time = time() [, int $atime ]] )
```
* If the file does not exist, it will be created.
* 如果文件已存在：它的修改时间会被改成当前时间，或者第二个参数指定的事件。
* 访问时间默认是当前系统时间，也可以通过第三个参数来指定

### `fopen()` fopen
```
resource fopen ( string $filename , string $mode [, bool $use_include_path = false [, resource $context ]] )
```
* `fopen()` binds a named resource, specified by filename, to a stream.
* On the Windows platform, be careful to escape any backslashes used in the path to the file, or use forward slashes.
* [para mode](http://php.net/manual/en/function.fopen.php)

### `fclose()` Closes an open file pointer

### `file_put_contents()`
* `file_put_contents()` does not create the directory structure.You will need to add logic to your script to test if the  directory exists by `is_dir()`. If not, use `mkdir()`

### `unlink()`Deletes a file
```
bool unlink ( string $filename [, resource $context ] )
```

### `copy()`  Copies file
```
bool copy ( string $source , string $dest [, resource $context ] )
```
* If the destination path($dest) is a URL, the copy operation may fail if the wrapper does not support overwriting of existing files.
* If the destination file already exists, it will be overwritten.

### `rename()` Renames a file or directory
```
bool rename ( string $oldname , string $newname [, resource $context ] )
```
* Attempts to rename oldname to newname, moving it between directories if necessary. If newname exists, it will be overwritten.
* 根据系统的不同：
    * 可以也可能不可以将一个文件从一个文件系统复制到另一个文件系统
    * 可以也可能不可以发生覆盖原同名文件的情况
* 如果要重命名为汉字，直接转换会出现乱码。因为WINDOWS和UNIX系统的文件名中文编码都是GBK（似乎），不能识别utf-8，需要先转码：  
```
rename('666.txt', iconv("utf-8", "gbk", '中國.txt'));
```

### `flock()` 文件锁定
<mark>不懂 没看</mark>

***
## 文件上传
### php.ini中的设置
* file_uploads：是否允许HTTP方式的文件上传
* upload_tmp_dir：指定上传的文件再被处理前的临时保存目录。如果没有设置则使用默认值
* upload_max_filesize：设置允许上传的文件最大大小。如果文件大小大于该值，PHP将创建一个文件大小为0的占位符文件
* post_max_size：设置PHP可以接受的、通过POST方法上传数据的最大值。该值必须大于upload_max_filesize的值，因为它是所有POST数据的大小，包括了所有上传的文件。

### 文件属性
* tmp_name：在服务器中临时存储的位置
* name：用户系统中的文件名
* size：文件的字节大小
* type：文件的MIME类型
* error：任何与文件上传相关的错误都有一个错误常量，其值为一个整数
    * UPLOAD_ERROR_OK,值为0：没有错误
    * UPLOAD_ERR_INI_SIZE,值为1：文件大小超过了upload_max_filesize的值
    * UPLOAD_ERR_FORM_SIZE,值为2：上传文件的大小超过了MAX_FILE_SIZE的值
    * UPLOAD_ERR_PARTIAL,值为3，表示文件只被部分上传
    * UPLOAD_ERR_NO_FILE，值为4，表示没有上传任何文件
    * UPLOAD_NO_TMP_DIR，值为6，表示在php.ini文件中没有指定临时目录
    * UPLOAD_ERR_CANT_WRITE，值为7，表示将文件写入磁盘失败

### 安全问题
* 不应该允许任何人都可以上传文件
* 应该对上传文件的类型作出限制。避免上传恶意脚本等。
* 使用`is_uploaded_file()`或`move_uploaded_file()`保证文件时用户上传的。
    1. This is useful to help ensure that a malicious user hasn't tried to trick
    the script into working on files upon which it should not be working. For
    instance, `/etc/passwd`.
* 降低用户浏览服务器目录的风险。可以使用`basename()`来修改接收到的文件名，删除文件名中可能的路径部分
* 如果是Windows系统，通常要确保文件路径中用“\\”或“/”替代“\”。

### 相关函数
#### `is_uploaded_file()`
* Tells whether the file was uploaded via HTTP POST
* For proper working, the function `is_uploaded_file()` needs an argument like `$_FILES['userfile']['tmp_name']`, the name of the uploaded file on the client's
machine `$_FILES['userfile']['name']` does not work.

#### `move_uploaded_file(string $filename , string $destination)`
* This function checks to ensure that the file designated by filename is a valid
upload file (meaning that it was uploaded via PHP's HTTP POST upload mechanism).
If the file is valid, it will be moved to the filename given by destination.



***
## 文件权限
[禁止访问的目录](http://stackoverflow.com/questions/2679524/block-direct-access-to-a-file-over-http-but-allow-php-script-access)



***
## Fileinfo
<mark>不懂 没具体看</mark>
