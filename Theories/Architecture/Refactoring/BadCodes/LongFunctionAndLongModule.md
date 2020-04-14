# Long Function and Long Module


<!-- TOC -->

- [Long Function and Long Module](#long-function-and-long-module)
    - [思想](#思想)
        - [意图和实现分离](#意图和实现分离)
    - [过长的标准是什么？](#过长的标准是什么)
        - [过长是相对的，只要长度影响理解，就算是过长，而和实际的长度无关](#过长是相对的只要长度影响理解就算是过长而和实际的长度无关)
        - [例子](#例子)
    - [重构方法参考](#重构方法参考)
    - [References](#references)

<!-- /TOC -->


## 思想
### 意图和实现分离
1. 要让阅读代码的人（包括自己在内）在不需要修改而只是阅读一段代码时，可以立刻知道它的意图是什么，而不用去关心它是怎么实现的。
2. A heuristic we follow is that whenever we feel the need to comment something, we write a function instead. Such a function contains the code that we wanted to comment but is named after the intention of the code rather than the way it works. 
3. We may do this on a group of lines or even on a single line of code. We do this even if the method call is longer than the code it replaces—provided the method name explains the purpose of the code. 


## 过长的标准是什么？
### 过长是相对的，只要长度影响理解，就算是过长，而和实际的长度无关
1. 只要函数中的某一段（甚至一行）代码有一个比较完整的子逻辑，并且这段代码封装为函数后可以用一个简单的函数名表示，那就可以考虑抽出为独立的函数。

### 例子
* 例1
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

  长度从24变成了22。但重要的不是少了两行，而是逻辑明显清晰了。`getLivingList`明显比以前清晰了。之前你看这个方法，即使不关心参数拼装过程，还是要小心的把前面的代码都看一遍。但现在在看这个方法时，只要你不关心参数，那很简单的一个`setLivingRequestParams`就让你理解了这里有生成参数的过程。
* 例2
  1. 重构前
  ```js
  async loadMore() {
    if (this.totalCount <= this.list.length || !this.totalCount || !this.list.length || this.loading) return;
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
    if (this.shouldNotLoad) return;
    this.loading = true;
    await this.getList();
    this.loading = false;
  },
  ```
  3. 可以看到，重构后反而多了3行。但把判断是否应该加载和具体加载两部分逻辑拆分开，当你想看具体加载逻辑时不需要看那很长的一行判断代码，而当你想看是否应该加载的逻辑也不用再到加载函数里去挑出想要代码查看。
* 例3
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
  3. 同样在重构后多了几行，但逻辑就比之前清晰了


 ## 短函数的弊端及良好命名的重要性
 1. Older languages carried an overhead in subroutine calls, which deterred people from small functions. Modern languages have pretty much eliminated that overhead for in­process calls. 
 2. There is still overhead for the reader of the code because you have to switch context to see what the function does. Development environments that allow you to quickly jump between a function call and its declaration, or to see both functions at once, help eliminate this step.
 3. But the real key to making it easy to understand small functions is good naming. If you have a good name for a function, you mostly don’t need to look at its body. 



## 重构方法参考
* Extract Function


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
