# Mysterious Name


## 原则
* 意图和实现分离
* 动态语言变量名加上类型前缀，例如数组变量命名为`aList`


## 场景
### 函数名及参数语义明确
#### 一例
1. 这个函数 `function hoistArrayItem (list, item, index)` 的意图是要把数组中的某一项提升到数组首位。第一个参数是要操作的数组，第二个参数是要提升的数组项，如果不知道具体的数组项而希望通过 index 确定要提升的数组项，则应该传第三个参数。
2. 存在的问题是：
    * 函数名只说明了提升，并没有说明提升到顶部，结合第三个寓意不明的参数，很容易让人误解为提升到第三个参数指定的位置。
    * 函数名用 array 表示数组，参数里却用 list 表示数组。
    * 第三个参数意义不明。
3. 修改为如下
    ```js
    function hoistArrayItemToTop (array, item, itemIndex) {}
    ```

### getter
#### 分享开关
1. 相册中有多处分享，对应两级分享开关。一级是总开关，一级是各处具体的分享。
2. 总开关的 `getter` 之前定义如下：
    ```js
    canShare(state) {
      return !!state.switches.shareSwitch;
    },
    ```
3. 语义不明确，在组件 HTML 里直接引用的话，更像是组件内计算属性的命名。
4. 修改如下：
    ```js
    canShare(state) {
        // 使用下面的 mainShareSwitch 进行判断
        return !!state.switches.shareSwitch;
    },
    mainShareSwitch (state, getters) {
        // 分享总开关
        // 用于逐步重构替换语义不明确的 canShare
        // 所有引用 canShare 的地方都更换为 mainShareSwitch 后，就可以删掉 canShare
        return getters.canShare;
    },
    ```
5. 因为修改设计好几处，先不全部修改，以免需要全部重新测试。在之后的迭代中初步替换，最后删除 `canShare`。
6. 这里没有在 `mainShareSwitch` 里直接返回 `!!state.switches.shareSwitch`，是为了保证只有一处引用接口返回值。

### 错误单词

### 词性错误
例如已选数量的变量从 `selectCount` 改为 `selectedCount`

### 约定俗成
#### 和后端接口统一
* 例如 `photoId` 和 `photoUrl` ，后端接口对于缩写都是只有首字母大写，为了防止出错，前端也保持这样的规则

### 业务场景引起的混淆
1. 例如有一个获取手机验证码的方法命名为 `getCode`，但 code 其实就挺不明确的。
2. 而且当前项目还涉及微信授权，微信授权也有 code，所以这里看名字就有可能造成误解，可以改成 `getVerificationCode`。

### 使用业务命名，不要使用程序命名
1. 比如有一个表格，每一行是一个管理员。
2. 现在有一个方法是删除一个管理员，如果使用程序命名，可能会被命名为 `deleteRow`。
3. 这样显然没有 `deleteAdmin` 语义明确。而且如果 HTML 从表格改成了列表，那这个方法名就很有歧义了。或者这个方法被复用到其他地方，可能也就是很不合适的命名了。


### 其他
* Vue 项目，重复的 dom 操作应该提取全局自定义指令


## 过度优化
### 模块内部的变量名还带上模块标志名
1. 比如有一个 header 组件，你可能会往里面传 title，那么在 header 的父级里，这个 title 可以命名为 `headerTitle`，语义明确。
2. 那么在 header 组件内部，如果就只有一个 title，就没必要再命名为 `headerTitle` 了，因为这个 title 本身就已经在 header 里面了。




















































## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
