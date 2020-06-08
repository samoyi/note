# Temporary Field

<!-- TOC -->

- [Temporary Field](#temporary-field)
    - [思想](#思想)
    - [条件](#条件)
        - [避免使用反面条件](#避免使用反面条件)
    - [References](#references)

<!-- /TOC -->


## 思想



## 条件
### 避免使用反面条件
1. 下面的例子
    ```js
    function isLogin () {
        // ...
    }
    // ...
    if (!isLogin) {
        // ... 
    }
    ```
2. 首先那个感叹号不容易看见。而且你看见了，你还要在脑子里在计算一次相反，也不直观。
3. 而且这个取反还比较好计算，有些取反计算起来还比较别扭。
4. 看到一句话：In short, don't cause extra mental mapping with your names.



## References

