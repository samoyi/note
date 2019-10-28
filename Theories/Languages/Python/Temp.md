# Temp

## 安装与配置
* windows 环境下 pip 的命令不是`pip`，而是`python -m pip `。例如要查看版本，不能是`pip --version`，而应该是`python -m pip --version`.
* 在使用 git bash 的时候 python 是不能直接运行的，为了实现这一点需要永久声明一个别名：
    ```shell
    alias python='winpty python.exe'
    ```
* **安装超时**：`socket.timeout: The read operation timed out`。使用下面的命令试了两次后安装成功：`python -m pip --default-timeout=100 install -U Pillow`


## 路径
* 拼路径的时候，至少在 windows 系统中，要使用绝对路径
    ```py
    # 为了导入父目录的文件而进行的设定
    # sys.path.append(os.pardir)  # 书上的写法，不成功
    sys.path.append(os.path.join(os.path.dirname(__file__), os.pardir)) # 这样写可以
    ```