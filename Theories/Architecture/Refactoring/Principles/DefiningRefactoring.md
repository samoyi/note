# Defining Refactoring


<!-- TOC -->

- [Defining Refactoring](#defining-refactoring)
    - [思想](#思想)
        - [小步改良](#小步改良)
        - [人是软件开发的重要因素](#人是软件开发的重要因素)
    - [基本定义](#基本定义)
    - [小步修改](#小步修改)
    - [Without changing observable behavior](#without-changing-observable-behavior)
    - [Difference from performance optimization](#difference-from-performance-optimization)
    - [References](#references)

<!-- /TOC -->


## 思想
### 小步改良
可以随时开始随时停止，不影响整体功能。

### 人是软件开发的重要因素
1. 程序员写代码的时候要清晰的理解代码，看别人代码的时候也要清晰的理解，修改软件的时候仍然需要清晰理解。
2. 如果代码混乱导致思维混乱，就可能写出混乱的代码，或者之后修改得混乱。这样不仅有可能性能低下，还很有可能出错。
3. 有时我们为了追求性能，可能会想写执行效率高但理解困难的代码。这样固然会带来一些直接的性能提示，但是难以理解和难以维护，就会带来上面说的混乱带来性能损失和错误。


## 基本定义
1. Like many terms in software development, “refactoring” is often used very loosely by practitioners. I use the term more precisely, and find it useful to use it in that more precise form. 
2. The term “refactoring” can be used either as a noun or a verb:
    * As a noun:  a change made to the internal structure of software to make it **easier to understand** and **cheaper to modify** without changing its observable behavior. 
    * As a verb: to restructure software by applying a series of refactorings without changing its observable behavior. 
3. Over the years, many people in the industry have taken to use “refactoring” to mean any kind of code cleanup—but the definitions above point to a particular approach to cleaning up code.


## 小步修改
1. Refactoring is all about applying small behavior­-preserving steps and making a big change by stringing together a sequence of these behavior­-preserving steps. 
2. Each individual refactoring is either **pretty small itself** or a **combination of small steps**.
3. As a result, when I’m refactoring, **my code doesn’t spend much time in a broken state, allowing me to stop at any moment even if I haven’t finished**.
4. If someone says their code was broken for a couple of days while they are refactoring, you can be pretty sure they were not refactoring.
5. I use “restructuring” as a general term to mean any kind of reorganizing or cleaning up of a code base, and see refactoring as a particular kind of restructuring. 
6. Refactoring may seem inefficient to people who first come across it and watch me making lots of tiny steps, when a single bigger step would do. 
7. But the tiny steps allow me to go faster because they compose so well—and, crucially, because I don’t spend any time
debugging.


## Without changing observable behavior
1. In my definitions, I use the phrase “observable behavior.” This is a deliberately loose term, indicating that the code should, overall, do just the same things it did before I started. 
2. It doesn’t mean it will work exactly the same—for example, Extract Function will alter the call stack, so performance characteristics might change—but nothing should change that the user should care about. 
3. In particular, interfaces to modules often change due to such refactorings as Change Function Declaration and Move
Function. 
4. Any bugs that I notice during refactoring should still be present after refactoring (though I can fix latent bugs that nobody has observed yet).


## Difference from performance optimization
1. Refactoring is very similar to performance optimization, as both involve carrying out code manipulations that don’t change the overall functionality of the program. 
2. The difference is the purpose: Refactoring is always done to make the code **“easier to understand and cheaper to modify.” This might speed things up or slow things down**.
3. With performance optimization, I only care about speeding up the program, and am prepared to end up with code that is harder to work with if I really need that improved performance.


## References
* [*Refactoring: Improving the Design of Existing Code,Second Edition*](https://book.douban.com/subject/30332135/)
