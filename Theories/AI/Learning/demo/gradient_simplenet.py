# coding: utf-8
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))
from common.gradient import numerical_gradient
from common.functions import softmax, cross_entropy_error
import numpy as np


class simpleNet:
    def __init__(self):
        self.W = np.random.randn(2, 3)  # 用高斯分布进行初始化参数

    def predict(self, x):
        return np.dot(x, self.W)

    #  x 接收输入数据，t 接收正确解标签
    def loss(self, x, t):
        z = self.predict(x)
        y = softmax(z)
        loss = cross_entropy_error(y, t)

        return loss


net = simpleNet()

print(net.W)  # 随机生成的参数
# [
#   [-0.31211728  0.81783696  1.0369602]
#   [-0.35531326 - 0.40729509  1.30223118]
# ]

t = np.array([0, 0, 1])  # 假定正确答案是最后一项
x = np.array([0.6, 0.9])
p = net.predict(x) # 使用随机参数预测三个结果
print(p)  # [-0.5070523   0.1241366   1.79418418]   预测结果正好倾向于最后一项
print(np.argmax(p))  # 如果使用随机参数预测的结果也是更倾向于最后一项，则损失函数的值会比较小
print(net.loss(x, t))  # 0.25338010072421907   




# 损失值关于参数的函数
def f(W):
    return net.loss(x, t)

# 求当前参数下的函数梯度
dW = numerical_gradient(f, net.W)
print(dW)
# [
#   [0.0466332   0.08766316 - 0.13429636]
#   [0.06994981  0.13149474 - 0.20144454]
# ]
