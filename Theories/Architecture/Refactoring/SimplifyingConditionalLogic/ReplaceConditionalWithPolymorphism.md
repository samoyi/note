# Replace Conditional with Polymorphism


<!-- TOC -->

- [Replace Conditional with Polymorphism](#replace-conditional-with-polymorphism)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [如果条件分支的处理逻辑是 “多态” 的，那就可以考虑使用多态](#如果条件分支的处理逻辑是-多态-的那就可以考虑使用多态)
        - [符合多态语义且逻辑比较复杂的，才有必要用多态](#符合多态语义且逻辑比较复杂的才有必要用多态)
        - [一组并列级别的对象的情况](#一组并列级别的对象的情况)
        - [一组并列级别且有共同父级的对象的情况](#一组并列级别且有共同父级的对象的情况)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 第一步也是封装。当分支处理逻辑比较复杂的时候，就要考虑封装。
2. 封装为函数还是对象，就要根据各分支之间的关系来决定。
3. 如果各分支的处理逻辑看起来类似一组类似的对象，看起来像是 “同类多态” 的感觉，那就封装为多态对象。
4. 这样封装的实现，保证了 **语义和实现相同**。


## Motivation
### 如果条件分支的处理逻辑是 “多态” 的，那就可以考虑使用多态
1. Complex conditional logic is one of the hardest things to reason about in programming, so I always look for ways to add structure to conditional logic. 
2. Often, I find I can separate the logic into different circumstances — high­level cases — to divide the conditions. 
3. Sometimes it’s enough to represent this division within the structure of a conditional itself, but using classes and polymorphism can make the separation more explicit. 
4. 如果各分支的情况看起来是一组并列级别的对象的话，它们的内在逻辑就是一种大类型的不同形态，也就是多态，那使用多态就比较合适。

### 符合多态语义且逻辑比较复杂的，才有必要用多态
1. Polymorphism is one of the key features of object-­oriented programming — and, like any useful feature, it’s prone to overuse. 
2. I’ve come across people who argue that all examples of conditional logic should be replaced with polymorphism. 
3. I don’t agree with that view. Most of my conditional logic uses basic conditional statements — `if`/`else` and `switch`/`case`. 
4. But when I see complex conditional logic that can be improved as discussed above, I find polymorphism a powerful tool.

### 一组并列级别的对象的情况
1. A common case for this is where I can form a set of types, each handling the conditional logic differently. 
2. I might notice that books, music, and food vary in how they are handled because of their type. 
3. This is made most obvious when there are several functions that have a switch statement on a type code. 
4. In that case, I remove the duplication of the common switch logic by creating classes for each case and using polymorphism to bring out the type­specific behavior.

### 一组并列级别且有共同父级的对象的情况
1. Another situation is where I can think of the logic as a base case with variants. 
2. The base case may be the most common or most straightforward. 例如哺乳动物类、爬行类和鸟类都属于脊椎动物类。
3. I can put this logic into a superclass which allows me to reason about it without having to worry about the variants. 
4. I then put each variant case into a subclass, which I express with code that emphasizes its difference from the base case.


## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
