# Replace Function with Command

inverse of: *Replace Command with Function*


<!-- TOC -->

- [Replace Function with Command](#replace-function-with-command)
    - [思想](#思想)
    - [Motivation](#motivation)
    - [Mechanics](#mechanics)
    - [References](#references)

<!-- /TOC -->


## 思想
1. 一个函数应该只是执行一个单纯的命令，这是 SRP。
2. 但如果你发现，这个命令执行起来会有其他不少附属操作，那就会变得复杂，你可能会需要其他几个函数来辅助，或者还需要独立的数据结构。
3. 这时自然而然的，就发展出了一个对象。


## Motivation
1. 通过命令模式将函数转换为对象，可以增强函数的功能。与普通的函数相比，命令对象提供了更大的控制灵活性和更强的表达能力。
2. 除了函数调用本身，命令对象还可以支持附加的操作，例如通过保存历史的输入数据来实现撤销和回退功能；还可以通过继承和钩子对函数行为进行定制。
3. 如果使用的编程语言不支持函数作为一等公民但是支持对象作为一等公民，那封装为命令对象就能在一定程度上解决这个问题。
4. 当然，封装为命令对象也增加了复杂度，所以需要权衡利弊。


## Mechanics
从
```js
function score (candidate, medicalExam, scoringGuide) {
    let result = 0;
    let healthLevel = 0;
    // long body code
}
```
到
```js
class Scorer {
    constructor (candidate, medicalExam, scoringGuide) {
        this._candidate = candidate;
        this._medicalExam = medicalExam;
        this._scoringGuide = scoringGuide;

        // 可以再增加一些状态来增强功能，例如保存 `excute` 的历史参数列表
    }

    excute () {
        this._result = 0;
        this._healthLevel = 0;
        // long body code
    }

    // 可以再定义一些方法来增强功能，例如回退
}
```


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
