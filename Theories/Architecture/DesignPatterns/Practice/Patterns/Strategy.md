# Strategy


<!-- TOC -->

- [Strategy](#strategy)
    - [适用场景](#适用场景)
    - [要点](#要点)
    - [使用场景](#使用场景)
        - [实现 Remove Flag Argument 兼容重构](#实现-remove-flag-argument-兼容重构)
        - [微信分享配置](#微信分享配置)
            - [需求](#需求)
            - [重构前](#重构前)
            - [重构后](#重构后)
        - [表单校验](#表单校验)
        - [底部菜单](#底部菜单)
        - [图片列表操作器](#图片列表操作器)

<!-- /TOC -->


## 适用场景
* 一个功能体要根据不同的情况采取不同的策略（或者算法）。
* 一个功能体要做好几件事情，而具体是哪几件可能是会发生变化的。


## 要点
1. 策略（或者算法）的制定、选择和执行分成了三个独立的部分。
2. 多种策略（或者算法）放在一起，作为一个策略（或者算法）仓库。
3. 需要执行策略时，根据环境的不同，选择需要的策略（或者算法）传递给策略执行者。


## 使用场景
### 实现 Remove Flag Argument 兼容重构
1. 后端有时会给一个接口兼容好几个类似的功能，然后通过一个 flag 来区分。比如说定一个 `type` 字段，传 `1` 是返回照片列表、传 `2` 时返回视频列表，传 `3` 时返回混合列表。
2. 这样的接口对于调用者是不友好的。
3. 所以前端可以把不同的请求类型定义为 3 方法（制定策略）；然后根据组件中具体的需求调用其中某个方法（选择策略）；而三个方法都会调用另一个通用方法，该方法负责具体的请求发起（执行策略）。
    ```js
    queryList ({type}) {
        return getList({type})
    },

    queryPhotoList () {
        queryList({type: 1});
    }

    queryVideoList () {
        queryList({type: 2});
    }

    queryMixedList () {
        queryList({type: 3});
    }
    ```
4. 这样，组件中不需要处理意义不明的 `type` 参数，而是调用命名明确的具体方法。


### 微信分享配置
#### 需求
1. 相册微信分享出去的标题、描述、链接和图标根据情况会有各种情况：
    * 默认
    * 某些页面需要特殊的配置
    * 从某些来源进入相册，也需要特殊的配置
2. 为了使不同的页面有不同的分享配置，所以要在路由切换的地方进行配置。以及要在一个处理外部来源的模块里，根据来源设定不同的分享配置。

#### 重构前
1. 在路由切换的地方进行分享配置
    ```js
    // afterEachRout.js
    function setShareConfig (to, from) {
        let config = {};

        // 根据本次路由到的页面决定
        if (to.name === 'video') {
            config.name = '视频';
        }
        else if (to.name === 'live') {
            config.name = '直播';
        }
        else if (to.name === 'comment') {
            config.name = '快来评论吧';
        }

        // 默认时传空对象，`configShare` 会使用默认配置
        store.dispatch('weixin/configShare', config);
    }
    ```
2. `setShareConfig` 做的工作是，在每次路由切换后，设定当前页面的分享配置。但它同时还负责了制定分享配置，也就是那一组条件分支。
3. 但从逻辑上讲，分享配置的指定，应该是属于微信分享模块的工作，而不属于路由模块的工作。路由模块只应该负责根据当前的路由选择对应的分享配置。
4. 而且在处理外部来源的模块里，也会根据需求自己制定分享配置。这样，各种分享配置的指定就散落在各处。但其实这些各种奇奇怪怪的分享配置应该整理到一起，统一管理。

#### 重构后
1. 把各种情况的分享配置都放到微信分享的模块里
    ```js
    // weixin.js
    shareConfigs () {
        return {
            normal: {},
            video: {
                title: '视频',
            },
            live: {
                title: '直播',
            },
            comment: {
                title: '评论',
                desc: '快来评论吧',
            },
            outer1: {
                title: '外部来源1指定的分享标题',
            },
            outer2: {
                title: '外部来源2指定的分享标题',
            },
        }
    }
    ```
2. 在需要的地方根据情况引用对应的配置
    ```js
    // afterEachRout.js
    function setShareConfig (to, from) {
        const shareConfigs = store.getters['weixin/shareConfigs'];
        let config = {};

        if (to.name === 'video') {
        config = shareConfigs.video;
        }
        else if (to.name === 'live') {
            config = shareConfigs.live;
        }
        else if (to.name === 'comment') {
            config = shareConfigs.comment;
        }

        store.dispatch('weixin/configShare', config);
    }
    ```
3. 按照典型的策略模式，条件判断也应该移出 `setShareConfig`，在外面判断需要哪个配置，然后可以作为参数传给 `setShareConfig`。`setShareConfig` 只作为一个单纯的配置对象，传什么配置它就设置什么配置。例如
    ```js
    const shareConfigs = store.getters['weixin/shareConfigs'];
    let config = {};
    if (to.name === 'video') {
    config = shareConfigs.video;
    }
    else if (to.name === 'live') {
        config = shareConfigs.live;
    }
    else if (to.name === 'comment') {
        config = shareConfigs.comment;
    }

    function setShareConfig (config) {
        store.dispatch('weixin/configShare', config);
    }
    ```
4. 但实际上我并没有一个公用的判断各种路由 `name` 的地方，现在判断 `name` 的逻辑，只是为配置分享服务的，所以没必要把它作为公用的路由判断。如果其他很多地方也需要判断路由 `name`，那就应该把这些判断作为公用的，然后在特定的路由分支下读取并设置响应的分享配置。


### 表单校验

### 底部菜单
1. 菜单上有一组按钮，分别执行这些操作：首页、集合页、找人、下载、预约、管理。
2. 该操作器的整体 UI、动画等都是通用的，而每个按钮的图标、数据和行为都封装为独立的策略。
3. 点击一个按钮时，根据点击按钮的 ID，来调用执行对应的策略，以及改变对应按钮的样式。
4. 这样不管是增删按钮，或者对某个按钮操作进行修改，都不影响整体菜单的逻辑。

### 图片列表操作器
1. 操作器上有一组按钮，分别执行这些操作：下载、拼图、收藏、取消收藏、隐藏、取消隐藏。
2. 该操作器的整体 UI、动画等都是通用的，而每个按钮的数据和行为都封装为独立的策略。
3. 点击一个按钮时，根据点击按钮的 ID，来调用执行对应的策略，以及改变对应按钮的样式。
4. 这样不管是增删按钮，或者对某个按钮操作进行修改，都不影响整体操作器的逻辑。