# Extract Function
inverse of: Inline Function


<!-- TOC -->

- [Extract Function](#extract-function)
    - [Motivations](#motivations)
        - [单纯的长度缩减](#单纯的长度缩减)
        - [SRP](#srp)
        - [复用](#复用)
        - [黑箱封装 —— Speration between intention and implementation](#黑箱封装--speration-between-intention-and-implementation)
            - [意图和实现分离](#意图和实现分离)
            - [性能担忧？](#性能担忧)
            - [命名的重要性](#命名的重要性)
            - [例1](#例1)
            - [例2](#例2)
    - [Mechanics](#mechanics)
    - [注意点](#注意点)
        - [变量作用域](#变量作用域)
        - [错误 return](#错误-return)
    - [References](#references)

<!-- /TOC -->


## Motivations
### 单纯的长度缩减
1. Functions should be no larger than fit on a screen. 
2. 其实我觉得 10 行就已经看起来比较累了。

### SRP
一个函数不要做两件事，这样会两个逻辑耦合

### 复用
Any code used more than once should be put in its own function, but code only used once should be left inline. 

### 黑箱封装 —— Speration between intention and implementation
#### 意图和实现分离
1. 当我们看代码的时候，很多时候是只关心一个部分做了什么，而不关心它是怎么实现的。
2. 那在我们看的时候，最好就是在这个部分只告诉我做了什么，而不要告诉我是怎么做的。
3. If you have to spend effort looking at a fragment of code and figuring out what it’s doing, then you should extract it into a function and name the function after the "what". 
4. Then, when you read it again, the purpose of the function leaps right out at you, and most of the time you won’t need to care about how the function fulfills its purpose (which is the body of the function).
5. 一段代码既不封装为函数，又不写注释，真的要从头看到尾才能知道是在干什么……

#### 性能担忧？
1. Some people are concerned about short functions because they worry about the performance cost of a function call, but that’s very rare now. 
2. Optimizing compilers often work better with shorter functions which can be cached more easily. 
3. 相比于极少的性能损失，可维护性提升的更多。

#### 命名的重要性
1. Small functions like this only work if the names are good, so you need to pay good attention to naming. 
2. Often, I see fragments of code in a larger function that start with a comment to say what they do. The comment is often a good hint for the name of the function when I extract that fragment.

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
1. Create a new function, and name it after the intent of the function (name it by what it does, not by how it does it).
    1. If the code I want to extract is very simple, such as a single function call, I still extract it if the name of the new function will reveal the intent of the code in a better way. 
    2. If I can’t come up with a more meaningful name, that’s a sign that I shouldn’t extract the code. However, I don’t have to come up with the best name right away; sometimes a good name only appears as I work with the extraction. 
    3. It’s OK to extract a function, try to work with it, realize it isn’t helping, and then inline it back again. As long as I’ve learned something, my time wasn’t wasted.
    4. If the language supports nested functions, nest the extracted function inside the source function. That will reduce the amount of out­of­scope variables to deal with after the next couple of steps. 如果外层被多次调用，内层被嵌套的函数会反复被创建？
    5. I can always use **Move Function (198)** later. 
2. Copy the extracted code from the source function into the new target function.
3. Scan the extracted code for references to any variables that are local in scope to the source function and will not be in scope for the extracted function. Pass them as parameters.
    1. If I extract into a nested function of the source function, I don’t run into these problems.
    2. Usually, these are local variables and parameters to the function. The most general approach is to pass all such parameters in as arguments. There are usually no difficulties for variables that are used but not assigned to.
    3. If a variable is only used inside the extracted code but is declared outside, move the declaration into the extracted code.
    4. Any variables that are assigned to need more care if they are passed by value. If there’s only one of them, I try to treat the extracted code as a query and assign the result to the variable concerned.
    5. Sometimes, I find that too many local variables are being assigned by the extracted code. It’s better to abandon the extraction at this point. When this happens, I consider other refactorings such as **Split Variable (240)** or **Replace Temp with Query (178)** to simplify variable usage and revisit the extraction later.
4. Compile after all variables are dealt with.
    * Once all the variables are dealt with, it can be useful to compile if the language environment does compile­time checks. Often, this will help find any variables that haven’t been dealt with properly.
5. Replace the extracted code in the source function with a call to the target function.
6. Test.
7. Look for other code that’s the same or similar to the code just extracted, and consider using **Replace Inline Code with Function Call (222)** to call the new function.
    * Some refactoring tools support this directly. Otherwise, it can be worth doing some quick searches to see if duplicate code exists elsewhere.


## 注意点
### 变量作用域

### 错误 return
1. 提取出去作为独立函数的代码中如果包含原函数的提前`return`，则要注意处理
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
