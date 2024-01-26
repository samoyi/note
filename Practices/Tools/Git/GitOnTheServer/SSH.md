# SSH


## 公钥登录
1. 使用密码登录，每次都必须输入密码，非常麻烦。好在 SSH 还提供了公钥登录，可以省去输入密码的步骤。
2. 所谓 "公钥登录"，原理很简单，就是用户将自己的公钥储存在远程主机上。登录的时候，远程主机会向用户发送一段随机字符串，用户用自己的私钥加密后，再发回来。远程主机用事先储存的公钥进行解密，如果成功，就证明用户是可信的，直接允许登录 shell，不再要求密码。


## fingerprints
TODO，不懂，为什么 Github 的公钥指纹是固定的？为什么不是一个公钥生成一个指纹？
https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints


## 遇到的问题
### `Connection timed out`
1. 错误信息如下
    ```
    ssh: connect to host github.com port 22: Connection timed out
    fatal: Could not read from remote repository.
    ```
2. 根据 [这个回答](https://stackoverflow.com/a/52817036) 解决
    1. 找到这个文件 `用户名 ~/.ssh/config`，没有的话新建
    2. 添加如下内容
        ```
        Host github.com
         Hostname ssh.github.com
         Port 443
        ```
3. 使用如下命令测试一下看看是否好了 `ssh -T git@github.com`
4. [这篇](https://docs.github.com/en/authentication/troubleshooting-ssh/using-ssh-over-the-https-port) 解释了原因


## References
* [详述 SSH 的原理及其应用](https://github.com/guobinhit/cg-blog/blob/master/articles/others/detail-ssh.md)
* [Git on the Server - Generating Your SSH Public Key](https://git-scm.com/book/en/v2/Git-on-the-Server-Generating-Your-SSH-Public-Key)
* [Doc](https://help.github.com/articles/connecting-to-github-with-ssh/)
* [使用 SSH 进行连接](https://docs.github.com/zh/authentication/connecting-to-github-with-ssh/about-ssh)
