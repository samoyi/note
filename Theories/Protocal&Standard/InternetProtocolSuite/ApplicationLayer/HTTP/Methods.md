# Methods
*  Note that not all methods are implemented by every server. To be compliant
with HTTP Version 1.1, a server need implement only the `GET` and `HEAD` methods
 for its resources.


## Safe Methods
1. HTTP defines a set of methods that are called safe methods. The `GET` and
`HEAD` methods are said to be safe, meaning that no action should occur as a
result of an HTTP request that uses either the `GET` or `HEAD` method.
2. By no action, we mean that nothing will happen on the server as a result of
the HTTP request. For example, consider when you are shopping online at Joe’s
Hardware and you click on the “submit purchase” button. Clicking on the button
submits a `POST` request with your credit card information, and an action is
performed on the server on your behalf. In this case, the action is your credit
card being charged for your purchase.
3. There is no guarantee that a safe method won’t cause an action to be
performed (in practice, that is up to the web developers). Safe methods are
meant to allow HTTP application developers to let users know when an unsafe
method that may cause some action to be performed is being used. In our Joe’s
Hardware example, your web browser may pop up a warning message letting you know
 that you are making a request with an unsafe method and that, as a result,
something might happen on the server (e.g., your credit card being charged).


## `GET`
1. `GET` is the most common method. It usually is used to ask a server to send a
resource.
2. HTTP/1.1 requires servers to implement this method.


## `HEAD`
1. The `HEAD` method behaves exactly like the GET method, but the server returns
 only the headers in the response. No entity body is ever returned.
2. This allows a client to inspect the headers for a resource without having to
actually get the resource.
3. Using `HEAD`, you can:
    * Find out about a resource (e.g., determine its type) without getting it.
    * See if an object exists, by looking at the status code of the response.
    * Test if the resource has been modified, by looking at the headers.
4. Server developers must ensure that the headers returned are exactly those
that a `GET` request would return.
5. The `HEAD` method also is required for HTTP/1.1 compliance.


## `PUT`
1. The `PUT` method writes documents to a server, in the inverse of the way that
 `GET` reads documents from a server.
2. Some publishing systems let you create web pages and install them directly on
 a web server using `PUT`.
3. The semantics of the `PUT` method are for the server to take the body of the
request and either use it to create a new document named by the requested URL or
, if that URL already exists, use the body to replace it.
4. Because `PUT` allows you to change content, many web servers require you to
log in with a password before you can perform a `PUT`.


## `POST`
1. The `POST` method was designed to send input data to the server.
2. `POST` is used to send data to a server. `PUT` is used to deposit data into a
 resource on the server (e.g., a file).
3. In practice, it is often used to support HTML forms. The data from a
filled-in form typically is sent to the server, which then marshals it off to
where it needs to go (e.g., to a server gateway program, which then processes it
).


## `TRACE`
1. When a client makes a request, that request may have to travel through
firewalls, proxies, gateways, or other applications. Each of these has the
opportunity to modify the original HTTP request. The `TRACE` method allows
clients to see how its request looks when it finally makes it to the server.
2. A `TRACE` request initiates a “loopback” diagnostic at the destination server
. The server at the final leg of the trip bounces back a `TRACE` response, with
the virgin request message it received in the body of its response.
3. A client can then see how, or if, its original message was
<a href="https://en.wikipedia.org/wiki/Mung_(computer_term)">munged</a> or
modified along the request/response chain of any intervening HTTP applications.
4. The `TRACE` method is used primarily for diagnostics; i.e., verifying that
requests are going through the request/response chain as intended. It’s also a
good tool for seeing the effects of proxies and other applications on your
requests.
5. As good as `TRACE` is for diagnostics, it does have the drawback of assuming
that intervening applications will treat different types of requests (different
methods — `GET`, `HEAD`, `POST`, etc.) the same. Many HTTP applications do
different things depending on the method — for example, a proxy might pass a
`POST` request directly to the server but attempt to send a `GET` request to
another HTTP application (such as a web cache). TRACE does not provide a
mechanism to distinguish methods. Generally, intervening applications make the
call as to how they process a `TRACE` request.
6. No entity body can be sent with a `TRACE` request. The entity body of the
`TRACE` response contains, verbatim, the request that the responding server
received.


## `OPTIONS`
1. The `OPTIONS` method asks the server to tell us about the various supported
capabilities of the web server. You can ask a server about what methods it
supports in general or for particular resources. (Some servers may support
particular operations only on particular kinds of objects).
2. This provides a means for client applications to determine how best to access
 various resources without actually having to access them.


## `DELETE`
1. The `DELETE` method does just what you would think—it asks the server to
deletethe resources specified by the request URL. However, the client
application is not guaranteed that the delete is carried out. This is because
the HTTP specification allows the server to override the request without telling
 the client.


## Extension Methods
1. HTTP was designed to be field-extensible, so new features wouldn’t cause
older software to fail.
2. Extension methods are methods that are not defined in the HTTP/1.1
specification. They provide developers with a means of extending the
capabilities of the HTTP services their servers implement on the resources that
the servers manage.
3. Some common examples of extension methods are listed below. These methods are
 all part of the WebDAV HTTP extension that helps support publishing of web
content to web servers over HTTP.

Method | description
--|--
LOCK | Allows a user to “lock” a resource — for example, you could lock a resource while you are editing it to prevent others from editing it at the same time
MKCOL | Allows a user to create a resource
COPY | Facilitates copying resources on a server
MOVE | Moves a resource on a server

4. It’s important to note that not all extension methods are defined in a formal
 specification. If you define an extension method, it’s likely not to be
understood by most HTTP applications. Likewise, it’s possible that your HTTP
applications could run into extension methods being used by other applications
that it does not understand.
5. In these cases, it is best to be tolerant of extension methods. Proxies
should try to relay messages with unknown methods through to downstream servers
if they are capable of doing that without breaking end-to-end behavior.
Otherwise, they should respond with a `501 Not Implemented` status code.
6. Dealing with extension methods (and HTTP extensions in general) is best done
with the old rule, “be conservative in what you send, be liberal in what you
accept.”


## References
* [HTTP: The Definitive Guide](https://book.douban.com/subject/1440226/)
