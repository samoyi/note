# Replace Conditional with Polymorphism


<!-- TOC -->

- [Replace Conditional with Polymorphism](#replace-conditional-with-polymorphism)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 第一步也是封装。当分支处理逻辑比较复杂的时候，就要考虑封装。
2. 封装为函数还是对象，就要根据各分支之间的关系来决定。
3. 如果各分支的处理逻辑看起来类似一组类似的对象，看起来像是 “同类”、“多态” 的感觉，那就封装为多态对象。
4. 这样封装的实现，保证了 **语义和实现相同**。


## Motivation
1. 如果各分支的情况看起来是一组并列级别的行为的话，它们的内在逻辑就可能就是一种大类型的不同形态，也就是多态。
2. 而且如果处理逻辑比较复杂，并且如果使用如果作为多态的子类型后这些子类型也会在其他地方复用，那使用多态就比较合适。
3. 如果这些子类型在语义上还明显有一个共同的父级，例如哺乳动物类、爬行类和鸟类都属于脊椎动物类。那就可以再实现一个父类型，然后若干个子类型只实现各自不同的地方。


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
