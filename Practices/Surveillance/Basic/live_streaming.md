# Live streaming

## 基本流程
### 一、数据采集
摄像机及拾音器收集视频及音频数据，此时得到的为原始数据

### 二、处理
如果需要，可对视频和音频进行处理

### 三、数据编码
使用相关硬件或软件对音视频原始数据进行编码处理及加工，得到可用的音视频数据

### 四、推流
将数据传输到服务器

### 五、转码
如果需要，可以在服务端对数据进行转码，以适配各种不同的网络状况和接收终端

### 六、处理
如果需要，可以再对数据进行相应处理

### 七、拉流
与服务器建立连接并接收数据

### 八、解码和渲染



***
## 传输协议
### RTMP
RealTime Messaging Protocol
* The Real-Time Messaging Protocol (RTMP) was designed for high-performance
transmission of audio, video, and data between Adobe Flash Platform technologies,
including Adobe Flash Player and Adobe AIR.
* The "plain" protocol which works on top of and uses TCP port number 1935 by
default.
* 建立在TCP协议或者轮询HTTP协议之上。
* RTMP协议初次建立连接的时候握手过程过于复杂

### RTSP
Real Time Streaming Protocol
* RTSP提供了一个可扩展框架，数据源可以包括实时数据与已有的存储的数据。
* RTSP语法和运作跟HTTP/1.1类似，但并不特别强调时间同步，所以比较能容忍网络延迟。
* 代理服务器的缓存功能也同样适用于RTSP，并且因为RTSP具有重新导向功能，可根据实际负载
情况来切换提供服务的服务器，以避免过大的负载集中于同一服务器而造成延迟。

### RTP
Real-time Transport Protocol

### RTCP
Real-time Transport Control Protocol







[《视频直播技术详解》](http://blog.qiniu.com/archives/7229)
[哪些地方可以学习视频直播技术？](https://www.zhihu.com/question/23651189)
[REAL-TIME MESSAGING PROTOCOL (RTMP) SPECIFICATION](http://www.adobe.com/devnet/rtmp.html)
[关于直播，所有的技术细节都在这里了（二）](https://zhuanlan.zhihu.com/p/23377305)
https://www.zhihu.com/question/37051236
