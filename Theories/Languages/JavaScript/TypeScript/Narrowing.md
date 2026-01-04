# Narrowing


## Type predicates
1. Predicates in programming are simply functions that return a boolean to answer a yes/no question. 
2. Several JavaScript built-in array methods, such as `filter`, `find`, `every`, and `some`, use predicates to help with decision-making.
3. Type predicates are a way to make predicates more useful for type narrowing.
4. 以下面的代码为例
    ```ts
    function isString(value: unknown): boolean {
        return typeof value === "string";
    }

    function padLeft(padding: number | string, input: string) {
        if (isString(padding)) {
            return padding + input;
            //        ^
            // string | number
        }
        else {
            return " ".repeat(padding) + input; // Type error
                        //       ^
                        // string | number
        }
    }
    ```
5. 代码本身的逻辑已经通过判断成功处理了 `padding` 不同类型时的情况。但这个判断并没有让 `padding` 的类型发生收窄，它在两个分支里的类型仍然保持原来的 `number | string`。因为在 `else` 分支中出现类型错误 
    ```sh
    Argument of type 'string | number' is not assignable to parameter of type 'number'.
      Type 'string' is not assignable to type 'number'.
    ```
6. 我们当然可以使用 `as` 进行强制类型断言来解决这个问题
   ```ts
   function padLeft(padding: number | string, input: string) {
        if (isString(padding)) {
            return padding + input;
            //        ^
            // string | number
        }
        else {
            return " ".repeat(padding as number) + input;
        }
    }
    ```
7. 但更好的方法是使用类型谓词
   ```ts
    function isString(value: unknown): value is string {
        return typeof value === "string";
    }

    function padLeft(padding: number | string, input: string) {
        if (isString(padding)) {
            return padding + input;
                //    ^
                // string
        }
        else {
            return " ".repeat(padding) + input;
                            //   ^
                            // number
        }
    }
    ```
8. 类型谓词 `value is string` 说明：如果函数返回 `true`，那 `value` 的类型就是 `string`；如果函数返回 `false`，那就是剩下的类型，在这里也就是 `number`。
9. 使用类型谓词时，函数必须返回布尔值
    ```ts
    function foo(value: unknown): value is string {
        return "hello"; // 类型错误
        // Type 'string' is not assignable to type 'boolean'.
    }
    ```

### 类型谓词比强制类型断言更好的地方
#### 强制类型断言并没有真的收窄边变量
1. 从上面使用 `as` 的例子能看出来，我们并没有解决两个分支的类型收窄：`if` 分支里的 `padding` 仍然是 `number | string`，`else` 分支里的 `padding` 也只是被强制转换了而已。
2. 它们都没有被收窄为正确的类型，只不过可以通过类型检查了而已。
3. 在上面 `if` 分支里如果有需要明确 `padding` 类型的地方，仍然需要强制类型断言。
    ```ts
    function padLeft(padding: number | string, input: string) {
        if (isString(padding)) {
            const re = padding + input;
                //        ^
                // string | number

            console.log(padding.length); // 类型错误
            // Property 'length' does not exist on type 'string | number'.
            //   Property 'length' does not exist on type 'number'.

            return re;
        }
        else {
            return " ".repeat(padding as number) + input;
        }
    }
    ```

#### 类型谓词将类型收窄封装在单独的一个函数里
假设上述 `if…else` 分支需要在多出使用，使用 `as` 的话就需要在每一处都编写 `as number`；而如果使用类型谓词，那只需要在 `isString` 函数中处理好类型收窄就可以了。


### 类型谓词仍然无法在编译时暴露某些类型错误
这里面没有类型错误，所以可以通过编译。但会发生运行时错误
```ts
function isString(value: unknown): value is string {
  return typeof value === "number"; // 逻辑错误，但类型谓词声明为 string
}

function padLeft(padding: number | string, input: string) {
  if (isString(padding)) {
    // TypeScript 认为 padding 是 string，但是 number
    return padding + input;
  } else {
    // TypeScript 认为 padding 是 number，但实际可能是 string
    return " ".repeat(padding) + input;
  }
}

// 测试用例
padLeft("5", "test");
```


## References
* [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
* [What are Type Predicates in TypeScript? Explained with Code examples](https://www.freecodecamp.org/news/what-are-type-predicates-in-typescript/)