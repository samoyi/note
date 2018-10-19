# Evaluation Strategy

## All function arguments in ECMAScript are passed by value.
1. If the value is primitive, then it acts just like a primitive variable copy,
and if the value is a reference, it acts just like a reference variable copy.  
2. 注意这里的“引用类型变量的拷贝”（reference variable copy）。引用类型变量实际上本身
就是指针，也就是说 **引用类型变量的值** 就是指针，而不是 **堆内存中实际保存的** 值。这
里所谓的按值传递，是指传递引用类型变量的值，而该值本身就是指针，而不是指针指向的内存中的
最终实际值。引用类型变量的值是一个指针，该指针指向堆内存中一个实际的值。要分清这两种值。
3. 在向参数传递基本类型的值时，被传递的值会被复制给一个局部变量（即命名参数，或者用
ECMAScript 的概念来说，就是`arguments`对象中的一个元素）。在向参数传递引用类型的值时，
会把这个值在内存中的地址复制给一个局部变量，因此这个局部变量的变化会反映在函数的外部。
    ```js
    function addTen(num) {
        // 因为传进来的是20，而不是count，所以这里怎么变都和外面的count没关系
        // 如果传进来的是对count的引用，则这里num一变外面的count也要变
        num += 10;
        return num;
    }
    var count = 20;
    var result = addTen(count); // 按值传递，所以传进去的就是 count 的值——20
    alert(count); // 20 - no change
    alert(result); // 30
    ```
4. 引用类型变量的按值传递
    ```js
    function setName(obj) {
        obj.name = 33;
    }
    var person = {};
    person.name = 22;
    setName(person);
    alert(person.name); // 33
    ```
    如果没有搞清楚上面所说的何为 **引用类型变量的值**，则会错误的认为既然函数内部改变变
    量不会对外部的`person`产生影响，所以应该弹出`22`才对。再看下面一例：
   ```js
   function setName(obj) {
       obj.name = 33;
       obj = {};
       obj.name = 66;
   }

   var person = {};
   person.name = 22;
   setName(person);
   alert(person.name);    // 33
   ```
   传入了`person`中保存的指针，所以函数内部第一行的时候，`obj`是指向`person`指向的对象
   的，所以修改为`33`后，`person`指向对象也发生了变化。但第二行将`obj`指向了新的对象，
   从这里开始，`obj`就和`person`指向的对象没关系了。


## References
* [《Professional JavaScript for Web Developers》](https://book.douban.com/subject/7157249/)
