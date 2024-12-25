# coding: utf-8
try:
    import urllib.request
except ImportError:
    raise ImportError('You should use Python 3.x')
import os.path
import gzip
import pickle
import os
import numpy as np

# 官网下载已经失效，这里直接使用之前的 .pkl 文件
url_base = 'https://yann.lecun.com/exdb/mnist/'
key_file = {
    'train_img':'train-images-idx3-ubyte.gz',
    'train_label':'train-labels-idx1-ubyte.gz',
    'test_img':'t10k-images-idx3-ubyte.gz',
    'test_label':'t10k-labels-idx1-ubyte.gz'
}

# os.path.dirname() method is used to get the directory name from the specified path.
# os.path.abspath() returns a normalized absolutized version of the pathname path.
# 一个模块的 .__file__ 属性的值是该模块所在文件的绝对路径。但这里 __file__ 作为属性，看起来就应该是指当前文件的绝对路径。实际测试也是这个结果。但 __file__ 已经是绝对路径了，为什么还要再使用 os.path.abspath() 呢？看到说 os.path.abspath() 的 normalized 是指使用 os.chdir() 改变 cwd 之后仍然成立，但我改变了 cwd，发现不管是否使用 os.path.abspath() 都没啥区别。
# 那么最终，dataset_dir 就是当前文件所在目录
dataset_dir = os.path.dirname(os.path.abspath(__file__))
# 下载好的数据会保存到下面的 .pkl 文件中，之后直接使用本地的
save_file = dataset_dir + "/mnist.pkl"

train_num = 60000
test_num = 10000
img_dim = (1, 28, 28)
img_size = 784


# 下载一个远程文件
def _download(file_name):
    # 下载下来的暂存路径
    file_path = dataset_dir + "/" + file_name
    
    if os.path.exists(file_path):
        return

    print("Downloading " + file_name + " ... ")
    urllib.request.urlretrieve(url_base + file_name, file_path)
    print("Done")
    
# 从远程下载若干个数据文件
def download_mnist():
    for v in key_file.values():
    # 具体下载每一个远程文件
       _download(v)
        
# 把下载标签文件转换为 NumPy 数组形式
def _load_label(file_name):
    file_path = dataset_dir + "/" + file_name
    
    print("Converting " + file_name + " to NumPy Array ...")
    with gzip.open(file_path, 'rb') as f:
            labels = np.frombuffer(f.read(), np.uint8, offset=8)
    print("Done")
    
    return labels

# 把下载图片文件转换为 NumPy 数组形式
def _load_img(file_name):
    file_path = dataset_dir + "/" + file_name
    
    print("Converting " + file_name + " to NumPy Array ...")    
    with gzip.open(file_path, 'rb') as f:
            data = np.frombuffer(f.read(), np.uint8, offset=16)
    data = data.reshape(-1, img_size)
    print("Done")
    
    return data
    
# 把下载图片文件转换为 NumPy 数组形式，把下载标签文件转换为 NumPy 数组形式
def _convert_numpy():
    dataset = {}
    dataset['train_img'] =  _load_img(key_file['train_img'])
    dataset['train_label'] = _load_label(key_file['train_label'])    
    dataset['test_img'] = _load_img(key_file['test_img'])
    dataset['test_label'] = _load_label(key_file['test_label'])
    
    return dataset

# 如果初次加载，不存在 .pkl 文件，则调用 init_mnist 从远程下载数据并创建 .pkl 文件
def init_mnist():
    # 从远程下载若干个数据文件
    download_mnist()
    # 把下载图片文件转换为 NumPy 数组形式，把下载标签文件转换为 NumPy 数组形式，都保存进 dataset
    dataset = _convert_numpy()
    print("Creating pickle file ...")
    # 把 dataset 的数据创建为 .pkl 文件
    with open(save_file, 'wb') as f:
        pickle.dump(dataset, f, -1)
    # 创建好 .pkl 文件，下载的那四个数据文件就不需要了
    print("Done!")

def _change_one_hot_label(X):
    # X 是一维数组，每个数组项是一个数字，例如 5。这里要把它的每一项从一个数转为一个一维十项的数组，例如把 5 转为 [0, 0, 0, 0, 0, 1, 0, 0, 0, 0]
    T = np.zeros((X.size, 10))
    # 数组转为可枚举对象后，for...in 可以使用 索引和值 两个变量
    for idx, row in enumerate(T):
        row[X[idx]] = 1
        
    return T
    

