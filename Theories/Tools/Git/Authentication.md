# Authentication

## 遇到的问题
### 电脑修改密码后，Gitlab 不能 push、pull 和 clone
1. 开始时弹出一个对话框让我输入账户和密码。
2. 输入错了之后再进行远程操作就不弹对话框而是直接报错：
    ```shell
    remote: HTTP Basic: Access denied
    fatal: Authentication failed for '远程仓库地址'
    ```
3. 这个[提问](https://stackoverflow.com/q/47860772)也是同样的问题，其中 Bharti
Ladumor 的回答解决了我的问题。步骤如下：
    1. Apply command from cmd
        ```shell
        git config --system --unset credential.helper
        ```
    2. And when I execute the above command, I got another error
        ```shell
        error: could not lock config file C:\Program Files\Git\mingw64/etc/gitconfig: Permission denied
        ```
    2. And then I removed `gitconfig` file from
    `C:\Program Files\Git\mingw64/etc/` location
    3. After that use git command like git pull or git push, it asked me for
    username and password. applying valid username and password and git command
    working.
4. 不过，我以为成功连接后在上面目录上会生成新的`gitconfig`，不过不懂为什么并没有。
