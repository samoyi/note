# Viewing the Commit History


## Author 和 Commit 的区别
1. Author 指的是实际作出修改的人，Commit 指的是最后将此工作成果提交到仓库的人。
2. 所以，当你为某个项目发布补丁，然后某个核心成员将你的补丁并入项目时，你就是 Author，
而那个核心成员就是 Commit。


## 常用选项
选项 | 意义
--|--
`-p` | 显示每次提交的内容差异
`-n` | 只显示最近 n 次的提交
`--stat` | 显示每次提交具体有哪些文件被新增、删除和修改了
`--shortstat` | 不显示具体哪些文件，只显示新增、删除、修改的文件数量
`--name-only` | 显示每次提交变动的文件，不显示怎么变动
`--name-status` | 显示每次提交变动的文件，显示怎么变动（新增、删除或修改）
`abbrev-commit` | 只显示 sha-1 的前几个字符
`relative=data` | 显示相对时间，如`2 days age`
`--graph` | 显示 ASCII 图形表示的分支合并历史
`--pretty` | 可以指定不同于默认格式的方式展示提交内容，下面会详说


## `--pretty`
该选项通过配合子选项来呈现不同的展现形式(子选项前面不加空格)

<table>
    <thead>
        <tr>
            <th>子选项</th>
            <th>显示形式</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                `=online`
            </td>
            <td>
                每条记录显示在一行<br />
                不会显示`Author`和`Data`；只会显示提交简短信息，不会显示详细提交信息
            </td>
        </tr>
        <tr>
            <td>
                `=short`
            </td>
            <td>
                不会显示`Data`<br />
                只会显示提交简短信息，不会显示详细提交信息
            </td>
        </tr>
        <tr>
            <td>
                `=full`
            </td>
            <td>不会显示`Data`，但会显示`Commit`</td>
        </tr>
        <tr>
            <td>
                `=fuller`
            </td>
            <td>
                不会显示`Data`，但会显示`AuthorData`和`CommitData`<br />
                也会显示`Commit`
            </td>
        </tr>
        <tr>
            <td>
                `=format`
            </td>
            <td>
                自定义显示格式。下面详述
            </td>
        </tr>
    </tbody>
</table>

### `=format`
常用选项：

选项 | 说明
--|--
`%H` | 提交对象（commit）的完整哈希字串
`%h` | 提交对象的简短哈希字串
`%T` | 树对象（tree）的完整哈希字串
`%t` | 树对象的简短哈希字串
`%P` | 父对象（parent）的完整哈希字串
`%p` | 父对象的简短哈希字串
`%an` | 作者（author）的名字
`%ae` | 作者的电子邮件地址
`%ad` | 作者修订日期（可以用 --date= 选项定制格式）
`%ar` | 作者修订日期，按多久以前的方式显示
`%cn` | 提交者（committer）的名字
`%ce` | 提交者的电子邮件地址
`%cd` | 提交日期
`%cr` | 提交日期，按多久以前的方式显示
`%s` | 提交说明

例如`git log --pretty=format:"%h - %an, %ar : %s"`，显示的某一条的记录是
```shell
371f49b - samoyi, 2 hours age : 调整 Tools 目录结构
```


## 过滤记录
选项 | 说明
--|--
`-n` | 只显示最近的 n 条记录
`--since`, `--after` | 仅显示指定时间之后的提交。例如`git log --since=2.weeks`
`--until`, `--before` | 仅显示指定时间之前的提交。
`--author` | 仅显示指定作者相关的提交。
`--committer` | 仅显示指定提交者相关的提交。
`--grep` | 仅显示含指定关键字的提交
`-S` | 仅显示添加或移除了某个关键字的提交。

### 时间的格式
可以在多种格式下工作。例如`2008-01-51`、`2.weeks`、`2 years 1 day 3 minute age`等

### `-S`
例如添加了一个文件，该文件内有字符串`已部署为中心`，则`git log -S已部署为中心`会显示该
次提交记录。



## References
* [Git Basics](https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History)
