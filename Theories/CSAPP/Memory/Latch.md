# Latch


<!-- TOC -->

- [Latch](#latch)
    - [触发器（Flip-Flop）](#触发器flip-flop)
    - [锁存器（latch）](#锁存器latch)
    - [用锁存器组成存储器](#用锁存器组成存储器)
    - [References](#references)

<!-- /TOC -->


## 触发器（Flip-Flop）
1. 看下面一个电路
    <img src="./images/07.jfif" width="600" style="display: block; margin: 5px 0 10px;" />
2. 左边或非门的输出是右边或非门的输入，而右边或非门的输出是左边或非门的输入。这种连接方式我们称之为 **反馈**（feedback）。
3. 在初始状态下，两个开关都没有闭合，电路中只有左边的或非门有输出电流。
4. 当闭合上面的开关，左边或非门将立刻输出 0，右边或非门的输出随之变为 1，这时灯泡将被点亮
    <img src="./images/08.jfif" width="600" style="display: block; margin: 5px 0 10px;" />
5. 此时，即使断开上面的开关，灯泡依然亮着。这是因为右边或非门的输出 1 反馈给了左边的或非门的输入，所以左边的或非门就始终输出 0，导致右边的或非门输出 1
    <img src="./images/09.jfif" width="600" style="display: block; margin: 5px 0 10px;" />
6. 现在闭合下面的开关，则右边的或非门输出 0，因此灯泡熄灭。同时反馈到左边的或非门后，输出变为 1
    <img src="./images/10.jfif" width="600" style="display: block; margin: 5px 0 10px;" />
7. 此时，即使断开下面的开关，灯泡依然保持熄灭，因为右边或非门已经有一个输入是 1 了。    
    <img src="./images/11.jfif" width="600" style="display: block; margin: 5px 0 10px;" />
8. 也就是说，在不同时闭合两个开关的情况下：
    * 闭合上面的开关，灯泡点亮，断开此开关灯泡仍然亮着。
    * 闭合下面的开关，灯泡熄灭，断开此开关灯泡仍然不亮。
9. 如果同时闭合两个开关，则灯泡熄灭；如果同时断开两个开关，灯泡保持当前状态。


## 锁存器（latch）
1. 在不同时闭合两个开关的情况下，触发器可以记住最近一次闭合的是哪个开关：
    * 如果一个触发器的灯泡是亮着的，就可以推测出最后一次闭合的是上面的开关；
    * 而如果灯泡不亮则可推测出最后一次闭合的是下面的开关。
2. 这个触发器可以记住上一次发生的操作，开或者关。也就是说，这个触发器可以记住 1bit 的信息。这个电路称为锁存器。
3. 再抽象一步，通常我们会把锁存器绘制成下面的形状
    <img src="./images/12.jfif" width="400" style="display: block; margin: 5px 0 10px;" />
    * 用 Q 来表示整体输出为 1 的情况，也就是上面灯泡点亮的情况；
    * 用 $\overline Q$ 表示对 Q 取反；
    * S（Set，把 Q 设置为 1） 对应上文中上面的开关；
    * R（Reset，把 Q 设置为 0） 对应上文中下面的开关；
4. 可以再简化为
    <img src="./images/13.jfif" width="400" style="display: block; margin: 5px 0 10px;" />
5. 下面是输入输出的逻辑表
    S | R | Q | $\overline Q$
    --|--|--|--
    1 | 0 | 1 | 0
    0 | 1 | 0 | 1
    0 | 0 | Q | $\overline Q$
    1 | 1 | 禁 | 止

    * 两个输入都是 0 时，输出保持不变；
    * 在设计锁存器电路时，不允许两个输入都是 1。也就是不允许上面说到的两个开关同时闭合。
6. 在实际的场景中，会进一步添加若干逻辑门并进行封装。我们使用一个输入的 1 和 0 的值来代替两个输入的 S 和 R；同时再增加一个输入，用来控制该锁存器是否能被写入。变成
    <img src="./images/14.png" width="400" style="display: block; margin: 5px 0 10px;" />


## 用锁存器组成存储器
1. 一个锁存器可以保存 1bit 二进制数，而如果将一组锁存器组合起来，就可以组成一个 **寄存器**（register）。寄存器的 bit 数称为该寄存器的 **位宽**（width）。
2. 实际中的寄存器，其中的锁存器使用矩阵排列。下面是一个 256 位的寄存器
    <img src="./images/15.png" width="600" style="display: block; margin: 5px 0 10px;" />


## References
* [程序是怎样跑起来的](https://book.douban.com/subject/26365491/)