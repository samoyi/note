# StateHook


<!-- TOC -->

- [StateHook](#statehook)
    - [Summary](#summary)
    - [Usage](#usage)
    - [TypeScript 的情况](#typescript-的情况)

<!-- /TOC -->


## Summary
A Hook is a special function that lets you “hook into” React features. For example, `useState` is a Hook that lets you add React state to function components.


## Usage
1. 组件首次渲染时， `useState` 会声明一个变量并对其进行初始化。如果这个变量没有被设值函数改变，那组件在先吃渲染时，`useState` 还会返回相同的值给这个变量。
2. 如果使用了设值函数改变了变量，那会触发组件重新渲染，然后 `useState` 就会返回更新后的值给这个变量。
3. 这也是为什么这个钩子不叫 `createState`，因为它只有在组件第一次渲染时才是 create，之后都是 use。
4. 直接修改变量没有效果（也不会报错），必须要通过设值函数。
5. 类组件的 `setState` 参数如果是引用类型，它是会合并到原对象上；但是 state hook 如果参数是引用类型的话，是直接替换对应的 state
    ```js
    function Component1 (props) {
        const [person, setPerson] = useState({name: "Hime", age: 22});
        setTimeout(() => {
            // 三秒钟只会只会渲染出名字，年龄为空
            setPerson({name: "Hina"});
        }, 3333);
        return (
            <div>
                <p>Name: {person.name}</p>
                <p>Age: {person.age}</p>
            </div>
        );
    }
    ```
6. 初始值参数也可以传一个函数，该函数返回初始值。


## TypeScript 的情况
1. 看起来在默认情况下，必须要使用初始值，否则初始值就是 `undefined`，然后之后赋值就会类型错误
    ```ts
    const [age, setAge] = useState();
    setAge(17); 
    // Argument of type '17' is not assignable to parameter of type 'SetStateAction<undefined>'.
    ```
2. 如果不想使用默认值，就需要在调用 `useState()` 时指明类型
    ```ts
    const [age, setAge] = useState<number>();
    setAge(17); 
    ``` 
3. 使用 interface 也是一样
    ```ts
    interface User {
        name: string;
        age: number;
    }
      
    const [age, setAge] = useState<User>();
    setAge({name: "33", age: 22}); 
    ```