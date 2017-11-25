# navigator


***
## 属性和方法
```js
for(let attr in navigator){
    console.log( attr + " : " + navigator[attr] );
}
```

***
## Detecting Plug-ins by `navigator.plugins`
### `navigator.plugins.refresh()`
* refreshes plugins to reflect any newly installed plug-ins.
* This method accepts a single argument: a Boolean value indicating if the page should be reloaded. When set to true, all  pages containing plug-ins are reloaded; otherwise the plugins collection is updated, but the page is not reloaded.


***
## Registering Handlers
没仔细看，《JavaScript高级程序设计（第3版）》8.3
