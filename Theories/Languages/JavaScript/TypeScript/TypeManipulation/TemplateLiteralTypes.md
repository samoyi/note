# Template Literal Types


<!-- TOC -->

- [Template Literal Types](#template-literal-types)
    - [Basic](#basic)
    - [String Unions in Types](#string-unions-in-types)

<!-- /TOC -->


## Basic
1. 模板字面量类型基于字符串字面量类型，通过联合，可以扩展多个字符串组成的类型。
2. 当字符串和字符串字面量结合是，可以拼接起来生成信息字符串字面量类型
    ```ts
    type World = "world";

    type Greeting = `hello ${World}`;
    // type Greeting = "hello world"
    ```
3. 如果插值的位置是联合类型，拼接会作用于联合里每个字符串字面量类型，返回所有拼接结果组成的联合类型
    ```ts
    type EmailLocaleIDs = "welcome_email" | "email_heading";
    type FooterLocaleIDs = "footer_title" | "footer_sendoff";
    
    type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
    // type AllLocaleIDs = "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"
    ```
4. 如果有多个联合的插值，则最终的结果是所有可能的联合组合拼接起来的结果组成的联合类型
```ts
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;

type Lang = "en" | "ja" | "pt";
 
type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;
// type LocaleMessageIDs = "en_welcome_email_id" | "en_email_heading_id" | 
// "en_footer_title_id" | "en_footer_sendoff_id" | "ja_welcome_email_id" | 
// "ja_email_heading_id" | "ja_footer_title_id" | "ja_footer_sendoff_id" | 
// "pt_welcome_email_id" | "pt_email_heading_id" | "pt_footer_title_id" | 
// "pt_footer_sendoff_id"
```


## String Unions in Types
1. 模板字面量类型很适合来基于现有类型的内部属性来定义新的字面量类型。
2. 假设我们要实现一个函数 `makeWatchedObject`，它会给参数对象添加一个事件监听方法，来监听对象每个属性的变动。使用效果如下
    ```ts
    // 为参数对象添加一个 on 方法用来监听属性变动
    const person = makeWatchedObject({
        firstName: "Saoirse",
        lastName: "Ronan",
        age: 26
    });

    设置属性监听和回调
    person.on("firstNameChanged", (newFisrtName: string) => {
        // 使用新的 firstName
    });
    person.on("lastNameChanged", (newLastName: string) => {
        // 使用新的 lastName
    });
    ```
3. `makeWatchedObject` 的定义可能如下
    ```ts
    type PropEventSource = {
        on(eventName: string, callback: (newValue: any) => void): void;
    };
    function makeWatchedObject<T>(obj: T): T & PropEventSource {
        return Object.assign({
            on (eventName: string, callback: (newValue: any) => void) {
                // 设置事件绑定，在 eventName 对应的属性变动后调用 callback 并传递新的值
            },
            foo: 222
        }, obj);
    }
    ```
    * `PropEventSource` 类型约束了 `on` 方法的两个参数；
    * `T & PropEventSource` 约束了 `makeWatchedObject` 的返回值不能删除 `obj` 的属性，并且要再加上 `PropEventSource` 约束的 `on` 方法。
4. 但是，不管是在类型定义还是再我们在调用 `makeWatchedObject` 时，都没有明确之后调用 `on` 方法时监听的事件名是什么。实际上， `makeWatchedObject` 的内部实现会把每个属性的事件名规定为 `${属性名}Changed`，正如后面使用的那样。
5. 这就要求我们在使用 `on` 方法是需要传入正确的事件名，如果我们传入了错误的事件名，编译时并不会报错，但运行时就会有错误
    ```ts
    // 这两个错误的写法在编译时都没有问题
    person.on("firstName", () => {});
    person.on("frstNameChanged", () => {});
    ```
6. 而且这里是事件监听，所以很有可能因为监听不到指定的事件，只是静默的失败，并不会抛出错误。
7. 所以，我们需要让事件名只能传 `${属性名}Changed` 这样的格式。这就可以用到模板字面量类型
    ```ts
    type PropEventSource<Type> = {
        on(eventName: `${string & keyof Type}Changed`, callback: (newValue: any) => void): void;
    };
    ```
    现在，就不是任意字符串了，而是联合类型 `"firstNameChanged" | "lastNameChanged" | "ageChanged"`。
8. 上面错误的事件名在编译时就会被发现
    ```ts
    person.on("firstName", () => {}); // Error
    // Argument of type '"firstName"' is not assignable to parameter of type
    // '"firstNameChanged" | "lastNameChanged" | "ageChanged"'.
    ```
