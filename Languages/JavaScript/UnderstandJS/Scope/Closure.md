# Closure
1. Lexical scode lets any function takes its lexical scope chain any time and
any where.
2. If the function is invoked at any place, its lexical scope chain will be used
to look up a variable.
3. The interesting part of closure is that you can access a function's inner
variable outside the function.


function foo(){
    let n = {};
    n.age = 222;
    return {
        getAge: ()=>n.age,
        setAge: (m)=>{
            console.log(n.age); // 222
            n.age = m;
            console.log(n.age); // 333
        }
    };
}

let getAge = foo().getAge;
let setAge = foo().setAge;

console.log( getAge() ); // 222
setAge(333);
console.log( getAge() ); // 222  为什么不是 333 ？
