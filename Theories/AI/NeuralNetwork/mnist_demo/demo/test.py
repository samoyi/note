# coding: utf-8
import sys, os
sys.path.append(os.pardir)
import numpy as np
import pickle
from dataset.mnist import load_mnist


# 读取数据集，返回测试用的图像和标签
def get_data():
    (x_train, t_train), (x_test, t_test) = load_mnist(normalize=True, flatten=True, one_hot_label=False)
    return x_test, t_test


def init_network():
    with open("sample_weight.pkl", 'rb') as f:
        network = pickle.load(f)
    return network



x, _ = get_data()  # 获得 MNIST 数据集
network = init_network()
W1, W2, W3 = network['W1'], network['W2'], network['W3']

print(x.shape)     # (10000, 784)
print(x[0].shape)  # (784,)
print(W1.shape)    # (784, 50)
print(W2.shape)    # (50, 100)
print(W3.shape)    # (100, 10)
