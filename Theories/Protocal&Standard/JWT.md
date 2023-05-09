# JWT（JSON Web Token）


<!-- TOC -->

- [JWT（JSON Web Token）](#jwtjson-web-token)
    - [Session 认证的缺点](#session-认证的缺点)
    - [JWT 结构](#jwt-结构)
        - [Header](#header)
        - [Payload](#payload)
        - [Signature](#signature)
    - [使用方法](#使用方法)
    - [JWT 的特点总结](#jwt-的特点总结)
    - [References](#references)

<!-- /TOC -->


## Session 认证的缺点
1. 如果是服务器集群，或者是跨域的服务导向架构，就要求 session 数据共享，每台服务器都能够读取 session。
2. 举例来说，A 网站和 B 网站是同一家公司的关联服务。现在要求，用户只要在其中一个网站登录，再访问另一个网站就会自动登录，也就是单点登录，请问怎么实现？
3. 一种解决方案是 session 数据持久化，写入数据库或别的持久层。各种服务收到请求后，都向持久层请求数据。这种方案的优点是架构清晰，缺点是工程量比较大。另外，持久层万一挂了，就会单点失败。
4. 另一种方案是服务器索性不保存 session 数据了，所有数据都保存在客户端，每次请求都发回服务器。JWT 就是这种方案的一个代表。



## JWT 结构
1. JWT 的 token 包含三部分内容，用点来分割。形如
    ```
    xxxxx.yyyyy.zzzzz
    ```
2. 三部分分别为：Header、Payload、Signature。

### Header
1. Header 通常由两部分组成：token 的类型（JWT 的 token 类型就是 JWT）和正在使用的签名算法，例如 HMAC SHA256 或 RSA。
2. 例如：
    ```json
    {
        "alg": "HS256",
        "typ": "JWT"
    }
    ```
3. 然后，这段 JSON 被使用 Base64Url 编码以形成 JWT 的第一部分。

### Payload
1. Payload 由声明（claims）组成。声明式关于实体（通常是用户信息）和额外信息的语句。
2. 声明有三中类型：registered, public, private。
    * Registered claim：是一组预定义的，非必须但建议使用，可以提供一些交互时可用到的基本信息。包括
        * iss (issuer)：签发人
        * exp (expiration time)：过期时间
        * sub (subject)：主题
        * aud (audience)：受众
        * nbf (Not Before)：生效时间
        * iat (Issued At)：签发时间
        * jti (JWT ID)：编号
    * Public claims：These can be defined at will by those using JWTs. But to avoid collisions they should be defined in the IANA JSON Web Token Registry or be defined as a URI that contains a collision resistant namespace.
    * Public claims：These are the custom claims created to share information between parties that agree on using them and are neither registered or public claims.
3. 一个 payload 可能是这样的
    ```json
    {
        "sub": "1234567890",
        "name": "John Doe",
        "admin": true
    }
    ```
4. 这段 JSON 被使用 Base64Url 编码以形成 JWT 的第二部分。
5. JWT 虽然可以防止篡改，但是任何人都可以读取，所以不要把机密信息放在这里。

### Signature
1. 使用一个 secret，通过 Header 中指定的签名算法，对已经编码的 Header 和 Payload 进行签名。原理如下
    ```
    HMACSHA256(
        base64UrlEncode(header) + "." +
        base64UrlEncode(payload),
        secret)
    ```
2. Signature 用于验证消息在此过程中未被更改，并且在使用私钥签名的令牌的情况下，它还可以验证 JWT 的发件人是否是它所说的人。
3. 最终形成 JWT 就像这样
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```


## 使用方法
1. 用户首次登录后，服务器生成 JWT 返回给用户。
2. 因为 JWT 是用户凭证，所以要注意安全问题，例如必须要使用 HTTPS、不要保存敏感信息，也不应该让它过长时间有效。
3. 因为客户端通常不是使用 cookie 发送 JWT，所以一般 JWT 保存在 localStorage 里。
4. 当用户想要进行需要凭证的访问时，就发送这个 JWT。通常是通过如下请求首部来发送
    ```
    Authorization: Bearer <token>
    ```
5. 使用 `Authorization` 而非 cookie 发送 JWT 的好处是，它不会受到跨域的限制。但你应该避免生成过大 JWT，因为某些服务器不接受好过 8KB 的首部。
6. 服务器接到用户请求时，如果是需要授权的请求，则尝试去读 JWT。


## JWT 的特点总结
* 服务器不用再保存 session，因此这是一种无状态的授权机制。
* 便于服务器扩展
* 可跨域
* JWT 默认是不加密的，所以应该使用 HTTPS。也可以对生成的 JWT 再加密一次。
* 因为服务器不保存状态，也就没办法提前废除一个 JWT，所以设置 JWT 时不要设置过长的有效期。
* 除了用来授权，JWT 的签名机制也可以用来安全的交换信息。


## References
* [Introduction to JSON Web Tokens](https://jwt.io/introduction)
* [JSON Web Token 入门教程](http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)