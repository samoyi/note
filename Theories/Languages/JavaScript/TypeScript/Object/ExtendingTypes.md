# Extending Types


<!-- TOC -->

- [Extending Types](#extending-types)
    - [使用 `extends` 扩展](#使用-extends-扩展)
    - [使用 Intersection Types](#使用-intersection-types)
        - [和上面使用 `extends` 的区别](#和上面使用-extends-的区别)

<!-- /TOC -->


## 使用 `extends` 扩展
`interface`s can also extend from multiple types
```ts
interface Colorful {
    color: string;
}

interface Circle {
    radius: number;
}

interface ColorfulCircle extends Colorful, Circle { }

const cc: ColorfulCircle = {
    color: "red",
    radius: 42,
};
```


## 使用 Intersection Types
1. TypeScript provides another construct called intersection types that is mainly used to combine existing object types.
2. An intersection type is defined using the `&` operator
    ```ts
    interface Colorful {
        color: string;
    }
    interface Circle {
        radius: number;
    }

    type ColorfulCircle = Colorful & Circle;


    function draw(circle: ColorfulCircle) {
        console.log(`Color was ${circle.color}`);
        console.log(`Radius was ${circle.radius}`);
    }

    draw({ color: "blue", radius: 42 }); // Ok

    draw({ color: "red", raidus: 42 }); // Error
    // Argument of type '{ color: string; raidus: number; }' is not assignable to parameter of type 'ColorfulCircle'.
    //   Object literal may only specify known properties, but 'raidus' does not exist in type 'ColorfulCircle'. Did you mean to write 'radius'?
    ```
3. 使用 `type` 定义类型时不能使用 `extends` 继承，只能使用 `&`
    ```ts
    interface Colorful {
        color: string;
    }

    type ColorfulCircle = {radius: number} & Colorful; // Ok
    type AnotherColorfulCircle = {radius: number} extends Colorful; // Error
    ```

### 和上面使用 `extends` 的区别
1. The principle difference between the two is how conflicts are handled, and that difference is typically one of the main reasons why you’d pick one over the other between an interface and a type alias of an intersection type.
2. 看下面使用 Intersection Types 时发生冲突的情况
    ```ts
    interface Colorful {
        color: string;
    }
    interface Circle {
        radius: number;
        color: number; // 冲突
    }

    type ColorfulCircle = Colorful & Circle; // OK


    function draw(circle: ColorfulCircle) {
        console.log(`Color was ${circle.color}`);
        console.log(`Radius was ${circle.radius}`);
    }

    draw({ color: "blue", radius: 42 }); // Error
    // Type 'string' is not assignable to type 'never'.
    ```
3. 再看看使用 `extends` 的情况
    ```ts
    interface Colorful {
        color: string;
    }

    interface Circle {
        radius: number;
        color: number;
    }

    interface ColorfulCircle extends Colorful, Circle { } // Error
    // Interface 'ColorfulCircle' cannot simultaneously extend types 'Colorful' and 'Circle'.
    //   Named property 'color' of types 'Colorful' and 'Circle' are not identical.
    ```
4. Intersection Types 还是会进行扩展，但是会把冲突的字段类型设置为 `never` 让它不可用；但 `extends` 则直接不能扩展。