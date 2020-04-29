# Regression Analysis


## 什么是回归分析
1. 由多个变量组成的数据中，着眼于其中一个特定的变量，用其余的变量来解释这个特定的变量，这样的方法称为回归分析。
2. 看一下最简单的一元线性回归分析。一元线性回归分析是以两个变量组成的数据为考察对象的，下图给出了一系列的 x、y 的数据以及它们的散点图
    <img src="./images/01.png" width="400" style="display: block;" />
3. 我们可以看出来这些数据大致呈现线性分布。（不过现实中也有很多数据并不能直接看出分布规律）
4. 那么，我们如果能构建出一个线性方程，让它的图像尽可能的拟合这些数据的分布，就像下图这样
    <img src="./images/02.png" width="400" style="display: block;" />
5. 这条近似地表示点列的直线称为**回归直线**。它对应的方程就是**回归方程**，表示为如下：

    $y=px+q　（p、q 为常数）$

6. $x$、$y$ 是为了将构成数据的各个值代入而设定的变量，对应一个个的数据点。常数 $p$、$q$ 是这个回归分析模型的参数，由给出的数据来决定。$p$ 称为回归系数，$q$ 称为截距。
7. 回归分析就是要确定方程的 $p$、$q$ 。


## 一元线性回归一例
1. 根据这些数据，求以体重 $y$ 为因变量、身高 $x$ 为自变量的回归方程 $y=px+q$ （$p$、$q$ 为常数）。
    <img src="./images/03.png" width="600" style="display: block;" />
2. 将第 $k$ 个学生的身高记为 $x_k$，体重记为 $y_k$，可以求得第 $k$ 个学生的回归分析预测的值（称为预测值）
    <img src="./images/04.png" width="600" style="display: block;" />
3. 如下图所示，可以计算出某个实际的体重值 $y_k$ 和预测值的差距 $e_k=y_k-(px_k+q)$ 
    <img src="./images/05.png" width="600" style="display: block;" />
4. 计算**平方误差** $C_k$

    $C_k=\frac{1}{2}(e_k)^2=\frac{1}{2}(y_k-(px_k+q))^2$


5. 遍历全体数据，将它们的平方误差加起来，假设得到的值为 $C_{{\rm T}}$。

    $C_{{\rm T}}=C_1+C_2+\cdots+C_7$

6. 带入实际的数据

    $\begin{aligned}C_{{\rm T}}=&\frac{1}{2}(45.5-(153.3p+q))^2+\frac{1}{2}(56.0-(164.9p+q))^2\\&+\cdots+\frac{1}{2}(50.8-(156.7p+q))^2-\frac{1}{2}(56.4-(161.1p+q))^2\end{aligned}$

7. $C_{{\rm T}}$ 可以理解为回归方程和实际数据的误差，我们要使得这个误差尽可能的小，也就是要求 $C_{{\rm T}}$ 的最小值。
8. $C_{{\rm T}}$是一个二元函数，求它的最小值，我们可以通过求它导数为0时的变量值来确定。即

    $\frac{\partial C_{{\rm T}}}{\partial p}=0,~\frac{\partial C_{{\rm T}}}{\partial q}=0$

<img src="./images/06.png" width="600" style="display: block;" />

9. 可以看出来，这一过程的本质实际上就是神经网络确定最优参数和偏置的过程。