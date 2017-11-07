# Calculation Error (误差)

## IEEE-754 floating-point
```js
let x = 0.3 - 0.2;
let y = 0.2 - 0.1;
console.log( x === y );    // false
console.log( x === 0.1 );  // false
console.log( y === 0.1 );  // true
```

### 解决方法
#### * 尽量使用整数
例如计算金额时使用分作为单位，而不是使用元

#### * 使用 machine epsilon
例如在JS中，使用常数`Number.EPSILON`
