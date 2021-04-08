# Extract Function
inverse of: Inline Function


<!-- TOC -->

- [Extract Function](#extract-function)
    - [Bad codes](#bad-codes)
    - [Motivations](#motivations)
        - [单纯的长度缩减](#单纯的长度缩减)
        - [SRP](#srp)
        - [复用](#复用)
        - [意图和实现分离](#意图和实现分离)
            - [例1](#例1)
            - [例2](#例2)
    - [Mechanics](#mechanics)
    - [注意点](#注意点)
        - [变量作用域](#变量作用域)
        - [错误 return](#错误-return)
    - [References](#references)

<!-- /TOC -->


## Bad codes
* Comments
* Duplicated Code
* Long Function and Long Module
* Message Chains


## Motivations
### 单纯的长度缩减
有人认为函数的长度不应该超过一屏。其实我觉得 10 行就已经看起来比较累了。

### SRP
1. 一个函数不要做两件事，这样会两个逻辑耦合。
2. 或者只要一段代码有一个独立的整体逻辑，那就可以考虑提取为函数。

### 复用

### 意图和实现分离
1. 当我们看代码的时候，很多时候是只关心一个部分做了什么，而不关心它是怎么实现的。
2. 那在我们看的时候，最好就是在这个部分只告诉我做了什么，而不要告诉我是怎么做的。
3. 如果我们在行内实现了一段代码，而且要花点儿事件才能看明白这段代码在干什么，或者你要在这段代码上面写一行简介的注释来说明这段代码的意图，那这段代码就可以考虑提取为一个独立的函数，并起一个表明其意图的名字。

#### 例1
1. 这个 `$watch` 内部的逻辑看起来也不复杂，也是容易看懂的
    ```js
    mounted() {
        this.$watch('pwdType.value', (newVal) => {
            if (newVal == 2) {
                this.$nextTick(()=>{
                    let node = document.querySelector('input');
                    node && node.addEventListener('blur', () => {
                        this.scrollForIOSBlur();
                    });
                });
            }
            else {
                let node = document.querySelector('input');
                node && node.removeEventListener('blur');
            }
        });
    },
    ```
2. 但是你还是不能很方便的看出来 `pwdType.value` 不同的值会做什么事情，还是要看上几行代码才行。
3. 很有可能，你看这个 watcher 的时候只是想知道值变化的时候程序会做什么，而并不想知道具体是怎么做的。但是在看的过程中，你还是要看完整的实现代码，还是要看懂这个事情是怎么做的。
4. 但是如果修改为下面你的形式，你几乎一眼就能看出来要做什么事情。至于你如果想要知道这些事情怎么做的，那你就要去看具体的方法。
    ```js
    methods: {
        //...
        addBlurHandler () {
            this.$nextTick(()=>{
                let node = document.querySelector('input');
                node && node.addEventListener('blur', () => {
                    this.scrollForIOSBlur();
                });
            });
        },
        removeBlurHandler () {
            let node = document.querySelector('input');
            node && node.removeEventListener('blur');
        },
    },
    // ...
    mounted() {
        this.$watch('pwdType.value', (newVal) => {
            if (newVal == 2) {
                this.addBlurHandler();
            }
            else {
                this.removeBlurHandler();
            }
        });
    },
    ```

#### 例2
1. 在一个 51 行的 `handleScroll` 方法中，有下面一段代码
    ```js
    let height = $list.height();
    let viewScrollTop = $(window).height() + scrollTop - viewOffsetTop;
    if(viewScrollTop < 0) {
        this.curViewCount = 1;
    } else if(viewScrollTop > height) {
        this.curViewCount = this.photoCount;
    } else {
        this.curViewCount = Math.ceil((viewScrollTop / height) * this.photoCount);
    }

    if(this.curViewCount > this.photoCount) {
        this.curViewCount = this.photoCount;
    }
    if(this.allPhotoCount > 0 && this.curViewCount > this.allPhotoCount) {
        console.warn(`gq获得的照片数为:${this.allPhotoCount}, 实际照片数量:${this.photoCount}`);
        this.curViewCount = this.allPhotoCount;
    }
    ```
2. 这一段的逻辑很明确，就是要设 置`this.curViewCount`，而且没有副作用，所以很应该作为独立的方法
    ```js
    getCurViewCount(scrollTop, $list, viewOffsetTop){
      let curViewCount = 0;
      let height = $list.height();
      let viewScrollTop = scrollTop - viewOffsetTop;
      if(viewScrollTop < 0) {
        curViewCount = 1;
      } else if(viewScrollTop > height) {
        curViewCount = this.photoCount;
      } else {
        curViewCount = Math.ceil((viewScrollTop / height) * this.photoCount);
      }

      if(curViewCount > this.photoCount) {
        curViewCount = this.photoCount;
      }
      if(this.allPhotoCount > 0 && curViewCount > this.allPhotoCount) {
        curViewCount = this.allPhotoCount;
      }
      return curViewCount;
    },
    ```
3. 这个方法接收参数并计算，不会直接设置 `this.curViewCount` 而是直接返回计算结果，没有副作用。
4. 然后在 `handleScroll` 方法中调用这个新的方法
    ```js
    this.curViewCount = this.getCurViewCount(scrollTop, $list, viewOffsetTop);
    ```
5. 这样，当你浏览 `handleScroll` 方法时，你会一眼就知道这一步是设置 `this.curViewCount`，如果你不关心怎么设置的，就可以完全不用操心。


## Mechanics
1. 创建一个函数，命名表明其意图，而非实现
    * 如果想不出一个合适的名字，也许就表明了这一次的提炼并不合理。
2. 将待提炼的代码从原函数搬移到新函数。
3. 搬移过来之后可能会发现有些变量无法访问了，那就考虑将这些变量作为参数
    如果参数按值传递并且在内部修改了值，那就要把修改的值返回给原函数。


## 注意点
### 变量作用域

### 错误 return
1. 提取出去作为独立函数的代码中如果包含原函数的提前 `return`，则要注意处理
2. 重构前
    ```js
    function getRes () {
        // ...

        // 一段需要提取出去的设置参数的代码
        let {m, n} = obj;
        if (!n) return ''; // 这里是作为 getRes 的返回值
        let params = {
            a: m,
            b: n,
        };

        // ...

        sendMessage (params);

        // ...
        }
    ```
3. 重构后
    ```js
    function setParams () {
      let {m, n} = obj;
      if (!n) return ''; // 错误返回
      let params = {
        a: m,
        b: n,
      };
      return params;
    }

    function getRes () {
      // ...

      let params = setParams();

      // ...

      sendMessage (params);

      // ...
    }
    ```


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
