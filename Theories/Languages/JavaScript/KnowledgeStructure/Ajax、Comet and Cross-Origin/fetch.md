# Fetch



## Differences with XHR
* The Promise returned from `fetch()` won't reject on HTTP error status even if
the response is an HTTP `404` or `500`. Instead, it will resolve normally (with
`ok` status set to false), and it will only reject on network failure or if
anything prevented the request from completing.
* By default, `fetch` won't send or receive any cookies from the server,
resulting in unauthenticated requests if the site relies on maintaining a user
session.
