# Encapsulate Variable


## 思想
* **代理**：多个使用者依赖不同的路径访问 record，导致路径耦合。现在统一访问迁移成本更低的代理函数，由代理函数去访问原 record。
* **意图与实现分离**：供使用者方便使用，但不需要他们知道功能的实现。
* **黑箱封装**：黑箱内部可以对公开的功能做一些黑箱操作。
* **对使用者透明**：可以对外的表现不变化的前提下，在里面根据需求修改逻辑，使用者都是无感的。


### Variable 的定义
1. 这里的 variable，并不局限于狭义的、定义的变量，而是包括所有对当前环境来说可能变化的东西。
2. 一个例子，就是外部接口返回的数据。外部接口返回的数据，对于当前系统来说是不可控的。
3. 虽然可能对接口返回的数据有约定，但仍然无法保证意外返回。更何况，随着接口提供者的版本升级之类的情况，接口的返回也有可能发生变化。


## Motivation
### 意图和实现分离的数据代理机制
1. 考虑一个重构场景。比如很多对象引用 `foo.a`，但后来我想把 `a` 放到 `bar` 里面，变成 `bar.a`，那么引用 `foo.a` 的对象就都要修改自己的逻辑，改成引用 `bar.a`。
2. 这些对象其实只是想引用 `a`（意图），但并不关心 `a` 到底在 `foo` 上还是在 `bar` 上。因为意图和实现没有分离，所以这些对象都要都和与 `a` 的实现。
3. 那么我么把 `a` 进行封装，访问函数比如封装为
    ```js
    getA(){
        return foo.a;
    }
    ```
4. 所有需要 `a` 的对象都通过 `getA` 访问。之后 `a` 不管放在那里，都只需要修改 `getA` 的实现即可，对于使用 `getA` 的对象来说修改是完全透明的。

### 监听和控制对数据的读写
1. 将数据隐藏起来并暴露出访问和修改的方法，就可以在这两个方法里控制对数据的访问和修改。
2. 可以监听，就可以做很多事情。参考了这个 [提问](https://stackoverflow.com/questions/1568091/why-use-getters-and-setters-accessors) 及 [翻译](https://www.zhihu.com/question/21401198/answer/18113707)
    * 变量的内部逻辑和外部表现可以不一样，你可能是想隐藏内部实现，也可能是希望在内部实现改变时对使用者透明。
    * 实现对读写的 debug。
    * 对不同的访问者设置不同的读写权限。

### 可变的数据要及时封装
1. It is my habit to make all mutable data encapsulated like this and only accessed through functions if its scope is greater than a single function. 
2. The greater the scope of the data, the more important it is to encapsulate. 
3. My approach with legacy code is that whenever I need to change or add a new reference to such a variable, I should take the opportunity to encapsulate it. That way I prevent the increase of coupling to commonly used data.

#### 不可变数据的情况
1. Keeping data encapsulated is much less important for immutable data. 
2. When the data doesn’t change, I don’t need a place to put in validation or other logic hooks before updates. 
3. I can also freely copy the data rather than move it — so I don’t have to change references from old locations, nor do I worry about sections of code getting stale data. 
4. Immutability is a powerful preservative. 
5. 不过即使是不可变的数据，上面说的监听的功能有时也是有必要的。


## Mechanics
1. Create encapsulating functions to access and update the variable.
2. Run static checks.
3. For each reference to the variable, replace with a call to the appropriate encapsulating function. Test after each replacement.
4. Restrict the visibility of the variable.
    * Sometimes it’s not possible to prevent access to the variable. If so, it may be useful to detect any remaining references by renaming the variable and testing.
5. Test.
6. If the value of the variable is a record, consider *Encapsulate Record*.


## 封装数据的值，而不仅仅是数据的引用
1. 基本的封装是封装访问数据的方式，也就是从直接访问变为代理访问
2. 但进一步的封装还可以封装数据本身，也就是阻止对数据本身的修改。
3. 第一个方法是取值函数返回数据的副本
    ```js   
    let defaultOwnerData = {firstName: "Martin", lastName: "Fowler"};
    export function defaultOwner() {return Object.assign({}, defaultOwnerData);}
    export function setDefaultOwner(arg) {defaultOwnerData = arg;}
    ```
4. 第二种方法是直接禁用修改权限  
    ```js
    let defaultOwnerData = {firstName: "Martin", lastName: "Fowler"};
    function defaultOwner() {return new Person(defaultOwnerData);}
    function setDefaultOwner(arg) {defaultOwnerData = arg;}

    class Person {
        constructor (data) {
            this._lastName = data.lastName;
            this._firstName = data.firstName;
        }
        get lastName () {return this._lastName;}
        get firstName () {return this._firstName;}
    }


    let person = defaultOwner();
    person.firstName = '33' // TypeError: Cannot set property firstName of #<Person> which has only a getter
    ```


## 如果支持修改的同时还想保存源数据，那可以在 setter 里面做拷贝


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
