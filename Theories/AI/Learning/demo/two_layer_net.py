import numpy as np
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))
from common.gradient import numerical_gradient
from common.functions import *


class TwoLayerNet:
    # input_size:  输入层的神经元数
    # hidden_size: 隐藏层的神经元数
    # output_size: 输出层的神经元数
    def __init__(self, input_size, hidden_size, output_size,
                 weight_init_std=0.01):
        # 初始化权重
        self.params = {}
        self.params['W1'] = weight_init_std * \
            np.random.randn(input_size, hidden_size)   # 第 1 层权重
        self.params['b1'] = np.zeros(hidden_size)      # 第 1 层偏置
        self.params['W2'] = weight_init_std * \
            np.random.randn(hidden_size, output_size)  # 第 2 层权重
        self.params['b2'] = np.zeros(output_size)      # 第 2 层偏置

    def predict(self, x):
        W1, W2 = self.params['W1'], self.params['W2']
        b1, b2 = self.params['b1'], self.params['b2']

        a1 = np.dot(x, W1) + b1
        z1 = sigmoid(a1)
        a2 = np.dot(z1, W2) + b2
        y = softmax(a2)

        return y

    # x:输入数据, t:监督数据
    def loss(self, x, t):
        y = self.predict(x)

        return cross_entropy_error(y, t)

    def accuracy(self, x, t):
        y = self.predict(x)
        y = np.argmax(y, axis=1)
        t = np.argmax(t, axis=1)

        accuracy = np.sum(y == t) / float(x.shape[0])
        return accuracy

    # x:输入数据, t:监督数据
    def numerical_gradient(self, x, t):
        def loss_W(W): return self.loss(x, t)

        grads = {}
        grads['W1'] = numerical_gradient(loss_W, self.params['W1']) # 第 1 层权重的梯度
        grads['b1'] = numerical_gradient(loss_W, self.params['b1']) # 第 1 层偏置的梯度
        grads['W2'] = numerical_gradient(loss_W, self.params['W2']) # 第 2 层权重的梯度
        grads['b2'] = numerical_gradient(loss_W, self.params['b2']) # 第 2 层偏置的梯度

        return grads
