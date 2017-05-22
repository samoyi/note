
5. Web Timing机制的核心是window.performance对象。对页面的所有度量信息，包括那些规范中已经定义的和将来才能确定的，都包含在这个对象里面。


## performance.navigation
该属性也是一个对象，包含着与页面导航有关的多个属性
* **redirectCount**页面加载前的重定向次数。
* **type**数值常量，表示刚刚发生的导航类型。
    ```performance.navigation.TYPE_NAVIGATE (0)```：页面第一次加载。 
    ```performance.navigation.TYPE_RELOAD (1)```：页面重载过。 
    ```performance.navigation.TYPE_BACK_FORWARD(2)```：页面是通过“后退”或“前进”按钮打开的。


## performance.timing
该属性也是一个对象，但这个对象的属性都是时间戳（从软件纪元开始经过的毫秒数），不同的事件会产生不同的时间值。
* **navigationStart** 开始导航到当前页面的时间。
* **unloadEventStart** 前一个页面的unload事件开始的时间。但只有在前一个页面与当前页面来自同一个域时这个属性才会有值；否则，值为0。
* **unloadEventEnd** 前一个页面的unload事件结束的时间。但只有在前一个页面与当前页面来自同一个域时这个属性才会有值；否则，值为0。
* **redirectStart** 到当前页面的重定向开始的时间。但只有在重定向的页面来自同一个域时这个属性才会有值；否则，值为0。
* **redirectEnd** 到当前页面的重定向结束的时间。但只有在重定向的页面来自同一个域时这个属性才会有值；否则，值为0。
* **fetchStart** 开始通过HTTP GET取得页面的时间。
* **domainLookupStart** 开始查询当前页面DNS的时间。
* **connectStart** 浏览器尝试连接服务器的时间。
* **connectEnd** 浏览器成功连接到服务器的时间。
* **secureConnectionStart** 浏览器尝试以SSL方式连接服务器的时间。不使用SSL方式连接时，这个属性的值为0。
* **requestStart** 浏览器开始请求页面的时间。 
** *responseStart** 浏览器接收到页面第一字节的时间。 
* **responseEnd** 浏览器接收到页面所有内容的时间。 
* **domLoading** document.readyState变为"loading"的时间。 
* **domInteractive** document.readyState变为"interactive"的时间。 
* **domContentLoadedEventStart** 发生DOMContentLoaded事件的时间。 
* **domContentLoadedEventEnd** DOMContentLoaded事件已经发生且执行完所有事件处理程序的时间。 
* **domComplete** document.readyState变为"complete"的时间。 
* **loadEventStart** 发生load事件的时间。 
* **loadEventEnd** load事件已经发生且执行完所有事件处理程序的时间。

通过这些时间值，就可以全面了解页面在被加载到浏览器的过程中都经历了哪些阶段，而哪些阶段可能是影响性能的瓶颈。



**浏览器支持还不够**



































