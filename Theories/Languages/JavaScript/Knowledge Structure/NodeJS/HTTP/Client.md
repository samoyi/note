# HTTP Client


## Class: http.ClientRequest




***
## `http.request(options[, callback])`
### [Doc](https://nodejs.org/api/http.html#http_http_request_options_callback)

### `callback`
* [Doc](https://nodejs.org/api/all.html#http_class_http_incomingmessage)
* This function accept `http.IncomingMessage` object as argument. This object
implements the Readable Stream interface, so, its `data` event listener callback
will be passed the chunk of data as a string if a default encoding has been
specified for the stream using the `readable.setEncoding()` method; otherwise
the data will be passed as a `Buffer`.

```js
const https = require('https');

var contents = querystring.stringify({
    name: 'byvoid',
    email: 'byvoid@byvoid.com',
    address: 'Zijing 2#, Tsinghua University',
});

https:///?format=json&explaintext=true&action=query&prop=extracts&exintro=&explaintext=true&titles=
var options = {
    host: 'ja.wikipedia.org',
    path: 'w/api.php',
    method: 'GET',
};

var req = https.request(options, function(res) {
    res.setEncoding('utf8'); // Covert type of chunk from buffer to string
    let sData = '';
    // data事件相当于 AJAX中 readyState为3的 readystatechange事件，即接收到部分数据
    res.on('data', (chunk)=>{
        sData += chunk;
    });
    // end事件相当于 AJAX中 readyState为4的 readystatechange事件
    res.on('end', ()=>{
        console.log( sData );
    })
});

req.write(contents);
req.end();
```



***
## `http.get(options[, callback])`
1. Since most requests are `GET` requests without bodies, Node.js provides this convenience method.
2. The only difference between this method and `http.request()` is that it sets
the method to `GET` and calls `req.end()` automatically.
3. Note that the callback must take care to consume the response data for
reasons stated in [http.ClientRequest](https://nodejs.org/api/all.html#http_class_http_clientrequest) section.

***
## Query String
* The `querystring` module provides utilities for parsing and formatting URL query
strings.
* [Doc](https://nodejs.org/api/querystring.html)


### `querystring.stringify(obj[, sep[, eq[, options]]])`
* Iterating through the object's "own properties".
* Default internal encoding uses `querystring.escape()`

```js
var querystring = require('querystring');
let str = querystring.stringify({ foo: 'bar', baz: [22, false, 'quux'], corge: '' });
console.log(str); // 'foo=bar&baz=22&baz=false&baz=quux&corge='
```


### `querystring.parse(str[, sep[, eq[, options]]])`
* The object returned by the `querystring.parse()` method does not
prototypically inherit from the JavaScript `Object`. This means that typical
`Object` methods such as `obj.toString()`, `obj.hasOwnProperty()`, and others
are not defined and will not work.
* This method is not the exact reverse process of `querystring.stringify`,
because it can not convert string `'false'` to boolean `false`
* Default internal encoding uses `querystring.unescape()`

```js
var querystring = require('querystring');
let obj = querystring.parse('foo=bar&baz=22&baz=false&baz=quux&corge=');
console.log( JSON.stringify(obj, null, 2) );
// {
//   "foo": "bar",
//   "baz": [
//     "22",
//     "false",
//     "quux"
//   ],
//   "corge": ""
// }
console.log( obj.toString ); // undefined
console.log( typeof obj.baz[1] ); // string
```


### `querystring.unescape()`
* The `querystring.unescape()` method is used by `querystring.parse()` and is
generally not expected to be used directly. It is exported primarily to allow application code to provide a replacement decoding implementation if necessary
by assigning querystring.unescape to an alternative function.
* By default, the `querystring.unescape()` method will attempt to use the
JavaScript built-in `decodeURIComponent()` method to decode. If that fails, a
safer equivalent that does not throw on malformed URLs will be used.


### `querystring.escape()`
* The `querystring.escape()` method is used by `querystring.stringify()` and is generally not expected to be used directly. It is exported primarily to allow application code to provide a replacement percent-encoding implementation if
necessary by assigning `querystring.escape` to an alternative function.



***
## References
* [Node.js v8.5.0 Documentation](https://nodejs.org/api/)
* [《Node.js开发指南》](https://book.douban.com/subject/10789820/)
