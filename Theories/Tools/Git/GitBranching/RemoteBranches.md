# Remote Branches

## 查看远程分支
### 直接查看远程主机信息
* `git remote show` 查看有哪些远程主机
* `git remote show 远程主机名称` 查看某个远程主机信息
    ```shell
    $ git remote show origin
    * remote origin
      Fetch URL: git@github.com:samoyi/note.git
      Push  URL: git@github.com:samoyi/note.git
      HEAD branch: master
      Remote branches:
        linux  tracked
        master tracked
        test   tracked
      Local branch configured for 'git pull':
        master merges with remote master
      Local ref configured for 'git push':
        master pushes to master (up to date)
    ```
* `git ls-remote 远程主机名称` 查看某个远程主机有哪些分支
    ```shell
    $ git ls-remote
    From git@github.com:samoyi/note.git
    05c6a5713551650cfc5a731baec4a91c6f8b531f        HEAD
    0bc7e1f493765dae074fdd8cc19fe6d6bc8dadaf        refs/heads/linux
    05c6a5713551650cfc5a731baec4a91c6f8b531f        refs/heads/master
    9a1fd88e52be844ae5bee96130002652a91ee6a7        refs/heads/test
    ```

## “origin” is not special
1. Just like the branch name “master” does not have any special meaning in Git, neither does “origin”.
2. While “master” is the default name for a starting branch when you run git init which is the only reason it’s widely used, “origin” is the default name for a remote when you run `git clone`. If you run `git clone -o booyah` instead, then you will have `booyah/master` as your default remote branch.


## 远程跟踪分支(remote-tracking branches)
1. Remote-tracking branches are references to the state of remote branches.
2. They’re local references that you can’t move; Git moves them for you whenever you do any network communication, to make sure they accurately represent the state of the remote repository.
3. Think of them as bookmarks, to remind you where the branches in your remote repositories were the last time you connected to them.
4. Remote-tracking branch names take the form `<remote>/<branch>`.
5. Let’s say you have a Git server on your network at `git.ourcompany.com`. If you clone from this, Git’s clone command automatically names it `origin` for you, pulls down all its data, creates a pointer to where its master branch is, and
names it `origin/master` locally. Git also gives you your own local master branch starting at the same place as origin’s master branch, so you have something to work from.


## Pushing
1. `git push (remote) (branch)`
2. This is a bit of a shortcut. Git automatically expands the `serverfix` branchname out to `refs/heads/serverfix:refs/heads/serverfix`, which means, “Take my serverfix local branch and push it to update the remote’s serverfix branch.”
3. You can also do `git push origin serverfix:serverfix`, which does the same thing — it says, “Take my serverfix and make it the remote’s serverfix.”
4. You can use this format to push a local branch into a remote branch that is named differently. If you didn’t want it to be called `serverfix` on the remote, you could instead run `git push origin serverfix:awesomebranch` to push your local `serverfix` branch to the `awesomebranch` branch on the remote project.


## Fetching
1. The next time one of your collaborators fetches from the server, they will get a reference to where the server’s version of `serverfix` is under the remote branch `origin/serverfix`:
    ```shell
    $ git fetch origin
    remote: Counting objects: 7, done.
    remote: Compressing objects: 100% (2/2), done.
    remote: Total 3 (delta 0), reused 3 (delta 0)
    Unpacking objects: 100% (3/3), done.
    From https://github.com/schacon/simplegit
     * [new branch]      serverfix    -> origin/serverfix
     ```
2. It’s important to note that when you do a fetch that brings down new remote-tracking branches, you don’t automatically have local, editable copies of them. In other words, in this case, you don’t have a new `serverfix` branch — you have only an `origin/serverfix` pointer that you can’t modify.
3. To merge this work into your current working branch, you can run `git merge origin/serverfix`.
4. If you want your own `serverfix` branch that you can work on, you can base it off your remote-tracking branch:
    ```shell
    $ git checkout -b serverfix origin/serverfix
    Branch serverfix set up to track remote branch serverfix from origin.
    Switched to a new branch 'serverfix'
    ```
5. This gives you a local branch that you can work on that starts where `origin/serverfix` is.


