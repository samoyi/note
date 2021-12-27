# Microarchitecture


<!-- TOC -->

- [Microarchitecture](#microarchitecture)
    - [基本结构](#基本结构)
    - [执行程序](#执行程序)
        - [取指令阶段（fetch phase）](#取指令阶段fetch-phase)
        - [解码阶段（decode phase）](#解码阶段decode-phase)
        - [执行阶段（execute phase）](#执行阶段execute-phase)
    - [References](#references)

<!-- /TOC -->


## 基本结构
1. 首先是指令集。假设我们的简单 CUP 有以下四种 8bit 指令
    <img src="./images/09.png" width="600" style="display: block; margin: 5px 0 10px;" />
    * 第一列是指令名；
    * 第二里是该指令的描述；
    * 第三列是指令的前 4bit，是指令的操作码，用来表明执行什么操作；
    * 第四列是指令的后 4bit，用来存储该条指令涉及的数据的地址，该地址可能是内存的也可能是寄存器的。
2. 我们的 CUP 设计有四个寄存器，用来临时保存数据以及操作数据；
3. 另外作为示例，我们需要一个内存。从指令集可以看出来数据地址最多是 4bit，所以我们这里的内存最多只有 16 个地址
    <img src="./images/10.png" width="800" style="display: block; margin: 5px 0 5px;" />
    可以看到，内存中已经保存了一些数据，这就是我们这个例子中的一小段程序。
4. 我们还需要另外两个特殊功能的寄存器：
    * **指令寄存器**（address register）：保存当前指令的内容；
    * **指令地址寄存器**（instruction address register）：为了追踪程序的运行，这个寄存器保存当前指令的内存地址，以及下一个指令的地址；


## 执行程序
### 取指令阶段（fetch phase）
<img src="./images/11.png" width="800" style="display: block; margin: 5px 0 10px;" />

1. 当计算机启动时，所有寄存器的值都是 0，然后开始进入取指令阶段。
2. 将指令地址寄存器连接到内存，该寄存器的值为 0，所以内存返回地址 0 的值 $00101110$。
3. 这个值被复制到指令寄存器中，作为当前要执行的指令。

### 解码阶段（decode phase）
1. 接下来要对拿到的指令解码，明确到底要做什么。
2. $00101110$ 的前四位 $0010$ 表明要执行 `LOAD_A` 操作，也就是说要从后四位的内存地址中读取数据并保存进寄存器 A。
3. 检查操作是否为 `LOAD_A`，可以用下面的电路实现
    <img src="./images/12.png" width="600" style="display: block; margin: 5px 0 5px;" />
    可以看到，这个电路检查操作码是否是 $0010$，也就是确定是否是 `LOAD_A` 操作。
3. 后四位 $1110$ 是内存地址 14，就是要 `LOAD_A` 操作要读取的数据的内存地址。

### 执行阶段（execute phase）
<img src="./images/13.png" width="800" style="display: block; margin: 5px 0 5px;" />

1. 检查操作是否为 `LOAD_A` 的电路会连接到内存上，如果输出为 1，就会打开内存的 read enable 线；
2. 指令寄存器也连接着内存，所以会把其后四位的地址传递给内存；
3. 内存根据地址读取地址为 14 上数据 $00000011$；
4. 内存要把数据传给暂存数据的四个寄存器，所以就会和这四个寄存器也有连接；
5. 如图显示，内存通过同一根线连接这四个结存器。所以其实内存本身并不是主动的把数据发送给某个特定的寄存器，也是需要指定的内存开启自己的允许写入线，就和往指定锁存器里写入数据的原理一样；
6. 这里，检查操作是否为 `LOAD_A` 的电路也会连接到寄存器 A 上（同样，检查操作是否为 `LOAD_B` 的电路也会连接到寄存器 B 上），所以该电路输出为 1 时，上面的寄存器 A 就会打开允许写入线，而其他三个寄存器并不会打开，因此内存输出的数据就只会写入寄存器 A。
7. 至此，本条指令就执行完成了，我们可以关掉所有的线路。然后，指令地址寄存器的地址数会加一，下一轮取指令就是从下一个地址，在本例中就是地址 1。


## References
* [Crash Course Computer Science](https://www.bilibili.com/video/BV1EW411u7th)