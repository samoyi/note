# Combine Functions into Transform


<!-- TOC -->

- [Combine Functions into Transform](#combine-functions-into-transform)
    - [原则](#原则)
    - [场景](#场景)
        - [将处理请求参数的逻辑和发送请求的逻辑分离](#将处理请求参数的逻辑和发送请求的逻辑分离)
    - [过度优化](#过度优化)

<!-- /TOC -->


## 原则
一段逻辑如果有不同阶段的处理逻辑，特别是不同阶段的逻辑变动的频率不同，那就考虑按阶段拆分。


## 场景
### 将处理请求参数的逻辑和发送请求的逻辑分离
1. 经常看到一个 POST 请求的方法，里面因为参数有些多，而且要对本地数据变换成参数要求的形式，所以会有比较多的参数处理逻辑。
2. 而且参数逻辑经常会根据业务需求变动，而发送请求的逻辑一般都是封装好的公共方法，所以更应该把两者分离。


## 过度优化