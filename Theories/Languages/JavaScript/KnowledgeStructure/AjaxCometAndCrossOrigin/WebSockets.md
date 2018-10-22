# Web Sockets

配置方法参考这个[Demo](https://github.com/samoyi/Nichijou/tree/master/communication/websocket)

## 与 HTTP 相比
### 持久连接
* 省去了每次发起请求的耗时及每次发起请求的头信息。
* `keep-alive`是只建立一次 TCP 链接就能发送多次请求，但每个请求仍然要发送各自的头信息。

### 全双工
* 非【请求—响应】式的通信模式，多次通信也不需要轮询
* 实现服务器主动发送信息