def load_mnist(normalize=True, flatten=True, one_hot_label=False):
    """读入MNIST数据集
    
    Parameters
    ----------
    normalize : 将图像的像素值正规化为0.0~1.0
    one_hot_label : 
        one_hot_label为True的情况下，标签作为one-hot数组返回
        one-hot数组是指[0,0,1,0,0,0,0,0,0,0]这样的数组
    flatten : 是否将图像展开为一维数组
    
    Returns
    -------
    (训练图像, 训练标签), (测试图像, 测试标签)
    """

    # 如果初次加载，不存在 .pkl 文件，则调用 init_mnist 从远程下载数据并创建 .pkl 文件
    if not os.path.exists(save_file):
        init_mnist()
        
    # 读取刚创建的或更早创建的 .pkl 文件，获得里面的数据 dataset
    with open(save_file, 'rb') as f:
        dataset = pickle.load(f)
    
    if normalize:
        for key in ('train_img', 'test_img'):
            # 为什么要先转型，不懂
            dataset[key] = dataset[key].astype(np.float32)
            dataset[key] /= 255.0
            
    if one_hot_label:
        dataset['train_label'] = _change_one_hot_label(dataset['train_label'])
        dataset['test_label'] = _change_one_hot_label(dataset['test_label'])
    
    if not flatten:
         for key in ('train_img', 'test_img'):
            # 1. 某个维度参数传 -1 是让 NumPy 自己计算这个维度应该是几。
            # 2. 例如下面的例子，前两个传了 2，那第三个只能也是 2 才行
            #     ```py
            #     arr = np.array([1, 2, 3, 4, 5, 6, 7, 8])
            #     newarr = arr.reshape(2, 2, -1)

            #     print(newarr)
            #     # [
            #     #     [
            #     #         [1 2]
            #     #         [3 4]
            #     #     ]
            #     #     [
            #     #         [5 6]
            #     #         [7 8]
            #     #     ]
            #     # ]

            #     print(newarr.shape) 
            #     # (2, 2, 2)
            #     ```
            # 3. -1 不一定要写在最后一位，其他地方也可以
            #     ```py
            #     arr.reshape(2, 2, -1)
            #     ```
            # 4. 如果确定的维度已经够了，那 -1 还会建一个单独的单项数组。下面本来 3x3 数组就刚好，但因为传了 -1，所以又把这个 3x3 数组整体放到一个数组里
            #     ```py
            #     arr = np.array([1, 2, 3, 4, 5, 6, 7, 8, 3])
            #     # newarr = arr.reshape(3, 3, -1)
            #     newarr = arr.reshape(-1, 3, 3)

            #     print(newarr)
            #     # [
            #     #     [
            #     #         [1 2 3]
            #     #         [4 5 6]
            #     #         [7 8 3]
            #     #     ]
            #     # ]

            #     print(newarr.shape) 
            #     # (1, 3, 3)
            #     ```
            #     如果 -1 在最后，则会把每个数都变成一个单项数组
            #     ```py
            #     newarr = arr.reshape(3, 3, -1)
            #     print(newarr)
            #     # [
            #     #     [
            #     #         [1]
            #     #         [2]
            #     #         [3]
            #     #     ]
            #     #     [
            #     #         [4]
            #     #         [5]
            #     #         [6]
            #     #     ]
            #     #     [
            #     #         [7]
            #     #         [8]
            #     #         [3]
            #     #     ]
            #     # ]

            #     print(newarr.shape) 
            #     # (3, 3, 1)
            #     ```
            # 5. 原本每个图像是一个包含 784 个值的单项数组，下面把每个图像改为 (1, 28, 28) 的三维数组。还要再加个 -1，因为 dataset[key] 不是一个图像，而是一组图像，所以 -1 会变成这一组图像的个数。
            dataset[key] = dataset[key].reshape(-1, 1, 28, 28)

    return (dataset['train_img'], dataset['train_label']), (dataset['test_img'], dataset['test_label']) 


if __name__ == '__main__':
    init_mnist()
