# async-await

## Basic
1. The `async` keyword before a function has two effects:
    1. Makes it always return a promise.
    2. Allows to use await in it.
2. If the code has `return <non-promise>` in it, then JavaScript automatically
wraps it into a resolved promise with that value.
3. The `await` keyword before a promise makes JavaScript wait until that promise
 settles, and then:
    1. If it’s an error, the exception is generated, same as if `throw error`
    were called at that very place.
    2. Otherwise, it returns the result, so we can assign it to a value.


## Misc


## References
[Async/await](https://javascript.info/async-await)
[JavaScript ES 2017: Learn Async/Await by Example](https://codeburst.io/javascript-es-2017-learn-async-await-by-example-48acc58bad65)
