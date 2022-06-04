# Summary


<!-- TOC -->

- [Summary](#summary)
    - [Motivation](#motivation)
    - [References](#references)

<!-- /TOC -->


## Motivation
1. React Query 并不是像 axios 那样的 HTTP 请求库，它是用来在项目中管理请求及其数据的，官方的说法是：it makes **fetching**, **caching**, **synchronizing** and **updating server state** in your React applications a breeze.
2. 大多数状态管理库可以很好地处理客户端本地的状态，但是设计异步请求和服务端状态时就不一定做的好。因为服务端状态有以下的不同之处：
    * 服务端数据保存在你无法控制的远程位置
    * 需要异步 API 来读取和更新
    * 服务端数据是所有客户端共享的，其他人可以在你不知情的情况下对其作出修改
    * 服务端数据更新后你本地的数据就会是过期数据
3. 因此处理服务端数据可能面临以下挑战：
    * 缓存
    * Deduping multiple requests for the same data into a single request
    * 在后台更新过期数据
    * 了解数据何时过期
    * Reflecting updates to data as quickly as possible
    * 分页和延迟加载数据等性能优化
    * 管理服务器状态的内存和垃圾收集
    * Memoizing query results with structural sharing
4. React Query 在解决上述问题时有以下优点：
    * 用简单的几行 React Query 逻辑替换掉许多复杂且容易被误解的代码
    * 使应用程序更易于维护，更容易构建新功能，而无需担心连接新的服务器状态数据源
    * 使应用程序感觉更快、更积极响应
    * 潜在的节省带宽并提高内存性能


## References
* [React Query](https://react-query.tanstack.com/overview)