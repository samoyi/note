# daemon

## 启动
* [Linux 守护进程的启动方法](http://www.ruanyifeng.com/blog/2016/02/linux-daemon.html)
* [How to make a node.js application run permanently?
 DogNibbler的回答](https://stackoverflow.com/a/32029341)

## 关闭
如果不是使用`forever`等外部工具，则需要[手动结束进程](https://stackoverflow.com/a/26987229)
1. Get the node process id by use
```bash
ps -ef | grep "node"
//9500 pts/0  00:00:00 .node.bin
```
2. Kill the process by
```bash
kill 9500
//you can use the PID to kill if not use kill -9 pid
```
