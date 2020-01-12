# Combine Functions Into Class


## 思想
### 收纳整理
1. 设想你有一个工具间，里面有各种工具。肯定有很多工具都是做一件事情时会一起用到的，或者说是成套的。
2. 当然你把所有工具都散乱摆放也没问题，但用的时候就找起来很不方便。所以一般人都会把一类工具放在一起，这是很自然的事情。
3. 这种思想运用到编程，其实最基础的也就是这里说到的方便。
4. 另外，你可能要把一类工具拿到其他地方去使用，这是你就必须收纳了。这就算是编程中的复用。
5. 当然这里还是只单纯的工具使用，还不涉及数据，没有数据封装。很多时候，

### 数据隔离
1. 多个方法操作一组数据，数据的传递需要使用共同的作用域。
2. 如果没有对这些方法进行封装，而是和其他方法混杂在一起，那么其他方法也会触及到这些它们不该触及的数据。

### 广义的 class
任何的这种一些方法操作共同数据的情况，都可以组合为一个抽象的类。比如像 Vue 的组件也可以算作是类：有一些方法，有共享的数据。而 React 就是直接把组件定义成了类。




## Motivation
1. Classes are a fundamental construct in most modern programming languages. They bind together data and functions into a shared environment, exposing some of that data and function to other program elements for collaboration. They are the primary construct in object­oriented languages, but are also useful with other approaches too.
2. When I see a group of functions that operate closely together on a common body of data (usually passed as arguments to the function call), I see an opportunity to form a class.
3. Using a class:
    * makes the common environment that these functions share more explicit. 分类整齐。
    * allows me to simplify function calls inside the object by removing many of the arguments. 数据共享。
    * provides a reference to pass such an object to other parts of the system. 方便复用。
4. In addition to organizing already formed functions, this refactoring also provides a good opportunity to identify other bits of computation and refactor them into methods on the new class. 搭好架构。
5. Another way of organizing functions together is *Combine Functions into Transform (149)*. Which one to use depends more on the broader context of the program. One significant advantage of using a class is that it allows clients to mutate the core data of the object, and the derivations remain consistent.
6. As well as a class, functions like this can also be combined into a nested function. Usually I prefer a class to a nested function, as it can be difficult to test functions nested within another. Classes are also necessary when there is more than one function in the group that I want to expose to collaborators.
7. Languages that don’t have classes as a first­class element, but do have first­class functions， often use the Function As Object [mf­fao] to provide this capability.


## Mechanics
1. Apply *Encapsulate Record (162)* to the common data record that the functions share.
    * If the data that is common between the functions isn’t already grouped into a record structure, use *Introduce Parameter Object (140)* to create a record to group it together.
2. Take each function that uses the common record and use *Move Function (198)* to move it into the new class.
    * Any arguments to the function call that are members can be removed from the argument list.
3. Each bit of logic that manipulates the data can be extracted with *Extract Function (106)*






























## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
