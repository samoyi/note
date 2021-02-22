# Branch Management


## 查看分支
* `git branch`不带参数查看当前分支
* `git branch -v`查看每个分支的最后一次提交
* `git branch --merged`查看已经合并到当前分支的分支
* `git branch --no=merged`查看尚未合并到当前分支的分支


## 删除分支
* 以合并的分支可以通过`git branch -d branchname`删除
* 不能这样删除未合并的分支。如果要强制删除未合并的分支，`-d`改为`-D`。


## References
* [Git Branching - Branch Management](https://git-scm.com/book/en/v2/Git-Branching-Branch-Management)
