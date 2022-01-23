# Use decision table to replace complicated conditions


<!-- TOC -->

- [Use decision table to replace complicated conditions](#use-decision-table-to-replace-complicated-conditions)
    - [思想](#思想)
        - [表驱动方法（table-driven methods）](#表驱动方法table-driven-methods)
    - [Motivation](#motivation)
    - [References](#references)

<!-- /TOC -->


## 思想
### 表驱动方法（table-driven methods）
 

## Motivation
1. 条件表达式本身就是一组映射关系，它从一个条件状态映射为另一个状态或者是一种行为。
2. 例如下面的例子就是从一种条件状态映射到另一种状态
    ```js
    if (n == 2) {
        return "double kill";
    }
    else if (n == 3) {
        return "triple kill";
    }
    else if (n == 4) {
        return "ultra kill";
    }
    ```
    一共有三对映射关系，其中每一对映射都是从 n 的正负性用射到该正负性的文字描述。
3. 在比如下面的例子是从一种条件状态映射到一种行为
    ```js
    if (n == -1) {
        turnLeft();
    }
    else if (n == 1) {
        turnRight();
    }
    else if (n == 0) {
        keep();
    }
    ```
4. 不管是映射到状态还是映射到行为，都是一一对应的关系，而一一对应的关系就可以使用两列表的形式来表示。例如
    ```js
    const decision_table = {
        2: "double kill",
        3: "triple kill",
        4: "ultra kill",
    }
    ```
5. 有了表之后，可以把条件状态作为索引直接获得映射后的状态
    ```js
    decision_table[n]
    ```
6. 映射到行为的情况也是一样
    ```js
    const decision_table = [
        [-1, turnLeft],
        [1,  turnRight],
        [0,  keep],
    ];
    let map = new Map(decision_table);
    map.get(-1)(); // 调用 turnLeft
    ```
7. 使用决策表的好处是：
    * 可以把所有的条件都统一的列到一起，方便查看各种状态；
    * 不需要每次都查看复杂的条件分支流程；
    * 增加、删除、修改映射时只需要修改作为数据决策表，而不需要修改执行过程的逻辑代码；


## References
* [*Code Complete 2*](https://book.douban.com/subject/1432042/)
