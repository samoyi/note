 # Primitive Obsession


<!-- TOC -->

- [现象](#现象)
- [重构方法参考](#重构方法参考)
- [References](#references)

<!-- /TOC -->


## 现象
1. 现实中大部分数据虽然可以用基本类型数据来表示，但是其实它们还会有其他的属性之类的。
2. 例如电话号码，可以说是比较基本的数字字符串，但其实它在实际的使用场景中，本身还会有国家编号、区号之类的，所以可以说它并不是一维的，而是三维的数据。
3. 那我们在这种场景下，表示一个电话号的时候，使用基本的字符串就不合适了。把它定义为具有三个属性的对象，就更加符合它本身的特征。而且使用起来也更方便，你可以直接获取它的某一项属性，添加一些方法来处理它的属性。这些方法当然也可以在外部实现，但是放到对象自身上可以实现更好的内聚性。


## 重构方法参考
* Introduce Parameter Object
* Replace Primitive with Object
* Extract Class
* Replace Type Code with Subclasses


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
