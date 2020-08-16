# Global Data

<!-- TOC -->

- [Global Data](#global-data)
    - [总原则](#总原则)
    - [相关就近](#相关就近)
    - [逻辑顺序](#逻辑顺序)
    - [同类对齐](#同类对齐)
    - [References](#references)

<!-- /TOC -->


## 总原则
1. 视觉设计良好的东西，不仅仅是好看的，也是好用的。
2. 好的排版可以方便阅读，降低阅读成本，降低阅读时出错的机会，提升阅读效率。


## 相关就近
1. 内容相关的代码，应该就近放置。
2. 比如下面这样写当然不会有什么问题
    ```html
    <el-tab-pane 
        v-for="item in tabList" 
        :label="item.label" 
        :data="item.tabView"
        :key="item.tabView"
    >
    </el-tab-pane>
    ```
3. 但是其实 `key` 是和 `v-for` 相关的，所以最好写成
    ```html
    <el-tab-pane 
        v-for="item in tabList" 
        :key="item.tabView"
        :label="item.label" 
        :data="item.tabView"
    >
    </el-tab-pane>
    ```
4. 再比如这样写也没问题
    ```html
    <el-tab-pane 
        class="pane"
        v-for="item in tabList" 
        :key="item.tabView"
        :class="{single: isSingle}"
    >
    </el-tab-pane>
    ```
5. 但如果有人要看这个节点有哪些 class， 这样写就不方便，他可能一开始就忽略了后面的动态 class，还要再调试一次再找一次才能发现。所以应该写成
    ```html
    <el-tab-pane 
        class="pane"
        :class="{single: isSingle}"
        v-for="item in tabList" 
        :key="item.tabView"
    >
    </el-tab-pane>
    ```


## 逻辑顺序
1. 比如有两个方法，一个是发送手机验证码 `getVerificationCode`，一个是输入验证码之后的登陆 `login`。
2. 你当然可以把它俩放在模块内的任何地方，只要能正常访问就行。但显然逻辑顺序上，是先发送验证码，再登陆。
3. 所以对于阅读代码的人来说，将这两个方法按顺序写在一起，至少在看代码和找方法的时候就就稍稍容易了一些
    ```js
    // ...
    getVerificationCode () {
        // ...
    },
    login () {
        // ...
    },
    // ...
    ```


## 同类对齐
1. 比如你可以这样写，没有任何问题
    ```js
    import Living from '@/pages/Living'
    import Login from '@/pages/Login'
    import Related from '@/pages/Related'
    import Album from '@/pages/Album'
    import Data from '@/pages/Data'
    import Enterprise from '@/pages/enterprise/Enterprise'
    import error from '@/pages/enterprise/error'
    import closed from '@/pages/enterprise/closed'
    ```
2. 但这样写的话，显然阅读起来就会更容易一些
    ```js
    import Living     from '@/pages/Living'
    import Login      from '@/pages/Login'
    import Related    from '@/pages/Related'
    import Album      from '@/pages/Album'
    import Data       from '@/pages/Data'
    import Enterprise from '@/pages/enterprise/Enterprise'
    import error      from '@/pages/enterprise/error'
    import closed     from '@/pages/enterprise/closed'
    ```
3. 甚至还可以更进一步，把它排的更好看一些（最后三个因为是同属一个二级，所以没有和前面的混在一起）
    ```js
    import Data       from '@/pages/Data'
    import Album      from '@/pages/Album'
    import Login      from '@/pages/Login'
    import Living     from '@/pages/Living'
    import Related    from '@/pages/Related'
    import error      from '@/pages/enterprise/error'
    import closed     from '@/pages/enterprise/closed'
    import Enterprise from '@/pages/enterprise/Enterprise'
    ```
4. 同样的原则还可以用在多个赋值语句上
    ```js
    state.enterpriseInfo.tel          = info.companyTelephone;
    state.enterpriseInfo.url          = info.companySiteUrl;
    state.enterpriseInfo.city         = info.cityName;
    state.enterpriseInfo.logo         = info.companyLogo;
    state.enterpriseInfo.slogan       = info.slogan;
    state.enterpriseInfo.address      = info.address;
    state.enterpriseInfo.company      = info.company;
    state.enterpriseInfo.abbreviation = info.companyAbbreviation;
    ```
5. 这样对齐且按照顺序排版的好处，让人在多行代码中想查找一条时，可以更方便的找到。节省了一点点时间，节省了一点点精力。



















































## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
