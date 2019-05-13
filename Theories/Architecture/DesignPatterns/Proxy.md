# Proxy

## 保护代理(Protection proxy)和虚拟代理(Virtual proxy)
保护代理过滤掉一些请求，用来保护被请求对象；虚拟代理为对象代理执行一些耗时操作。


## 虚拟代理实现图片预加载
1. 本地对象，创建`img`节点，接收图片`src`。这个对象目前会直接记载图片，如果加载较慢，并不会有任何提示
    ```js
    var myImage = (function(){
        var imgNode = document.createElement( 'img' );
        document.body.appendChild( imgNode );

        return {
            setSrc: function( src ){
                imgNode.src = src;
            }
        }
    })();

    myImage.setSrc('http:// imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg');
    ```
2. 使用代理对象`proxyImage`先调用实际的图片对象并设置一个本地的 loading 图片，然后代理请求实际要加载的图片，加载完成后，再给实际的图片对象设置实际的图片`src`
    ```js
    var proxyImage = (function(){
        var img = new Image;
        img.onload = function(){
            myImage.setSrc( this.src );
        }
        return {
            setSrc: function( src ){
                myImage.setSrc( 'file:// /C:/Users/svenzeng/Desktop/loading.gif' );
                img.src = src;
            }
        }
    })();

    proxyImage.setSrc('http:// imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg');
    ```


## 代理的意义——设计思想
### 先实现一个不使用代理的懒加载看看
    ```js
    var MyImage = (function(){
        var imgNode = document.createElement( 'img' );
        document.body.appendChild( imgNode );
        var img = new Image;

        img.onload = function(){
            imgNode.src = img.src;
        };

        return {
            setSrc: function( src ){
                imgNode.src = 'file:// /C:/Users/svenzeng/Desktop/loading.gif';
                img.src = src;
            }
        }
    })();

    MyImage.setSrc( 'http:// imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg' );
    ```

### 违反单一职责原则
1. 上面的对象实际上有两个职责：加载图片和懒加载。
2. 当然你也可以说这就是一个职责，即：懒加载图片。但问题是，这两个功能有可能被拆分，因为你并不总是需要懒加载。
3. 所以把这两个职责划分到不同的对象或函数，就可以让它们之间尽量不互相影响。这样，修改一个不会影响另一个；而且可以很方便的决定是否要加上懒加载功能


## 代理和本体接口的一致性
1. [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)说一致性在于是否使用代理是都是对用户透明的，但上面的例子中，虽然用户调用的是同一个方法`setSrc`，但却是不同对象的该方法。
2. 如下这样做的话，对于用户就是完全透明的了
    ```js
    var myImage = (function(){
        var imgNode = document.createElement( 'img' );
        document.body.appendChild( imgNode );

        return {
            setSrc: function( src ){
                imgNode.src = src;
            }
        }
    })();

    var proxyImage = (function(){
        var img = new Image;
        img.onload = function(){
            myImage.setSrc( this.src );
        }
        return {
            setSrc: function( src ){
                myImage.setSrc( 'file:// /C:/Users/svenzeng/Desktop/loading.gif' );
                img.src = src;
            }
        }
    })();

    // 用户永远都只需要调用这个函数，而该函数内部可以切换使用实际图片对象还是代理图片对象
    function getImage (src) {
        proxyImage.setSrc(src);
    }

    getImage('http:// imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg');
    ```


## 虚拟代理合并 HTTP 请求
```js
// 实际的请求
const synchronousFile = function( id ){
     console.log( '开始同步文件，id为: ' + id );
};

// 代理请求  代理两秒钟之内发起的请求，统一发起实际请求
const proxySynchronousFile = (function(){
    let cache = [],   // 保存一段时间内需要同步的ID
        timer;        // 定时器

     return function( id ){
        cache.push( id );
        if ( timer ){    // 保证不会覆盖已经启动的定时器
            return;
        }

        timer = setTimeout(function(){
            synchronousFile( cache.join( ',' ) );    // 2秒后向本体发送需要同步的ID集合
            clearTimeout( timer );    // 清空定时器
            timer = null;
            cache.length = 0; // 清空ID集合
        }, 2000 );
    }
})();

// 包装实际请求和代理请求
function syncFile (...args) {
    proxySynchronousFile(...args);
}


var checkbox = document.getElementsByTagName( 'input' );

for ( var i = 0, c; c = checkbox[ i++ ]; ){
    c.onclick = function(){
        if ( this.checked === true ){
            syncFile( this.id );
        }
    }
}
```


## 高阶函数动态代理创建器
1. 通过传入高阶函数这种更加灵活的方式，可以为各种计算方法创建缓存代理。
2. 构建一个代理创建器，各种计算方法被当作参数传入其中，返回该计算方法的缓存代理版本。
    ```js
    const multi = function(){
        let a = 1;
        for ( let i = 0, l = arguments.length; i < l; i++ ){
            a = a * arguments[i];
        }
        return a;
    };

    const plus = function(){
        let a = 0;
        for ( let i = 0, l = arguments.length; i < l; i++ ){
            a = a + arguments[i];
        }
        return a;
    };


    const createProxyFactory = function( fn ){
        let cache = {};
        return function(){
            let args = Array.prototype.join.call( arguments, ',' );
            if ( args in cache ){
                return cache[ args ];
            }
            return  cache[ args ] = fn.apply( this, arguments );
        }
    };

    const proxyMulti = createProxyFactory(multi);
    const proxyPlus = createProxyFactory(plus);
    ```


## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)
