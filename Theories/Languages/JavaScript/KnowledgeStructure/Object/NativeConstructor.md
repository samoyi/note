#



***
## Internal `[[Class]]`
Every object has an internal `[[Class]]` property. This property cannot be
accessed directly, but can generally be revealed indirectly by borrowing the
default `Object.prototype.toString(..)` method called against the value.
```js
Object.prototype.toString.call( [1,2,3] );	// "[object Array]"
```
For the array in the above example, the internal` [[Class]]` value is "Array".


***
## References
