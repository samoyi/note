# LinkedList


<!-- TOC -->

- [LinkedList](#linkedlist)
    - [链表和数组的区别](#链表和数组的区别)
        - [内存连续性不同](#内存连续性不同)
            - [查询元素的区别](#查询元素的区别)
            - [插入和移除元素的区别](#插入和移除元素的区别)
        - [设计思想区别](#设计思想区别)
            - [统一与自治](#统一与自治)
            - [封闭与开放——无边界性带来更灵活的组合和拆分](#封闭与开放无边界性带来更灵活的组合和拆分)
    - [反转单向列表](#反转单向列表)
        - [循环](#循环)
        - [递归](#递归)
    - [一些习题](#一些习题)
        - [1.3.28　使用递归寻找链表最大值](#1328　使用递归寻找链表最大值)
        - [1.3.40 前移编码](#1340-前移编码)

<!-- /TOC -->


## 链表和数组的区别
### 内存连续性不同 
1. 从内存使用上来说，传统数组中的元素在内存上是连续的，而链表的元素因为是通过指针联系，所以不需要是连续的。
2. 由于这个特性，所以链表查询元素比较耗时，而数组插入和删除元素比较耗时。

#### 查询元素的区别
1. 因为这种连续性，只要确保所有数组项都保存同样类型的数据，也就是每个数组项都占用同样长度的内存，那么想要根据索引读取某一项时，可以很方便的计算出来它所在的位置，然后立刻找到。
2. 而链表的每一个节点都是通过指针连接的，所以想要读取元素只能从第一个节点开始，依次按照每个节点的指针找到目标。
3. 所以，如果要依次访问所有的元素，其实数组和链表都是 $O(n)$ 级别的；但要根据索引随机访问元素，数组就会变为 $O(1)$ 级别，而链表依然是 $O(n)$ 级别。

#### 插入和移除元素的区别
1. 因为这种连续型，所以从数组的起点或中间插入或移除项的成本很高，因为后面所有的数组项都要依次往后移动一位。 插入和移除本身是 $O(n)$ 级别，但访问到该位置是 $O(1)$ 级别。
2. 而链表因为没有这种连续型，所以添加或移除元素的时候不需要移动其他元素，只需要在要插入的地方连接上新的节点即可。插入和移除本身是 $O(1)$ 级别，但访问到该位置是 $O(n)$ 级别。
3. 如果是 append 到最后一项，则数组会比较快，因为它拥有较快的查询，且 append 不涉及移动数组项；而链表还是需要从头部一路根据指针找到尾部。（如果是双向列表，则可以从尾部开始，所以也不会慢）

### 设计思想区别
#### 统一与自治
1. 传统数组的方式是全盘统一管理，链表的方式是自治管理。
2. 统一管理会有一套统一的编制体系，所以查找起来更方便。但因为是一套编制，所以其中一个节点的变动都是对整个编制的变动。
3. 自治管理中，虽然每个节点有同一个的规则，但是所有节点并没有规划进统一的编制。因此两个节点或多个节点直接发生的变动，并不会影响全局，更准确的说就是根本没有一个全局编制。而没有全局编制的缺点也就是不方便在全局层面上进行管理。
4. 倒是有些像集权和封建的感觉。

#### 封闭与开放——无边界性带来更灵活的组合和拆分
1. 《算法导论》练习 10.2-6 的例子，并集的计算使用链表只需要 $O(1)$ 的时间复杂度。**只要连接就成为一体**。
2. 使用数组并不能实现这样的功能，或者说不能如此方便的实现。因为数组是一个封闭的体系。要对两个数组进行合并，就必须先创造出一个更大的封闭体系，然后把两个数组都封闭进来。


## 反转单向列表
### 循环
1. 刚开始这样实现，有问题
    ```cpp
    void reverse_iteration(void) {
        if (head == NULL) {
            return;
        }

        Node* curr = head;
        // 遍历列表，让当前元素的下一个元素的 next 指针指向当前元素
        while (curr->next) {
            curr->next->next = curr;
            curr = curr->next;
        }

        // 反转后设定新的链表尾和头
        head->next = NULL;
        head = curr;
    }
    ```
2. 每次改变了下一个元素的 `next`，下一轮循环却还试图使用改变之前的 `next` 指针。所以每轮改变了 `next` 指针后，下一轮判断条件中的 `curr->next` 就不能用了。
3. 一个指针想要指向两个地方，那就再多加一个指针
    ```cpp
    void reverse_iteration(void) {
        if (head == NULL) {
            return;
        }

        Node* prev = head;
        Node* curr = head->next;
        Node* next; // 保存改变之前的 next
        while (curr) {
            next = curr->next;
            curr->next = prev; // 设置新的 next
            // 设置下一轮
            prev = curr;
            curr = next;
        }

        // 反转后设定新的链表尾和头
        head->next = NULL;
        head = prev;
    }
    ```
4. 链表为空的情况（`head == NULL`）也完全可以并入到 `while` 里面
    ```cpp
    void reverse_iteration(void) {
        Node* curr = head;
        Node* prev = NULL;
        Node* next;
        while (curr) {
            next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }

        // head->next = NULL; // 循环第一轮已经设置 
        head = prev;
    }
    ```

### 递归
1. 直接把上面的循环改为递归。上面的循环中每轮要设置新的 `prev` 和 `curr`，所以这两个作为参数
    ```cpp
    void reverse_recurse (Node* prev, Node* curr) {
        if (curr == NULL) {
            head = prev;
        }
        else {
            Node* next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
            reverse_recurse (prev, curr);
        }
    }
    ```
2. `reverse_recurse` 调用的时候因为还需要传递参数，所以在包装一个函数作为接口
    ```cpp
    void reverse_recursion () {
        reverse_recurse(NULL, head);
    }
    ```
3. 但更好的方法是，直接从递归的本意出发，也就是在之前的基础上或者说利用之前的计算结果再进行新的计算。也就是类似于阶乘的逻辑结构，高层级的计算递归的利用低一层级的计算结果。列出来的形式，就是最高层级的函数中递归的调用低一层级的函数。
4. 对于这里的情况，就是链表 `1->2->3->4` 的反转函数中递归的调用 `2->3->4` 的反转函数，内层函数调用结束后，它的结果 `4->3->2` 会直接被外层函数利用
    ```cpp
    void reverse_recurse (Node* prev, Node* curr) {
        if (curr == NULL) {
            head = prev;
        }
        else {
            Node* next = curr->next;
            reverse_recurse(curr, next); // 反转 head 之后的链表
            // 到了这里，head 之后的链表已经完成了反转
            curr->next = prev;
        }
    }
    void reverse_recursion () {
        reverse_recurse(NULL, head);
    }
    ```


## 一些习题
### 1.3.28　使用递归寻找链表最大值
1. 接受一条链表的首结点作为参数，返回链表中键最大的节点的值。假设所有键均为正整数，如果链表为空则返回 0。
2. 根据递归思想 “用前一层或前几层的成果（返回）再做些什么事情”，这里的递归逻辑是：在第一个元素和第二个元素之间比较，得到一个最大值；然后再用这个最大值和第二个元素的下一个元素比较，再得到最大值；继续和下一个元素比较。
3. 递归函数接收两个参数：一个是之前若干次比较过之后产生的最大值，第二个是下一个待比较的元素。这样，每次都是用已有的最大值和新元素进行比较。
```js
function maxInLinkedList_recursion ( max, current ) {
    if ( current === null ) {
        return 0
    }

    max = current.element > max ? current.element : max;
    if ( current.next ) {
        return maxInLinkedList_recursion (max, current.next);
    }
    else {
        return max;
    }
}

let max = maxInLinkedList_recursion( 0, ll.getHead() );
```

### 1.3.40 前移编码
1. 从标准输入读取一串字符，使用链表保存这些字符并清除重复字符。当你读取了一个从未见过的字符时，将它插入表头。当你读取了一个重复的字符时，将它从链表中删去并再次插入表头。
2. 将你的程序命名为 `MoveToFront`：它实现了著名的 **前移编码** 策略，这种策略假设最近访问过的元素很可能会再次访问，因此可以用于缓存、数据压缩等许多场景。很有用的策略啊。
3. 虽然题目要求用链表，不过还是用数组吧
    ```js
    function moveToFront ( str, arr=[] ) {
        let charList = [...str];

        charList.forEach(( char ) => {
            let index = arr.indexOf( char );
            if ( index > -1 ) {
                char = arr.splice( index, 1 )[0];
            }
            arr.unshift( char );
        });
        

    }


    const arr = []

    moveToFront( 'hello', arr );
    console.log( arr ); // ["o", "l", "e", "h"]

    moveToFront( 'world', arr );
    console.log( arr ); // ["d", "l", "r", "o", "w", "e", "h"]
    ```