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
### 数据本身不像函数那样方便转发引用
1. Refactoring is all about manipulating the elements of our programs. 
2. Data is more awkward to manipulate than functions. 
3. Since using a function usually means calling it, I can easily rename or move a function while keeping the old function intact as a forwarding function (so my old code calls the old function, which calls the new function). 
4. I’ll usually not keep this forwarding function around for long, but it does simplify the refactoring.
3. Data is more awkward because I can’t do that. If I move data around, I have to change all the references to the data in a single cycle to keep the code working. 

### 数据封装为函数，代理访问
1. For data with a very small scope of access, such as a temporary variable in a small function, this isn’t a problem. 
2. But as the scope grows, so does the difficulty, which is why global data is such a pain.
3. So if I want to move widely accessed data, often the best approach is to first encapsulate it by routing all its access through functions. 
4. That way, I turn the difficult task of reorganizing data into the simpler task of reorganizing functions.
5. 这里的逻辑其实也是代理思想：本来是很多不同层次（作用域）的用户分别自己去访问和修改数据，现在变成了对数据的访问由统一的函数代理。
6. 本来，当数据迁移的时候，所有用到数据的用户都要分别重新建立和数据的关系，但现在有了代理，在数据迁移后，代理内部会处理迁移逻辑，迁移的过程对于所有用户都是透明的，所有用户还是按照之前的方法、层级来访问代理就行了。
7. 尤其是对于像接口返回数据这样的系统外部数据，外部数据有可能发生非预期的变化，进而对系统产生非预期的影响。对于这种非预期的数据，就应该加装一层防御性代理。

### 封装为函数后也方便监听读写行为并进行需要的操作
1. Encapsulating data is valuable for other things too. 
2. It provides a clear point to monitor changes and use of the data; I can easily add validation or consequential logic on the updates. 
3. 这里同样也是代理的思想，代理可以监听访问甚至修改访问。这是监控功能的代理。
4. 可以监听，就可以做很多事情。参考了这个 [提问](https://stackoverflow.com/questions/1568091/why-use-getters-and-setters-accessors) 及 [翻译](https://www.zhihu.com/question/21401198/answer/18113707)
    * 变量的内部逻辑和外部表现可以不一样，你可能是想隐藏内部实现，也可能是希望在内部实现改变时对使用者透明
    * 实现对读写的 debug
    * Getters and setters can allow different access levels - for example the get may be public, but the set could be protected.

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
1. The basic refactoring encapsulates the reference to the data item.  In many cases, this is all I want to do for the moment.
2. But I often want to take the encapsulation deeper to control not just changes to the variable but also to its contents.
3. For this, I have a couple of options. 

### Modifying the getting function to return a copy of the data
1. Demo
    ```js
    let defaultOwnerData = {firstName: "Martin", lastName: "Fowler"};
    export function defaultOwner() {return Object.assign({}, defaultOwnerData);}
    export function setDefaultOwner(arg) {defaultOwnerData = arg;}
    ```
2.  If I return a copy of the data, any clients using it can change it, but that change isn’t reflected in the shared data.

### Prevent changes
1. Demo
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
2. Now, any attempt to reassign the properties of the default owner will cause an error.


## 如果支持修改的同时还想保存源数据，那可以在 setter 里面做拷贝
1. So far I’ve talked about copying on getting data, but it may be worthwhile to make a copy in the setter too. 
2. That will depend on where the data comes from and whether I need to maintain a link to reflect any changes in that original data. 
3. If I don’t need such a link, a copy prevents accidents due to changes on that source data. 
4. Taking a copy may be superfluous most of the time, but copies in these cases usually have a negligible effect on performance.
5. on the other hand, if I don’t do them, there is a risk of a long and difficult bout of debugging in the future.


## 封装的代价与取舍
1. Remember that the copying above, and the class wrapper, both only work one level deep in the record structure. 
2. Going deeper requires more levels of copies or object wrapping. 
3. As you can see, encapsulating data is valuable, but often not straightforward. 
4. Exactly what to encapsulate — and how to do it — depends on the way the data is being used and the changes I have in mind. 
5.  The more widely it’s used, the more it’s worth my attention to encapsulate properly.


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
