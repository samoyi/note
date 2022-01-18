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


## References
* [《代码大全（第2版）》](https://book.douban.com/subject/1477390/)