# Basic


<!-- TOC -->

- [Basic](#basic)
    - [0. 思想](#0-思想)
    - [1. 整体结构](#1-整体结构)
    - [2. 卷积层](#2-卷积层)
        - [2.1 全连接层存在的问题](#21-全连接层存在的问题)
        - [2.2 卷积运算](#22-卷积运算)
        - [2.3 填充](#23-填充)
        - [2.4 步幅](#24-步幅)
        - [2.5 三维数据的卷积运算](#25-三维数据的卷积运算)
        - [2.6 结合方块思考](#26-结合方块思考)
        - [2.7 批处理](#27-批处理)
    - [3. 池化层](#3-池化层)
        - [3.1 池化层的特征](#31-池化层的特征)
            - [没有要学习的参数](#没有要学习的参数)
            - [通道数不发生变化](#通道数不发生变化)
            - [对微小的位置变化具有鲁棒性](#对微小的位置变化具有鲁棒性)
    - [4. 卷积层和池化层的实现](#4-卷积层和池化层的实现)
        - [4.1 四维数组](#41-四维数组)
        - [4.2 基于 im2col 的展开](#42-基于-im2col-的展开)
        - [4.3 卷积层的实现](#43-卷积层的实现)
            - [4.3.1 `im2col` 函数](#431-im2col-函数)
            - [4.3.2 实现卷积层](#432-实现卷积层)
            - [4.3.3 池化层的实现](#433-池化层的实现)
    - [5. CNN的实现](#5-cnn的实现)
        - [5.1 初始化](#51-初始化)
        - [5.2 `predict` 和 `loss`](#52-predict-和-loss)
        - [5.3 `gradient`](#53-gradient)
    - [References](#references)

<!-- /TOC -->


## 0. 思想


## 1. 整体结构
1. 首先，来看一下 CNN 的网络结构，了解 CNN 的大致框架。
2. CNN 和之前介绍的神经网络一样，可以像乐高积木一样通过组装层来构建。不过，CNN 中新出现了卷积层（Convolution 层）和池化层（Pooling 层）。
3. 之前介绍的神经网络中，相邻层的所有神经元之间都有连接，这称为 **全连接**（fully-connected）。
4. 另外，我们用 Affine 层实现了全连接层。如果使用这个 Affine 层，一个 5 层的全连接的神经网络就可以通过下图所示的网络结构来实现
    <img src="./images/01.png" width="800" style="display: block; margin: 5px 0 10px;" />
5. 全连接的神经网络中，Affine 层后面跟着激活函数 ReLU 层（或者 Sigmoid 层）。这里堆叠了 4 层 “Affine-ReLU” 组合，然后第 5 层是 Affine 层，最后由 Softmax 层输出最终结果（概率）。
6. 下图是 CNN 的一个例子，新增了 Convolution 层和 Pooling 层
    <img src="./images/02.png" width="800" style="display: block; margin: 5px 0 10px;" />


## 2. 卷积层
### 2.1 全连接层存在的问题
1. 全连接层存在的问题是，数据的形状被 “忽视” 了。比如，输入数据是图像时，图像通常是高、长、通道方向上的 3 维形状。但是，向全连接层输入时，需要将 3 维数据拉平为 1 维数据。
2. 实际上，全连接中使用了 MNIST 数据集时，输入图像就是 1 通道、高 28 像素、长 28 像素的（1, 28, 28）形状，但却被排成 1 列，以 784 个数据的形式输入到最开始的 Affine 层。
3. 图像是 3 维形状，这个形状中应该含有重要的空间信息。比如，空间上邻近的像素为相似的值、RGB 的各个通道之间分别有密切的关联性、相距较远的像素之间没有什么关联等，3 维形状中可能隐藏有值得提取的本质模式。
4. 但是，因为全连接层会忽视形状，将全部的输入数据作为相同的神经元（同一维度的神经元）处理，所以无法利用与形状相关的信息。
5. 而卷积层可以保持形状不变。当输入数据是图像时，卷积层会以 3 维数据的形式接收输入数据，并同样以 3 维数据的形式输出至下一层。因此，在 CNN 中，可以（有可能）正确理解图像等具有形状的数据。
6. 另外，CNN 中，有时将卷积层的输入输出数据称为 **特征图**（feature map）。其中，卷积层的输入数据称为 **输入特征图**（input feature map），输出数据称为 **输出特征图**（output feature map）。

### 2.2 卷积运算
1. 卷积层进行的处理就是卷积运算。卷积运算相当于图像处理中的“滤波器运算”。先来看一个具体的例子，下图用 $\circledast$ 符号表示卷积运算
    <img src="./images/03.png" width="600" style="display: block; margin: 5px 0 10px;" />
2. 具体的计算过程如下
    <img src="./images/04.png" width="600" style="display: block; margin: 5px 0 10px;" />
3. 对于输入数据，卷积运算以一定间隔滑动滤波器的窗口并应用。将各个位置上滤波器的元素和输入的对应元素相乘，然后再求和（有时将这个计算称为 **乘积累加运算**）。然后，将这个结果保存到输出的对应位置。将这个过程在所有位置都进行一遍，就可以得到卷积运算的输出。
4. 在全连接的神经网络中，除了权重参数，还存在偏置。CNN 中，滤波器的参数就对应之前的权重。并且，CNN 中也存在偏置。包含偏置的卷积运算的处理流如下图所示，偏置通常只有 1 个（1 × 1），这个值会被加到应用了滤波器的所有元素上
    <img src="./images/05.png" width="600" style="display: block; margin: 5px 0 10px;" />

### 2.3 填充
1. 在进行卷积层的处理之前，有时要向输入数据的周围填入固定的数据（比如 0 等），这称为 **填充**（padding），是卷积运算中经常会用到的处理。
2. 在下图的例子中，对大小为 (4, 4) 的输入数据应用了幅度为 1 的填充
    <img src="./images/06.png" width="600" style="display: block; margin: 5px 0 10px;" />
3. 使用填充主要是为了调整输出的大小。比如，对大小为 (4, 4) 的输入数据应用 (3, 3) 的滤波器时，输出大小变为 (2, 2)，相当于输出大小比输入大小缩小了 2 个元素。这在反复进行多次卷积运算的深度网络中会成为问题。
2. 因为如果每次进行卷积运算都会缩小空间，那么在某个时刻输出大小就有可能变为 1，导致无法再应用卷积运算。
3. 为了避免出现这样的情况，就要使用填充。在刚才的例子中，将填充的幅度设为 1，那么相对于输入大小 (4, 4)，输出大小也保持为原来的 (4, 4)。因此，卷积运算就可以在保持空间大小不变的情况下将数据传给下一层。

### 2.4 步幅
1. 应用滤波器的位置间隔称为 **步幅**（stride）。之前的例子中步幅都是 1，如果将步幅设为 2，则如下图所示
    <img src="./images/07.png" width="600" style="display: block; margin: 5px 0 10px;" />
2. 接下来，我们看一下对于填充和步幅，如何计算输出大小。
3. 这里，假设输入大小为 (H, W)，滤波器大小为 (FH, FW)，输出大小为 (OH, OW)，填充为 P，步幅为 S。此时，输出大小可通过式 (7.1) 进行计算。

    $$\begin{aligned}OH&=\frac{H+2P-FH}{S}+1\\OW&=\frac{W+2P-FW}{S}+1\end{aligned}$$

### 2.5 三维数据的卷积运算
1. 例如图像是 3 维数据，除了高、长方向之外，还需要处理通道方向。下图是对加上了通道方向的 3 维数据进行卷积运算的例子
    <img src="./images/08.png" width="600" style="display: block; margin: 5px 0 10px;" />
2. 下面是计算步骤
    <img src="./images/09.png" width="600" style="display: block; margin: 5px 0 10px;" />

### 2.6 结合方块思考
1. 将数据和滤波器结合长方体的方块来考虑，方块是如下图所示的 3 维长方体
    <img src="./images/10.png" width="600" style="display: block; margin: 5px 0 10px;" />
2. 把 3 维数据表示为多维数组时，书写顺序为（channel, height, width）。比如，通道数为 C、高度为 H、长度为 W 的数据的形状可以写成（C, H, W）。滤波器也一样，要按（channel, height, width）的顺序书写。比如，通道数为 C、滤波器高度为 FH（Filter Height）、长度为 FW（Filter Width）时，可以写成（C, FH, FW）。
3. 在这个例子中，数据输出是 1 张特征图。所谓 1 张特征图，换句话说，就是通道数为 1 的特征图。
4. 如果要在通道方向上也拥有多个卷积运算的输出，就需要用到多个滤波器（权重）。如下图所示
    <img src="./images/11.png" width="600" style="display: block; margin: 5px 0 10px;" />
5. 通过应用 FN 个滤波器，输出特征图也生成了 FN 个。如果将这 FN 个特征图汇集在一起，就得到了形状为 (FN, OH, OW) 的方块。将这个方块传给下一层，就是 CNN 的处理流。
6. 卷积运算中也存在偏置，如果进一步追加偏置的加法运算处理，则结果如下图所示
    <img src="./images/12.png" width="600" style="display: block; margin: 5px 0 10px;" />
7. 这里，偏置的形状是 (FN, 1, 1)，滤波器的输出结果的形状是 (FN, OH, OW)。这两个方块相加时，要对滤波器的输出结果 (FN, OH, OW) 按通道加上相同的偏置值。
8. 另外，不同形状的方块相加时，可以基于 NumPy 的广播功能轻松实现。

### 2.7 批处理
为了使卷积运算也可以批处理，需要将在各层间传递的数据保存为 4 维数据。具体地讲，就是按 (batch_num, channel, height, width) 的顺序保存数据。
    <img src="./images/13.png" width="600" style="display: block; margin: 5px 0 10px;" />


## 3. 池化层
1. 池化是缩小高、长方向上的空间的运算。比如下图，是进行将 2 × 2 的区域集约成 1 个元素的处理，缩小空间大小。
    <img src="./images/14.png" width="600" style="display: block; margin: 5px 0 10px;" />
2. 这里是按步幅 2 进行 2 × 2 的 Max 池化时的处理顺序。“Max 池化” 是获取最大值的运算，“2 × 2” 表示目标区域的大小。这个例子中将步幅设为了 2，所以 2 × 2 的窗口的移动间隔为 2 个元素。
3. 另外，一般来说，池化的窗口大小会和步幅设定成相同的值。
4. 除了 Max 池化之外，还有 Average 池化等。相对于 Max 池化是从目标区域中取出最大值，Average 池化则是计算目标区域的平均值。在图像识别领域，主要使用 Max 池化。

### 3.1 池化层的特征
#### 没有要学习的参数
池化层和卷积层不同，没有要学习的参数。池化只是从目标区域中取最大值（或者平均值）。

#### 通道数不发生变化
经过池化运算，输入数据和输出数据的通道数不会发生变化。如下图所示，计算是按通道独立进行的
<img src="./images/15.png" width="600" style="display: block; margin: 5px 0 10px;" />

#### 对微小的位置变化具有鲁棒性
输入数据发生微小偏差时，池化仍会返回相同的结果。因此，池化对输入数据的微小偏差具有鲁棒性。比如，3 × 3 的池化的情况下，如下图所示，池化会吸收输入数据的偏差
<img src="./images/16.png" width="600" style="display: block; margin: 5px 0 10px;" />


## 4. 卷积层和池化层的实现
### 4.1 四维数组
1. 如前所述，CNN 中各层间传递的数据是 4 维数据。所谓 4 维数据，比如数据的形状是 (10, 1, 28, 28)，则它对应 10 个高为 28、长为 28、通道为 1 的数据。用 Python 来实现的话，如下所示。
    ```py
    >>> x = np.random.rand(10, 1, 28, 28) # 随机生成数据
    >>> x.shape
    (10, 1, 28, 28)
    ```
2. 这里，如果要访问第 1 个数据，只要写 `x[0]` 就可以了。同样地，用 `x[1]` 可以访问第 2 个数据。
    ```py
    >>> x[0].shape # (1, 28, 28)
    >>> x[1].shape # (1, 28, 28)
    ```
3. 如果要访问第 1 个数据的第 1 个通道的空间数据，可以写成下面这样。
    ```py
    >>> x[0, 0] # 或者x[0][0]
    ```
4. 像这样，CNN 中处理的是 4 维数据，因此卷积运算的实现看上去会很复杂，但是通过使用下面要介绍的 `im2col` （image to column）这个技巧，问题就会变得很简单。

### 4.2 基于 im2col 的展开
1. 如果老老实实地实现卷积运算，估计要重复好几层的 `for` 语句。这样的实现有点麻烦，而且，NumPy 中存在使用 `for` 语句后处理变慢的缺点（NumPy 中，访问元素时最好不要用 `for` 语句）。
2. 这里，我们不使用 `for` 语句，而是使用 `im2col` 这个便利的函数进行简单的实现。
3. `im2col` 是一个函数，将输入数据展开以适合滤波器（权重）。如下图所示，对 3 维的输入数据应用 `im2col` 后，数据转换为 2 维矩阵（正确地讲，是把包含批数量的 4 维数据转换成了 2 维数据，参考下面的实现）。
    <img src="./images/17.png" width="600" style="display: block; margin: 5px 0 10px;" />
4. `im2col` 会把输入数据展开以适合滤波器（权重）。具体地说，对于输入数据，将应用滤波器的区域（3 维方块）横向展开为 1 行。`im2col` 会在所有应用滤波器的地方进行这个展开处理。如下图所示
    <img src="./images/18.png" width="600" style="display: block; margin: 5px 0 10px;" />
5. 在上图中，为了便于观察，将步幅设置得很大，以使滤波器的应用区域不重叠。而在实际的卷积运算中，滤波器的应用区域几乎都是重叠的。
6. 在滤波器的应用区域重叠的情况下，使用 `im2col` 展开后，展开后的元素个数会多于原方块的元素个数。因此，使用 `im2col` 的实现存在比普通的实现消耗更多内存的缺点。
7. 但是，汇总成一个大的矩阵进行计算，对计算机的计算颇有益处。比如，在矩阵计算的库（线性代数库等）中，矩阵计算的实现已被高度最优化，可以高速地进行大矩阵的乘法运算。因此，通过归结到矩阵计算上，可以有效地利用线性代数库。
8. 使用 `im2col` 展开输入数据后，之后就只需将卷积层的滤波器（权重）纵向展开为 1 列，并计算 2 个矩阵的乘积即可。这和全连接层的 Affine层进行的处理基本相同。如下图所示
    <img src="./images/19.png" width="600" style="display: block; margin: 5px 0 10px;" />
9. 可以看到，基于 `im2col` 方式的输出结果是 2 维矩阵。因为 CNN 中数据会保存为 4 维数组，所以要将 2 维输出数据转换为合适的形状。
10. 以上就是卷积层的实现流程。

### 4.3 卷积层的实现
#### 4.3.1 `im2col` 函数
1. `Theories/AI/common/util.py` 中实现了 `im2col` 函数，`im2col` 这一便捷函数具有以下接口。
    ```py
    im2col (input_data, filter_h, filter_w, stride=1, pad=0)
    ```
    * `input_data`——由（数据量，通道，高，长）的 4 维数组构成的输入数据
    * `filter_h`——滤波器的高
    * `filter_w`——滤波器的长
    * `stride`——步幅
    * `pad`——填充
2. `im2col` 会考虑滤波器大小、步幅、填充，将输入数据展开为 2 维数组。现在，我们来实际使用一下这个 `im2col`。
    ```py
    import sys, os
    sys.path.append(os.pardir)
    from common.util import im2col

    x1 = np.random.rand(1, 3, 7, 7)
    col1 = im2col(x1, 5, 5, stride=1, pad=0)
    print(col1.shape) # (9, 75)

    x2 = np.random.rand(10, 3, 7, 7) # 10个数据
    col2 = im2col(x2, 5, 5, stride=1, pad=0)
    print(col2.shape) # (90, 75)
    ```
3. 这里举了两个例子。第一个是批大小为 1、通道为 3 的 7 × 7 的数据，第二个的批大小为 10，数据形状和第一个相同。分别对其应用 `im2col` 函数，在这两种情形下，第 2 维的元素个数均为 75。这是滤波器（通道为 3、大小为 5 × 5）的元素个数的总和。批大小为 1 时，`im2col` 的结果是 (9, 75)。而第 2 个例子中批大小为 10，所以保存了 10 倍的数据，即 (90, 75)。

#### 4.3.2 实现卷积层
1. `Convolution` 类 
    ```py
    class Convolution:
        def __init__(self, W, b, stride=1, pad=0):
            self.W = W
            self.b = b
            self.stride = stride
            self.pad = pad

        def forward(self, x):
            FN, C, FH, FW = self.W.shape
            N, C, H, W = x.shape
            out_h = int(1 + (H + 2*self.pad - FH) / self.stride)
            out_w = int(1 + (W + 2*self.pad - FW) / self.stride)

            col = im2col(x, FH, FW, self.stride, self.pad)
            col_W = self.W.reshape(FN, -1).T # 滤波器的展开
            out = np.dot(col, col_W) + self.b

            out = out.reshape(N, out_h, out_w, -1).transpose(0, 3, 1, 2)

            return out
    ```
2. 卷积层的初始化方法将滤波器（权重）、偏置、步幅、填充作为参数接收。滤波器是 `(FN, C, FH, FW)` 的 4 维形状。另外，`FN`、`C`、`FH`、`FW` 分别是 Filter Number（滤波器数量）、Channel、Filter Height、Filter Width 的缩写。
3. 用 `im2col` 展开输入数据，并用 `reshape` 将滤波器展开为 2 维数组。然后，计算展开后的矩阵的乘积。
3. 展开滤波器的部分，将各个滤波器的方块纵向展开为 1 列。
4. 这里通过 `reshape(FN,-1)` 将参数指定为 -1，这是 `reshape` 的一个便利的功能。通过在 reshape 时指定为 -`1，reshape` 函数会自动计算 -1 维度上的元素个数，以使多维数组的元素个数前后一致。比如，`(10, 3, 5, 5)` 形状的数组的元素个数共有 750 个，指定 `reshape(10,-1)` 后，就会转换成 (10, 75) 形状的数组。
5. forward 的实现中，最后会将输出大小转换为合适的形状。转换时使用了 NumPy 的 `transpose` `函数。transpose` 会更改多维数组的轴的顺序。通过指定索引序列，就可以更改轴的顺序。如下图所示
    <img src="./images/20.png" width="600" style="display: block; margin: 5px 0 10px;" />
6. `Theories/AI/common/layer.py` 中实现了卷积层的反向传播。

#### 4.3.3 池化层的实现
1. 池化层的实现和卷积层相同，都使用 `im2col` 展开输入数据。不过，池化的情况下，在通道方向上是独立的，这一点和卷积层不同。具体地讲，池化的应用区域按通道单独展开，如下图所示
    <img src="./images/21.png" width="600" style="display: block; margin: 5px 0 10px;" />
2. 像这样展开之后，只需对展开的矩阵求各行的最大值，并转换为合适的形状即可。如下图所示
    <img src="./images/22.png" width="600" style="display: block; margin: 5px 0 10px;" />
3. 实现
    ```py
    class Pooling:
        def __init__(self, pool_h, pool_w, stride=1, pad=0):
            self.pool_h = pool_h
            self.pool_w = pool_w
            self.stride = stride
            self.pad = pad

        def forward(self, x):
            N, C, H, W = x.shape
            out_h = int(1 + (H - self.pool_h) / self.stride)
            out_w = int(1 + (W - self.pool_w) / self.stride)

            col = im2col(x, self.pool_h, self.pool_w, self.stride, self.pad)
            col = col.reshape(-1, self.pool_h*self.pool_w)

            out = np.max(col, axis=1)
            
            out = out.reshape(N, out_h, out_w, C).transpose(0, 3, 1, 2)

            return out
    ```
4. `Theories/AI/common/layer.py` 中实现了池化层的反向传播。


## 5. CNN的实现
我们已经实现了卷积层和池化层，现在来组合这些层，搭建进行手写数字识别的 CNN。这里要实现如下图所示的 CNN。
    <img src="./images/23.png" width="600" style="display: block; margin: 5px 0 10px;" />

### 5.1 初始化
1. 我们将它实现为名为 `SimpleConvNet` 的类。首先来看一下 `SimpleConvNet` 的 `__init__`，取下面这些参数
    * `input_dim`——输入数据的维度：（通道，高，长）
    * `conv_param`——卷积层的超参数（字典）。字典的关键字如下：
        * `filter_num`——滤波器的数量
        * `filter_size`——滤波器的大小
        * `stride`——步幅
        * `pad`——填充
    * `hidden_size`——隐藏层（全连接）的神经元数量
    * `output_size`——输出层（全连接）的神经元数量
    * `weitght_int_std`——初始化时权重的标准差
2. 实现如下
    ```py
    def __init__(self, 
                input_dim=(1, 28, 28),
                conv_param={'filter_num':30, 'filter_size':5, 'pad':0, 'stride':1},
                hidden_size=100, 
                output_size=10, 
                weight_init_std=0.01):
        filter_num = conv_param['filter_num']
        filter_size = conv_param['filter_size']
        filter_pad = conv_param['pad']
        filter_stride = conv_param['stride']
        input_size = input_dim[1]
        conv_output_size = (input_size - filter_size + 2*filter_pad) / filter_stride + 1
        pool_output_size = int(filter_num * (conv_output_size/2) *(conv_output_size/2))
    ```
3. 接下来实现权重参数的初始化，学习所需的参数是第 1 层的卷积层和剩余两个全连接层的权重和偏置。
    ```py
    self.params = {}
    self.params['W1'] = weight_init_std * np.random.randn(filter_num, input_dim[0],
                                                            filter_size, filter_size)
    self.params['b1'] = np.zeros(filter_num)
    self.params['W2'] = weight_init_std * np.random.randn(pool_output_size,
                                                            hidden_size)
    self.params['b2'] = np.zeros(hidden_size)
    self.params['W3'] = weight_init_std * np.random.randn(hidden_size, output_size)
    self.params['b3'] = np.zeros(output_size)
    ```
4. 生成必要的层
    ```py
    self.layers = OrderedDict()
    self.layers['Conv1'] = Convolution(self.params['W1'],
                                        self.params['b1'],
                                        conv_param['stride'],
                                        conv_param['pad'])

    self.layers['Relu1'] = Relu()
    self.layers['Pool1'] = Pooling(pool_h=2, pool_w=2, stride=2)
    self.layers['Affine1'] = Affine(self.params['W2'], self.params['b2'])

    self.layers['Relu2'] = Relu()
    self.layers['Affine2'] = Affine(self.params['W3'], self.params['b3'])
    self.last_layer = SoftmaxWithLoss()
    ```

### 5.2 `predict` 和 `loss`
1. 实现
    ```py
    def predict(self, x):
        for layer in self.layers.values():
            x = layer.forward(x)
        return x

    def loss(self, x, t):
        y = self.predict(x)
        return self.lastLayer.forward(y, t)
    ```
2. 这里，参数 `x` 是输入数据，`t` 是监督标签。
3. 在求损失函数的 `loss` 方法中，除了使用 `predict` 方法进行的 `forward` 处理之外，还会继续进行 `forward` 处理，直到到达最后的 `SoftmaxWithLoss` 层。不懂，没看出来

### 5.3 `gradient`
1. 实现
    ```py
    def gradient(self, x, t):
        # forward
        self.loss(x, t)

        # backward
        dout = 1
        dout = self.lastLayer.backward(dout)

        layers = list(self.layers.values())
        layers.reverse()
        for layer in layers:
            dout = layer.backward(dout)

        # 设定
        grads = {}
        grads['W1'] = self.layers['Conv1'].dW
        grads['b1'] = self.layers['Conv1'].db
        grads['W2'] = self.layers['Affine1'].dW
        grads['b2'] = self.layers['Affine1'].db
        grads['W3'] = self.layers['Affine2'].dW
        grads['b3'] = self.layers['Affine2'].db

        return grads
    ```
2. 参数的梯度通过误差反向传播法求出，通过把正向传播和反向传播组装在一起来完成。
3. 因为已经在各层正确实现了正向传播和反向传播的功能，所以这里只需要以合适的顺序调用即可。
4. 最后，把各个权重参数的梯度保存到 `grads` 字典中。
5. 这就是 `SimpleConvNet` 的实现，主文件代码在 `./demos/train_convnet.py`。


## References
* [《深度学习入门》](https://book.douban.com/subject/30270959/)