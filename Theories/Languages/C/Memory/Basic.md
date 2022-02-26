# Basic


<!-- TOC -->

- [Basic](#basic)
    - [设计目的](#设计目的)
        - [关键细节](#关键细节)
    - [实现原理](#实现原理)
    - [抽象本质](#抽象本质)
    - [设计思想](#设计思想)
    - [栈内存分配和堆内存分配](#栈内存分配和堆内存分配)
        - [栈内存分配](#栈内存分配)
        - [堆内存分配](#堆内存分配)
        - [对比](#对比)
    - [References](#references)

<!-- /TOC -->


## 设计目的
### 关键细节


## 实现原理

## 抽象本质


## 设计思想


## 栈内存分配和堆内存分配
### 栈内存分配
1. 之所以称为栈内存分配，是因为内存的分配发生在函数调用栈中。

### 堆内存分配
1. 叫做堆内存并不是使用了堆数据结构，而是指 “一堆内存” 的感觉。
3. 每次创建一个对象时，它都是在堆空间被创建的；而对这个对象的引用信息则是保存在栈内存中。例如对象本身在堆内存中，而对象的指针在栈内存中。

### 对比
<table>
        <thead>
            <tr>
                <th>对比项</th>
                <th>栈内存</th>
                <th>堆内存</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>空间连续型</td>
                <td>内存分配发生在连续的内存块</td>
                <td>内存分配在空间上顺序随机</td>
            </tr>
            <tr>
                <td>由谁负责分配和回收</td>
                <td>编译器自动分配和回收</td>
                <td>程序员手动分配和回收，处理不好可能会发生内存泄漏</td>
            </tr>
            <tr>
                <td>数据在其中的生命期限</td>
                <td>变量所在函数执行期间</td>
                <td>整个应用程序运行时间</td>
            </tr>
            <tr>
                <td>分配后占用内存空间可变性</td>
                <td>为数据分配内存后不能再调整内存大小</td>
                <td>分配后可以调整大小</td>
            </tr>
            <tr>
                <td>相关操作速度</td>
                <td>快</td>
                <td>慢</td>
            </tr>
            <tr>
                <td>存储空间总容量</td>
                <td>小</td>
                <td>大</td>
            </tr>
            <tr>
                <td>安全性</td>
                <td>相对安全，因为每个线程都有一个栈内存，其中的数据只能被所有者线程访问</td>
                <td>相对不安全，因为通常整个应用程序只有一个堆内存，其中的数据可以被所有的线程访问</td>
            </tr>
            <tr>
                <td>主要缺点</td>
                <td>存储空间少</td>
                <td>分配空间碎片化</td>
            </tr>
            <tr>
                <td>Implementation</td>
                <td>Easy</td>
                <td>Hard</td>
            </tr>
            <tr>
                <td>Locality of reference</td>
                <td>Excellent</td>
                <td>Adequate</td>
            </tr>
            <tr>
                <td>Data type structure</td>
                <td>Linear</td>
                <td>Hierarchical</td>
            </tr>
        </tbody>
    </table>


## References
* [Stack vs Heap Memory Allocation](https://www.geeksforgeeks.org/stack-vs-heap-memory-allocation/)