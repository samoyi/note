# Closure

***
## 闭包实现原理
1. In low-level programming languages like C and to stack-based CPU
architectures: if a function’s local variables are defined on a CPU stack, then
they would indeed cease to exist when the function returned.
2. But the scope chain of JavaScript is a list of objects, not a stack of
bindings. Each time a JavaScript function is invoked, a new object is created to
hold the local variables for that invocation, and that object is added to the
scope chain.
3. When the function returns, that variable binding object is removed from the
scope chain.
4. If there were no nested functions, there are no more references to the
binding object and it gets garbage collected.
5. If there were nested functions defined, then each of those functions has a
reference to the scope chain, and that scope chain refers to the variable
binding object.
6. If those nested functions objects remained within their outer function,
however, then they themselves will be garbage collected, along with the variable
binding object they referred to.
7. But if the function defines a nested function and returns it or stores it
into a property somewhere, then there will be an external reference to the
nested function. It won’t be garbage collected, and the variable binding object
it refers to won’t be garbage collected either.


***
## 闭包是作用域链和词法作用域共同的产物
```
function outer(){
    let n = 22;
    function inner(){
        console.log( n );
    }
    return inner;
}
let n = 33;
outer()(); // 22
```
* 作用域链保证了在`outer`函数执行完毕后，其内部的变量不会被回收，还能被保存在`outer`函
数外部的`inner`函数调用到
* 词法作用域保证了保存在`outer`函数外部的`inner`函数在查找变量`n`时查找到的是22而不是
、33

***
## Usage
### 因为闭包是词法作用域的产物，所以通过闭包可以从外部访问函数内部的局部变量
```
function create_person(){
    let _age = 22;
    return {
        getAge: ()=>_age,
        setAge: (n)=>{
            _age = n;
        }
    };
}

let person1 = create_person();
console.log( person1.getAge() ); // 22
person1.setAge(33);
console.log( person1.getAge() ); // 33
```
### 因为闭包是作用域链的产物，所以同一个外部函数生成的两个闭包，拥有独立的作用域链。
> When that function is invoked, it creates a new object to store its local variables, and adds that new object to the stored scope chain to create a new, longer, chain that represents the scope for that function invocation.

```
function create_person(){
    let _age = 22;
    return {
        getAge: ()=>_age,
        setAge: (n)=>{
            _age = n;
        }
    };
}

let person1 = create_person();
let person2 = create_person();
console.log( person1.getAge() ); // 22
console.log( person2.getAge() ); // 22
person1.setAge(33);
console.log( person1.getAge() ); // 33
console.log( person2.getAge() ); // 22
```

再加上整理犀牛和mdn的闭包内容
