# Iteration protocols

1. JavaScript 原有的表示“集合”的数据结构，主要是`Array`和`Object`，ES6 又添加了`Map`
和`Set`。这样就需要一种统一的接口机制，来处理所有不同的数据结构。
2. 遍历器（Iterator）就是这样一种机制。它是一种接口，为各种不同的数据结构提供统一的访问
机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所
有成员）。
3. Iterator 的作用有三个：一是为各种数据结构，提供一个统一的、简便的访问接口；二是使得
数据结构的成员能够按某种次序排列；三是 ES6 创造了一种新的遍历命令`for...of`循环，
Iterator 接口主要供`for...of`消费。
4. 一个对象通过实现可遍历协议（Iterable protocol）& 遍历器协议（Iterator protocol），
就可以实现规范要求的统一的遍历机制。


## 可遍历协议
1. 可遍历协议允许给 JS 对象定义自己的遍历行为。
2. 为了实现可遍历，一个对象必须在其自身或原型链上实现一个`@@iterator`方法。该方法的键名
为常量`Symbol.iterator`。
3. 当在可遍历对象进行遍历时，`@@iterator`方法会被调用，并返回一个遍历器对象`iterator`，
该对象必须要符合遍历器协议。
4.  `iterator`用来获得遍历的值。
5. 内置实现可遍历的类型包括：`String`、 `Array`、 `TypedArray`、 `Map`和`Set`。
    ```js
    let str = 'hi';
    console.log( str[Symbol.iterator]); // ƒ [Symbol.iterator]() { [native code] }
    console.log( str[Symbol.iterator]()); // StringIterator {}
    ```

## 遍历器协议
1. 遍历器协议定义了一种标准的方法来进行遍历。
2. 一个可遍历对象的`@@iterator`方法返回的对象如果要实现遍历器协议，该对象必须要有一个
`next`方法，在遍历的过程中，通过每一步调用`next`来实现遍历。
3. 并且`next`方法也要返回一个对象，该对象有两个属性: `done`和`value`。这两个属性要符合
一些条件：
    * `done`: 如果值为`true`，表示遍历器已经遍历完了所有的项。如果值为`false`表示还可
    以在遍历中。注意参考下面的例子，当遍历进行到最后一项时，`done`仍然应该是`false`，再
    一次调用`next`时，`done`才应该是`true`。`done`一直是`true`，则遍历永远不会停止。
    * `value`：遍历每一步得到的值，可以是任何类型。如果`done`为`true`时，可以省略该值。

### 遍历器对象可选的`return`和`throw`方法
1. 如果`for...of`循环提前退出（通常是因为出错，或者有`break`语句），就会调用`return`方
法。
2. 如果一个对象在完成遍历前，需要清理或释放资源，就可以部署`return`方法。
3. `return`方法必须返回一个对象，这是 Generator 规格决定的。
4. `throw`方法主要是配合 Generator 函数使用，一般的遍历器对象用不到这个方法。

```js
const arr = ['x', 'y', 'z'];
arr[Symbol.iterator] = function(){
	let index = 0;
	return {
		next(){
			let obj = {
				value: arr[index] + arr[index],
				done: index===3 ? true : false,
			};
			index++;
			return obj;
		},
		return(){
			console.log('return');
			return {};
		},
	};
};
for(let char of arr){
	if (char === 'yy'){
		break;
	}
	console.log(char);
}
```


## 实现遍历
1. 如果要给一个对象实现遍历，首先这个对象要实现可遍历协议，然后该对象的`@@iterator`方法
返回的对象要实现遍历器协议。
2. 实现以上两个协议后，该对象就是可遍历的，就可以使用`for...of`进行遍历，也可以使用其他
会默认调用遍历接口的方法。
3. 下面要给一个默认没有实现遍历协议的对象实现遍历
    ```js
    let obj = {
        name: '33',
        age: 22,
    };

    try {
        // 不能使用 for...of
        for (let val of obj){}
    }
    catch(err){
        console.log(err); // TypeError: obj is not iterable
    }
    try {
        // 不能使用扩展运算符和解构赋值
        console.log([...obj]);
    }
    catch(err){
        console.log(err); // TypeError: obj is not iterable
    }
    ```
