# Cookie, Session and Security
* cookie的总数限制接近于4KB。这已经远远超出大多数应用程序所需的数量。
* 可以使用headers_sent()函数来测试发送cookie是否安全。它将报告HTTP头是否已经发送给Web浏览器。<mark>不懂</mark>


***
## Cookie
[Basic](https://secure.php.net/manual/en/features.cookies.php)


***
## Session
[Basic](https://secure.php.net/manual/en/session.examples.php)



http://www.php.net/manual/zh/session.constants.php
http://netsecurity.51cto.com/art/201402/428721.htm






***
## Security problems
* Cookie is store in client in cleartext, anyone with access to the client can
easily pick those up.
* HTTP does not encrypt the headers in any way. If the connection isn’t over SSL
then it will not be protected from snooping eyes.



***
## Security configuration
### Avoid storing sensitive information in cookie

### HTTP(HTTPS) protocol only
* You can make the cookie won't be accessible by scripting languages, such as
JavaScript.
* This is primarily a defense against cross site scripting
* [Detail](https://secure.php.net/manual/en/function.setcookie.php)

### HTTPS only
* If the cookie will be set just when a secure connection exists.
* [Detail](https://secure.php.net/manual/en/function.setcookie.php)
* Check if current query is througn HTTPS, if it's ture, set HTTPS only
```php
<?php
    function isSecure() {
      return
        (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || $_SERVER['SERVER_PORT'] == 443;
    }
?>
```
[Reference](https://stackoverflow.com/questions/21729960/how-do-i-use-syntax-highlighting-in-php-within-a-markdown-github-gist)

### Restrict available path and subdomain
* Set the specific path or subdomain which the cookie is available
* Default valid domain is the current domain
* [Detail](https://secure.php.net/manual/en/function.setcookie.php)

### Secure cookie for session
* Before `session_start()`, using `session_set_cookie_params()` can set the
cookie's configarations for this session.
* If not, configations in `php.ini` will be used for this session's cookie.
* [Detail](https://secure.php.net/manual/en/function.session-set-cookie-params.php)




***
## References
* [PHP Manual](https://php.net/)
* [How to Create Totally Secure Cookies](http://blog.teamtreehouse.com/how-to-create-totally-secure-cookies)








EOF
