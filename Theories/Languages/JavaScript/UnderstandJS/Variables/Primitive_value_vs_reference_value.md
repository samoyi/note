# Primitive value vs Reference value

## Primitive values
* stored on the stack.
* stored directly in the location that the variable accesses.

## Reference values
* Stored in the heap.
* Stored in the variable location is a pointer to a location in memory where the
object is stored.


```js
// 堆内存中保存着数组 [22]
// 变量 arr 保存着一个指针，指向堆内存中的数组 [22]
// arr 把它的指针复制了一份给 a1，a1 也保存一个指针，指向 [22]
let arr = [22],
    a1 = arr;

// 通过 arr[0] 直接找到 [22] 的数组第一项，对其进行修改，数组变成了 [33]
// 因为 a1 也指向实际的数组，所以打印 a1 页看到了变化
arr[0] = 33;
console.log( a1 ); // [33]

// 堆内存中的实际数组 [33] 还正常的存在，但此时在堆内存中又保存了一个数组 [44]
// 变量 arr 的指针此时改为指向数组 [44] ，所以打印 arr显示 “[44]”
// 而因为数组 [33] 仍然存在于内存中，且仍然被变量 a1 的指针引用，所以打印 a1 显示 “[33]”
arr = [44];
console.log( arr ); // [44]
console.log( a1 ); // [33]
```


## References
* [Primitive value vs Reference value](https://stackoverflow.com/questions/13266616/primitive-value-vs-reference-value)
