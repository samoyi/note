# HTTPS


## Check
Check if current query is through the HTTPS protocol
```
function isSecure() {
  return
    (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || $_SERVER['SERVER_PORT'] == 443;
}
```
* [stackoverflow](https://stackoverflow.com/questions/1175096/how-to-find-out-if-youre-using-https-without-serverhttps)
* [$_SERVER['HTTPS']](https://secure.php.net/manual/en/reserved.variables.server.php)
* [Wiki HTTPS](HTTPS)



***
## References
