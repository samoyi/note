# Basic
windows

## 基本命令
### 启动
1. 在 nginx 根目录(nginx.exe 所在目录)下，命令行运行`start nginx`
2. 虽然也可以直接`nginx.exe`来启动，但这将导致启动后窗口无法再输入任何命令。目前还不知
道这种情况下要怎么停止 nginx，关闭窗口也不能，只能在任务管理器里结束进程。

### 停止
1. `nginx.exe -s stop`或`nginx.exe -s quit`命令。
2. `stop`是快速停止，可能并不保存相关信息；`quit`是完整有序的停止，并保存相关信息。

### 重新载入
1. 当修改配置后，不用停止再启动，可以直接`nginx.exe -s reload`使用重载。

### 查看版本
`nginx -v`


## 基本配置


### 小例子——配置 Vue-cli 的生产环境
1. 由于 Vue-cli `build`之后的输出要放在服务器环境下，所以如果要在本地测试则必须要有环
境。之前我用的 PHP 环境，也可以用 Nginx。
2. 把配置文件里面`listen`改为想要监听的端口号，比如`8080`
3. `location`里面的`root`改为 build 之后的`dist`目录，比如
    `D:/WWW/test/vuecli2test/dist`
4. `location`里面的`index`不用改，本来就有`index.html`
5. 启动 nginx，访问`http://localhost:8080`就可以看到 vue 项目。
