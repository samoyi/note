# Module Specification



***
## `module.exports` vs `exports`
* If you create a module that has both `exports` and `module.exports`, it will
return `module.exports`, but `exports` will be ignored.
* Eventually exproted in the program is `module.exports`, `export` which was
initially defined as a null object to which properties can be added, is simply a
global reference to `module.exports`.
* So `exports.myFunc` is just a shorthand for `module.exports.myFunc`.

如果你创建了一个既有exports又有module.exports的模块，那它会返回
module.exports，而exports会被忽略。
