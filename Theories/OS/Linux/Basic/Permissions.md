# Permissions

## 3 sets of people
Each file and directory has three user based permission groups:
* `owner` - a single person who owns the file or directory.(typically the person
 who created the file but ownership may be granted to some one else by certain
users)
* `group` - every file or directory belongs to a single group.
* `others` - everyone else who is not in the group or the owner.



## Permission Types
### 对于文件来说
* `r` read - you may read the contents of the file.
* `w` write - you may edit, add, or modify the contents of the file, but can not
delete the file.
* `x` execute - you may execute or run the file if it is a program or script.  
這裡你就必須要小心啦！ 因為在Windows底下一個檔案是否具有執行的能力是藉由『 副檔名 』
來判斷的， 例如：`.exe`, `.bat`, `.com` 等等，但是在Linux底下，我們的檔案是否能被執
行，則是藉由是否具有`x`這個權限來決定的！跟檔名是沒有絕對的關係的！

### 对于目录来说
* `r` - 表示具有讀取目錄結構清單的權限
* `w` - 改变該目錄結構清單的權限：
    * 建立新的檔案與目錄；
    * 刪除已經存在的檔案與目錄(不論該檔案的權限為何！)
    * 將已存在的檔案或目錄進行更名；
    * 搬移該目錄內的檔案、目錄位置。
* `x` - 目錄的`x`代表的是使用者能否進入該目錄成為工作目錄。  
所謂的工作目錄(work directory)就是你目前所在的目錄啦！

### 一个具体的权限表示
1. 由个长度为10的字符串表示。
2. 第一位的值表示该权限主体的类型：
    * 當為[ d ]則是目錄，例如上表檔名為『.config』的那一行；
    * 當為[ - ]則是檔案，例如上表檔名為『initial-setup-ks.cfg』那一行；
    * 若是[ l ]則表示為連結檔(link file)；
    * 若是[ b ]則表示為裝置檔裡面的可供儲存的周邊設備(可隨機存取裝置)；
    * 若是[ c ]則表示為裝置檔裡面的序列埠設備，例如鍵盤、滑鼠(一次性讀取裝置)。
3. 接下来的9个字符，分为3组，每组3个字符。第一组表示`owner`对该主体的`rwx`权限，第二
组表示`group`对该主体的`rwx`权限，第一组表示`other`对该主体的`rwx`权限。
4. 在对应的位置上，如果是相应的权限字符，则表示具有该权限。如果是`-`，表示没有该权限。



## Change Permissions
参考[这里](http://linux.vbird.org/linux_basic/0210filepermission.php)



## References
* [Permissions!](https://ryanstutorials.net/linuxtutorial/permissions.php)
* [Understanding Linux File Permissions](https://www.linux.com/learn/understanding-linux-file-permissions)
* [鸟哥的Linux私房菜](http://linux.vbird.org/linux_basic/0210filepermission.php)
