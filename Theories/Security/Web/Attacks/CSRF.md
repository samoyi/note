# Cross-Site_Request_Forgery 跨站点请求伪造

## 使用受害者 cookie 伪造请求
1. 由于很多的用户请求是需要通过 cookie 验证身份的，例如发帖、转账等，因此想要伪造这些请
求，必须要让请求成功的发送 cookie。
2. 攻击者想要伪造受害者转账给攻击者的请求，该请求是要发送给银行网站
`http://www.bank.com/transfer` 的，银行网站接到该请求的时候会验证 cookie 中的身份信
息。
3. 攻击者制作一个网页 `http://www.evil.com`，该网页会自动发送一个转账请求到
`http://www.bank.com/transfer`
4. 诱导受害者进入 `http://www.evil.com`，转账请求就会被发出，同时也会带上受害者的银行
cookie。


## References
* [白帽子讲Web安全](https://book.douban.com/subject/10546925/)
* <a href="https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)">WASP</a>
