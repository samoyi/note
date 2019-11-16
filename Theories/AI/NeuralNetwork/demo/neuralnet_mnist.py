# coding: utf-8
import sys, os
sys.path.append(os.pardir)  # 为了导入父目录的文件而进行的设定
sys.path.append('../../')
# 如果当前工作目录（命令行工具的当前目录）不是该文件所在目录，就应该使用下面的绝对路径
# sys.path.append(os.path.join(os.path.dirname(__file__), os.pardir))
import numpy as np
import pickle
from dataset.mnist import load_mnist
from common.functions import sigmoid, softmax


# 读取数据集，返回测试用的图像和标签
def get_data():
    (x_train, t_train), (x_test, t_test) = load_mnist(normalize=True, flatten=True, one_hot_label=False)
    return x_test, t_test


# 读入保存在 pickle 文件 sample_weight.pkl 中的学习到的权重参数(假设学习已经完成，并将学习到的参数保存在# 这里)。这个文件中以字典变量的形式保存了权重和偏置参数。
def init_network():
    with open("sample_weight.pkl", 'rb') as f:
        network = pickle.load(f)
    return network


# 输入之前神经网络循环的权重和偏置，并接受一个图像数据，演算并推测结果
def predict(network, x):
    W1, W2, W3 = network['W1'], network['W2'], network['W3']
    b1, b2, b3 = network['b1'], network['b2'], network['b3']

    a1 = np.dot(x, W1) + b1
    z1 = sigmoid(a1)
    a2 = np.dot(z1, W2) + b2
    z2 = sigmoid(a2)
    a3 = np.dot(z2, W3) + b3
    y = softmax(a3)

    return y


x, t = get_data()  # 获得 MNIST 数据集
network = init_network()  # 生成神经网络，也就是之前循环得到的权重和偏置
accuracy_cnt = 0
# 遍历所有图像
for i in range(len(x)):
    # predict() 函数以 NumPy 数组的形式输出各个标签对应的概率。比如输出[0.1, 0.3, 0.2, ..., 0.04] 
    # 的数组，该数组表示“0”的概率为 0.1，“1”的概率为 0.3，等等。
    y = predict(network, x[i])
    p = np.argmax(y) # 获取概率最高的元素的索引。也就是说，神经网络判断图像中的数字最有可能为 p
    if p == t[i]:
        # 对比标签，如果真的为 p ，则准确次数加一
        accuracy_cnt += 1

# 输出准确率
print("Accuracy:" + str(float(accuracy_cnt) / len(x)))
