# Basic


<!-- TOC -->

- [Basic](#basic)
    - [参数的更新](#参数的更新)
        - [SGD](#sgd)
            - [将 SGD 实现为类](#将-sgd-实现为类)
            - [SGD 的缺点——梯度方向并不是目的地方向](#sgd-的缺点梯度方向并不是目的地方向)
    - [References](#references)

<!-- /TOC -->


## 参数的更新
### SGD
#### 将 SGD 实现为类
1. Python 实现
    ```py
    class SGD:
        def __init__(self, lr=0.01):
            self.lr = lr #  learning rate

        def update(self, params, grads):
            for key in params.keys():
                params[key] -= self.lr * grads[key]
    ```
2. 使用这个 SGD 类，可以按如下方式进行神经网络的参数的更新
    ```py
    network = TwoLayerNet(...)
    optimizer = SGD()

    for i in range(10000):
        ...
        x_batch, t_batch = get_mini_batch(...) # mini-batch
        grads = network.gradient(x_batch, t_batch)
        params = network.params
        optimizer.update(params, grads)
        ...
    ```

#### SGD 的缺点——梯度方向并不是目的地方向
1. 我们来思考一下求下面这个函数的最小值的问题

    $$f(x,y)=\frac{1}{20}x^2+y^2$$

2. 该函数的图像和函数值大小等高线如下图
    <img src="./images/01.png" width="800" style="display: block; margin: 5px 0 10px;" />
3. 可以直观的看出来，在大多数地方，y 的偏导都明显大于 x。通过等高线也能看出来，沿着 y 轴方向变化可以很高效的改变函数值，而沿着 x 轴变化则没那么容易。
4. 如果用图表示梯度的话，则如下图所示
    <img src="./images/02.png" width="600" style="display: block; margin: 5px 0 10px;" />
5. 这个梯度的特征是，y 轴方向上大，x 轴方向上小。换句话说，就是 y 轴方向的坡度大，而 x 轴方向的坡度小。
6. 这里需要注意的是，虽然函数的最小值在 $(x, y) = (0, 0)$ 处，但是上图中的梯度在很多地方并没有指向 `(0, 0)`。
7. 这也就是 SGD 的问题：某个位置的梯度只是指向了当前位置函数减小最多的方向，但只是对当前位置而言，而不是整体的目的地而言。
7. 考虑函数图像中高处左侧的一点，当前的梯度是指向竖直向下然后稍微向右偏一点点的，因为这个方向的改变会使得本次移动函数值减少最多。但其实如果它够智能，那就应该朝着原点的方向移动，这样才能尽快的到达真正的目的地。
8. 也就是说，每个位置的梯度下降，只是实现了自己眼前的利益最大化，而没有从全局来考虑。
9. 我们来尝试对这个函数应用 SGD。从 $(x, y) = (-7.0, 2.0)$ 处开始搜索，结果如下图所示
    <img src="./images/03.png" width="600" style="display: block; margin: 5px 0 10px;" />
10. SGD 呈 “之” 字形移动，因为这种基本竖直的移动，就是对应当前的梯度，这种移动会导致当前位置函数值变化最大。这是一个相当低效的路径。
11. 也就是说，SGD 的缺点是，如果函数的形状非均向（anisotropic），比如呈延伸状，搜索的路径就会非常低效。因此，我们需要比单纯朝梯度方向前进的 SGD 更聪明的方法。SGD 低效的根本原因是，梯度的方向并没有指向最小值的方向。






## References
* [《深度学习入门》](https://book.douban.com/subject/30270959/)