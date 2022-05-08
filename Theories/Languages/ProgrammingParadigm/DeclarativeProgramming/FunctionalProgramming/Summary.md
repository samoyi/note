# Summary


<!-- TOC -->

- [Summary](#summary)
    - [Immutability](#immutability)
    - [Pure Functions](#pure-functions)
    - [Data Transformations](#data-transformations)
    - [Higher-Order Functions](#higher-order-functions)
    - [Recursion](#recursion)
    - [Composition](#composition)
    - [References](#references)

<!-- /TOC -->


## Immutability
1. Immutability means unchangeable. In functional programming, you can’t change the data and it never changes.
2. If you want to mutate or change the data, you have to copy the data and change the copied version and use it.
3. For instance, here is a `student` object and `changeName` function and if you want to change the name of the `student`, you need to copy the `student` object first and then return the new object
    ```js
    let student = {
        firstName: "testing",
        lastName: "testing",
        marks: 500
    }

    function changeName(student) {
        // student.firstName = "testing11" //should not do it
        let copiedStudent = Object.assign({}, student);
        copiedStudent.firstName = "testing11";
        return copiedStudent;
    }
    ```


## Pure Functions
```js
let student = {
    firstName: "testing",
    lastName: "testing",
    marks: 500
}

// impure function
function appendAddress() {
    student.address = {streetNumber:"0000", streetName: "first", city:"somecity"};
}

// pure function
function appendAddress(student) {
    let copystudent = Object.assign({}, student);
    copystudent.address = {streetNumber:"0000", streetName: "first", city:"somecity"};
    return copystudent;
}
```


## Data Transformations
上面两个例子中对数据的处理都是不修改原数据，而生 transformed 的副本进行修改。JS 中也有很多方法都是这样的，比如数组方法 `filter`。


## Higher-Order Functions
参数或者返回值是函数的函数，例如 JS 中的数组方法 `filter`。


## Recursion
递归居然也是

## Composition
相对于继承？


## References
* [Learn Enough React For The Interview](https://medium.com/bb-tutorials-and-thoughts/learn-enough-react-for-the-interview-f460a2fa3aeb)