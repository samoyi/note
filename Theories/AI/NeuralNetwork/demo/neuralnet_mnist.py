# coding: utf-8
import numpy as np
import pickle
from mnist import load_mnist
from functions import sigmoid, softmax


# 读取数据集，返回测试用的图像和标签
# 这里 normalize 设为了 True，所以每个像素的值不是 0-255 而是 0-1
# 这里 flatten 设为了 True，所以每个图像的数据是一个 784 项的一维数组
# 这里 one_hot_label 设为了 False，所以每个标签的值是一个数而不是一个 10 项数组
def get_data():
    (x_train, t_train), (x_test, t_test) = load_mnist(normalize=True, flatten=True, one_hot_label=False)
    return x_test, t_test


# 读入保存 sample_weight.pkl 中的学习到的权重参数(假设学习已经完成，并将学习到的参数保存在这里)。
# 这个文件中以字典变量的形式保存了权重和偏置参数。
def init_network():
    with open("sample_weight.pkl", 'rb') as f:
        network = pickle.load(f)
    return network


# 输入之前神经网络学习到的权重和偏置，并接受一个图像数据，演算并推测结果
# predict() 函数以 NumPy 数组的形式输出各个标签对应的概率。比如输出[0.1, 0.3, 0.2, ..., 0.04] 
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
network = init_network()  # 生成神经网络，也就是之前学习到的权重和偏置
accuracy_cnt = 0

# 遍历所有图像
for i in range(len(x)):
    # 表示当前图像预测结果的一个 10 项数组，每一个项对应这个数的可能概率
    y = predict(network, x[i])
    # 获取概率最高的元素的索引，也就是说，神经网络判断图像中的数字最有可能为 p。
    # 注意 np.argmax 函数获得的不是值而是索引。但实际上这里的值恰好就是索引。
    p = np.argmax(y)
    if p == t[i]:
        # 对比标签，如果真的为 p ，则准确次数加一
        accuracy_cnt += 1

# 输出准确率
print("Accuracy:" + str(float(accuracy_cnt) / len(x))) # Accuracy:0.9352
