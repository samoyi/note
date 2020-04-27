# Remove Flag Argument


## 原则
1. 提供 SRP 的接口。一个接口只应该提供一个功能。如果是两个功能，就提供两个接口，不要兼容。
2. 接口的参数只能是作为这个单一功能内部的逻辑分支标志，而不应该作为兼容其他功能的标志。


## 场景
### 接口的参数不应该作为复用的标志
参考 `../BadCodes/SpeculativeGenerality.md` 中关于接口设计的重构场景


## 过度优化


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
