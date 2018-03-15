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
    端口范围 | 21/22
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

ftpuser中注释了root
http://blog.csdn.net/liyinsen2333/article/details/69241282


https://www.2cto.com/net/201306/221473.html
http://blog.csdn.net/px_528/article/details/53931647
http://blog.csdn.net/mgsky1/article/details/77825386
