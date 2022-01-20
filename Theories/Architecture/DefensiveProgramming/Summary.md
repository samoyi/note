# Summary


1. The idea is based on defensive driving. In defensive driving, you adopt the mind-set that you’re never sure what the other drivers are going to do. That way, you make sure that if they do something dangerous you won’t be hurt. You take responsibility for protecting yourself even when it might be the other driver’s fault. 
2. In defensive programming, the main idea is that if a routine is passed bad data, it won’t be hurt, even if the bad data is another routine’s fault. 
3. More generally, it’s the recognition that programs will have problems and modifications, and that a smart programmer will develop code accordingly.
4. 理想的情况是，如果有错误数据输入到程序，程序必须能够对该错误做出处理和警告。而不应该毫无反应或者让程序发生错误。



## 检查所有外部数据
1. 如果在编写函数，那就要检查函数参数以及函数内直接引用的外部数据。当然要尽量避免直接引用外部数据。
2. 如果在编写某个子程序，也是和编写函数的情况一样。
3. 而对于整个程序来说，外部数据可以包括：
    * 要用到的文件：比如第三方库，比如证书有效期；
    * 用户输入：用户的任何文本输入、交互输入、文件上传等等；
    * 网络输入：调用的网络接口等；
    * 网络情况；不同的网络环境等；
    * 程序执行环境：不同的执行平台等；
    * 产品经理和客户：需求变更等；
    * 政策和法规；
    * 总之就是所有程序代码本身以外的东西。


## 确定在产品代码中保留多少防御式代码
产品阶段需要移除大部分防御式代码，以保证程序的高效和健壮。当仍然需要权衡利弊，保留一些必要的防御式代码。

### 保留检查重要错误的代码
用来检测明显影响使用的错误的代码应该保留，其他的可以移除。

### 不要让程序崩溃，尤其是影响数据的崩溃

### 确认错误消息是友好的
开发阶段的错误消息是面向开发者的，而产品阶段的错误消息则是直接面向用户的。


## 不要过度防御
根据实际情况，考虑每防御的成本和收益。


## CHECKLIST
### General
* Does the routine protect itself from bad input data?
* Have you used assertions to document assumptions, including preconditions and postconditions?
* Have assertions been used only to document conditions that should never occur?
* Does the architecture or high-level design specify a specific set of errorhandling techniques?
* Does the architecture or high-level design specify whether error handling should favor robustness or correctness?
* Have barricades been created to contain the damaging effect of errors and reduce the amount of code that has to be concerned about error processing?
* Have debugging aids been used in the code?
* Have debugging aids been installed in such a way that they can be activated or deactivated without a great deal of fuss?
* Is the amount of defensive programming code appropriate—neither too much nor too little?
* Have you used offensive-programming techniques to make errors difficult to overlook during development?

### Exceptions
* Has your project defined a standardized approach to exception handling?
* Have you considered alternatives to using an exception?
* Is the error handled locally rather than throwing a nonlocal exception, if possible?
* Does the code avoid throwing exceptions in constructors and destructors?
* Are all exceptions at the appropriate levels of abstraction for the routines that throw them?
* Does each exception include all relevant exception background information?
* Is the code free of empty catch blocks? (Or if an empty catch block truly is appropriate, is it documented?)

### Security Issues
* Does the code that checks for bad input data check for attempted buffer overflows, SQL injection, HTML injection, integer overflows, and other malicious inputs?
* Are all error-return codes checked?
* Are all exceptions caught?
* Do error messages avoid providing information that would help an attacker break into the system?


## References
* [《代码大全（第2版）》](https://book.douban.com/subject/1477390/)