# Object


<!-- TOC -->

- [Object](#object)
    - [三种定义对象类型的方式](#三种定义对象类型的方式)
    - [Property Modifiers](#property-modifiers)

<!-- /TOC -->


## 三种定义对象类型的方式
* anonymous
    ```ts
    function greet(person: { name: string; age: number }) {
        return "Hello " + person.name;
    }
    ```
* interface
    ```ts
    interface Person {
        name: string;
        age: number;
    }
    
    function greet(person: Person) {
        return "Hello " + person.name;
    }
    ```
* alias
    ```ts
    type Person = {
        name: string;
        age: number;
    };
    
    function greet(person: Person) {
        return "Hello " + person.name;
    }
    ```


## Property Modifiers
Each property in an object type can specify a couple of things: the type, whether the property is optional, and whether the property can be written to.

### Optional Properties