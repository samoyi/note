# 需要考虑 `-0` 的情况
* 除了下面提到的`-0`不能视为`0`的情况，以及可能存在的漏掉的情况，其他情况`-0`都看做`0`
* 只考虑数值类型，不包括其他类型，例如
```
console.log( Number.parseInt("-0") ); // -0
```
这不是`-0`，而是`"-0"`


***
## Type Conversion Methods
### Object()
```
console.log( Object(-0).valueOf() ); // -0
```
### Number()
```
console.log( Number(-0) );  // -0 实际上并没有发生类型转换
```
### valueOf()
```
console.log( (-0).valueOf() );  // -0 实际上并没有发生类型转换
```



***
## Operators
### Additive Operators
```
console.log( -0 + -0 ); // -0
```

### Unary - Operator ,  Unary + Operator
```
console.log( -(-0) ); // 0
console.log( +(-0) ); // -0
```


***
## Math methods
### Math.asin
### Math.atan
### Math.atan2
### Math.ceil
### Math.floor
### Math.max
### Math.min
### Math.pow
### Math.round
### Math.sin
### Math.sqrt
### Math.tan



## References
* [Specification](https://www.ecma-international.org/ecma-262/5.1/)
