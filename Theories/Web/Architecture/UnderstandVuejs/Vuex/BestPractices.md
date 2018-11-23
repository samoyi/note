# Best Practices

## 基础规则
* 开发环境开启开发模式
    ```js
    strict: process.env.NODE_EVN !== 'production'
    ```
* mutation payload 通过对象方式提交
* 应用状态较复杂时，mutation 定义为常量并放在单独的文件中
