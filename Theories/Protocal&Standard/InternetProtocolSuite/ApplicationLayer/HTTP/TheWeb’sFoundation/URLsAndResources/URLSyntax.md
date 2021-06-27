# URL Syntax

1. URLs provide a means of locating any resource on the Internet, but these resources can be accessed by different schemes (e.g., HTTP, FTP, SMTP), and URL syntax varies from scheme to scheme.
2. Does this mean that each different URL scheme has a radically different syntax? In practice, no. Most URLs adhere to a general URL syntax, and there is significant overlap in the style and syntax between different URL schemes.


<!-- TOC -->

- [URL Syntax](#url-syntax)
    - [设计思想](#%E8%AE%BE%E8%AE%A1%E6%80%9D%E6%83%B3)
    - [抽象本质](#%E6%8A%BD%E8%B1%A1%E6%9C%AC%E8%B4%A8)
    - [URL 结构](#url-%E7%BB%93%E6%9E%84)
    - [Schemes: What Protocol to Use](#schemes-what-protocol-to-use)
    - [Hosts and Ports](#hosts-and-ports)
    - [Usernames and Passwords](#usernames-and-passwords)
    - [Paths](#paths)
    - [Parameters](#parameters)
    - [Query Strings](#query-strings)
    - [Fragments](#fragments)
    - [Host, Domain, Origin and Site](#host-domain-origin-and-site)
        - [public suffix 和 registrable domain](#public-suffix-%E5%92%8C-registrable-domain)
        - [Origin](#origin)
        - [Site](#site)
    - [References](#references)

<!-- /TOC -->


## 设计思想


## 抽象本质


## URL 结构
1. Most URL schemes base their URL syntax on this nine-part general format:
    ```
    <scheme>://<user>:<password>@<host>:<port>/<path>;<params>?<query>#<frag>
    ```
2. Almost no URLs contain all these components. The three most important parts of a URL are the `scheme`, the `host`, and the `path`. 
3. Table below summarizes the various components
<table>
    <thead>
        <tr>
            <th>Component</th>
            <th>Description</th>
            <th>Default value</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>scheme</td>
            <td>Which protocol to use when accessing a server to get a resource.</td>
            <td>None</td>
        </tr>
        <tr>
            <td>user</td>
            <td>The username some schemes require to access a resource.</td>
            <td>anonymous</td>
        </tr>
        <tr>
            <td>password</td>
            <td>The password that may be included after the username, separated by a colon (:). </td>
            <td>&lt;Email address&gt;</td>
        </tr>
        <tr>
            <td>host</td>
            <td>The hostname or dotted IP address of the server hosting the resource.</td>
            <td>None</td>
        </tr>
        <tr>
            <td>port</td>
            <td>The port number on which the server hosting the resource is listening. Many schemes have default port numbers (the default port number for HTTP is 80).</td>
            <td>Scheme-specific</td>
        </tr>
        <tr>
            <td>path</td>
            <td>The local name for the resource on the server, separated from the previous URL components by a slash (/). The syntax of the path component is server- and scheme-specific. (We will see later in this chapter that a URL’s path can be divided into segments, and each segment can have its own components specific to that segment.)</td>
            <td>None</td>
        </tr>
        <tr>
            <td>params</td>
            <td>Used by some schemes to specify input parameters. Params are name/value pairs. A URL can contain multiple params fields, separated from themselves and the rest of the path by semicolons (;).</td>
            <td>None</td>
        </tr>
        <tr>
            <td>query</td>
            <td>Used by some schemes to pass parameters to active applications (such as databases, bulletin boards, search engines, and other Internet gateways). There is no common format for the contents of the query component. It is separated from the rest of the URL by the “?” character.</td>
            <td>None</td>
        </tr>
        <tr>
            <td>frag</td>
            <td>A name for a piece or part of the resource. The frag field is not passed to the server when referencing the object; it is used internally by the client. It is separated from the rest of the URL by the “#” character.</td>
            <td>None</td>
        </tr>
    </tbody>
</table>


## Schemes: What Protocol to Use
1. The *scheme* is really the main identifier of how to access a given resource; it tells the application interpreting the URL what protocol it needs to speak. In our simple HTTP URL, the scheme is simply `http`.
2. The scheme component must start with an alphabetic character, and it is separated from the rest of the URL by the first `:` character. 
3. Scheme names are case-insensitive, so the URLs `http://www.joes-hardware.com` and `HTTP://www.joeshardware.com` are equivalent.


## Hosts and Ports
1. To find a resource on the Internet, an application needs to know what machine is hosting the resource and where on that machine it can find the server that has access to the desired resource. 
2. The *host* and *port* components of the URL provide these two pieces of information.
3. The host component identifies the host machine on the Internet that has access to the resource. 
4. The name can be provided as a hostname, as above (`www.joes-hardware.com`) or as an IP address. 
5. For example, the following two URLs point to the same resource—the first refers to the server by its hostname and the second by its IP address:
    ```
    http://www.joes-hardware.com:80/index.html
    http://161.58.228.45:80/index.html
    ```
6. The port component identifies the network port on which the server is listening. For HTTP, which uses the underlying TCP protocol, the default port is 80.


## Usernames and Passwords
1. More interesting components are the *user* and *password* components. Many servers require a username and password before you can access data through them. 
2. FTP servers are a common example of this. Here are a few examples:
    ```
    ftp://ftp.prep.ai.mit.edu/pub/gnu
    ftp://anonymous@ftp.prep.ai.mit.edu/pub/gnu
    ftp://anonymous:my_passwd@ftp.prep.ai.mit.edu/pub/gnu
    http://joe:joespasswd@www.joes-hardware.com/sales_info.txt
    ```
3. The first example has no user or password component, just our standard scheme, host, and path. If an application is using a URL scheme that requires a username and password, such as FTP, it generally will insert a default username and password if they aren’t supplied. For example, if you hand your browser an FTP URL without specifying a username and password, it will insert “anonymous” for your username and send a default password (Internet Explorer sends “IEUser”, while Netscape Navigator sends “mozilla”).
4. The second example shows a username being specified as “anonymous”. This username, combined with the host component, looks just like an email address. The `@` character separates the user and password components from the rest of the URL.
5. In the third example, both a username (“anonymous”) and password (“my_passwd”) are specified, separated by the `: `character.


## Paths
1. The `path` component of the URL specifies where on the server machine the resource lives. 
2. The path often resembles a hierarchical filesystem path. For example:
    ```
    http://www.joes-hardware.com:80/seasonal/index-fall.html
    ```
3. The path in this URL is `/seasonal/index-fall.html`, which resembles a filesystem path on a Unix filesystem. 
4. The path is the information that the server needs to locate the resource. (This is a bit of a simplification. In “Virtual Hosting” , we will see that the path is not always enough information to locate a resource. Sometimes a server needs additional information)
5. The path component for HTTP URLs can be divided into path segments separated by `/` characters (again, as in a file path on a Unix filesystem). Each path segment can have its own params component.


## Parameters
1. For many schemes, a simple host and path to the object just aren’t enough, many protocols require more information to work.
2. Applications interpreting URLs need these protocol parameters to access the resource. Otherwise, the server on the other side might not service the request or, worse yet, might service it wrong. 
3. For example, take a protocol like FTP, which has two modes of transfer, binary and text. You wouldn’t want your binary image transferred in text mode, because the binary image could be scrambled.
4. To give applications the input parameters they need in order to talk to the server correctly, URLs have a `params` component. 
5. This component is just a list of name/value pairs in the URL, separated from the rest of the URL (and from each other) by `;` characters. 
6. They provide applications with any additional information that they need to access the resource. For example:
    ```
    ftp://prep.ai.mit.edu/pub/gnu;type=d
    ```
7. In this example, there is one param, `type=d`, where the name of the param is `type` and its value is `d`.
8. As we mentioned earlier, the path component for HTTP URLs can be broken into path segments. Each segment can have its own params. For example:
    ```
    http://www.joes-hardware.com/hammers;sale=false/index.html;graphics=true
    ```
9. In this example there are two path segments, `hammers` and `index.html`. The `hammers` path segment has the param `sale`, and its value is `false`. The `index.html` segment has the param `graphics`, and its value is `true`.


## Query Strings
1. Some resources, such as database services, can be asked questions or queries to narrow down the type of resource being requested.
2. Let’s say Joe’s Hardware store maintains a list of unsold inventory in a database and allows the inventory to be queried, to see whether products are in stock. 
3. The following URL might be used to query a web database gateway to see if item number 12731 is available:
    ```
    http://www.joes-hardware.com/inventory-check.cgi?item=12731
    ```
4. For the most part, this resembles the other URLs we have looked at. What is new is everything to the right of the question mark (`?`). This is called the `query` component.
5. The query component of the URL is passed along to a gateway resource, with the path component of the URL identifying the gateway resource. 
6. Basically, gateways can be thought of as access points to other applications. Figure below shows an example of a query component being passed to a server that is acting as a gateway to Joe’s Hardware’s inventory-checking application. The query is checking whether a particular item, 12731, is in inventory in size large and color blue.
    <img src="./images/02.png" width="600" style="display: block; margin: 5px 0 10px 0;" />
7. There is no requirement for the format of the query component, except that some characters are illegal, as we’ll see later in this chapter. By convention, many gateways expect the query string to be formatted as a series of “name=value” pairs, separated by `&` characters:
    ```
    http://www.joes-hardware.com/inventory-check.cgi?item=12731&color=blue
    ```


## Fragments
1. Some resource types, such as HTML, can be divided further than just the resource level. 
2. For example, for a single, large text document with sections in it, the URL for the resource would point to the entire text document, but ideally you could specify the sections within the resource.
3. To allow referencing of parts or fragments of a resource, URLs support a `frag` component to identify pieces within a resource. For example, a URL could point to a particular image or section within an HTML document. 
4. A fragment dangles off the right-hand side of a URL, preceded by a `#` character. For example:
    ```
    http://www.joes-hardware.com/tools.html#drills
    ```
5. In this example, the fragment `drills` references a portion of the `/tools.html` web page located on the Joe’s Hardware web server. The portion is named “drills”.
6. Because HTTP servers generally deal only with entire objects, not with fragments of objects, clients don’t pass fragments along to servers. The URL fragment is used only by the client, because the server deals with entire objects.
7. After your browser gets the entire resource from the server, it then uses the fragment to display the part of the resource in which you are interested.
    <img src="./images/03.png" width="600" style="display: block; margin: 5px 0 10px 0;" />


## Host, Domain, Origin and Site
1. 上面已经介绍了 **host**，再看一下标准中的表述：A host is a domain, an IP address, an opaque host, or an empty host.
2. 再看看 **domain**，标准上的表述是：A domain is a non-empty ASCII string that identifies a realm within a network。 但感觉 MDN 上的一个表述似乎更准确：A domain is an authority within the internet that controls its own resources. Its "domain name" is a way to address this authority as part of the hierarchy in a URL。也就是，domain（域）是那个 realm，而 domain name（域名）是表示那个 realm 的一串字符。
3. 一个普通的 host，既可以表示为域名也可以表示为 IP 地址。

### public suffix 和 registrable domain
1. Host 还包括两个特别的部分：public suffix 和 registrable domain。
2. A host’s public suffix is the portion of a host which is included on the [Public Suffix List](https://publicsuffix.org/learn/).
3. 直观的说，这部分就是你去注册域名时不能自定义的那一部分。比如你可以选择注册 `mysite.com`、`mysite.org` 或者 `mysite.com.cn`，`com`、`org` 或者 `com.cn` 就是不能定义的那一部分。
4. Public suffix 还有一些特殊的，比如 Github Pages 的 `github.io`。
5. Public suffix 的作用是用来判断域名中哪一部分是很多网站公共的部分，哪一部分是各个网站自定义的部分。
6. 比如浏览器不允许给 public suffix 设置 cookie，比如你给 `com` 设置了一个 cookie，因为给一个域设置 cookie 后它的子域也会收到这个 cookie，这就会导致所有的基于 `com` 都会网站收到这个 cookie。
7. 而 registrable domain 就是在 public suffix 的基础上，再加上前面注册的那个自定义名字。规范上的表述是：A host’s registrable domain is a domain formed by the most specific public suffix, along with the domain label immediately preceding it, if any. 
8. 例如 `example.com` 和 `www.example.com` 的 registrable domain 都是 `example.com`；`github.io` 的 registrable domain 是 null；`whatwg.github.io` 的 registrable domain 是 `whatwg.github.io`。

### Origin
1. Origins are the fundamental currency of the web's security model. Two actors in the web platform that share an origin are assumed to trust each other and to have the same authority. Actors with differing origins are considered potentially hostile versus each other, and are isolated from each other to varying degrees.

### Site

## References
* [*HTTP: the definitive guide*](https://book.douban.com/subject/1440226/)
* [URL 标准文档](https://url.spec.whatwg.org/)
* [Domain](https://developer.mozilla.org/en-US/docs/Glossary/Domain)
* [PUBLIC SUFFIX LIST](https://publicsuffix.org/learn/)