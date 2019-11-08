# coding: utf-8
import sys, os
sys.path.append(os.pardir)
import numpy as np
import pickle
from dataset.mnist import load_mnist
from common.functions import sigmoid, softmax


def get_data():
    (x_train, t_train), (x_test, t_test) = load_mnist(normalize=True, flatten=True, one_hot_label=False)
    return x_test, t_test


def init_network():
    with open("sample_weight.pkl", 'rb') as f:
        network = pickle.load(f)
    return network


def predict(network, x):
    w1, w2, w3 = network['W1'], network['W2'], network['W3']
    b1, b2, b3 = network['b1'], network['b2'], network['b3']

    a1 = np.dot(x, w1) + b1
    z1 = sigmoid(a1)
    a2 = np.dot(z1, w2) + b2
    z2 = sigmoid(a2)
    a3 = np.dot(z2, w3) + b3
    y = softmax(a3)

    return y


x, t = get_data()
network = init_network()

batch_size = 100 # 批数量
accuracy_cnt = 0

# range(start, end, step)
# >>> list( range(0, 10) )
# [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
# >>> list( range(0, 10, 3) )
# [0, 3, 6, 9]
for i in range(0, len(x), batch_size):
    x_batch = x[i:i+batch_size] # 每个批次读取 batch_size 个图片数据
    y_batch = predict(network, x_batch) # 批量计算结果
    # 批量获取值最大的元素的索引
    # 注意现在 y_batch 是二维数组，需要告诉 argmax 对哪个维度的元素进行最大筛选
    # 第一个维度（ axis=0 ）的元素是数组，第二个维度（ axis=1 ）的元素是每个数组的数字数组项，
    # 所以我们这里应该是对第二维的数字数组中挑选最大元素的索引
    # 这样，没批输入 100 个图像数据，会得到 100 个预测结果索引
    p = np.argmax(y_batch, axis=1)
    # 再使用该批次的 100 个预测索引和标签中的对应的 100 个正确答案索引进行对比
    accuracy_cnt += np.sum(p == t[i:i+batch_size])

print("Accuracy:" + str(float(accuracy_cnt) / len(x)))
