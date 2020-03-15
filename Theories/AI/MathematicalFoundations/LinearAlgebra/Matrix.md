# Matrix


<!-- TOC -->

- [Matrix](#matrix)
    - [思想](#思想)
    - [1. 运算](#1-运算)
        - [1.1 矩阵的乘积](#11-矩阵的乘积)
        - [1.2 Hadamard 乘积](#12-hadamard-乘积)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 矩阵是数的阵列。
2. 矩阵本身并没有什么意义，但我们对它制定了意义，以及相关的运算法则，矩阵就变得很有用。
3. 就像矩阵的乘看起来很奇怪，但因为这么规定很有用，所以就这么规定了。
4. 这么规定之后，现实中的一些事物的变化，就可以用矩阵的模型来表示了。

## 1. 运算
### 1.1 矩阵的乘积
1. **单位矩阵**对角线上的元素 $a_{ii}$ 为 1、其他元素为 0 的方阵，通常用 $\boldsymbol{E}$ 表示。如

    $\boldsymbol{E}=\begin{pmatrix}1&0\\0&1\end{pmatrix},~\boldsymbol{E}=\begin{pmatrix}1&0&0\\0&1&0\\0&0&1\end{pmatrix}$
    
2. 除了例外情况下，不满足交换律。一个有规律性的例外情况是，两个矩阵是维数相同的方阵且其中之一是单位矩阵的常数倍。

### 1.2 Hadamard 乘积
1. 对于相同形状的矩阵 $\boldsymbol{A}$、$\boldsymbol{B}$，将相同位置的元素相乘，由此产生的矩阵称为矩阵 $\boldsymbol{A}$、$\boldsymbol{B}$ 的 **Hadamard 乘积**，用 $\boldsymbol{A}\odot\boldsymbol{B}$ 表示。
2. 例如当 $\boldsymbol{A}=\begin{pmatrix}2&7\\1&8\end{pmatrix}$，$\boldsymbol{B}=\begin{pmatrix}2&8\\1&3\end{pmatrix}$ 时，$\boldsymbol{A}\odot\boldsymbol{B}=\begin{pmatrix}2\cdot2&7\cdot8\\1\cdot1&8\cdot3\end{pmatrix}=\begin{pmatrix}4&56\\1&24\end{pmatrix}$


## References
* [《深度学习的数学》](https://book.douban.com/subject/33414479/)





