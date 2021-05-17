# CIntroduce Assertion




<!-- TOC -->

- [CIntroduce Assertion](#cintroduce-assertion)
    - [原则](#原则)
    - [场景](#场景)
        - [公共组件接口应该明确使用断言](#公共组件接口应该明确使用断言)
        - [需要手动配置的代码加上校验以防漏掉或错误](#需要手动配置的代码加上校验以防漏掉或错误)
    - [过度优化](#过度优化)
    - [References](#references)

<!-- /TOC -->


## 原则


## 场景
### 公共组件接口应该明确使用断言
例如 Vue 对于 prop 的类型检查

### 需要手动配置的代码加上校验以防漏掉或错误
1. 项目有开发、测试、生成三个环境，对应三套接口 URL。有一个项目需要在本地配置三个环境的 URL，经常出现的情况是只配置了开发环境的接口，因此在测试环境发生错误，或者是配了前两个而忘了生产的。
2. 因为没有验证机制，在使用 axios 发起请求时，报的错误是 axios 一个文件里的，很难看出来原因，要去源码里面费劲找。
3. 现在直接在封装的 axios 发起请求的地方设置一个断言，如果没有 URL 则抛出错误
    ```js
    function request(option) {
        AssertHasURL(option);

        // ... 其他代码
    }

    function AssertHasURL (opt) {
        let params = opt.params;
        let paramsStr = "";
        if (params) {
            for(let key in params) {
                paramsStr += (key + ", ");
            }
            if (paramsStr.length > 0) {
                paramsStr = "接口参数包括 [" + paramsStr.slice(0, -2) + "]。"
            }
        }
        if (!!opt.url) {
            throw new Error(`${env} 环境没有配置该接口 URL! 接口请求方法为 ${opt.method}。${paramsStr}`);
        }
    }
    ```


## 过度优化


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
