# Basic


## 从感知机到神经网络
### 神经网络概念
1. 用图来表示神经网络的话，如下图所示。
    <img src="./images/01.png" width="600" style="display: block;" />
2. 我们把最左边的一列称为输入层，最右边的一列称为输出层，中间的一列称为中间层。中间层有时也称为隐藏层。

### 用函数来表示感知机
1. 感知机可以使用如下函数`h`来表示
    ```
    y = h(b + w1x1 + w2x2)
    ```
2. 图示如下
    <img src="./images/02.png" width="600" style="display: block;" />
3. 输入值结合参数共同的计算结果，作为函数`h`的参数。函数`h`内部会计算参数的值：如果小于等于0，函数返回0；否则返回1
    <img src="./images/03.png" width="600" style="display: block;" />
### 感知机用到的激活函数
1. 刚才登场的`h（x）`函数会将输入信号的总和转换为输出信号，这种函数一般称为激活函数（activation function）。激活函数的作用在于决定如何来激活输入信号的总和。
2. 下图明确的显示了激活函数的计算过程
    <img src="./images/04.png" width="600" style="display: block;" />
3. `b + w1x1 + w2x2`的计算结果得到神经元`a`，神经元`a`作为参数传给激活函数`h`，`h`计算并输入为神经元`y`。


## 激活函数
### 阶跃函数
1. 激活函数以阈值为界，一旦输入超过阈值，就切换输出。这样的函数称为“阶跃函数”。
2. 因此，可以说感知机中使用了阶跃函数作为激活函数。
3. 下面就是感知机用到的阶跃函数
    ```py
    def step_function(x):
        if x > 0:
            return 1
        else:
            return 0
    ```
4. 改造一下，并使用 numpy，使它支持数组参数
    ```py
    import numpy as np
    def step_function(x):
        y = x > 0
        return y.astype(np.int)
    
    arr = np.array([-1, 0, 1])
    step_function(arr)  # [0 0 1]
    ```
5. 根据 NumPy 的广播功能，如果在标量和 NumPy 数组之间进行运算，则标量会和 NumPy 数组的各个元素进行运算。改造后的函数在传入单个数字时，`y`会是布尔值，通过转型函数转为整数，就会是 1 或 0；如果传入数组，以上面的`arr`为例，`y`的值会是`[False, False, True]`，最后转为期望的整数结果。
6. 打印阶跃函数的图形
    ```py
    import numpy as np
    import matplotlib.pylab as plt

    def step_function(x):
        return np.array(x > 0, dtype=np.int)

    x = np.arange(-5.0, 5.0, 0.1)
    y = step_function(x)
    plt.plot(x, y)
    plt.ylim(-0.1, 1.1)  # 指定y轴的范围
    plt.show()
    ```
    <img src="./images/05.png" width="600" style="display: block;" />

### sigmoid 函数
1. 如果将激活函数从阶跃函数换成其他函数，就可以进入神经网络的世界了。神经网络中经常使用的一个激活函数就是如下的 sigmoid 函数（sigmoid function）。
        <img src="./images/sigmoind-function.svg" width="600" style="background: white";display: block; />
2. 神经网络中用 sigmoid 函数作为激活函数，进行信号的转换，转换后的信号被传送给下一个神经元。实际上，上一章介绍的感知机和接下来要介绍的神经网络的主要区别就在于这个激活函数。其他方面，比如神经元的多层连接的构造、信号的传递方法等，基本上和感知机是一样的。
3. 用 Python 可以像下面这样写出 sigmoid 函数
    ```py
    def sigmoid(x):
        return 1 / (1 + np.exp(-x))
    ```
4. 打印 sygmoid 函数的图形
    ```py
    import numpy as np
    import matplotlib.pylab as plt

    def sigmoid(x):
        return 1 / (1 + np.exp(-x))

    x = np.arange(-5.0, 5.0, 0.1)
    y = sigmoid(x)
    plt.plot(x, y)
    plt.ylim(-0.1, 1.1)  # 指定y轴的范围
    plt.show()
    ```
    <img src="./images/06.png" width="600" style="display: block;" />

### sigmoid 函数和阶跃函数的比较
<img src="./images/07.png" width="600" style="display: block;" />

1. 平滑性不同：输出是否随着输入发生连续性的变化。
2. 输出值不同：相对于阶跃函数只能返回 0 或 1，sigmoid 函数可以返回 0.731 ...、0.880 ... 等实数。也就是说，感知机中神经元之间流动的是 0 或 1 的二元信号，而神经网络中流动的是连续的实数值信号。
3. 两者的结构均是“输入小时，输出接近 0；随着输入增大，输出接近 1 ”。也就是说，当输入信号为重要信息时，阶跃函数和 sigmoid 函数都会输出较大的值；当输入信号为不重要的信息时，两者都输出较小的值。
4. 还有一个共同点是，不管输入信号有多小，或者有多大，输出信号的值都在 0 到 1 之间。

###　ReLU（Rectified Linear Unit）函数
 ReLU 函数在输入大于 0 时，直接输出该值；在输入小于等于 0 时，输出 0
```py
def relu(x):
    return np.maximum(0, x)
```


## 矩阵乘法与神经网络的内积运算
1.  矩阵乘法 **A** x **B** 要求 **A** 的列数必须要等于 **B** 的行数。
2. 一维数组和多维数组相乘是，看起来比较灵活：如果 **A** 是一维数组，则它会被当做单行；如果 **B** 是一维数组，则它会被当做单行。这样都可以和另一个数组进行矩阵乘法。
2. 神经网络的内积计算，正好可以使用矩阵乘法
<img src="./images/09.png" width="600" style="display: block;" />
    1. 在上面的神经网络中，输入为矩阵 **X** `[x1, x2]`，输出为`[x1*1+x2*2, x1*3+x2*4, x1*5+x2*6, ]`。
    2. 如果将权重表示为矩阵 **W** `[[1, 3, 5], [2, 4, 6]]`，则该神经网络的计算结果正好就是 **X** 和 **W** 的乘积。
4. 假设输入是`[1, 2]`，则使用矩阵乘法可以很容易的算出输出：
    ```py
    X = np.array([1, 2])
    W = np.array([[1, 3, 5], [2, 4, 6]])
    Y = np.dot(X, W)
    print(Y)  # [ 5 11 17]
    ```
5. 使用 `np.dot`，可以一次性计算出 **Y** 的结果。这意味着，即便 **Y** 的元素个数为 100 或 1000，也可以通过一次运算就计算出结果。如果不使用 `np.dot`，就必须对输入和权重进行循环的相乘相加，非常麻烦。