# Fisher-Yates-shuffle

```js
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
```
Swapping variables with destructuring assignment causes significant performance
loss, as of October 2017.

## References
* [Programming-Algorithms.net](https://www.programming-algorithms.net/article/43676/Fisher-Yates-shuffle)
* [Stackoverflow](https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array)
