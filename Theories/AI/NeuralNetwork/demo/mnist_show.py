# coding: utf-8
import sys, os
# sys.path.append(os.pardir)  # 为了导入父目录的文件而进行的设定
# 如果当前工作目录（命令行工具的当前目录）不是该文件所在目录，就应该使用下面的绝对路径
# sys.path.append(os.path.join(os.path.dirname(__file__), os.pardir))
# 这里我们测试时把 mnist.py 和 mnist_show.py 放在同一个目录

import numpy as np

from mnist import load_mnist # 从 dataset 目录的 mnist.py 中导入加载 mnist 数据的函数
# 如果是安装的单独 Python 而不是 Anaconda 这样集成的环境，那么 PIL（Python Image Library） 需要安装 pillow
# 使用 `python - m pip Pillow` 安装时网络不好很可能安装超时，
# 使用下面的方法设定超时时间，多试几次可以安装成功：
# `python - m pip - -default-timeout = 100 install - U Pillow`
from PIL import Image


# 用来显示图像
def img_show(img):
    # 因为下面读取的图像数据是 NumPy 数组的形式，在显示图像时，需要使用 `Image.fromarray` 函数将其转换为 # PIL 所用的数据对象
    pil_img = Image.fromarray(np.uint8(img))
    pil_img.show()


# 读取数据集。第一次时如果没有下载，会先下载，会下载到 dataset 目录中
# 同样因为网络原因很可能下载不成功，直接上官网找连接迅雷下载：http://yann.lecun.com/exdb/mnist/
# 不过现在官网也无法现在了，这里可以直接使用之前的 .pkl 文件
# load_mnist 函数以 “(训练图像, 训练标签)，(测试图像, 测试标签 )” 的形式返回读入的 MNIST 数据
# flatten 参数设置为 True，所以每个图像数据是一个 784 项的一维数组。
# normalize 参数设置为 False，因此将输入图像为 0～255 的值。
# one_hot_label 参数没设置，默认为 False，因此每个标签项是一个数而不是数组。
(x_train, t_train), (x_test, t_test) = load_mnist(flatten=True, normalize=False)

img = x_train[0]
label = t_train[0]
print(label)  # 5

print(img.shape)  # (784,) # 上面使用一维数组的形式读取的第一个训练图像
img = img.reshape(28, 28)  # 因此，显示图像时，需要把它变为原来的 28 像素 × 28 像素的形状
print(img.shape)  # (28, 28)

img_show(img)
