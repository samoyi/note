# Fisher-Yates-shuffle

```js
function swap(arr, index1, index2){
    const aux = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = aux;
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Swapping variables with destructuring assignment causes significant
        // performance loss, as of October 2017.
        // [arr[i], arr[j]] = [arr[j], arr[i]];
        swap(arr, i, j);
    }
    return arr;
}
```


## References
* [Programming-Algorithms.net](https://www.programming-algorithms.net/article/43676/Fisher-Yates-shuffle)
* [Stackoverflow](https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array)
