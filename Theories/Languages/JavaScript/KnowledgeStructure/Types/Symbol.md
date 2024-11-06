# Symbol

* Symbol 类型的数据是基本类型，
* 与其他基本类型可以通过字面量生成不同，Symbol 类型必须通过 `Symbol()` 函数来生成
* Symbol 函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述。主要是为了在控制台显示，或者转为字符串时，比较容易区分。
    ```js
    console.log(Symbol('My symbol')) // Symbol(My symbol)
    ```
    也可以通过只读属性 `description` 读取到这个参数
    ```js
    console.log(Symbol('My symbol').description) // My symbol
    console.log(Symbol().description) // undefined
    ```
* Symbol 值不能与其他类型的值进行运算
* Symbol 值除了可以转换为字符串值，也可以转换为布尔值 `true`
* 任何两个 Symbol 值都不相同
* Symbol 作为属性名，该属性不会出现在 `for...in`、`for...of` 循环中，也不会被 `Object.keys()`、`Object.getOwnPropertyNames()`、`JSON.stringify()` 返回。但是，它也不是私有属性，有一个 `Object.getOwnPropertySymbols` 方法，可以获取指定对象的所有 Symbol 属性名。`Reflect.ownKeys()` 可以获得包括 Symbol 属性在内的所有自身属性属性名。
