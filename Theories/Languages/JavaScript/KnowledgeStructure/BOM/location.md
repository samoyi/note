# location

* `window.location === document.location // always true`



## Location properties
属性名 | 例子 | 说明
-- | -- | --
`hash` | `#contents` | 返回URL中的`hash`，如果URL中不包含散列，则返回空字符串
`host` | `www.wrox.com:80` | 返回服务器名称和端口号（如果有）
`hostname` | `www.wrox.com` | 返回不带端口号的服务器名称
`href` | `http://www.wrox.com` | 返回当前加载页面的完整URL。而`location`对象的`toString()`方法也返回这个值
`pathname` | `/WileyCDA/` | 返回URL中的目录和（或）文件名
`port` | `8080` | 返回URL中指定的端口号。如果URL中不包含端口号，则这个属性返回空字符串
`protocol` | `http:` | 返回页面使用的协议。通常是`http:`或`https:`
`search` | `?q=javascript` | 返回URL的查询字符串。这个字符串以问号开头



## Manipulating the Location
### `location.assign()`
This immediately starts the process of navigating to the new URL and makes an
entry in the browser’s history stack.

### `location.href`  `window.location`
If `location.href` or `window.location` is set to a URL, the `assign()` method
is called with the value.

### `location.replace()`
This method accepts a single argument, the URL to navigate to, but does not make
an entry in the history stack.

### 用上述方法改变`hash`
* 将上述四个方法的值设置为`hash`值时，只进行`hash`的改变，而不发生跳转
* 作为一个特殊值，当设置为`#top`时，如果文档中没有 ID 为`top`的元素，该设置会让页面回
到顶部

### change other properties
* The `hash`, `search`, `hostname`, `pathname`, and `port` properties can be set
with new values that alter the current URL
* When the URL is changed using one of the previously mentioned approaches, an
entry is made in the browser’s history stack so the user may click the Back
button to navigate to the previous page.

### `location.reload()`
* When `reload()` is called with no argument, the page is reloaded in the most
efficient way possible, which is to say that the page may be reloaded from the
browser cache if it hasn’t changed since the last request.
* To force a reload from the server, pass in `true` as an argument
* Any code located after a `reload()` call may or may not be executed, depending
on factors such as network latency and system resources. For this reason, it is
best to have `reload()` as the last line of code.
