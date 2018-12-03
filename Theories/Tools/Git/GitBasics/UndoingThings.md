# Undoing Things


## 撤销对文件的修改
1. 任何没有通过`add`添加到暂存区的修改都可以被撤销。
2. 事实就和听起来一样，是一个危险的操作。在你修改了文件，并且`Ctrl+s`保存之后，如果执行
了这个命令，那这些修改就都不见了！如果你的文件一直开着，那还可以通过`Ctrl+z`来恢复，不
过如果已经关了，那就恢复不了了。
3. 在对文件修改后，如果执行`git status`就可以看到撤销的命令的提示
    ```shell
    hanges not staged for commit:
    (use "git add <file>..." to update what will be committed)
    (use "git checkout -- <file>..." to discard changes in working directory)
    ```
4. 因此只要使用`git checkout -- 撤销对该文件的修改.md`就可以删除之前的修改。


## 撤销暂存的文件
1. 在`add`了一个文件而后悔之后，可以取消将其暂存。
2. add 之后如果执行`git status`就可以看到撤销的命令的提示
    ```shell
    Changes to be committed:
    (use "git reset HEAD <file>..." to unstage)
    ```
3. 因此只要`git reset HEAD 把这个文件移出暂存区.md`即可让这个文件变为未经`add`的状态。
4. 注意，在调用该撤销命令时如果加上`--hard`选项会让该命令变得危险，可能会导致工作目录中
所有当前进度丢失。不懂，实际测试中，如果使用了`--hard`选项，则该命令不能带路径，即只能
`git reset --hard HEAD`。这时因为 reset 到了 HEAD，所以之前的修改全部消失了。


## 对 commit 进行修改
1. 如果刚进行了一次 commit，但是发现 message 写错了，或者发现本次 commit 少提交了一个
文件，则可以进行一次重提交。
2. `git commit --amend -m '新的message'`或
3. 该命令会用一个新的提交合并并替换之前一次的提交。
4. 如果直接`git commit --amend`而没写 message，则会进入编辑模式，在编辑模式里填写
message。


## References
* [Git Basics](https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things)
