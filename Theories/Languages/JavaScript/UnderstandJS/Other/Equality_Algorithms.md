# Equality Algorithms

## There are four equality algorithms in ES2015:
* Abstract Equality Comparison (==)
* Strict Equality Comparison (===): used by Array.prototype.indexOf, Array.prototype.lastIndexOf, and case-matching
* SameValueZero: used by %TypedArray% and ArrayBuffer constructors, as well as Map and Set operations, and up-coming String.prototype.includes and Array.prototype.includes in ES2016
* SameValue: used in all other places

## JavaScript provides three different value-comparison operations:
* strict equality (or "triple equals" or "identity") using ===,
* loose equality ("double equals") using ==,
* and Object.is (new in ECMAScript 2015) , SameValue algorithm

```js
console.log( Object.is(NaN, NaN) ); // true
console.log( NaN === NaN );         // false

console.log( Object.is(0, -0) ); // false
console.log( 0 === -0 );         // true
```

## Strict equality using ===
* Strict equality is almost always the correct comparison operation to use.
* For all values except numbers, it uses the obvious semantics: a value is only
equal to itself.
* 虽然 ECMAScript 的数字使用 IEEE 754 的浮点数标准，因此有0和-0的区分，但ECMAScript的标准
规定 `0 === -0` 为`true`
* `NaN`不等于`NaN`看起来就是，`NaN`并不是计算的结果，而是计算发生错误的提示。所以如果
你两个计算都发生了错误，那最多说它们都是错的，但不能说它们是相等的。但是，也不能说他们是
不相等的，值为只有在算对的情况下才可说比较是否相等。所以任何涉及`NaN`的操作都会返回`NaN`
也是很合理的，因为如果返回其他结果，那错误就被掩盖了。但`Object.is`和`===`分别返回`true`
和`false`,就不合理了。感觉出现`NaN`的情况应该改为直接抛出错误。<mark>有待深入</mark>


## Loose equality using ==
It is pretty much never a good idea to use loose equality. The result of a comparison using strict equality is easier to predict, and as no type coercion
takes place the evaluation may be faster.


## Same-value equality
* Same-value equality addresses a final use case: determining whether two values are functionally identical in all contexts.
* Same-value equality is provided by the Object.is method.


## Same-value-zero equality
* Similar to same-value equality, but considered +0 and -0 equal.


## Sameness Comparisons
![https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness](SamenessComparisons.png)



## References
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)
* [stackoverflow](https://stackoverflow.com/questions/10034149/why-is-nan-not-equal-to-nan)