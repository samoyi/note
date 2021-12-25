# Latch


<!-- TOC -->

- [Latch](#latch)
    - [触发器（Flip-Flop）](#触发器flip-flop)
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
8. 也就是说：
    * 接通上面的开关，灯泡被点亮，断开此开关灯泡仍然亮着。
    * 接通下面的开关，灯泡被熄灭，断开此开关灯泡仍然不亮。
9. 触发器可以记住最近一次闭合的是哪个开关：
    * 如果一个触发器的灯泡是亮着的，就可以推测出最后一次闭合的是上面的开关；
    * 而如果灯泡不亮则可推测出最后一次闭合的是下面的开关。


## References
* [程序是怎样跑起来的](https://book.douban.com/subject/26365491/)