# 算法分析基础


算法分析的基础是 **科学方法**，它是科学家们为获取自然界知识所使用的一系列为大家所认同的方法。我们将会使用 **数学分析** 为算法成本建立简洁的模型并使用 **实验数据** 验证这些模型。


<!-- TOC -->

- [算法分析基础](#算法分析基础)
    - [0. 思想](#0-思想)
        - [科学方法](#科学方法)
        - [异序词检测体现出的四种解题思路](#异序词检测体现出的四种解题思路)
            - [清点法——根据定义](#清点法根据定义)
            - [蛮力法——尝试所有结果](#蛮力法尝试所有结果)
            - [排序法——先变形再计算](#排序法先变形再计算)
            - [计数法——发现特征](#计数法发现特征)
    - [1. 科学方法](#1-科学方法)
    - [何谓算法分析](#何谓算法分析)
        - [算法和程序的区别](#算法和程序的区别)
        - [基于所使用的计算资源](#基于所使用的计算资源)
            - [使用基准分析进行时间分析的例子](#使用基准分析进行时间分析的例子)
        - [基准测试的缺陷](#基准测试的缺陷)
    - [数学模型](#数学模型)
        - [输入规模和运行时间](#输入规模和运行时间)
        - [使用步骤数来描述一个算法的复杂度](#使用步骤数来描述一个算法的复杂度)
        - [大 $O$、大 $θ$ 和大 $Ω$](#大-o大-θ-和大-ω)
        - [大 O 记法——取函数的数量级函数用来近似计算复杂度，和求极限原理相同](#大-o-记法取函数的数量级函数用来近似计算复杂度和求极限原理相同)
        - [数据对算法性能的影响](#数据对算法性能的影响)
        - [最坏情况、最好情况和平均情况的评估选择](#最坏情况最好情况和平均情况的评估选择)
        - [常见的大 O 函数](#常见的大-o-函数)
        - [一例](#一例)
        - [异序词检测示例](#异序词检测示例)
            - [方案 1：清点法](#方案-1清点法)
            - [方案 2：排序法](#方案-2排序法)
            - [方案 3：蛮力法](#方案-3蛮力法)
            - [方案 4：计数法](#方案-4计数法)
    - [时间与空间](#时间与空间)
    - [习题](#习题)
        - [算法（第4版）1.4.12](#算法第4版1412)
        - [算法（第4版）1.4.16](#算法第4版1416)
            - [直接比较——平方复杂度](#直接比较平方复杂度)
            - [先排序——复杂度取决于排序算法](#先排序复杂度取决于排序算法)
        - [算法（第4版）1.4.17](#算法第4版1417)
    - [TODO](#todo)
        - [算法（第4版）1.4.18 及之后的 1.4.* 的练习](#算法第4版1418-及之后的-14-的练习)
    - [References](#references)

<!-- /TOC -->


## 0. 思想
### 科学方法
1. 下面科学方法的笔记摘录自 [算法（第4版）](https://book.douban.com/subject/19952400/)，说的真好。
2. 虽然是出自一本算法的书，但是显然这是所有科学通用的方法思想。

### 异序词检测体现出的四种解题思路
#### 清点法——根据定义
1. 异序词的定义就是一个词的所有字母都出现在另一个词里面，只不过顺序可能不一样。那么，就可以根据定义中的 “都出现在另一个词里面” 来实现算法。

#### 蛮力法——尝试所有结果
1. 有时候你希望得出一个类似于解析解的算法，但可能在有限的时间内并不能得出，或者是算法实现起来难度很大。
2. 而这时如果遍历所有结果如果成本不高的话，这反而是一个高效的解决方法，只是看起来没那么酷。但它确实是当前环境下更好的算法。

#### 排序法——先变形再计算
1. 对于问题给的数据，变形为另一种形式，也许就可以用另一个完全不同的计算来解决。
2. 比如排序法中，本来是要计算是否字母都相同，但进行排序变形后，要计算的就变成了相等判断了。
3. 这种方法非常普遍，比如常见的算数问题图形化解答就是这个思路。
4. 直接计算不好计算，变个形也许就好计算了。

#### 计数法——发现特征
1. 对于异序词，立刻会想到的特征大概就是长度相同、字符都可以对应找到。
2. 但相同字符个数相同这个特征，就要继续探索一下才能发现。而一旦发现这个特征，就找到了一种新的解决思路。


## 1. 科学方法
1. 科学家用来理解自然世界的方法对于研究计算机程序的运行时间同样有效：
    1. 细致地 **观察** 真实世界的特点，通常还要有精确的测量；
    2. 根据观察结果提出 **假设** 模型；
    3. 根据模型 **预测** 未来的事件；
    4. 继续观察并 **核实** 预测的准确性；
    5. 如此反复直到确认预测和观察一致。
2. 科学方法的一条关键原则是我们所设计的实验必须是 **可重现** 的，这样他人也可以自己验证假设的真实性。
3. 所有的假设也必须是 **可证伪** 的，这样我们才能确认某个假设是错误的（并需要修正）。正如爱因斯坦的一句名言所说：“再多的实验也不一定能够证明我是对的，但只需要一个实验就能证明我是错的。”
4. 我们永远也没法知道某个假设是否绝对正确，我们只能验证它和我们的观察的一致性。


## 何谓算法分析
### 算法和程序的区别
1. 程序和它所代表的算法是不同的。
2. 算法是为逐步解决问题而设计的一系列通用指令。给定某个输入，算法能得到对应的结果——算法就是解决问题的方法。
3. 程序则是用某种编程语言对算法编码。
4. 同一个算法可以对应许多程序，这取决于程序员和编程语言。
5. 算法分析是一种独立于实现的算法度量方法。

### 基于所使用的计算资源
1. 算法分析关心的是基于所使用的计算资源比较算法。我们说甲算法比乙算法好，依据是甲算法有更高的资源利用率或使用更少的资源。
2. 如果有两个算法的编程实践，一个可读性好一个可读性差，但只要它们对计算资源的利用情况相同，那么在算法分析的层面上，它们是相同的。
3. 计算资源究竟指什么？思考这个问题很重要。有两种思考方式。一是考虑算法在解决问题时要占用的空间或内存。解决方案所需的空间总量一般由问题实例本身决定，但算法往往也会有特定的空间需求。另一种思考方式是根据算法执行所需的时间进行分析和比较。这个指标有时称作算法的执行时间或运行时间。

#### 使用基准分析进行时间分析的例子
1. 需求是计算前 n 个自然数之和。
2. 先用累加算法计算并进行基准分析
    ```py
    import time

    def sumOfN1(n):
        start = time.time()

        theSum = 0
        for i in range(1, n+1):
            theSum = theSum + i

        end = time.time()

        return theSum, end-start


    for i in range(5):
        print("Sum is %d required %10.7f seconds" % sumOfN1(10000))

    # Sum is 50005000 required  0.0009973 seconds
    # Sum is 50005000 required  0.0000000 seconds
    # Sum is 50005000 required  0.0009973 seconds
    # Sum is 50005000 required  0.0010083 seconds
    # Sum is 50005000 required  0.0009875 seconds
    ```
3. 而且如果增加 n 的值，计算时间也会相应增长
    ```py
    for i in range(5):
        print("Sum is %d required %10.7f seconds" % sumOfN1(100000))

    # Sum is 5000050000 required  0.0049865 seconds
    # Sum is 5000050000 required  0.0049884 seconds
    # Sum is 5000050000 required  0.0050058 seconds
    # Sum is 5000050000 required  0.0069606 seconds
    # Sum is 5000050000 required  0.0059812 seconds
    ```
4. 但是如果使用下面求和公式的算法来计算，时间已经少到了无法正常显示，而且增大 n 也不会有耗时上的变化
    ```py
    import time

    def sumOfN2(n):
        start = time.time()

        theSum = (n*(n+1))/2

        end = time.time()

        return theSum, end-start


    for i in range(5):
        print("Sum is %d required %10.7f seconds" % sumOfN2(10000))

    # Sum is 50005000 required  0.0000000 seconds
    # Sum is 50005000 required  0.0000000 seconds
    # Sum is 50005000 required  0.0000000 seconds
    # Sum is 50005000 required  0.0000000 seconds
    # Sum is 50005000 required  0.0000000 seconds
    ```

### 基准测试的缺陷
1. 这里有个问题。如果在另一台计算机上运行这个函数，或用另一种编程语言来实现，很可能会得到不同的结果。如果计算机再旧些，`sumOfN1` 的执行时间也会更长。
2. 可以看出来，基准测试计算的是执行算法的实际时间。这不是一个有用的指标，因为它依赖于特定的计算机、程序、时间、编译器与编程语言。
3. 所以，我们需要更好的方式来描述算法的执行时间。我们希望找到一个独立于程序或计算机的指标。这样的指标在评价算法方面会更有用，可以用来比较不同实现下的算法。


## 数学模型
1. 在计算机科学的早期，D. E. Knuth 认为，尽管有许多复杂的因素影响着我们对程序的运行时间的理解，原则上我们仍然可能构造出一个数学模型来描述任意程序的运行时间。
2. Knuth 的基本见地很简单——一个程序运行的总时间主要和两点有关：
    * 执行每条语句的耗时；
    * 执行每条语句的频率。
3. 前者取决于计算机、Java 编译器和操作系统，后者取决于程序本身和输入。
4. 如果对于程序的所有部分我们都知道了这些性质，可以将它们相乘并将程序中所有指令的成本相加得到总运行时间。

### 输入规模和运行时间
1. In general, the time taken by an algorithm grows with the size of the input, so it is traditional to describe the running time of a program as a function of the size of its input. 
2. To do so, we need to define the terms “running time” and “size of input” more carefully.
3. The best notion for **input size** depends on the problem being studied.
4. The **running time** of an algorithm on a particular input is the number of primitive operations or “steps” executed. 
5. It is convenient to define the notion of step so that it is as machine-independent as possible. 6. For the moment, let us adopt the following view. A constant amount of time is required to execute each line of our pseudocode. One line may take a different amount of time than another line, but we shall assume that each execution of the $i$th line takes time $c_i$, where $c_i$ is a
constant.

### 使用步骤数来描述一个算法的复杂度
1. 试图摆脱程序或计算机的影响而描述算法的效率时，量化算法的操作或步骤很重要。
2. 如果将每一步看成基本计算单位，那么可以将算法的执行时间描述成解决问题所需的步骤数。
3. 确定合适的基本计算单位很复杂，也依赖于算法的实现。
4. 对于累加算法，计算总和所用的赋值语句的数目就是一个很好的基本计算单位。在 `sumOfN1` 函数中，赋值语句数是 1（`theSum = 0`）加上 n（`theSum = theSum + i` 的运行次数）。
5. 可以将其定义成函数 `T`，令 `T(n)=1+n`。参数 `n` 常被称作 **问题规模**，可以将函数解读为 “当问题规模为 `n` 时，解决问题所需的时间是 `T(n)`，即需要 `1+n` 步”。

### 大 $O$、大 $θ$ 和大 $Ω$
1. 学术界用大 $O$、大 $θ$（theta）和大 $Ω$（omega）来描述运行时间。
    * $O$（big O）：学术界用大 $O$ 描述时间的上界。一个打印数组所有值的算法，可以描述为 $O(N)$，但也可以描述为 $O(N^2)$、$O(N^3)$、$O(2^N)$ 或者其他大 $O$ 时间。这个算法运行时间至少和上述任意大 $O$ 一样快。因为上面的那些大 $O$ 是它运行时间的上界。
    * $Ω$（big omega）：在学术界，$Ω$ 描述时间的下界。上述简单算法可以描述为 $Ω(N)$、$Ω(\log N)$ 和 $Ω(1)$。毕竟，没有比上述运行时间更快的算法了。
    * $θ$（big theta）：学术界用 $θ$ 同时表示 $O$ 和 $Ω$，即如果一个算法同时是 $O(N)$ 和 $Ω(N)$，它才是 $θ(N)$，$θ$ 代表的是确界。
2. 在工业界中，人们似乎已经把 $θ$ 和 $O$ 融合了，工业界中大 $O$ 更像是学术界的 $θ$。
3. 例如使用学术界用法，描述一个算法时可以说：这个算法是 $O(N^2)$ 和 $Ω(\log N)$ 的复杂度，在假设的平均情况下是 $θ(N)$ 的复杂度。如果用工业界的描述就是：这个算法的复杂度上界是 $O(N^2)$，下界是 $O(\log N)$，平均情况下是 $O(N)$。

### 大 O 记法——取函数的数量级函数用来近似计算复杂度，和求极限原理相同
1. 精确的步骤数并没有 $T(n)$ 函数中起决定性作用的部分重要。也就是说，随着问题规模的增长，$T(n)$ 函数的某一部分会比其余部分增长得更快。最后比较的其实就是这一起决定性作用的部分。
2. 数量级函数描述的就是，当 $n$ 增长时，$T(n)$ 增长最快的部分。**数量级**（order of magnitude）常被称作 **大O记法**（O 指 order），记作 $O(f(n))$。
3. 它提供了步骤数的一个有用的近似方法。$f(n)$ 函数为 $T(n)$ 函数中起决定性作用的部分提供了简单的表示。
4. 对于 $T(n)=1+n$，随着 $n$ 越来越大，常数 $1$ 对最终结果的影响越来越小。如果要给出 $T(n)$ 的近似值，可以舍去 $1$，直接说执行时间是 $O(n)$。
5. 再举个例子，假设某算法的步骤数是 $T(n)=5n^2+27n+1005$。当 $n$ 很小时，比如说 $1$ 或 $2$，常数 $1005$看起来是这个函数中起决定性作用的部分。
6. 然而，随 $n$ 着增长，$n^2$ 变得更重要。实际上，当 $n$ 很大时，另两项的作用对于最终结果来说就不显著了，因此可以忽略这两项，只关注 $5n^2$。另外，当 $n$ 变大时，系数 $5$ 的作用也不显著了。
7. 因此可以说，函数 $T(n)$ 的数量级是 $f(n)=n^2$，或者直接说是 $O(n^2)$。

### 数据对算法性能的影响
1. 算法的性能有时不仅依赖于问题规模，还依赖于数据值。
2. 对于这种算法，要用 **最坏情况**、**最好情况** 和 **普通情况** 来描述性能。
3. 最坏情况指的是某一个数据集会让算法的性能极差；另一个数据集可能会让同一个算法的性能极好（最好情况）。大部分情况下，算法的性能介于两个极端之间（普通情况）。
4. 计算机科学家要理解这些区别，以免被某个特例误导。

### 最坏情况、最好情况和平均情况的评估选择
1. We shall usually concentrate on finding only the **worst-case** running time, that is, the longest running time for any input of size $n$. 
2. We give three reasons for this orientation
    * **可保证的底线**。The worst-case running time of an algorithm gives us an upper bound on the running time for any input. Knowing it provides a guarantee that the algorithm will never take any longer. We need not make some educated guess about the running time and hope that it never gets much worse.
    * **最坏情况很常见**。For some algorithms, the worst case occurs fairly often. For example, in searching a database for a particular piece of information, the searching algorithm’s worst case will often occur when the information is not present in the database. In some applications, searches for absent information may be frequent
    * **平均情况和最坏情况时常差不了多少**。就插入排序来说，如果每次比较的次数都是最好情况的一半，最终还是平方级别的。


### 常见的大 O 函数
1. 要判断哪一个才是 `T(n)` 的决定性部分，必须了解它们在 `n` 变大时彼此有多大差别。
2. 注意，当 `n` 较小时，这些函数之间的界限不是很明确，很难看出哪个起主导作用。随着 `n` 的增长，它们之间的差别就很明显了。
    <img src="./images/01.png" width="600" style="display: block; margin: 5px 0 10px;" />

### 一例
1. 代码
    ```py
    a = 5
    b = 6
    c = 10
    for i in range(n):
        for j in range(n):
            x = i * i
            y = j * j
            z = i * j
    for k in range(n):
        w = a * k + 45
        v = b * b
    d = 33
    ```
2. 赋值操作的数量是 4 项之和：$T(n)=3+3n^2+2n+1$。
3. 很容易看出来，$n^2$ 起主导作用，所以这段代码的时间复杂度是 $O(n^2)$。当 $n$ 变大时，其他项以及主导项的系数都可以忽略。
4. 下图展示了一部分常见的大 O 函数与这里的 $T(n)$ 函数的对比情况。注意，$T(n)$ 一开始比立方函数大。然而，随着 `n` 的增长，立方函数很快就超越了 `T(n)`。
    <img src="./images/02.png" width="600" style="display: block; margin: 5px 0 10px;" />

### 异序词检测示例
1. 如果一个字符串只是重排了另一个字符串的字符，那么这个字符串就是另一个的异序词，比如 heart 与 earth，以及 python 与 typhon。
2. 为了简化问题，假设要检查的两个字符串长度相同，并且都是由 26 个英文字母的小写形式组成的。
3. 我们的目标是编写一个布尔函数，它接受两个字符串，并能判断它们是否为异序词。

#### 方案 1：清点法
1. 清点第 1 个字符串的每个字符，看看它们是否都出现在第 2 个字符串中。
2. 因为 Python 中的字符串是不可修改的，所以先要将第 2 个字符串转换成列表
    ```py
    def anagramSolution1(s1, s2):
        alist = list(s2)

        pos1 = 0
        stillOK = True

        while pos1 < len(s1) and stillOK:
            pos2 = 0
            found = False
            while pos2 < len(alist) and not found:
                if s1[pos1] == alist[pos2]:
                    found = True
                else:
                    pos2 = pos2 + 1

            if found:
                alist[pos2] = None
            else:
                stillOK = False

            pos1 = pos1 + 1

        return stillOK
    ```
3. 这个方法应该是最容易想到的，因为异序词的主要特征就是字母都相同。
4. 如果两个字符串确实是异序词的话，那 `s2` 中的每一个字符都要被内层的 `while` 遍历到，遍历到每个字符的步数就是该字符的 index 再加一。
5. 所以内层遍历的次数就是 $\frac{(1+ n)n}{2}$，时间复杂度是 $O(n^2)$。

#### 方案 2：排序法
1. 如果按照字母表顺序给字符排序，异序词得到的结果将是同一个字符串
    ```py
    def anagramSolution2(s1, s2):
        alist1 = list(s1)
        alist2 = list(s2)

        alist1.sort()
        alist2.sort()

        pos = 0
        matches = True

        while pos < len(s1) and matches:
            if alist1[pos] == alist2[pos]:
                pos = pos + 1
            else:
                matches = False

    return matches
    ```
2. 如果不考虑排序，看起来只需要遍历一遍，时间复杂度是 $O(n)$。
3. 但是，排序的时间复杂度基本上是 $O(n^2)$ 或 $O(n\log n)$，所以排序操作起主导作用。
4. 也就是说，该算法和排序过程的数量级相同。

#### 方案 3：蛮力法
1. 我以为清点法就是蛮力法了，没想到真正的蛮力法是生成第一个字符串的所有异序词！还真没想到这个方法。
2. 因为要遍历所有可能的结果，所以在这个例子，复杂度高达 $n!$。但这也是一个思路，而且也许在某些场景下这还是最优的方法。

#### 方案 4：计数法
1. 最后一个方案基于这样一个事实：两个异序词有同样数目的 a、同样数目的 b、同样数目的 c，等等。
2. 要判断两个字符串是否为异序词，先统计一下每个字符出现的次数。因为字符可能有 26 种，所以使用 26 个计数器，对应每个字符。每遇到一个字符，就将对应的计数器加 1。
3. 最后，如果两个计数器列表相同，那么两个字符串肯定是异序词。
    ```py
    def anagramSolution4(s1, s2):
        c1 = [0] * 26
        c2 = [0] * 26
            
        for i in range(len(s1)):
            pos = ord(s1[i]) - ord('a')
            c1[pos] = c1[pos] + 1
            
        for i in range(len(s2)):
            pos = ord(s2[i]) - ord('a')
            c2[pos] = c2[pos] + 1
                    
        j = 0
        stillOK = True
        while j < 26 and stillOK:
            if c1[j] == c2[j]:
                j = j + 1
            else:
                stillOK = False
                
        return stillOK
    ```
4. 前两个 `for` 循环的次数都是 n，最后一个 `while` 循环遍历字母表，最多是 26。时间复杂度为 $T(n)=2n+26$，即 $O(n)$。
5. 尽管这个方案的执行时间是线性的，它还是要用额外的空间来存储计数器。也就是说，这个算法用空间换来了时间。


## 时间与空间
1. 大 O 记法只是从时间维度来衡量算法的优劣。不过很多时候，都需要在时间和空间之间进行权衡。
2. 在异序词算法中，因为占用空间不大，所以使用空间换时间是值得的。但如果有些问题的算法会占用很大的空间，那就要另当别论了。
3. 面对多种算法和具体的问题，计算机科学家需要决定如何利用好计算资源。


## 习题
### 算法（第4版）1.4.12
1. 编写一个程序，有序打印给定的两个有序数组（含有 N 个 int 值）中的所有公共元素，程序在最坏情况下所需的运行时间应该和 N 成正比。
2. 实现
    ```js
    function foo ( a, b ) {
        let common = [];

        // 因为两个数组都是升序的，所以在 b 中找到和 a[i] 相同的 b[j] 后，下次就不用再从头在 b 中查找了
        let j = 0;

        for ( let i=0; i < a.length; i++ ) {

            if ( j === b.length ) {
                break;
            }

            // 因为两个数组都是升序，如果 a[i] 小于 b[j]，就不可能有和它相同的了
            if ( a[i] < b[j] ) {
                continue;
            }

            // 逐个在 b 中查找 a[i]
            while ( j < b.length && a[i] > b[j] ) {
                j++;
            }

            // 找到
            if ( j < b.length && a[i] === b[j] ) {
                common.push( b[j] );
            }
        }

        return common;
    }


    let arr1 = [1, 3, 4, 6, 8, 12, 13, 14, 16, 20];
    let arr2 = [3, 4, 8, 9, 11, 14, 15, 17, 18, 19];
    console.log( foo( w1, w2 ) );
    ```

### 算法（第4版）1.4.16
编写一个程序，给定一个含有 N 个 double 值的数组 a[]，在其中找到一对最接近的值：两者之差（绝对值）最小的两个数。程序在最坏情况下所需的运行时间应该是线性对数级别的。

#### 直接比较——平方复杂度
1. 首先想到的是平方复杂度的方法，也就是遍历数组，用每一项和它后面的进行比较
    ```js
    function foo ( arr ) {
        let min = Number.POSITIVE_INFINITY;
        let indexes = [];

        for ( let i=0; i<arr.length-1; i++ ) {
            for ( let j=i+1; j<arr.length; j++ ) {
                let abs = Math.abs(arr[i] - arr[j]);
                if ( abs < min ) {
                    min = abs;
                    indexes = [i, j]
                }
            }
        }

        return {
            indexes,
            ints: [arr[indexes[0]], arr[indexes[1]]],
            min,
        };
    }
    ```
2. 步骤数的函数是 $T(n) = \frac{1}{2}n^2 - \frac{1}{2}n$。

#### 先排序——复杂度取决于排序算法
1. 实现
    ```js
    function foo ( arr ) {
        let min = Number.POSITIVE_INFINITY;
        let ints = [];

        arr.sort( (m, n) => {
            return m - n;
        });

        for ( let i=1; i<arr.length; i++ ) {
            let abs = arr[i] - arr[i-1];
            if ( abs < min ) {
                min = abs;
                ints = [arr[i-1], arr[i]] 
            }
        }

        return ints;
    }
    ```
2. 后面循环部分的复杂度是线性的，复杂度低于前面的排序算法。排序算法如果使用归并排序，复杂度就是线性对数级别的。

### 算法（第4版）1.4.17
1. 编写一个程序，给定一个含有 N 个 double 值的数组 a[]，在其中找到一对最遥远的值：两者之差（绝对值）最大的两个数。程序在最坏情况下所需的运行时间应该是线性级别的。
2. 最容易想到的可能就是先排序然后取头尾，但既然要求最坏情况下线性，那就不能排序了。
3. 不过，如果不需要排序，那么单纯的找到最大值和最小值还是很容易的
    ```js
    function foo ( arr ) {
        let min = arr[0];
        let max = arr[0];

        for ( let i=1; i<arr.length; i++ ) {
            if ( arr[i] > max ) {
                max = arr[i];
            }
            if ( arr[i] < min ) {
                min = arr[i];
            }
        }

        return [min, max];
    }
    ```

## TODO
### 算法（第4版）1.4.18 及之后的 1.4.* 的练习


## References
* [算法（第4版）](https://book.douban.com/subject/19952400/)
* [Python数据结构与算法分析（第2版）](https://book.douban.com/subject/34785178/)
* [算法导论（原书第3版）](https://book.douban.com/subject/20432061/)