## Tracking Branches
### Create
1. Checking out a local branch from a remote-tracking branch automatically creates what is called a “tracking branch” (and the branch it tracks is called an “upstream branch”).
2. Tracking branches are local branches that have a direct relationship to a remote branch. If you’re on a tracking branch and type `git pull`, Git automatically knows which server to fetch from and which branch to merge in.
3. When you clone a repository, it generally automatically creates a `master` branch that tracks` origin/master`. However, you can set up other tracking branches if you wish — ones that track branches on other remotes, or don’t track the master branch.
4. The simple case is running `git checkout -b <branch> <remote>/<branch>`. This is a common enough operation that Git provides the `--track` shorthand:
    ```shell
    $ git checkout --track origin/serverfix
    Branch serverfix set up to track remote branch serverfix from origin.
    Switched to a new branch 'serverfix'
    ```
5. In fact, this is so common that there’s even a shortcut for that shortcut. If the branch name you’re trying to checkout (a) doesn’t exist and (b) exactly matches a name on only one remote, Git will create a tracking branch for you:
    ```shell
    $ git checkout serverfix
    Branch serverfix set up to track remote branch serverfix from origin.
    Switched to a new branch 'serverfix'
    ```
6. To set up a local branch with a different name than the remote branch, you can easily use the first version with a different local branch name:
    ```shell
    $ git checkout -b sf origin/serverfix
    Branch sf set up to track remote branch serverfix from origin.
    Switched to a new branch 'sf'
    ```
    Now, your local branch `sf` will automatically pull from `origin/serverfix`.
7. If you already have a local branch and want to set it to a remote branch you just pulled down, or want to change the upstream branch you’re tracking, you can use the `-u` or `--set-upstream-to` option to git branch to explicitly set it at any time.
    ```shell
    $ git branch -u origin/serverfix
    Branch serverfix set up to track remote branch serverfix from origin.
    ```

### Show
1. If you want to see what tracking branches you have set up, you can use the `-vv` option to `git branch`. This will list out your local branches with more information including what each branch is tracking and if your local branch is ahead, behind or both.
    ```shell
    $ git branch -vv
      iss53     7e424c3 [origin/iss53: ahead 2] forgot the brackets
      master    1ae2a45 [origin/master] deploying index fix
    * serverfix f8674d9 [teamone/server-fix-good: ahead 3, behind 1] this should do it
      testing   5ea463a trying something new
    ```
    So here we can see that our `iss53` branch is tracking `origin/iss53` and is “ahead” by two, meaning that we have two commits locally that are not pushed to the server. We can also see that our `master` branch is tracking `origin/master` and is up to date. Next we can see that our `serverfix` branch is tracking the `server-fix-good` branch on our `teamone` server and is ahead by three and behind by one, meaning that there is one commit on the server we haven’t merged in yet and three commits locally that we haven’t pushed. Finally we can see that our `testing` branch is not tracking any remote branch.
2. It’s important to note that these numbers are only since the last time you fetched from each server. This command does not reach out to the servers, it’s telling you about what it has cached from these servers locally. If you want totally up to date ahead and behind numbers, you’ll need to fetch from all your remotes right before running this. You could do that like this:
```shell
$ git fetch --all; git branch -vv
```


## Pulling
1. While the `git fetch` command will fetch all the changes on the server that you don’t have yet, it will not modify your working directory at all. It will simply get the data for you and let you merge it yourself.
2. However, there is a command called `git pull` which is essentially a `git fetch` immediately followed by a `git merge` in most cases.
3. If you have a tracking branch, either by explicitly setting it or by having it created for you by the `clone` or `checkout` commands, `git pull` will look up what server and branch your current branch is tracking, fetch from that server and then try to merge in that remote branch.
4. Generally it’s better to simply use the `fetch` and `merge` commands explicitly as the magic of `git pull` can often be confusing.


## Deleting Remote Branches
1. If you want to delete your `serverfix` branch from the server, you run the following:
    ```shell
    $ git push origin --delete serverfix
    To https://github.com/schacon/simplegit
     - [deleted]         serverfix
    ```
2. Basically all this does is remove the pointer from the server. The Git server will generally keep the data there for a while until a garbage collection runs, so if it was accidentally deleted, it’s often easy to recover.


## References
* [Git Branching - Remote Branches](https://git-scm.com/book/en/v2/Git-Branching-Remote-Branches)
