# FormData

## Summary
* The serialization of form data is frequently needed in modern web applications
, and so the XMLHttpRequest Level 2 specification introduces the `FormData` type.
The `FormData` type makes it easy to both serialize existing forms and create
data in the same format as a form for easy transmission via XHR.
* 截至2017.5，[浏览器支持](https://developer.mozilla.org/en-US/docs/Web/API/FormData#Browser_compatibility)
不好


## Create `FormData` instance
* 创建空的`FormData`实例
    ```js
    var formData = new FormData();
    ```
* 使用已有表单来创建一个实例  
    ```html
    <form id="myForm" action="" method="post">
        <input type="text" name="name" value="33" />
        <input type="text" name="age" value="22" />
        <input type="text" name="age" value="233" />
        <input id="sub" type="button" value="提交" />
    </form>
    ```
    ```js
    var form = document.getElementById("myForm");
    var formData = new FormData(form);
    ```


## Get data
  ```js
  console.log( formData.get('name') ); // 33
  // 获取一键多值数据
  console.log( formData.getAll('age') ); // ["22", "233"]
  ```


## Append data
  ```js
  formData.append("sex", "female");
  console.log( formData.get('sex') ); // female
  ```

即使是相同的键名，也不会覆盖，而是重复添加：
  ```js
  let formData = new FormData();

  formData.append("name", "li");
  formData.append("name", "ni");

  for (var key of formData.keys()) {
     console.log(key); // 输出两个 "name"
  }

  for (var value  of formData.values()) {
     console.log(value); // 输出 "li" 和 "ni"
  }
  ```
所以在多次提交数据时，每次都要初始化。


## Update data
```js
formData.set("sex", "male");
console.log( formData.get('sex') ); // male

// 如果要修改的 key 不存在，将创建该 key 并赋值
formData.set("height", "160");
console.log( formData.get('height') ); // 160
```


## Check if a key exists
```js
console.log( formData.has("height") ); // true
console.log( formData.has("weight") ); // false
```


## Delete data
```js
formData.delete("height");
console.log( formData.has("height") ); // false
```


## Iterator
* Go through all key/value pairs
    ```js
    var i = formData.entries();
    for (var pair of i) {
       console.log(pair);
       // 分别为：["name", "33"]、["age", "22"]、["age", "233"]、["sex", "male"]
    }
    ```
* Go through all keys
    ```js
    for (var key of formData.keys()) {
       console.log(key); // 分别为：name、age、age、sex
    }
    ```
*  Go through all values
    ```js
    for (var value of formData.values()) {
       console.log(value);  // 分别为：33、22、233、male
    }
    ```


## Post data    
使用 FormData 的方便之处体现在不必明确地在 XHR 对象上设置请求头部。XHR 对象能够识别传
入的数据类型是 FormData 的实例，并配置适当的头部信息。
```js
// client
var xhr = new XMLHttpRequest();
xhr.open("post", "test.php", true);
xhr.send(formData);
```
```js
// server
if (req.method === 'POST'){
    console.log(req.headers['content-type']);
    // multipart/form-data; boundary=----WebKitFormBoundary5aAU0KqnhfJp7nV1
    res.end();
}
```
