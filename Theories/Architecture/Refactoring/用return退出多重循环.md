# 用return退出多重循环

## 美学


## 好处


## 例子
### 例1
1. 假设在函数体内有一个两重循环语句，我们需要在内层循环中判断，当达到某个临界条件时退出外层的循环。如果使用控制标记变量的方法：
    ```js
    var func = function(){
        var flag = false;
        for ( var i = 0; i < 10; i++ ){
            for ( var j = 0; j < 10; j++ ){
                if ( i * j >30 ){
                    flag = true;
                    break;
                }
            }
            if ( flag === true ){
                break;
            }
        }
    };
    ```
2. 这里的逻辑就是，你为了要实现退出循环，有另外引入了一个工具，这个工具用来辅助实现退出循环。
3. 如果改成下面直接`return`的逻辑，则不需要附加工具：
    ```js
    var func = function(){
        for ( var i = 0; i < 10; i++ ){
            for ( var j = 0; j < 10; j++ ){
                if ( i * j >30 ){
                    return;
                }
            }
        }
    };
    ```
4. 当然用`return`直接退出方法会带来一个问题，如果在循环之后还有一些将被执行的代码呢？如果我们提前退出了整个方法，这些代码就得不到被执行的机会：
    ```js
    var func = function(){
        for ( var i = 0; i < 10; i++ ){
            for ( var j = 0; j < 10; j++ ){
                if ( i * j >30 ){
                    return;
                }
            }
        }
        console.log( i );    // 这句代码没有机会被执行
    };
    ```
5. 为了解决这个问题，我们可以把循环后面的代码放到`return`后面，如果代码比较多，就应该把它们提炼成一个单独的函数：
    ```js
    var print = function( i ){
        console.log( i );
    };

    var func = function(){
        for ( var i = 0; i < 10; i++ ){
            for ( var j = 0; j < 10; j++ ){
                if ( i * j >30 ){
                    return print( i );
                }
            }
        }
    };

    func();
    ```


## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)
