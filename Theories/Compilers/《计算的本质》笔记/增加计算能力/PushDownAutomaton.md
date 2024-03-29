# 确定性下推自动机
Deterministic PushDown Automaton，DPDA


## 有限自动机的局限
1. 有限自动机的状态是有限的，并且存储也是有限的，因此没法跟踪任意数量的信息。
2. 自带栈的有限状态机叫作 **下推自动机**（PushDown Automaton，PDA），如果这台机器的规则是确定性的，我们就叫它 **确定性下推自动机**（Deterministic PushDown Automaton，DPDA）。


## 规则


## 确定性
### 没有二义性
对于同样的状态和同样的栈顶字符没有其他规则可用就可以，否则在确定一个字符是否应该从输入读取的时候会产生二义性。

### 支持停滞状态
1. DFA 还有 “不能有遗漏” 的约束（每一个可能的情况都应该有一个规则），但是因为状态、输入字符和栈顶字符有大量可能的组合，所以这对于 DPDA 来说很难处理。
2. 通常只是忽略这个约束并允许 DPDA 只定义完成工作所需的规则，并且假定一台 DPDA 在没有规则可用时将进入 **停滞状态**。
3. 我们的平衡括号 DPDA 在读取 `')'` 或 `'())'` 这样的字符串时会进入这种情况，因为处于状态 1 且读入一个右括号时没有规则可用。


## 模拟
### 实现栈