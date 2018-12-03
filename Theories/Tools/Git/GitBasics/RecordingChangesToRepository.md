# Recording Changes to the Repository


## *tracked* and *untracked* file
1. Each file in your working directory can be in one of two states: tracked or
untracked.
2. Tracked files are files that were in the last snapshot; they can be
unmodified, modified, or staged. In short, tracked files are files that Git
knows about.
3. Untracked files are everything else — any files in your working directory
that were not in your last snapshot and are not in your staging area.
4. 刚刚新加的文件是 untracked 的，但只要对其 add，就是 tracked 的了。如果 add 了之后
又 reset 撤消了，则又恢复了 untracked 状态。
5. When you first clone a repository, all of your files will be tracked and
unmodified because Git just checked them out and you haven’t edited anything.
6. As you edit files, Git sees them as modified, because you’ve changed them
since your last commit. As you work, you selectively stage these modified files
and then commit all those staged changes, and the cycle repeats.


## Checking the Status of Your Files
`git status`

### Short Status
如果你使用`git status -s`命令或`git status --short`命令，你将得到一种更为紧凑的格式
输出

```shell
$ git status -s
 M README
MM Rakefile
A  lib/git.rb
M  lib/simplegit.rb
?? LICENSE.txt
```

* 新添加的未跟踪文件前面有`??`标记
* 新添加到暂存区中的文件前面有`A`标记
* 修改过的文件前面有`M`标记
    * 出现在右边的`M`表示该文件被修改了但是还没放入暂存区
    * 出现在靠左边的`M`表示该文件被修改了并放入了暂存区

    例如，上面的状态报告显示： `README`文件在工作区被修改了但是还没有将修改后的文件放入
    暂存区；`lib/simplegit.rb`文件被修改了并将修改后的文件放入了暂存区；而`Rakefile`
    在工作区被修改并提交到暂存区后又在工作区中被修改了，所以在暂存区和工作区都有该文件被
    修改了的记录。


## Tracking New Files
1. `git add`
2. The `git add` command takes a path name for either a file or a directory; if
it’s a directory, the command adds all the files in that directory recursively.


## Staging Modified Files
`git add`


## Viewing Your Staged and Unstaged Changes
`git diff`命令只能用于 tracked 文件

### `git diff`
1. To see what you’ve changed but not yet staged, type `git diff` with no other
arguments
2. This command compares what is in your working directory with what is in your
staging area. The result tells you the changes you’ve made that you haven’t yet
staged.

### `git diff --staged`
1. If you want to see what you’ve staged that will go into your next commit, you
can use `git diff --staged`.
2. This command compares your staged changes to your last commit.


## Committing Your Changes
1. 默认使用`-m`只能编写单行提交信息。
2. 如果要编写多行，可以直接不带参数提交，然后编辑器就会启动。
3. 应该先用一行文字简述提交的内容，空一行字后再详细的说明。
4. `#`号可以注释一行。
5. 如果没有输入提交信息，则提交会被终止。


## Skipping the Staging Area
1. 尽管使用暂存区域的方式可以精心准备要提交的细节，但有时候这么做略显繁琐。
2. Git 提供了一个跳过使用暂存区域的方式， 只要在提交的时候，给`git commit`加上`-a`选
项，Git 就会自动把所有已经跟踪过的文件暂存起来一并提交，从而跳过`git add`步骤。
3. 只适用于 tracked 文件。


## Removing Files
### 删除文件
1. 使用`git rm filename`移除一个文件后，将移除工作区的`filename`文件，并且本次删除会
直接进入缓存区，可以直接 commit 本次删除。
2. 而如果直接手动删除了一个文件，之后`git status`，可以看到类似如下
    ```shell
    Changes not staged for commit:
    (use "git add/rm <file>..." to update what will be committed)
    (use "git checkout -- <file>..." to discard changes in working directory)

        deleted:    1.txt
    ```
    之后需要 add 并 commit。不过也可以运行`git rm`不带文件名，然后再 commit

### 将文件从仓库中移除但并不删除
1. 带上`--cached`参数，例如`git rm --cached filename`。
2. `filename`并不会从工作区真的被删除，它实际上的效果相当于：在工作区里刚刚新加了一个文
件`filename`，还出去 untracked 状态。
3. 之后你可以把`filename`剪切走或者将它加到`.gitignore`里面。

### `glob`模式
`git rm`命令后面可以列出文件或者目录的名字，也可以使用`glob`模式

```shell
git rm log/\*.log
```
该命令会删除`log/`目录下扩展名为`.log`的所有文件

```shell
git rm \*~
```
该命令会删除以`~`结尾的所有文件


## Moving Files
1. Git doesn’t explicitly track file movement. If you rename a file in Git, no
metadata is stored in Git that tells it you renamed the file.
2. However, Git is pretty smart about figuring that out after the fact。
3. If you want to rename a file in Git, you can run something like:
    ```shell
    $ git mv file_from file_to
    ```
4. In fact, if you run something like this and look at the status, you’ll see
that Git considers it a renamed file:
    ```shell
    $ git mv README.md README
    $ git status
    On branch master
    Your branch is up-to-date with 'origin/master'.
    Changes to be committed:
      (use "git reset HEAD <file>..." to unstage)

        renamed:    README.md -> README
    ```
5. However, this is equivalent to running something like this:
    ```shell
    $ mv README.md README
    $ git rm README.md
    $ git add README
    ```


## [Ignoring Files](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)


## References
* [Git Basics](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)
