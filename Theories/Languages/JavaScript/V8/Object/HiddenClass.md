# Hidden Class


<!-- TOC -->

- [Hidden Class](#hidden-class)
    - [静态语言访问属性的效率更高](#静态语言访问属性的效率更高)
    - [隐藏类 (Hidden Class）](#隐藏类-hidden-class)
    - [多个对象共用一个隐藏类](#多个对象共用一个隐藏类)
    - [重新构建隐藏类](#重新构建隐藏类)
    - [最佳实践](#最佳实践)
    - [References](#references)

<!-- /TOC -->


## 静态语言访问属性的效率更高
1. 我们通过下面两段代码，来对比一下动态语言和静态语言在运行时的一些特征
    <img src="./images/01.jpg" width="600" style="display: block; margin: 5px 0 10px;" />
2. 我们知道，JavaScript 在运行时，对象的属性是可以被修改的，所以当 V8 使用了一个对象时，比如使用了 `point` 的时候，它并不知道该对象中是否有 `x`，也不知道 `x` 相对于对象的偏移量是多少，也可以说 V8 并不知道该对象的具体的 **形状**（Shape）。
3. 那么，当在 JavaScript 中要查询对象 `point` 中的 `x` 属性时，V8 会按照具体的规则一步一步来查询，这个过程非常的慢且耗时。
4. C++ 代码在执行之前需要先被编译，编译的时候，每个对象的形状都是固定的，也就是说，在代码的执行过程中，`Point` 的形状是无法被改变的。
5. 那么在 C++ 中访问一个对象的属性时，自然就知道该属性相对于该对象地址的偏移值了。比如在 C++ 中使用 `start.x` 的时候，编译器会直接将 `x` 相对于 `start` 的地址写进汇编指令中，那么当使用了对象 `start` 中的 `x` 属性时，CPU 就可以直接去内存地址中取出该内容即可，没有任何中间的查找环节。


## 隐藏类 (Hidden Class）
1. V8 将这种静态的特性引入，目前所采用的一个思路就是将 JavaScript 中的对象静态化，也就是 V8 在运行 JavaScript 的过程中，会假设 JavaScript 中的对象是静态的。
2. 具体地讲，V8 对每个对象做如下两点假设：
    * 对象创建好了之后就不会添加新的属性；
    * 对象创建好了之后也不会删除属性。
3. 符合这两个假设之后，V8 就可以对 JavaScript 中的对象做深度优化了。
4. 具体地讲，V8 会为每个对象创建一个隐藏类，对象的隐藏类中记录了该对象一些基础的布局信息，包括以下两点：
    * 对象中所包含的所有的属性；
    * 每个属性相对于对象的偏移量。
5. 有了隐藏类之后，那么当 V8 访问某个对象中的某个属性时，就会先去隐藏类中查找该属性相对于它的对象的偏移量。有了偏移量和属性类型，V8 就可以直接去内存中取出对于的属性值，而不需要经历一系列的查找过程，那么这就大大提升了 V8 查找对象的效率。
6. 结合一段代码来分析下隐藏类是怎么工作的
    ```js
    let point = {x:100,y:200}
    ```
7. 当 V8 执行到这段代码时，会先为 `point` 对象创建一个隐藏类。在 V8 中，把隐藏类又称为 **map**，每个对象都有一个 `map` 属性，其值指向内存中的隐藏类
8. 隐藏类描述了对象的属性布局，它主要包括了属性名称和每个属性所对应的偏移量，以及每个属性的描述符。
    <img src="./images/19.svg" width="600" style="display: block; margin: 5px 0 10px;" />  
9. 比如 `point` 对象的隐藏类就包括了 `x` 和 `y` 属性，`x` 的偏移量是 4，`y` 的偏移量是 8
    <img src="./images/02.jpg" width="400" style="display: block; margin: 5px 0 10px;" />
10. 关于 `point` 对象和它的 `map` 之间的关系，你可以参看下图
    <img src="./images/03.jpg" width="400" style="display: block; margin: 5px 0 10px;" />
    左边的是 `point` 对象在内存中的布局，右边是 `point` 对象的 map，我们可以看到，`point` 对象的第一个属性就指向了它的 map。
11. 实际测试
    <img src="./images/04.png" width="600" style="display: block; margin: 5px 0 10px;" />


## 多个对象共用一个隐藏类
1. 如果两个对象的形状是相同的，V8 就会为其复用同一个隐藏类，这样有两个好处：
    * 减少隐藏类的创建次数，也间接加速了代码的执行速度；
    * 减少了隐藏类的存储空间。
2. 那么，什么情况下两个对象的形状是相同的，要满足以下几点：
    * 相同的构造函数和原型？TODO
    * 相等的属性个数；
    * 相同的属性名称；
    * 相同属性的属性具有相同的描述符：`[[writable]]`、`[[enumerable]]`、`[[configurable]]`
    * 相同的初始化顺序。即使属性都一样，但顺序不同，也会导致形状不同。使用字面量创建对象时有这个可能。
    <img src="./images/18.svg" width="600" style="display: block; margin: 5px 0 10px;" />   
3. 下面用同一个构造函数创建了三个对象，可以看到它们的 map 都是一样的
    <img src="./images/15.png" width="600" style="display: block; margin: 5px 0 10px;" />   
4. 但是删掉 `foo2` 的 `y` 属性后，它的 map 就和其他两个不一样了
    <img src="./images/16.png" width="600" style="display: block; margin: 5px 0 10px;" />   
5. 不过看起来如果不是来自于同一个构造函数，即使形状相同也不会复用 map。而且我尝试让这两个构造函数使用同样的原型，结果还是不同的 map
    <img src="./images/17.png" width="600" style="display: block; margin: 5px 0 10px;" />   


## 重新构建隐藏类
1. 但是，JavaScript 依然是动态语言，在执行过程中，对象的形状是可以被改变的。如果某个对象的形状改变了，隐藏类也会随着改变，这意味着 V8 要为新改变的对象重新构建新的隐藏类，这对于 V8 的执行效率来说，是一笔大的开销。
2. 实践中，给一个对象添加新的属性，删除新的属性，或者改变某个属性的数据类型，都会改变这个对象的形状，那么势必也就会触发 V8 为改变形状后的对象重建新的隐藏类。


## 最佳实践
* 生成对象后不要删除或增加属性
* 生成对象后不要修改属性描述符
* 字面量创建对象时一次写完所有的属性
* 字面量创建同类对象时每次都按照固定的顺序定义属性


## References
* [图解 Google V8](https://time.geekbang.org/column/intro/296)
* [JavaScript engine fundamentals: Shapes and Inline Caches](https://mathiasbynens.be/notes/shapes-ics)
* [JavaScript engine fundamentals: Shapes and Inline Caches 译文](https://hijiangtao.github.io/2018/06/17/Shapes-ICs/)