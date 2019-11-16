# coding: utf-8
import sys, os
# sys.path.append(os.pardir)  # 为了导入父目录的文件而进行的设定
sys.path.append('../../')
# 如果当前工作目录（命令行工具的当前目录）不是该文件所在目录，就应该使用下面的绝对路径
# sys.path.append(os.path.join(os.path.dirname(__file__), os.pardir))

import numpy as np

from dataset.mnist import load_mnist # 导入加载 mnist 数据的函数
# PIL（Python Image Library） 需要安装 pillow
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
# load_mnist 函数以“(训练图像, 训练标签)，(测试图像, 测试标签 )”的形式返回读入的 MNIST 数据
# normalize 参数：是否将输入图像正规化为 0.0～1.0 的值。如果将该参数设置为 False，则输入图像的像素会保持原 #                 来的 0～255。
# flatten 参数：是否展开输入图像（变成一维数组）。如果将该参数设置为 False，则输入图像为 1 × 28 × 28 的三维
#               数组；若设置为 True，则输入图像会保存为由 784 个元素构成的一维数组。
(x_train, t_train), (x_test, t_test) = load_mnist(flatten=True, normalize=False)

img = x_train[0]
label = t_train[0]
print(label)  # 5

print(img.shape)  # (784,) # 上面使用一维数组的形式读取的第一个训练图像
img = img.reshape(28, 28)  # 因此，显示图像时，需要把它变为原来的 28 像素 × 28 像素的形状
print(img.shape)  # (28, 28)

img_show(img)