4. 实现遍历
    ```js
    const aPair = [];
    for (let key in obj){
        aPair.push([key, obj[key]]);
    }
    // aPair 的值为 [['name', '33'], ['age', 22]]

    // 给该对象定义一个键名为常量`Symbol.iterator`的方法，该方法会返回一个对象，及遍
    // 历器对象。这样，就实现了给对象定义`@@iterator`方法，进而实现了可遍历协议。
    obj[Symbol.iterator] = function(){
        return {
            // 下面定义这个遍历器，实现遍历器协议
            length: aPair.length,
            index: 0,
            next(){ // 遍历器协议要求遍历器对象要有一个`next`方法
                 // 遍历器协议要求`next`方法也返回一个对象
                let result = {
                    // 遍历器协议要求`next`方法返回的对象要有`value`和`done`属性

                    // 遍历 aPair 所有项后，才会是 true
                    done: this.index !== this.length ? false : true,
                    // 如果遍历的当前项存在，则返回当前项的值
                    value: aPair[this.index] && aPair[this.index][1],
                };
                this.index++; // 推动每次 next 遍历 aPair 下一项
                return result;
            },
        };
    };

    for (let val of obj){
        console.log(val);
    }
    // "33"
    // 22

    console.log([...obj]); // ["33", 22]
    ```


## 手动遍历
因为遍历的过程是不断调用遍历器的`next`方法来获得返回值中的`value`，所以可以按照这个规则
手动遍历。虽然好像没什么实际用处，但可以理解遍历规则。
```js
const str = 'hi';
const iterator = str[Symbol.iterator]();
console.log( iterator.next() ); // {value: "h", done: false}
console.log( iterator.next() ); // {value: "i", done: false}
console.log( iterator.next() ); // {value: undefined, done: true}
```


## 调用 Iterator 接口的场合
有一些场合会默认调用 Iterator 接口（即`Symbol.iterator`方法），除了`for...of`，还有
几个别的场合。

### 解构赋值
对数组和 Set 结构进行解构赋值时，会默认调用`Symbol.iterator`方法
```js
let set = new Set().add('a').add('b').add('c');

let [x,y] = set;
// x='a'; y='b'

let [first, ...rest] = set;
// first='a'; rest=['b','c'];
```

### 扩展运算符
```js
// 例一
var str = 'hello';
[...str] //  ['h','e','l','l','o']

// 例二
let arr = ['b', 'c'];
['a', ...arr, 'd']
// ['a', 'b', 'c', 'd']
```

### yield*
`yield*`后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。

### 其他场合
由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口。

### `for...of`
一个数据结构只要部署了`Symbol.iterator`属性，就被视为具有 iterator 接口，就可以用
`for...of`循环遍历它的成员。也就是说，`for...of`循环内部调用的是数据结构的
`Symbol.iterator`方法。

### 与`for...in`不是一类方法
`for...in`是遍历对象属性的方法，而`for...of`是使用可迭代对象的迭代规则进行迭代的方法
```js
let arr = ['a', 'b', 'c'];
arr[3] = 'd';
arr.foo = 'bar';

let of_result = [];
for(let val of arr){
    of_result.push(val);
}

// 数组的迭代规则就是迭代 index 属性，而不是其他任意属性
console.log(of_result); // ["a", "b", "c", "d"]


let in_result = [];
for(let val in arr){
    in_result.push(val);
}

// 而对象的遍历则不受迭代规则的影响
console.log(in_result); // ["0", "1", "2", "3", "foo"]
```

### 直接遍历 Array、Set、Map 的 key、value 和 entry
Array、Set、Map 都部署了这三个方法，调用后都返回可遍历对象，可分别用来遍历 key、value
和 entry
```js
const arr = ['x', 'y', 'z'];
const set = new Set(arr);
const map = new Map().set(1, 'x').set(2, 'y').set(3, 'z');

console.log('----------------------key--------------------');
for(let key of arr.keys()){
	console.log(key);
}
console.log('-------------');
for(let key of set.keys()){
	console.log(key);
}
console.log('-------------');
for(let key of map.keys()){
	console.log(key);
}
console.log('--------------------value----------------------');
for(let value of arr.values()){
	console.log(value);
}
console.log('-------------');
for(let value of set.values()){
	console.log(value);
}
console.log('-------------');
for(let value of map.values()){
	console.log(value);
}
console.log('--------------------entry----------------------');
for(let entry of arr.entries()){
	console.log(entry);
}
console.log('-------------');
for(let entry of set.entries()){
	console.log(entry);
}
console.log('-------------');
for(let entry of map.entries()){
	console.log(entry);
}
```


## Reference
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
* [Draft ECMA-262](https://tc39.github.io/ecma262/#sec-iteration)
* [阮一峰](http://es6.ruanyifeng.com/#docs/iterator)
* [You Don't Know JS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch3.md)
