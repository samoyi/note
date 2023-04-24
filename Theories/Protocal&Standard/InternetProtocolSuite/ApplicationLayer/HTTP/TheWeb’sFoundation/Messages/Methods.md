# Methods


<!-- TOC -->

- [Methods](#methods)
    - [设计思想](#设计思想)
    - [抽象本质](#抽象本质)
    - [安全方法](#安全方法)
    - [GET](#get)
    - [HEAD](#head)
    - [POST](#post)
    - [PUT](#put)
    - [REST API 规范](#rest-api-规范)
    - [GET 和 POST 的比较](#get-和-post-的比较)
    - [TRACE](#trace)
    - [OPTIONS](#options)
    - [DELETE](#delete)
    - [Extension Methods](#extension-methods)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 抽象本质


## 安全方法
1. `GET` 和 `HEAD` 方法被 HTTP 定义为 **安全方法**，意味着这些方法不应该对服务器发生实质性的修改，而仅仅是获得一些数据。
2. 安全方法意在让 HTTP 程序告诉用户某些非安全方法的行为可能会引起非预期的改变。例如用户刷新一个提交表单的页面时浏览器会提示可能会重复提交表单。


## GET


## HEAD
1. `HEAD` 和 `GET` 类似，但是它的响应只会包括首部，而不包括响应实体。
2. 这个方法让客户端可以查看一个资源的信息而不必真的请求它。
3. 开发者必须确保对一个资源的 `HEAD` 请求返回的首部和对该资源的 `GET` 请求返回的首部完全相同。


## POST
1. 注意，REST API 规范与下面描述的不同。
2. 该方法是设计用来向服务器发送输入数据的，最典型的场景就是发送表单数据。
3. `POST` 方法用来向服务器发送数据，而 `PUT` 方法用来把提交的数据作为一个资源保存在服务器。


## PUT
1. 注意，REST API 规范与下面描述的不同。
2. `PUT` 方法和 `GET` 方法相反，它把文档写入到服务器。
3. 某些发布系统应用允许用户创建页面，然后通过 `PUT` 方法直接添加到服务器。
4. `PUT` 方法的语义就是让服务器使用请求实体去创建一个新文档并保存在请求 URL 的位置，或者如果这个 URL 已经存在，则替换掉当前文档
    <img src="./images/05.png" width="600" style="display: block; margin: 5px 0 10px 0;" />
5. 可以看到与 `POST` 的明显不同时，`PUT` 提交的内容会被创建为一个独立的资源，之后的响应也会返回这个资源的 URL。而 `POST` 提交的数据可以只是用来验证身份或者在数据库里插入一条记录，并不是一个独立的资源。


## REST API 规范
* GET：查询资源；幂等
* POST：创建资源；不幂等
* PUT：整体更新资源；幂等，同样的资源会替换旧的
* PATCH：修改资源的一部分，不幂等
* DELETE：幂等

[REST – PUT vs POST](https://restfulapi.net/rest-put-vs-post/)


## GET 和 POST 的比较
<table>
    <theader>
        <tr>
            <th>Item</th>
            <th>GET</th>
            <th>POST</th>
        </tr>
    </theader>
    <tbody>
        <tr>
            <td>语义</td>
            <td>请求数据</td>
            <td>提交数据</td>
        </tr>
        <tr>
            <td>
                Side effect
            </td>
            <td>
                因为是请求数据，所以适用于请求不会改变服务器数据的情况
            </td>
            <td>
                因为是提交数据，所以一般都是涉及修改，适用于请求会改变服务器数据的情况
            </td>
        </tr>
        <tr>
            <td>
                Cached
            </td>
            <td>
                因为没有副作用，同样的请求每次返回的结果都一样。所以响应的结果可以被缓存
            </td>
            <td>
                因为会改变服务器数据，所以每次请求结果可能不同。例如一个存款请求，每次返回的账户余额都不同。所以响应的结果不应该被缓存。
            </td>
        </tr>
        <tr>
            <td>
                速度
            </td>
            <td>
                从性能角度来看，以发送相同的数据计，<code>GET</code> 请求的速度最多可达到 <code>POST</code> 请求的两倍。
            </td>
            <td>
                与 <code>GET</code> 请求相比，<code>POST</code> 请求消耗的资源会更多一些。
            </td>
        </tr>
        <tr>
            <td>
                History
            </td>
            <td>
                Parameters remain in browser history because they are part of the URL
            </td>
            <td>
                Parameters are not saved in browser history.
            </td>
        </tr>
        <tr>
            <td>
                Bookmarked
            </td>
            <td>
                Can be bookmarked
            </td>
            <td>
                Can not be bookmarked
            </td>
        </tr>
        <tr>
            <td>
                BACK button/re-submit behaviour
            </td>
            <td>
                <code>GET</code> requests are re-executed but may not be re-submitted to server if the HTML is stored in the browser cache
            </td>
            <td>
                The browser usually alerts the user that data will need to be re-submitted
            </td>
        </tr>
        <tr>
            <td>
                Encoding type (enctype attribute) 不懂
            </td>
            <td>
                <code>application/x-www-form-urlencoded</code>
            </td>
            <td>
                <code>multipart/form-data</code> or <code>application/x-www-form-urlencoded</code>, use multipart encoding for binary data
            </td>
        </tr>
        <tr>
            <td>
                Parameters
            </td>
            <td>
                Can send but the parameter data is limited to what we can stuff into the request line (URL). Safest to use less than 2K of parameters, some servers handle up to 64K
            </td>
            <td>
                Can send parameters, including uploading files, to the server.
            </td>
        </tr>
        <tr>
            <td>
                Security
            </td>
            <td>
                <code>GET</code> is less secure compared to <code>POST</code> because data sent is part of the URL. So it's saved in browser history and server logs in plaintext.
            </td>
            <td>
                <code>POST</code> is a little（应该是可以被忽略的程度） safer than <code>GET</code> because the parameters are not stored in browser history or in web server logs.
            </td>
        </tr>
        <tr>
            <td>
                Restrictions on form data type
            </td>
            <td>
                Yes, only ASCII characters allowed.
            </td>
            <td>
                No restrictions. Binary data is also allowed.
            </td>
        </tr>
        <tr>
            <td>
                Restrictions on form data length
            </td>
            <td>
                Yes, since form data is in the URL and URL length is restricted. A safe URL length limit is often 2048 characters but varies by browser and web server.
            </td>
            <td>
                No restrictions
            </td>
        </tr>
        <tr>
            <td>
                Visibility
            </td>
            <td>
                <code>GET</code> method is visible to everyone (it will be displayed in the browser's address bar) and has limits on the amount of information to send.
            </td>
            <td>
                <code>POST</code> method variables are not displayed in the URL.
            </td>
        </tr>
    </tbody>
</table>


## TRACE
1. When a client makes a request, that request may have to travel through firewalls, proxies, gateways, or other applications. Each of these has the opportunity to modify the original HTTP request. 
2. The `TRACE` method allows clients to see how its request looks when it finally makes it to the server.
3. A `TRACE` request initiates a “loopback” diagnostic at the destination server. The server at the final leg of the trip bounces back a `TRACE` response, with the virgin request message it received in the body of its response. 
4. A client can then see how, or if, its original message was munged or modified along the request/response chain of
any intervening HTTP applications
    <img src="./images/07.png" width="600" style="display: block; margin: 5px 0 10px 0;" />
5. The `TRACE` method is used primarily for diagnostics; i.e., verifying that requests are going through the request/response chain as intended. It’s also a good tool for seeing the effects of proxies and other applications on your requests.
6. As good as `TRACE` is for diagnostics, it does have the drawback of assuming that intervening applications will treat different types of requests (different methods—`GET`, `HEAD`, `POST`, etc.) the same. 
7. Many HTTP applications do different things depending on the method—for example, a proxy might pass a `POST` request directly to the server but attempt to send a `GET` request to another HTTP application (such as a web cache). 
8. `TRACE` does not provide a mechanism to distinguish methods. Generally, intervening applications make the call as to how they process a `TRACE` request.
9. No entity body can be sent with a `TRACE` request. The entity body of the `TRACE` response contains, verbatim, the request that the responding server received.


## OPTIONS
1. `OPTIONS` 方法用来请求服务器告知它支持哪些功能，例如支持哪些方法、哪些首部等
    <img src="./images/08.png" width="600" style="display: block; margin: 5px 0 10px 0;" />
2. 因为某些场景下，对于特定的资源，服务器只允许通过特殊的请求条件才能获取到。例如跨域请求的 preflight 请求会询问服务器针对该跨域资源是否支持特定的方法和首部等。
3. 这个方法可以让客户端在不用实际请求某个资源的情况下来确定该如何请求该资源。


## DELETE
1. 请求服务器删除请求 URL 所指的资源。
2. 客户端无法确定资源是否真的被删除，因为规范允许服务器在不通知客户端的情况下忽略删除操作。


## Extension Methods
1. HTTP was designed to be field-extensible, so new features wouldn’t cause older software to fail. 
2. Extension methods are methods that are not defined in the HTTP/1.1 specification. They provide developers with a means of extending the capabilities of the HTTP services their servers implement on the resources that the servers manage.
3. It’s important to note that not all extension methods are defined in a formal specification. If you define an extension method, it’s likely not to be understood by most HTTP applications. Likewise, it’s possible that your HTTP applications could run into extension methods being used by other applications that it does not understand.
4. In these cases, it is best to be tolerant of extension methods. Proxies should try to relay messages with unknown methods through to downstream servers if they are capable of doing that without breaking end-to-end behavior. Otherwise, they should respond with a 501 Not Implemented status code.
5.  Dealing with extension methods (and HTTP extensions in general) is best done with the old rule, “be conservative in
what you send, be liberal in what you accept.”

    
## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)
* [REST – PUT vs POST](https://restfulapi.net/rest-put-vs-post/)