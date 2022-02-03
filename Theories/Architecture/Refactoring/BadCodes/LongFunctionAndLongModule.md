# Long Function and Long Module


<!-- TOC -->

- [Long Function and Long Module](#long-function-and-long-module)
    - [思想](#思想)
        - [SRP](#srp)
    - [过长函数或过大模块的问题](#过长函数或过大模块的问题)
        - [内部耦合度高](#内部耦合度高)
        - [无法准确命名](#无法准确命名)
    - [过长的标准是什么？](#过长的标准是什么)
        - [过长是相对的](#过长是相对的)
        - [例子](#例子)
            - [例 1](#例-1)
            - [例 2](#例-2)
            - [例 3](#例-3)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
### SRP


## 过长函数或过大模块的问题
### 内部耦合度高
1. 一个过长的函数或过大的模块都不只是单一功能，而是若干个功能融合在一起。
2. 若干个功能的耦合必然带来理解和修改的困难。

### 无法准确命名
1. 因为它内部耦合了若干个功能，所以你的命名常常不能准确又全面。
2. 要么以偏概全，让人无法通过名字理解内容；要么用一个很长的命名，同样影响阅读。


## 过长的标准是什么？
### 过长是相对的
1. 只要长度影响理解和修改，或者是违反了 SRP，就算是过长，而和实际的长度无关。
2. 只要函数中的某一段（甚至一行）代码有一个比较完整的子逻辑，并且这段代码封装为函数后可以用一个简单的函数名表示，那就可以考虑抽出为独立的函数。
3. 据说是 GoF 里的一句类似的话："If you can't see the closing curly brace, you're doing it wrong."


### 例子
#### 例 1
1. 重构前
    ```js
    async getLivingList({commit}) {
        let dateObj = new Date();
        let year = dateObj.getFullYear();
        let month = dateObj.getMonth() + 1;
        let date = dateObj.getDate();
        let startTime = `${year}-${month}-${date} 00:00:00`;
        let endTime = `${year}-${month}-${date} 23:59:59`;
        let isStarted = 1;
        let pageSize = 20;
        let pageIndex = batchIndex;

        let res = await connector.getModel('getLivingList').$get({
            startTime,
            endTime,
            isStarted,
            pageSize,
            pageIndex,
        })
        if (res.status === 200) {
            commit('setLivingList', res.data.records);
            commit('setTotalCount', res.data.totalCount);
            batchIndex++;
        }
    },
    ```
2. 重构后
    ```js
    let setLivingRequestParams = ()=>{
        let dateObj = new Date();
        let year    = dateObj.getFullYear();
        let month   = dateObj.getMonth() + 1;
        let date    = dateObj.getDate();

        return {
            startTime: `${year}-${month}-${date} 00:00:00`,
            endTime: `${year}-${month}-${date} 23:59:59`,
            isStarted: 1,
            pageSize: 20,
            pageIndex: batchIndex,
        };
    };

    // ...

    async getLivingList({commit}) {
        let res = await connector.getModel('getLivingList').$get(setLivingRequestParams());
        if (res.status === 200) {
            commit('setLivingList', res.data.records);
            commit('setTotalCount', res.data.totalCount);
            batchIndex++;
        }
      },
    ```
3. 长度从 24 变成了 22。但重要的不是少了两行，而是逻辑明显清晰了。`getLivingList` 明显比以前清晰了。之前你看这个方法，即使不关心参数拼装过程，还是要小心的把前面的代码都看一遍。但现在在看这个方法时，只要你不关心参数，那很简单的一个 `setLivingRequestParams` 就让你理解了这里有生成参数的过程。

#### 例 2
1. 重构前
    ```js
    async loadMore() {
        if (this.totalCount <= this.list.length || !this.totalCount || !this.list.length || this.loading) {
            return;
        }
        this.loading = true;
        await this.getList();
        this.loading = false;
    },
    ```
2. 重构后
    ```js
    shouldNotLoad () {
        return this.totalCount <= this.list.length || !this.totalCount || !this.list.length || this.loading;
    },
    ```
    ```js
    async loadMore() {
        if (this.shouldNotLoad) {
            return;
        }
        this.loading = true;
        await this.getList();
        this.loading = false;
    },
    ```
3. 可以看到，重构后反而多了 3 行。但把判断是否应该加载和具体加载两部分逻辑拆分开，当你想看具体加载逻辑时不需要看那很长的一行判断代码，而当你想看是否应该加载的逻辑也不用再到加载函数里去挑出想要代码查看。

#### 例 3
1. 重构前
    ```js
    download () {
        let imgUrls = "";
        let imgMaps = "";
        let photoList = this.$refs.photoList.mergeArr;
        photoList.forEach(item => {
            imgUrls += `${item.smallUrl},`
            imgMaps += `${item.photoName},`
        });
        window.__widget_datas.serve.events.notifyToObserver(this.$constants.ACTION.GLOBAL_DIALOG, {
            type: 'downloadQr',
            params: {
                url: imgUrls,
                imgMaps: imgMaps,
                identification: "photo"
            },
            options: {
                unlockPage: true,
                bindTo: 'dialogs'
            }
        })
        this.$store.commit("puzzle/setPhotoList", photoList);
    },
    ```
2. 重构后
    ```js
    setDownloadParams () {
        let photoUrls = "";
        let photoNames = "";
        this.$refs.photoList.mergeArr.forEach(item => {
            photoUrls += `${item.smallUrl},`
            photoNames += `${item.photoName},`
        });
        return {
            url: photoUrls,
            imgMaps: photoNames,
            identification: "photo"
        };
    },
    openDownloadDialog () {
        window.__widget_datas.serve.events.notifyToObserver(this.$constants.ACTION.GLOBAL_DIALOG, {
          type: 'downloadQr',
          params: this.setDownloadParams(),
          options: {
              unlockPage: true,
              bindTo: 'dialogs'
          }
        })
    },
    download () {
        this.openDownloadDialog();
        this.$store.commit("puzzle/setPhotoList", photoList);
    },
    ```
  3. 同样在重构后多了几行，但逻辑就比之前清晰了。


## 重构方法参考
* Extract Function
* Split Phase
* Split Loop
* Replace Primitive with Object：使用数据的各个地方不用自己对数据进行各种处理了
* Replace Temp with Query：如果临时变量保存的计算逻辑比较复杂
* Extract Class
* Decompose Conditional
* Replace Conditional with Polymorphism
* Remove Flag Argument
* Replace Function with Command
* Replace Type Code with Subclasses
* Extract Superclass


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
