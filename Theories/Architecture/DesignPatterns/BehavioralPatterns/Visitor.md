# Visitor


<!-- TOC -->

- [思想](#思想)
- [References](#references)

<!-- /TOC -->


## 思想
1. 我们要对一组不完全相同的对象执行一个类似的操作，这个操作会根据每个对象的不同之处而略有不同。
2. 我们当然可以给每个对象内部都定义各自的这个方法，但有时并不能这么做。比如：
    * 比如有 100 个对象但其实只是分为 3 类，那操作也就 3 种，但你还是要把操作代码写 100 份才行。
    * 比如从语义上来说，对象内部不应该包含这个操作代码。例如对象是一组不同语言的说明书，而你的操作是翻译这些说明书。翻译这个行为从语义上就不属于说明书本身该有的功能，而是外部的功能。
3. 所以我们可以把这些不同的操作定义到外部一个模块，这个模块接收对象，根据对象类型执行不同的操作。
4. 其实这里已经把问题解决了，但访问者模式还要处理的一个问题是，这个操作模块无法通过 O(1) 操作确定对象的方法，只能线性的确定当前对象的类型然后进行操作，比如只能这样
    ```js
    foreach (Node node in graph) {
        if (node instanceof City)
            exportVisitor.doForCity((City) node)
        if (node instanceof Industry)
            exportVisitor.doForIndustry((Industry) node)
        // ……
    }
    ```
5. 但算法复杂度不是 O(1) 并不是它的主要问题，它的主要问题是：每次我们新增一个节点对象，除了新增该对象的代码以外，我们还必须要找到上面这段逻辑判断，然后进行修改。如果这个判断不止一处，我们还要保证所有地方都同步同样的进行了修改。
6. 那么我们看看访问者模式解决这个问题了吗？
7. 访问者模式是让外部模块自己定义访问每种对象的方法，而是每种对象都提供一个访问的接口，外部模块如果想要访问对象，就必须按照对象提供的接口来实现访问方法。
8. 例如下面两个对象
    ```js
    // 城市
    class City is
        method accept(Visitor v) is
            v.doForCity(this)
        // ……

    // 工业区
    class Industry is
        method accept(Visitor v) is
            v.doForIndustry(this)
        // ……
    ```
9. 它们定义了 `accept` 方法，该方法接受访问器对象，并且要求访问器对象上必须有对应的 `doForCity` 和 `doForIndustry` 方法。
10. 外部模块定义访问器对象 `exportVisitor`，保证它里面有 `doForCity` 和 `doForIndustry` 方法，然后就可以这样进行遍历
    ```js
    foreach (Node node in graph) {
        node.accept(exportVisitor)
    }
    ```
11. 现在功能和之前一样了，那么它解决了原方法的问题了吗。算法复杂度确实降低了，但现在如果我们新增一个节点对象例如 `airport`，实际上还是要修改 `exportVisitor` 模块来增加 `doForAirport` 方法。而且如果还有其他访问器对象例如 `renderVisitor`，那还是要多次修改。
12. 也就是说，访问者模式并没有降低每次修改的直接工作量。但这里有一个关键性的不同。
13. 在旧模式中，如果你忘记新增一个 `if`，编译器并不会提示，错误会在运行时暴露。但再访问器模式中，如果某个访问器对象忘记新增 `doForAirport` 方法，编译器就会提示，错误会在编译时暴露。
14. 访问器模式并没有降低实际的代码编写量，但明确降低了开发的复杂度。


## References
* [Refactoring.Guru](https://refactoring.guru/design-patterns/visitor)