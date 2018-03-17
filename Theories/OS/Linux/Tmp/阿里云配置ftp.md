# 阿里云配置FTP

1. 安装yum时出错
    ```bash
    Unable to locate package yum
    ```
2. 刷新存储库索引    
    ```bash
    apt install yum
    ```
3. 成功安装yum
4. 安装vsftpd
    ```bash
    apt-get install vsftpd
    ```
5. 安装过程中询问是否，我一直没操作，一会儿PuPPY卡死。重启后再安装，提示
    ```bash
    E: Could not get lock /var/lib/dpkg/lock - open (11: Resource temporarily unavailable)
    E: Unable to lock the administration directory (/var/lib/dpkg/), is another process using it?
    ```
6. 执行如下命令依然不行
    ```bash
    rm /var/lib/apt/lists/lock
    ```
7. 重启服务器，安装成功
8. 启动ftp服务
    ```bash
    systemctl start vsftpd.service
    ```
9. 检查ftp服务状态
    ···bash
    systemctl status vsftpd.service
    ```
10. 进入阿里云管理控制台，找到该实例安全组
11. 配置规则——添加安全组规则
    项目 | 值
    -- | --
    规则方向 | 入方向
    授权策略 | 允许
    协议类型 | 自定义TCP
    端口范围 | 20/21
    优先级 | 1
    授权类型 | 地址段访问
    授权对象 | 0.0.0.0/0
12. 打开配置文件
    ```bash
    vi /etc/vsftpd.conf
    ```
13. 按照这个进行了修改
http://blog.csdn.net/px_528/article/details/53931647

14. 在该目录下创建两个文件
sudo touch /etc/vsftpd.chroot_list
sudo touch /etc/allowed_users

15. 发现服务一起无法启动，最后找到原因是vsftpd.conf中多写了空格

16. 按照这里的方法添加了新用户`uftp`并设置了访问目录`uftp`，但使用ftp工具链接不成功
https://jingyan.baidu.com/article/67508eb4d6c4fd9ccb1ce470.html

17. 进入ftp测试内网是否可以连接
http://blog.csdn.net/u013319480/article/details/51946947?locationNum=10
```bash
# ftp
ftp > open 127.0.0.1
```
出错提示
```bash
500 OOPS: vsftpd: cannot locate user specified in 'ftp_username':ftp
```

18. 修改 vsftpd.conf后内网连接成功
从注释 `#anonymous_enable=YES` 改为 `anonymous_enable=NO`

19. 输入刚才创建的用户名`uftp`和密码，内网链接成功

20. 按照下面网址说的开启过21端口。但插入端口时INPUT后面没写数字
http://blog.csdn.net/u013319480/article/details/51946947?locationNum=10

21. 按照阿里云工单回复的，使用FlashFXP把好几个能设为主动模式的都设为了主动模式。root
和`uftp`都能连接。但`uftp`不能上传文件。

22. 把`uftp`目录改为`777`, FlashFXP报错如下：
```bash
500 OOPS: vsftpd: refusing to run with writable root inside chroot ()
```

23. 将用户`uftp`添加到`vsftpd.chroot_list`，可以连接和正常上传下载。但同时也无法约束
`uftp`访问外部目录。

24. 查询后得知，如果将用户约束在其目录下，即没有添加进`vsftpd.chroot_list`。则该用户
的在其主目录不能有写权限。

25. 取消用户主目录`uftp`的写权限，设为`drwxr-xr-x  4 root root`。

26. 同时在其主目录内再建一级目录 `www`，该目录对用户添加写权限，
设为`drwxrwxrwx 2 root root `

27. `uftp`用户也可以正常连接，并且在`www`内拥有完整权限。

28. 但使用8UFTP还是不能使用`uftp`连接。似乎主动模式会被切换为被动模式。如下显示：
```bash
响应：  200 PORT command successful. Consider using PASV.
命令：  TYPE A
响应：  200 Switching to ASCII mode.
命令：  LIST
响应：  425 Failed to establish connection.
错误：  无法取得目录列表
```

29. 远程连接进入ftp模式切换试了也不行
```bash
root@iZuf68ip0m748xlwi572g0Z:~# ftp
ftp> passive
Passive mode on.
ftp> passive
Passive mode off.
ftp> bye
root@iZuf68ip0m748xlwi572g0Z:~#
```

30. 再看8UFtp选项。防火墙设置里，有一项是“对非被动链接使用以下IP地址”。之前启用了该项
并填写了这里的IP。关掉该选项后连接成功。



## References
* [主要流程是按照这个](https://www.cnblogs.com/tonyibm/p/7497978.html)
* [阿里云官方文档](http://help.aliyun.com/document_detail/51998.html)
* [其他参考](http://blog.csdn.net/px_528/article/details/53931647)
* [其他参考](http://blog.csdn.net/mgsky1/article/details/77825386)
* [其他参考](http://blog.csdn.net/liyinsen2333/article/details/69241282)
