# Working with Remotes


## Showing Your Remotes
### `git remote`
1. To see which remote servers you have configured, you can run the `git remote`
command.
2. It lists the shortnames of each remote handle you’ve specified.
3. If you’ve cloned your repository, you should at least see `origin` — that is
the default name Git gives to the server you cloned from.

#### `-v`
You can also specify `-v`, which shows you the URLs that Git has stored for the
shortname to be used when reading and writing to that remote.

### multiple remotes
1. If you have more than one remote, the command lists them all.
2. This means we can pull contributions from any of these users pretty easily.
We may additionally have permission to push to one or more of these.


## upstream & downstream
When you clone a repository, the parent repository is described as being
"Upstream", from your cloned repository and your new repository is described as
being "Downstream" from the parent repository.


## Adding Remote Repositories
1. We’ve mentioned and given some demonstrations of how the `git clone` command
implicitly adds the origin remote for you.
2. Here’s how to add a new remote explicitly. To add a new remote Git repository
as a shortname you can reference easily, run `git remote add <shortname> <url>`
    ```shell
    $ git remote
    origin
    $ git remote add pb https://github.com/paulboone/ticgit
    $ git remote -v
    origin	https://github.com/schacon/ticgit (fetch)
    origin	https://github.com/schacon/ticgit (push)
    pb	https://github.com/paulboone/ticgit (fetch)
    pb	https://github.com/paulboone/ticgit (push)
     ```
3. Now you can use the string `pb` on the command line in lieu of the whole URL.
4. For example, if you want to fetch all the information that Paul has but that
you don’t yet have in your repository, you can run `git fetch pb`:
    ```shell
    $ git fetch pb
    remote: Counting objects: 43, done.
    remote: Compressing objects: 100% (36/36), done.
    remote: Total 43 (delta 10), reused 31 (delta 5)
    Unpacking objects: 100% (43/43), done.
    From https://github.com/paulboone/ticgit
     * [new branch]      master     -> pb/master
     * [new branch]      ticgit     -> pb/ticgit
     ```
     Paul’s master branch is now accessible locally as `pb/master` — you can
     merge it into one of your branches, or you can check out a local branch at
     that point if you want to inspect it.


## Fetching and Pulling from Your Remotes
### `git fetch <remote>`
1. The command goes out to that remote project and pulls down all the data from
that remote project that you don’t have yet.
2. After you do this, you should have references to all the branches from that
remote, which you can merge in or inspect at any time.
3. If you clone a repository, the command automatically adds that remote
repository under the name “origin”. So, `git fetch origin` fetches any new work
that has been pushed to that server since you cloned (or last fetched from) it.
4. It’s important to note that the `git fetch` command only downloads the data
to your local repository — it doesn’t automatically merge it with any of your
work or modify what you’re currently working on. You have to merge it manually
into your work when you’re ready.

### `git pull`
1. If your current branch is set up to track a remote branch, you can use the
`git pull` command to automatically fetch and then merge that remote branch into
your current branch.
2. This may be an easier or more comfortable workflow for you; and by default,
the git clone command automatically sets up your local master branch to track
the remote master branch (or whatever the default branch is called) on the
server you cloned from.
3. Running `git pull` generally fetches data from the server you originally
cloned from and automatically tries to merge it into the code you’re currently
working on.


## Pushing to Your Remotes
### `git push <remote> <branch>`
1. When you have your project at a point that you want to share, you have to
push it upstream.
2. The command for this is simple: `git push <remote> <branch>`.
3. If you want to push your master branch to your `origin` server (again,
cloning generally sets up both of those names for you automatically), then you
can run this to push any commits you’ve done back up to the server.
4. This command works only if you cloned from a server to which you have write
access and if nobody has pushed in the meantime. If you and someone else clone
at the same time and they push upstream and then you push upstream, your push
will rightly be rejected. You’ll have to fetch their work first and incorporate
it into yours before you’ll be allowed to push.

### `-u`参数
默认情况下，`push`和`pull`时都要指定远程仓库。在`push`时加上该参数，会将当前的远程仓库
设为默认，之后可以直接`git pull`或`git push`而不用知名远程仓库。


## Inspecting a Remote
1. If you want to see more information about a particular remote, you can use
the `git remote show <remote>` command.
2. This command shows which branch is automatically pushed to when you run
`git push` while on certain branches.
3. It also shows you which remote branches on the server you don’t yet have,
which remote branches you have that have been removed from the server, and
multiple local branches that are able to merge automatically with their
remote-tracking branch when you run `git pull`.

```shell
$ git remote show origin
* remote origin
  URL: https://github.com/my-org/complex-project
  Fetch URL: https://github.com/my-org/complex-project
  Push  URL: https://github.com/my-org/complex-project
  HEAD branch: master
  Remote branches:
    master                           tracked
    dev-branch                       tracked
    markdown-strip                   tracked
    issue-43                         new (next fetch will store in remotes/origin)
    issue-45                         new (next fetch will store in remotes/origin)
    refs/remotes/origin/issue-11     stale (use 'git remote prune' to remove)
  Local branches configured for 'git pull':
    dev-branch merges with remote dev-branch
    master     merges with remote master
  Local refs configured for 'git push':
    dev-branch                     pushes to dev-branch                     (up to date)
    markdown-strip                 pushes to markdown-strip                 (up to date)
    master                         pushes to master                         (up to date)
```


## Renaming and Removing Remotes
### rename
1. You can run `git remote rename` to change a remote’s shortname.
2. For instance, if you want to rename `pb` to `paul`, you can do so with
`git remote rename`:
    ```shell
    $ git remote rename pb paul
    $ git remote
    origin
    paul
    ```
3. It’s worth mentioning that this changes all your remote-tracking branch names
, too. What used to be referenced at `pb/master` is now at `paul/master`.

### remove
1. If you want to remove a remote for some reason — you’ve moved the server or
are no longer using a particular mirror, or perhaps a contributor isn’t
contributing anymore — you can either use `git remote remove` or `git remote rm`:
    ```shell
    $ git remote remove paul
    $ git remote
    origin
    ```
2. Once you delete the reference to a remote this way, all remote-tracking
branches and configuration settings associated with that remote are also deleted.


## References
* [Git Basics - Working with Remotes](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes)
