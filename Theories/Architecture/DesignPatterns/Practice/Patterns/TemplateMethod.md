# Template Method

## 使用场景
1. 若干个任务有相同的执行步骤，但是全部或部分步骤的具体执行不同。
2. 模板父类就可以提供一个执行模板和执行环境，子类继承这个父类，并定义自己独特的步骤方法，然后使用父类的执行模板和执行环境来完成任务。
3. 父类用于定义架构，之后根据实际业务实现若干个符合该模板架构的子类，在此架构的基础上实现任务。类似于架构师和程序员的关系。

### 钩子方法
1. 针对实际的场景，可能在某些情况下会对模板步骤进行一些特殊化处理，例如跳过一些步骤，加入前置或回调函数之类的。
2. 父类可以提供一些钩子函数，让子类实例在具体执行时，根据需求来决定是否调用钩子函数、调用时要传哪些参数。
3. 父类的模板中，会加入判断，在指定步骤中如果发现钩子函数被执行了或者传了特定的参数，则执行响应的特定操作。
4. 这样模板不仅规定了基础的步骤，还可以兼容一些个性化的需求。