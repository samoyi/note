# Basic


## 基本运算
### Misc
1. 一些运算符  
    $\land$  
    $\lor$  
    $\oplus$  
    $\to$  
    $\lnot q$  
    $\setminus$  
    $\implies$  $\subset$  
    $\supset$
2. 异或的否定等于相等：$(\lnot (A \oplus B))=(A=B)$。异或就是两个不相等，所以它的否定就是两个相等。

### 蕴含（implication）
1. 同一试验下的两个事件 $A$ 和 $B$，若 $A$ 发生时 $B$ 必发生，则称 $A$ 蕴含 $A$。记作 $A \subset B$ 或 $A \implies B$。前者似乎是表示集合时用的符合，后者似乎是表示布尔运算时用到的符号。

#### 真值表
A | B | $A \implies B$
--|--|--
true | true | true
true | false | false
false | true | true
false | false | true

1. 第一行，$A$ 发生了，$B$ 也发生了，符合 $A$ 蕴含 $B$ 的定义，所以为真。
2. 第二行，$A$ 发生了，$B$ 却发生了，不符合 $A$ 蕴含 $B$ 的定义，所以为假。
3. 后两行，$A$ 直接没有发生，看起来连定义的前提都不满足。不过这两种情况都认为是真。
4. 看一下文氏图，除了第二行以外的情况都是 true
    <img src="./images/01.png" width="200" style="display: block; margin: 5px 0 10px;" />
5. 没有涂红的情况，正好就是 “A 发生了 B 却没有发生”。

### 一些计算
#### $\lnot (A \land B)$ 等于 $(\lnot A) \lor (\lnot B)$
1. 前者的意思是：A 和 B 不同时为 true，当然也可以都不为 true。
2. 后者的意思是：A 不为 true 或者 B 不为 true。
3. 两者同意。这一相等的规律被称为 **德·摩根定律**（De Morgan's laws）

#### $\lnot (A \oplus B)$ 等于 $A = B$
$A \oplus B$ 是 A、B 相异，$\lnot (A \oplus B)$ 就是 A、B 相同。

#### $A \implies B$ 等于 $(\lnot A) \lor B$
1. 可以先通过文氏图来验证这一点，直接看书《程序员的数学》图 2-22
2. $\lnot A$ 就是蕴含的真值表的后两行，而 B 为 true 则是真值表的第一行。
3. 也就是受，要么就 A 为 false，直接让蕴含关系前提不满足，从而为 true；要么就 A 为 true 但是 B 也为 true，这就是标准的蕴含。

#### 思考 $(\lnot B) \implies (\lnot A)$ 的文氏图
1. 根据蕴含真值表的后两行，$\lnot B$ 直接为 false 时则蕴涵关系为真。也就是 B 为 true 时。
2. 根据蕴含真值表的第一行，$\lnot A$ 为 true 时蕴涵关系也为真。也就是 A 为 false。
3. 所以文氏图中的阴影部分就应该是 $B \lor (\lnot A)$


## 两个值四种组合，所有的逻辑关系
1. A 和 B 可以举出的 true / false 组合，一共有四种：
    A | B
    --|--
    true | true
    true | false
    false | true
    false | fales
2. 而根据不同的逻辑运算规则，每种组合的运算结果也有 true / false 两种。
3. 比如同样是组合 true true：如果进行 $\land$ 运算，那结果是 true；但如果进行 $\oplus$ 运算，结果就是 false。
4. A、B 有四种组合，每种组合又有两种运算结果。那么，A、B 两个值就可以表示出 $2^4$ 种计算情况。
5. 看书《程序员的数学》图 2-25，四个空位，每个空位可能是 true 或 false，一共有 16 种可能。
6. 这正好对应了一个四位的二进制数！四个数位要么是 1 要么是 0。这个四位的二进制数也一共可以表示 16 个值。