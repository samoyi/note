# Cross-Origin

## CORS（Cross-Origin Resource Sharing
### Pros：
  * 支持所有类型的HTTP请求

### Cons：
  * 需要


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
http://www.b.com/test.html www.b.com域的html文件  
  ```
  <script>
  function mycallback(data){
    alert(data.foo);
  };
  </script>
  <script src="http://www.funca.org/test/test.php?myName"></script>
  ``
  `http://www.a.com/test.php` www.a.com域的php文件  
  ```
  if( isset($_GET["myName"]) ){
    echo 'mycallback({ foo: "bar" });';
  }
  ```
  这个例子中，先定义一个请求成功的回调函数，如果请求成功，返回的就是对该函数的调用，因此取得了想要的JSON数据中的值。

### 缺点：
1. 如果请求地址的代码自己无法控制，可以返回恶意代码
2. 无法很好的确定请求是否失败  
  Although HTML5 has specified an onerror event handler for `<script>` elements, it hasn’t yet been implemented by any browser. Developers frequently used timers to see if a response has or has not been received within a set amount of time, but even this is tricky because not every user has the same connection speed and bandwidth.


## Image Pings
1. 常用于跟踪用户点击页面或动态广告曝光次数。
2. 缺点：
（1）只能发送GET请求
（2）无法访问服务器的响应文本

## Reference
* [Professional JavaScript for Web Developers](https://book.douban.com/subject/7157249/)
* [跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)
