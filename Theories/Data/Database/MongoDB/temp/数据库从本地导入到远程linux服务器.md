# 数据库从本地导入到远程linux服务器
从本地的`project`数据库`documents`集合导入到linux上的相应位置

## 导出本地数据库
1. 使用和`mongoexport.exe`工具，目前本地的路径是`C:\Program Files\MongoDB\Server\3.6\bin`
2. 参数说明:
    * `-h` 数据库地址
    * `-d` 指明使用的库
    * `-c` 指明要导出的集合
    * `-o` 指明要导出的文件名（文件支持多种格式，如txt,wps,xls等）
3. 示例：
    * `mongoexport -h localhost:27017 -d kaiye -c c2 -o C://mongoexport/test.txt`
    * `mongoexport -h localhost:27017 -d kaiye -c c2 -o C://mongoexport/test.wps`
    * `mongoexport -h localhost:27017 -d kaiye -c c2 -o C://mongoexport/test.xls`
4. 我实际输入的命令是（在`C:\Program Files\MongoDB\Server\3.6\bin`路径下）：
```shell
mongoexport -h localhost:27017 -d project -c documents -o D:\WWW\documents.txt
```
5. 通过ftp把导出的文件`documents.txt`上传到`/home/uftp/www`

## Linux 服务器新建数据库
1. 进入 shell 命令模式
```shell
mongo
```
2. 要新建一个名为`project`的数据库，直接使用切换命令即可新建
```shell
use project
```
3. 在其中建一个名为`documents`的 collection
```shell
db.createCollection('documents')
```
4. 在本地 Windows 上运行`mongoexport`要按照路径确定的找到`mongoexport.exe`，但在
linux不知道是之前配置过还是什么，似乎在任何路径都可以直接运行`mongoexport`命令。因为我
在好几个路径下尝试`mongoexport --help`都可以
5. 我切换路径到`/home/uftp/www`，通过以下命令把`documents.txt`导入到新创建的
collection里：
```shell
mongoimport -h localhost:27017 -d project -c documents ./documents.txt
```
提示我 `imported 6 objects`



## References
* [MongoDB的导入导出](https://www.cnblogs.com/jiyukai/p/6980104.html)
* [Ubuntu下MongoDB的安装和使用](https://blog.csdn.net/flyfish111222/article/details/51886787)
