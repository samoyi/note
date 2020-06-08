# Remove Flag Argument


## 原则
1. 提供 SRP 的接口。一个接口只应该提供一个功能。如果是两个功能，就提供两个接口，不要兼容。
2. 接口的参数只能是作为这个单一功能内部的逻辑分支标志，而不应该作为兼容其他功能的标志。


## 场景
### 接口的参数不应该作为复用的标志
参考 `../BadCodes/SpeculativeGenerality.md` 中关于接口设计的重构场景

### 不要使用意义不明的数字来标志状态
1. 后端一个接口，需要一个字段来表明图片来源，他定的规则是用一个数字来表示：
    * 0：来自于历史记录
    * 1：来自于图片浏览页
    * 2： 来自于上传
2. 最初我在 store 里用 `sourceFrom` 这个 state 字段来保存本地的这个状态，这个字段会被设置为 0 或 1 或 2，然后传给后端。
3. 然后我定义了一个 mutaion，用来设置这个字段
    ```js
    setSourceFrom(state) {
        state.sourceFrom = n;
    },
    ```
4. 在这里，后端接口设计的就不好，所以前端为了使用这个接口，只能传递意义不明的数字。
5. 但是，在设计 `setSourceFrom` 时，我其实是可以包装一下的，让前端使用者可以调用更有意义的方法。
6. 于是我用下面三个 mutation 替代了上面的 `sourceFrom`
    ```js
    setSourceFromHistory (state) {
        state.sourceFrom = 0;
    },
    setSourceFromPicView (state) {
        state.sourceFrom = 1;
    },
    setSourceFromUpload (state) {
        state.sourceFrom = 2;
    },
    ```


## 过度优化


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
