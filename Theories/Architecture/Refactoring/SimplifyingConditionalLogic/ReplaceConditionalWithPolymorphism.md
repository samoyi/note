# Replace Conditional with Polymorphism


<!-- TOC -->

- [Replace Conditional with Polymorphism](#replace-conditional-with-polymorphism)
    - [思想](#思想)
    - [Motivation](#motivation)
        - [使用多态的好处](#使用多态的好处)
        - [一组并列级别的对象的情况](#一组并列级别的对象的情况)
        - [一组并列级别且有共同父级的对象的情况](#一组并列级别且有共同父级的对象的情况)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想


## Motivation
### 使用多态的好处
1. Complex conditional logic is one of the hardest things to reason about in programming, so I always look for ways to add structure to conditional logic. 
2. Often, I find I can separate the logic into different circumstances — high­level cases — to divide the conditions. 
3. Sometimes it’s enough to represent this division within the structure of a conditional itself, but using classes and polymorphism can make the separation more explicit. 如果各分支的情况看起来是一组并列级别的对象的话，那使用多态就比较合适。
4. Polymorphism is one of the key features of object­oriented programming — and, like any useful feature, it’s prone to overuse. I’ve come across people who argue that all examples of conditional logic should be replaced with polymorphism. 5. I don’t agree with that view. Most of my conditional logic uses basic conditional statements—`if`/`else` and `switch`/`case`. But when I see complex conditional logic that can be improved as discussed above, I find polymorphism a powerful tool.

### 一组并列级别的对象的情况
1. A common case for this is where I can form a set of types, each handling the conditional logic differently. 
2. I might notice that books, music, and food vary in how they are handled because of their type. This is made most obvious when there are several functions that have a switch statement on a type code. 
3. In that case, I remove the duplication of the common switch logic by creating classes for each case and using polymorphism to bring out the type­specific behavior.

### 一组并列级别且有共同父级的对象的情况
1. Another situation is where I can think of the logic as a base case with variants. The base case may be the most common or most straightforward. 例如哺乳动物类、爬行类和鸟类都属于脊椎动物类。
2. I can put this logic into a superclass which allows me to reason about it without having to worry about the variants. 
3. I then put each variant case into a subclass, which I express with code that emphasizes its difference from the base case.



## Mechanics


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
