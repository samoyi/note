# Windows下的安装和使用

[官方文档](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
文档的版本是 4.0，我装的是 3.6

## Steps
1. 按照文档说明进行安装 MongoDB Server。
2. 安装完毕后，还要设定用来存储数据的数据目录(data directory)
3. 建立目录`d:\mongodb\data`，并执行以下命令设定其为数据目录
```shell
"C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe" --dbpath d:\mongodb\data
```
之后该目录自动生成了一些文件
4. 按照文档说的，似乎是设定完数据目录后还用再运行`mongod.exe`才能启动服务，不过实际的情
况是上述第3步本身就会启动，最后一行会有如下输入
```shell
[initandlisten] waiting for connections on port 27017
```
6. 但之后每次重新开机后仍然要运行`mongod.exe`才能启动服务，输入如下：
```shell
"C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe" --dbpath d:\mongodb\data
```
7. 启动服务之后就可以通过同时安装的 MongoDB Compass 来查看和管理。默认配置即可打开本地
启动的数据库。也是启动服务后后端才可以链接和使用 MongoDB。
