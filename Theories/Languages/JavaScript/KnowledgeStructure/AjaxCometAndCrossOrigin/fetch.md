# Fetch
[MDN: Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
[This API is so Fetching!](https://hacks.mozilla.org/2015/03/this-api-is-so-fetching/)


## Differences with XHR
* The Promise returned from `fetch()` won't reject on HTTP error status even if
the response is an HTTP `404` or `500`. Instead, it will resolve normally (with
`ok` status set to false), and it will only reject on network failure or if
anything prevented the request from completing.
* By default, `fetch` won't send or receive any cookies from the server,
resulting in unauthenticated requests if the site relies on maintaining a user
session.


## Re-read response, using `Response.clone()`
[MDN](https://developer.mozilla.org/en-US/docs/Web/API/Response/clone)
```js
let clonedRes = null;

async function reRead(){
    let res = await fetch('test.json');
    clonedRes = res.clone();
    console.log(await res.json());
}

reRead();

setTimeout(async ()=>{
    console.log(await clonedRes.json());
}, 3000);
```
