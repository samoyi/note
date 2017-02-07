# Cross-Origin

## CORS（Cross-Origin Resource Sharing
### Pros：
  * 支持所有类型的HTTP请求

### Cons：
  * 需要

## WebSockets
### 原理：
WebSocket是一种通信协议，使用ws://（非加密）和wss://（加密）作为协议前缀。该协议不实行同源政策，只要服务器支持，就可以通过它进行跨源通信。
### Cons:
* 需要搭建WebSocket服务器

## JSONP
### 原理：
`<script>`的`src`属性加载资源不受同源策略的限制

### 例子：
1. 一个最简单的例子

  ```
  // http://www.a.com/test.js www.a.com域的js文件    
  let myName = "li";
  ```
  ```
  // http://www.b.com/test.html www.b.com域的html文件   
  <script src="http://www.a.com/test.js"></script>
  <script>
  alert( myName ); // li    请求到了不同域的数据
  </script>
  ```
2. 更符合JSONP定义的一个例子。其实道理完全一样

  ```
  // http://www.b.com/test.html www.b.com域的html文件
  <script>
  function mycallback(data){
    alert(data.foo);
  };
  </script>
  <script src="http://www.funca.org/test/test.php?myName"></script>
  ```
  ```
  // http://www.a.com/test.php www.a.com域的php文件  
  if( isset($_GET["myName"]) ){
    echo 'mycallback({ foo: "bar" });';
  }
  ```
  这个例子中，先定义一个请求成功的回调函数，如果请求成功，返回的就是对该函数的调用，因此取得了想要的JSON数据中的值。

### 缺点：
1. 如果请求地址的代码自己无法控制，可以返回恶意代码
2. 无法很好的确定请求是否失败  
  Although HTML5 has specified an onerror event handler for `<script>` elements, it hasn’t yet been implemented by any browser. Developers frequently used timers to see if a response has or has not been received within a set amount of time, but even this is tricky because not every user has the same connection speed and bandwidth.
3. 只支持`GET`请求


## Image Pings
### 原理：
`<img>`的`src`属性加载资源不受同源策略的限制

### 例子：
```
var img = new Image();
function imgPing(){
    alert("Done!");
}
// 因为请求的不是图片，所以即使请求成功，也不会触发`load`事件，只会触发`error`事件
img.addEventListener('error', imgPing, false);
img.src = "http://www.otherDomain/test.php?name=li";
```

### 用途：
* 监听用户是否访问了某个网页。如果访问了，上例中的```test.php```就会收到指定的参数
* 以参数的形式发送简单的数据

### Cons
* 在请求失败的情况下，仍然会触发`error`事件。所以客户端无法确定是否发送成功。
* 只能发送`GET`请求
* 无法访问服务器的响应文本

## Reference
* [Professional JavaScript for Web Developers](https://book.douban.com/subject/7157249/)
* [跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)
