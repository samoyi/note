# Copy To Clipboard


<!-- TOC -->

- [Copy To Clipboard](#copy-to-clipboard)
    - [Summary](#summary)
    - [Clipboard API](#clipboard-api)
        - [权限](#权限)
        - [Methods](#methods)
            - [`read()`](#read)
            - [`readText()`](#readtext)
            - [`write()`](#write)
            - [`writeText()`](#writetext)
    - [已废弃的 `document.execCommand` 方法](#已废弃的-documentexeccommand-方法)
    - [基于以上两种方案的一种实现](#基于以上两种方案的一种实现)
    - [References](#references)

<!-- /TOC -->


## Summary
1. 剪切板操作有两个方案：比较新的 Clipboard API 和已经废弃的 `document.execCommand`。
2. 详见 [References](#References) 里的内容。


## Clipboard API
1. The `Clipboard` interface implements the Clipboard API, providing—if the user grants permission—both read and write access to the contents of the system clipboard. 
2. The Clipboard API can be used to implement cut, copy, and paste features within a web application.
3. The system clipboard is exposed through the global `Navigator.clipboard` property.
4. All of the Clipboard API methods operate asynchronously; they return a `Promise` which is resolved once the clipboard access has been completed. The promise is rejected if clipboard access is denied.
5. The clipboard is a data buffer that is used for short-term, data storage and/or data transfers, this can be between documents or applications. 
6. It is usually implemented as an anonymous, temporary data buffer, sometimes called the paste buffer, that can be accessed from most or all programs within the environment via defined programming interfaces.

### 权限
1. Calls to the methods of the `Clipboard` object will not succeed if the user hasn't granted the needed permissions using the Permissions API and the "clipboard-read" or "clipboard-write" permission as appropriate.
2. The asynchronous clipboard API is a relatively recent addition, and the process of implementing it in browsers is not yet complete. 
3. Due to both potential security concerns and technical complexities, the process of integrating this API is happening gradually in most browsers.
4. Check the compatibility tables for each method before using it.

### Methods
Clipboard is based on the `EventTarget` interface, and includes its methods.

#### `read()`
`. Requests arbitrary data (such as images) from the clipboard, returning a `Promise`. 
2. When the data has been retrieved, the promise is resolved with a `DataTransfer` object that provides the data.

#### `readText()`
Requests text from the system clipboard; returns a `Promise` which is resolved with a `DOMString` containing the clipboard's text once it's available.

#### `write()`
Writes arbitrary data to the system clipboard. This asynchronous operation signals that it's finished by resolving the returned `Promise`.

#### `writeText()`
Writes text to the system clipboard, returning a `Promise` which is resolved once the text is fully copied into the clipboard.


## 已废弃的 `document.execCommand` 方法
因为已经被废弃，所以只作为 `Clipboard` 的回退方案使用


## 基于以上两种方案的一种实现
根据 [这个回答](https://stackoverflow.com/a/30810322) 给出的实现
```js
function fallbackCopyTextToClipboard (text) {
    let textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        let successful = document.execCommand('copy');
        let msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        return false;
    }

    document.body.removeChild(textArea);
    return true;
}

async function copyTextToClipboard (text) {
    if ( !navigator.clipboard ) {
        return this.fallbackCopyTextToClipboard(text);
    }
    try {
        await navigator.clipboard.writeText(text)
    }
    catch (err) {
        return false;
    }
    return true;
}


let str = 'hello world';

copyTextToClipboard(str)
.then((res) => {
    if (res) {
        alert('复制成功');
    }
    else {
        alert('复制失败');
    }
});
```


## References
* [MDN Clipboard](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard)
* [How do I copy to the clipboard in JavaScript?](https://stackoverflow.com/questions/400212/)