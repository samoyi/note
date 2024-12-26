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
batch_size = 100 # 批数量
accuracy_cnt = 0

# range(start, end, step)
# >>> list( range(0, 10) )
# [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
# >>> list( range(0, 10, 3) )
# [0, 3, 6, 9]
# 所以 range(0, len(x), batch_size) 是 [0, 100, 200, ... , 9800, 9900]
for i in range(0, len(x), batch_size):
    # 取出一批 100 张图
    x_batch = x[i:i+batch_size]
    # 得出这 100 张图的预测结果
    y_batch = predict(network, x_batch)
    # 现在 y_batch 是二维数组，第一维的每个数组项是一个 10 项数组，第二维的每个数组项是一个数。
    # 如果直接使用 argmax 的话，那就是比较第一维里面的数组项，也就是比较 100 个 10 项数组了，显然不对。
    # 所以需要告诉 argmax 对第二个维度（ axis=1 ）里面的数组项进行比较，也就是对 100 个 10 项数组中的 10 个数求最大值的索引，
    # 最终会得到 100 个最大值的索引，是一个 100 项的一维数组 p。
    # 这样，每批输入 100 个图像数据，会得到 100 个预测结果。
    p = np.argmax(y_batch, axis=1)
    # np.sum 的参数如果是数组，那就是累加数组项的值。但这里的参数是两个数组的相等判断，它累加的就是对应的项相等的次数。例如
    # y = np.array([1, 2, 1, 4])
    # t = np.array([1, 2, 0, 4])
    # print(y==t) # [True True False True]
    # print( np.sum(y==t) ) # 3
    accuracy_cnt += np.sum(p == t[i:i+batch_size])


# 输出准确率
print("Accuracy:" + str(float(accuracy_cnt) / len(x))) # Accuracy:0.9352
