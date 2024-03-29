# 算法分析基础


算法分析的基础是 **科学方法**，它是科学家们为获取自然界知识所使用的一系列为大家所认同的方法。我们将会使用 **数学分析** 为算法成本建立简洁的模型并使用 **实验数据** 验证这些模型。


<!-- TOC -->

- [算法分析基础](#算法分析基础)
    - [0. 思想](#0-思想)
        - [科学方法](#科学方法)
        - [异序词检测体现出的四种解题思路](#异序词检测体现出的四种解题思路)
            - [根据定义——清点法](#根据定义清点法)
            - [尝试所有结果——蛮力法](#尝试所有结果蛮力法)
            - [先变形再计算——排序法](#先变形再计算排序法)
            - [发现特征——计数法](#发现特征计数法)
    - [1. 科学方法](#1-科学方法)
    - [何谓算法分析](#何谓算法分析)
        - [算法和程序的区别](#算法和程序的区别)
        - [基于所使用的计算资源](#基于所使用的计算资源)
            - [使用基准分析进行时间分析的例子](#使用基准分析进行时间分析的例子)
        - [基准测试的缺陷](#基准测试的缺陷)
    - [数学模型](#数学模型)
        - [输入规模（input size）和运行时间（running time）](#输入规模input-size和运行时间running-time)
    - [渐近记法（Asymptotic notation）](#渐近记法asymptotic-notation)
        - [$Θ$ 记号](#θ-记号)
        - [$O$ 记号](#o-记号)
        - [$Ω$ 记号](#ω-记号)
        - [$o$ 记号和 $ω$ 记号](#o-记号和-ω-记号)
        - [比较各种函数](#比较各种函数)
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
1. 下面科学方法的笔记摘录自 [算法（第4版）](https://book.douban.com/subject/19952400/)。

### 异序词检测体现出的四种解题思路
#### 根据定义——清点法
1. 异序词的定义就是一个词的所有字母都出现在另一个词里面，只不过顺序可能不一样。那么，就可以根据定义中的 “都出现在另一个词里面” 来实现算法。

#### 尝试所有结果——蛮力法
1. 有时候你希望得出一个类似于解析解的算法，但可能在有限的时间内并不能得出，或者是算法实现起来难度很大。
2. 而这时如果遍历所有结果如果成本不高的话，这反而是一个高效的解决方法，只是看起来没那么酷。但它确实是当前环境下更好的算法。

#### 先变形再计算——排序法
1. 对于问题给的数据，变形为另一种形式，也许就可以用另一个完全不同的计算来解决。
2. 比如排序法中，本来是要计算是否字母都相同，但进行排序变形后，要计算的就变成了相等判断了。
3. 这种方法非常普遍，比如常见的算数问题图形化解答就是这个思路。
4. 直接计算不好计算，变个形也许就好计算了。

#### 发现特征——计数法
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

### 输入规模（input size）和运行时间（running time）
1. In general, the time taken by an algorithm grows with the size of the input, so it is traditional to describe the running time of a program as a function of the size of its input. 
2. To do so, we need to define the terms “**running time**” and “**size of input**” more carefully.
3. The best notion for input size depends on the problem being studied.
4. The running time of an algorithm on a particular input is the number of primitive operations or “steps” executed. 
5. It is convenient to define the notion of step so that it is as machine-independent as possible.
6. For the moment, let us adopt the following view. A constant amount of time is required to execute each line of our pseudocode. One line may take a different amount of time than another line, but we shall assume that each execution of the $i$th line takes time $c_i$, where $c_i$ is a
constant.


## 渐近记法（Asymptotic notation）
1. When we look at input sizes large enough to make only the order of growth of
the running time relevant, we are studying the **asymptotic** efficiency of algorithms.
2. That is, we are concerned with how the running time of an algorithm increases with
the size of the input *in the limit*, as the size of the input increases without bound.
3. Usually, an algorithm that is asymptotically more efficient will be the best choice
for all but very small inputs.

### $Θ$ 记号
1. 看《算法导论》25 页的定义以及 26-27 页的证明。
2. 如果存在正常量  $c_1$ 和 $c_2$，使得对于足够大的 $n$，函数 $f(n)$ 能夹入 $c_1 g(n)$ 和 $c_2 g(n)$ 之间，则 $f(n)$ 属于集合 $Θ(g(n))$。我们称 $g(n)$ 是 $f(n)$ 的一个 **渐近紧确界**（asymptotically tight bound）。
3. 例如，根据《算法导论》27 页的证明，$an^2 + bn + c$ 属于集合 $Θ(n^2)$，那么就说 $an^2 + bn + c$ 的渐进紧确界是 $n^2$。

### $O$ 记号
1. 看《算法导论》27 页的定义。
2. $Θ$ 记号渐近地给出一个函数的上界和下界。当只有一个 **渐近上界** 时，使用 $O$ 记号。
3. 一个打印数组所有值的算法，可以描述为 $O(N)$，但也可以描述为 $O(N^2)$、$O(N^3)$、$O(2^N)$ 或者其他大 $O$ 时间。这个算法运行时间至少和上述任意大 $O$ 一样快。因为上面的那些大 $O$ 是它运行时间的上界。
4. 在工业界中，人们似乎已经把 $Θ$ 和 $O$ 融合了，工业界中大 $O$ 更像是学术界的 $Θ$。
5. 例如使用学术界用法，描述一个算法时可以说：这个算法是 $O(N^2)$ 和 $Ω(\log N)$ 的复杂度，在假设的平均情况下是 $Θ(N)$ 的复杂度。如果用工业界的描述就是：这个算法的复杂度上界是 $O(N^2)$，下界是 $O(\log N)$，平均情况下是 $O(N)$。

### $Ω$ 记号
1. 看《算法导论》28 页的定义。
2. 正如 $O$ 记号提供了一个函数的渐近上界，$Ω$ 记号提供了 **渐近下界**。 
3. 上述打印数组的算法可以描述为 $Ω(N)$、$Ω(\log N)$ 和 $Ω(1)$。毕竟，没有比上述运行时间更快的算法了。
4. 如果一个算法同时是 $O(N)$ 和 $Ω(N)$，它就是 $Θ(N)$。看《算法导论》28 页定理 3.1 及后面的解释。

### $o$ 记号和 $ω$ 记号
1. 注意上面对三个记号的命名，只有 $Θ$ 是 **紧确** 的。另外，$O$ 和 $Ω$ 中打印算法的举例中，上界和下界都不止一个，但是分别都是只有一个才是紧确的，也就是 $O(N)$ 和 $Ω(N)$。
2. 其他那些非紧确的渐近上界和渐近下界，我们可以使用 $o$ 记号和 $ω$ 记号来描述。
3. 例如，你可以说 $2n = O(n^2)$，也可以是说 $2n^2 = O(n^2)$；但是，虽然你可以说 $2n = o(n^2)$，但不能说 $2n^2 = o(n^2)$。

### 比较各种函数
看《算法导论》29 页。

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


## 异序词检测示例
1. 如果一个字符串只是重排了另一个字符串的字符，那么这个字符串就是另一个的异序词，比如 `heart` 与 `earth`，以及 `python` 与 `typhon`。
2. 为了简化问题，假设要检查的两个字符串长度相同，并且都是由 26 个英文字母的小写形式组成的。
3. 我们的目标是编写一个布尔函数，它接受两个字符串，并能判断它们是否为异序词。

### 方案 1：清点法
1. 清点第 1 个字符串的每个字符，看看它们是否都出现在第 2 个字符串中
    ```cpp
    #include <stdio.h>
    #include <stdlib.h>
    #include <stdbool.h>
    #include <string.h>


    #define STR_LEN 5

    char* s1 = "python";
    char* s2 = "typhon";
    // char* s1 = "heart";
    // char* s2 = "earth";

    bool anagramSolution1(char* str1, char* str2, int strSize);


    int main(void) {
        bool result = anagramSolution1(s1, s2, STR_LEN);
        printf("\n%d\n", result);
        return 0;
    }

    bool anagramSolution1(char* str1, char* str2, int strSize) {
        char* ptr1 = (char*)malloc(strSize+1);
        char* ptr2 = (char*)malloc(strSize+1);
        strcpy(ptr1, str1);
        strcpy(ptr2, str2);

        bool stillOK = false;

        for (int i=0; i<strSize; i++) {
            stillOK = false;
            for (int j=0; j<strSize; j++) {
                if (ptr2[j] == ptr1[i]) {
                    ptr2[j] = -1;
                    stillOK = true;
                    break;
                }
            }
            if (!stillOK) {
                free(arr1);
                free(arr2);
                return false;
            }
        }

        free(arr1);
        free(arr2);
        return true;
    }
    ```
2. 这个方法应该是最容易想到的，因为异序词的主要特征就是字母都相同。
3. 如果两个字符串确实是异序词的话，那 `s2` 中的每一个字符都要被内层的 `for` 遍历到，遍历到每个字符的步数就是该字符的 index 再加一。
4. 所以内层遍历的次数就是 $\frac{(1+ n)n}{2}$，时间复杂度是 $O(n^2)$。

### 方案 2：排序法
1. 如果按照字母表顺序给字符排序，异序词得到的结果将是同一个字符串
    ```cpp
    bool anagramSolution2(char* str1, char* str2, int strSize) {
        int* arr1 = (int*)malloc(strSize*sizeof(int));
        int* arr2 = (int*)malloc(strSize*sizeof(int));

        if (arr1 == NULL || arr2 == NULL) {
            printf("malloc failed.\n");
            return false;
        }

        for (int i=0; i<strSize; i++) {
            arr1[i] = str1[i];
            arr2[i] = str2[i];
        }

        merge_sort(arr1, 0, strSize-1);
        merge_sort(arr2, 0, strSize-1);

        for (int i=0; i<strSize; i++) {
            if (arr1[i] != arr2[i]) {
                free(arr1);
                free(arr2);
                return false;
            }
        }

        free(arr1);
        free(arr2);
        
        return true;
    }
    ```
2. 如果不考虑排序，只需要遍历一遍，时间复杂度是 $O(n)$。但是，归并排序的时间复杂度是 $O(n\log n)$，所以排序操作起主导作用。也就是说，该算法和归并排序过程的数量级相同。

### 方案 3：蛮力法
1. 我以为清点法就是蛮力法了，没想到真正的蛮力法是生成第一个字符串的所有异序词！还真没想到这个方法。
2. 因为要遍历所有可能的结果，所以在这个例子，复杂度高达 $n!$。但这也是一个思路，而且也许在某些场景下这还是最优的方法。

### 方案 4：计数法
1. 最后一个方案基于这样一个事实：两个异序词有同样数目的 `a`、同样数目的 `b`、同样数目的 `c`，等等。
2. 要判断两个字符串是否为异序词，先统计一下每个字符出现的次数。因为字符可能有 26 种，所以使用 26 个计数器，对应每个字符。每遇到一个字符，就将对应的计数器加 1。
3. 最后，如果两个计数器列表相同，那么两个字符串肯定是异序词。
    ```cpp
    bool anagramSolution4(char* str1, char* str2, int strSize) {
        int count1[26] = {0};
        int count2[26] = {0};

        for (int i=0; i<strSize; i++) {
            count1[str1[i] - (int)'a']++;
            count2[str2[i] - (int)'a']++;
        }

        for (int i=0; i<26; i++) {
            if (count1[i] != count2[i]) {
                return false;
            }
        }
        
        return true;
    }
    ```
4. 尽管这个方案的执行时间是 $O(n)$ 级别的，它还是要用额外的空间来存储计数器。也就是说，这个算法用空间换来了时间。


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