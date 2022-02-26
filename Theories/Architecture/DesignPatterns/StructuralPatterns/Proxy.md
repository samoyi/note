# Proxy

代理模式是一种结构型设计模式，让你能够提供对象的替代品或其占位符。代理控制着对于原对象的访问，并允许在将请求提交给对象前后进行一些处理。


<!-- TOC -->

- [Proxy](#proxy)
    - [设计思想](#设计思想)
        - [在 SRP 和 OCP 的原则下扩展功能](#在-srp-和-ocp-的原则下扩展功能)
        - [对用户透明](#对用户透明)
        - [缓存（cache）和缓冲（buffer）](#缓存cache和缓冲buffer)
        - [代理创建器](#代理创建器)
    - [适用场景](#适用场景)
    - [常见代理模式](#常见代理模式)
    - [在 SRP 和 OCP 的原则下扩展功能](#在-srp-和-ocp-的原则下扩展功能-1)
        - [不使用代理的情况下扩展功能](#不使用代理的情况下扩展功能)
        - [违反 SRP 和 OCP](#违反-srp-和-ocp)
        - [使用代理实现预加载](#使用代理实现预加载)
    - [代理和本体接口的一致性](#代理和本体接口的一致性)
    - [缓存代理](#缓存代理)
        - [缓存代理的例子——计算乘积](#缓存代理的例子计算乘积)
    - [高阶函数动态代理创建器](#高阶函数动态代理创建器)
    - [其他例子](#其他例子)
        - [虚拟代理合并 HTTP 请求——请求缓冲（buffer）](#虚拟代理合并-http-请求请求缓冲buffer)
    - [与其他模式的关系](#与其他模式的关系)
        - [装饰模式](#装饰模式)
    - [References](#references)

<!-- /TOC -->


## 设计思想
### 在 SRP 和 OCP 的原则下扩展功能
1. 其实和现实生活中的代理、外包甚至收购都是同样的逻辑，就是在保持自身功能不变（SRP）的情况下，扩展自身的功能。
2. 因为这种扩展，自身内部还是 closed 的，但对外提供的功能又是 open 的。

### 对用户透明
一个软件实体内部可以随便折腾，但不要影响到使用者。

### 缓存（cache）和缓冲（buffer）
1. 缓存和缓冲都是为了平衡两个对象某方面的不平衡，或者说，**调和资源的不平衡**。
2. 比如计算请求者希望快速得到计算结果，但计算者计算速度有限，这种不平衡之下，计算着就可以使用缓存来加速。
3. 比如客户端会一秒钟触发好几次请求，但服务端无法高效的频繁处理，这种不平衡之下，就需要客户端缓冲合并一段时间的请求再一次性发给服务端。

### 代理创建器


## 适用场景
1. 在 SRP 和 OCP 的原则下扩展功能。
2. 这个功能可能是保护、缓存等等。


## 常见代理模式
* **保护代理**(Protection proxy)：过滤掉一些请求，用来保护被请求对象，用于对象应该有不同访问权限的情况。
* **虚拟代理**(Virtual proxy)：为对象代理执行一些耗时或者耗资源的操作。例如使用图片占位元素进行布局，只在滚动到该位置的时候才真正加载图片。
* **缓存代理**：可以为一些开销大的运算结果提供暂时的存储，在下次运算时，如果传递进来的参数跟之前一致，则可以直接返回前面存储的运算结果。
* **防火墙代理**：控制网络资源的访问，保护主题不让 “坏人” 接近。
* **远程代理**：远程对象的本地代表，为一个对象在不同的地址空间提供局部代表，代表用户访问远程对象。操作系统协议栈可以算是本地应用程序的远程代理？
* **智能引用代理**：取代了简单的指针，它在访问对象时执行一些附加操作，比如计算一个对象被引用的次数。例如访问器属性。
* **写时复制代理**：通常用于复制一个庞大对象的情况。写时复制代理延迟了复制的过程，当对象被真正修改时，才对它进行复制操作。写时复制代理是虚拟代理的一种变体，DLL（操作系统中的动态链接库）是其典型运用场景。


## 在 SRP 和 OCP 的原则下扩展功能
### 不使用代理的情况下扩展功能
1. 一个简单的图片加载功能
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

    myImage.setSrc(url);
    ```
2. 在网速比较慢时，图片加载好需要一段时间，此时页面会出现空白。我们希望可以在实际图片加载好之前有一个占位 loading 图。
3. 不使用代理的情况下，实现这一扩展功能
    ```js
    var myImage = (function(){
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

    myImage.setSrc(url);
    ```

### 违反 SRP 和 OCP
1. 上面扩展后的对象实际上有两个职责：加载图片和预加载。
2. 当然你也可以说这就是一个职责，即：预加载图片。但问题是，这两个功能有可能被拆分，因为你并不总是需要预加载。
3. 而且，当领导希望取消预加载时，你就得修改代码；之后领导觉得应该加上预加载，你还得把代码改回去。

### 使用代理实现预加载
1. 使用代理对象 `proxyImage` 先调用实际的图片对象并设置一个本地的 loading 图片，然后代理请求实际要加载的图片。加载完成后，再给实际的图片对象设置实际图片的 `src`
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

    proxyImage.setSrc(url);
    ```
2. 这样就把这两个职责划分到不同的对象或函数，就可以让它们之间尽量不互相影响。
3. 需要普通加载的地方就使用 `myImage`，需要预加载的地方就使用 `proxyImage`。而且，修改一个不会影响另一个。
4. 而且对外扩展很变得方便，不管是加上预加载还是取消预加载，内部只需要根据一个字段来加载不同的方法即可，并不需要为了外部扩展的改变而修改代码。
    ```js
    isPreLoad ? proxyImage.setSrc(url) : myImage.setSrc(url)
    ```
5. 对外实现了扩展，对内也关闭了修改。


## 代理和本体接口的一致性
1. 如果有一天我们不再需要预加载，那么就不再需要代理对象，可以选择直接请求本体。
2. 其中关键是,代理对象和本体都对外提供了 `setSrc` 方法，在客户看来，代理对象和本体是一致的，代理接手请求的过程对于用户来说是透明的，用户并不清楚代理和本体的区别。
3. 这样做有两个好处：
    * 用户可以放心地请求代理，他只关心是否能得到想要的结果。
    * 在任何使用本体的地方都可以替换成使用代理。
4. 在 Java 等语言中，代理和本体都需要显式地实现同一个接口，一方面接口保证了它们会拥有同样的方法，另一方面，面向接口编程迎合依赖倒置原则，通过接口进行向上转型，从而避开编译器的类型检查，代理和本体将来可以被替换使用。
5. 在 JavaScript 这种动态类型语言中，我们可以通过鸭子类型来检测代理和本体是否都实现了 `setSrc` 方法。
6. 另外，如果代理对象和本体对象都为一个函数（函数也是对象），函数必然都能被执行，则可以认为它们也具有一致的 “接口”
    ```js
    var myImage = (function(){
        var imgNode = document.createElement( 'img' );
        document.body.appendChild( imgNode );

        return function( src ){
            imgNode.src = src;
        }
    })();

    var proxyImage = (function(){
        var img = new Image;

        img.onload = function(){
            myImage( this.src );
        }

        return function( src ){
            myImage( 'file:// /C:/Users/svenzeng/Desktop/loading.gif' );
            img.src = src;
        }
    })();

    proxyImage(url);
    ```
7. 不过，在实际使用中，像下面这样再加一层封装，即使方法不一致，对于用户也是完全透明的了吧
    ```js
    function getImage (src) {
        isPreLoad ? proxyImage.proxySetSrc(src) : myImage.basicSetSrc(src)
    }
    // 用户永远只需要调用 getImage 即可
    getImage(url);
    ```


## 缓存代理
缓存代理可以为一些开销大的运算结果或者耗时的请求提供暂时的存储，在下次运算或请求相同的内容时，就可以直接返回前面存储的结果。

### 缓存代理的例子——计算乘积
1. 一个普通的求乘积函数
    ```js
    var multi = function(){
        var a = 1;
        for ( var i = 0, l = arguments.length; i < l; i++ ){
            a = a * arguments[i];
        }
        return a;
    };
    ```
2. 假如这是个比较复杂的计算，如果两次传入的参数相同，还需要再重新计算一遍，就是浪费资源和时间了。
3. 使用缓存代理函数
    ```js
    var proxyMulti = (function(){
        var cache = {};
        return function(){
            var args = Array.prototype.join.call( arguments, ',' );
            if ( args in cache ){
                return cache[ args ];
            }
            return cache[ args ] = multi.apply( this, arguments );
        }
    })();
    ```
4. 通过增加缓存代理的方式，`multi` 函数可以继续专注于自身的职责——计算乘积，缓存的功能是由代理对象实现的。


## 高阶函数动态代理创建器
1. 通过传入高阶函数这种更加灵活的方式，可以为各种计算方法创建缓存代理。
2. 构建一个代理创建器，各种计算方法被当作参数传入其中，返回该计算方法的缓存代理版本。
    ```js
    /**************** 计算乘积 *****************/
    var multi = function(){
        var a = 1;
        for ( var i = 0, l = arguments.length; i < l; i++ ){
            a = a * arguments[i];
        }
        return a;
    };

    /**************** 计算加和 *****************/
    var plus = function(){
        var a = 0;
        for ( var i = 0, l = arguments.length; i < l; i++ ){
            a = a + arguments[i];
        }
        return a;
    };

    /**************** 创建缓存代理的工厂 *****************/
    var createProxyFactory = function( fn ){
        // 通过闭包为每个被代理的函数创建一个缓存对象
        var cache = {};
        // 返回一个经过包装的函数，命中缓存就返回缓存，否则就调用原函数计算
        return function(){
            var args = Array.prototype.join.call( arguments, ',' );
            if ( args in cache ){
                return cache[ args ];
            }
            return  cache[ args ] = fn.apply( this, arguments );
        }
    };

    var proxyMulti = createProxyFactory( multi );
    var proxyPlus = createProxyFactory( plus );
    ```


## 其他例子
### 虚拟代理合并 HTTP 请求——请求缓冲（buffer）
```js
// 实际的请求
const synchronousFile = function( id ){
     console.log( '开始同步文件，id为: ' + id );
};

// 代理请求  代理两秒钟之内发起的请求，统一发起实际请求
const proxySynchronousFile = (function(){
    let cache = [],   // 保存一段时间内需要同步的 ID
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


## 与其他模式的关系
适配器模式能为被封装对象提供不同的接口，代理模式能为对象提供相同的接口，装饰模式则能为对象提供加强的接口。

### 装饰模式
1. 装饰和代理有着相似的结构，但是其意图却非常不同。 
2. 这两个模式的构建都基于组合原则，也就是说一个对象应该将部分工作委派给另一个对象。 
3. 两者之间的不同之处在于代理通常自行管理其服务对象的生命周期，而装饰的生成则总是由客户端进行控制。
4. 代理模式是 “我把服务委托给你了，你负责加强一些功能，然后去执行”，装饰模式是 “加强服务的一些功能，得到强化版的服务，然后还是我执行”。


## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)