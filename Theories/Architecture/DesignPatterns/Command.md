# Command



<!-- TOC -->

- [Command](#command)
    - [0. 术语定义](#0-术语定义)
    - [1. 设计思想](#1-设计思想)
        - [1.1 SRP 解耦](#11-srp-解耦)
        - [1.2 解耦带来的复用](#12-解耦带来的复用)
        - [1.3 解耦带来的软件拆分设计](#13-解耦带来的软件拆分设计)
        - [1.4 OCP](#14-ocp)
    - [2. 本质](#2-本质)
        - [2.1 功能的使用者和功能的执行者分离](#21-功能的使用者和功能的执行者分离)
            - [2.1.1 使用者不需要各自实现功能](#211-使用者不需要各自实现功能)
            - [2.1.2 执行者不需要关注使用者](#212-执行者不需要关注使用者)
        - [2.2 可复用的命令列表](#22-可复用的命令列表)
        - [2.3 功能的执行者和命令分离](#23-功能的执行者和命令分离)
        - [2.4 同一个命令可以有若干种不同的实现方式](#24-同一个命令可以有若干种不同的实现方式)
    - [3. 缺点](#3-缺点)
        - [3.1 增加复杂度](#31-增加复杂度)
    - [4. 适用场景](#4-适用场景)
    - [5. 实现原理](#5-实现原理)
    - [6. 一个不好的例子](#6-一个不好的例子)
        - [6.1 作为命令发起人的 sender 的工作](#61-作为命令发起人的-sender-的工作)
        - [6.2 负责命令的人的工作](#62-负责命令的人的工作)
        - [6.3 作为命令执行人的 receiver 的工作](#63-作为命令执行人的-receiver-的工作)
        - [6.4 下达命令](#64-下达命令)
        - [6.5 命令和命令执行者实现了解耦](#65-命令和命令执行者实现了解耦)
    - [7. JavaScript 中的命令模式](#7-javascript-中的命令模式)
    - [8. 给执行者传参](#8-给执行者传参)
    - [9. 撤销命令](#9-撤销命令)
        - [9.1 receiver](#91-receiver)
        - [9.2 定义命令](#92-定义命令)
        - [9.3 sender 使用命令](#93-sender-使用命令)
    - [10. 命令队列](#10-命令队列)
    - [11. 宏命令](#11-宏命令)
    - [12. 智能命令与傻瓜命令](#12-智能命令与傻瓜命令)
    - [References](#references)

<!-- /TOC -->


## 0. 术语定义
* 发送者（sender）：某个功能的使用者
* 接收者（receiver）：某个功能的执行者


## 1. 设计思想
### 1.1 SRP 解耦
1. 功能的使用者和功能的执行者分离。
2. 同一个功能只需要实现一遍，就可以被不同的使用者使用，而不需要让每个使用者都实现自己的功能。
3. 使用者只需要通过一个接口来指定想要哪些功能，但不关心功能具体怎么执行。
4. 同样，功能的具体执行者也不需要关心自己被谁使用。

### 1.2 解耦带来的复用
1. 命令和功能的使用者分离，所以命令就可以复用到不同的使用者。
2. 具体的功能执行方法也和命令分离，所以具体的功能也可以复用到不同的命令。

### 1.3 解耦带来的软件拆分设计
因为使用者和执行者解耦了，所以在一个软件系统中，可以让一部分人负责开发和维护使用者，然后让另一部分开发和维护执行者。两部分互不影响，甚至都不需要知道对方的存在。

### 1.4 OCP
因为指令是和使用者和执行者分离的，所以你可以在不影响这两者的情况下，任意添加新的指令。


## 2. 本质
以吃饭来举例。

### 2.1 功能的使用者和功能的执行者分离
1. 一个人想吃饭，它必须要使用 “做饭” 这个功能。它如果在家自己做饭的话，那它既是这个功能的执行者，也是这个功能的使用者。
2. 但如果它去饭馆吃饭，它作为顾客就只是这个功能的使用者，而功能的执行者，就是某个厨师。
3. 顾客和厨师之间，很多时候还需要一个中间人，比如服务员，它收集顾客的命令（点菜），把这个命令传递给厨师。
4. 为什么要去饭馆吃饭而不是在家吃饭呢。当然在家吃有在家吃的好处，但是去饭馆吃的好处就是专业分工，也就是 SRP。

#### 2.1.1 使用者不需要各自实现功能
1. 如果多个使用者都想使用一个功能，他们可以都自己实现一遍。但这显然是一种浪费，应该由一个人统一实现，然后每个使用者各自使用就行了。
2. 而且，如果使用者是各自实现，那这个功能发生变化后，每个使用者又要分别各自更改。

#### 2.1.2 执行者不需要关注使用者
1. 厨师甲负责做热菜，厨师乙负责做凉菜，他们不需要关心哪个顾客爱吃什么菜。
2. 至于来了什么顾客，顾客想吃什么菜，那是负责管理命令的人的责任。厨师只需要负责自己的事情，然后根据命令执行就行了。
3. 因为厨师甲和乙都没有和顾客绑定，所以他们就具有了通用性，任何顾客都可以根据需求来使用他们。
4. 也就是通用的方法可以供不同的人调用。

### 2.2 可复用的命令列表
1. 菜单上的每一道菜都是一个命令，这个命令的执行结果是明确的，至少应该是明确的。比如一个命令叫 “鱼香肉丝”，那么执行的结果就应该是一盘鱼香肉丝。
2. 饭馆已经用命令封装好了若干种功能，也就是用菜名指定了若干种菜的做法。你不需要每次都和服务员或者厨师商量要选什么食材、做什么口味，只需要点菜发出命令，就可以得到指定的菜。
3. 任何顾客都可以发出这个命令，而且也会得到相同的结果。

### 2.3 功能的执行者和命令分离
1. 鱼香肉丝这个菜不能和某个厨师绑定到一起，至少常见的菜都不会这么绑定。
2. 也就是说，“鱼香肉丝” 这个命令可能有好几个厨师都可以执行，至于谁来执行那就看情况。即使有厨师离职了，新来的厨师也可以执行这个命令。

### 2.4 同一个命令可以有若干种不同的实现方式
1. 一道菜可以由一个厨师来做，也可以好几个厨师都可以做同一道菜。
2. 对于同一道菜，每个厨师的做法多少都会有所不同。所以，同一个命令由不同的厨师实现，就会有不同的效果。
3. 但是做出来的还是同一道菜，也就是说执行的还是同一个命令。


## 3. 缺点
### 3.1 增加复杂度
The code may become more complicated since you’re introducing a whole new layer between senders and receivers.


## 4. 适用场景
1. 一个对象想要使用若干种功能，并不一定是一次全部使用，也可以是根据情况每次使用其中的一部分。
2. 而且这些功能除了被这个对象使用，也可能被其他对象使用。
3. 然后，从分工的角度来讲，这个对象本身并不适合自己实现这些功能，但是它需要方便的告知自己需要哪些功能。
4. 每个功能对应一个命令，这个对象通过指定命令来选择需要的功能。
5. 一个命令如果有不同的执行方式，那这也是命令模式的特点之一。
6. 而且如果还希望命令支持撤回功能，或者是命令的执行具有队列功能，那就更合适命令模式了。


## 5. 实现原理
1. 根据使用者想要的功能列表，设计若干种命令，每种命令对应一类功能。
2. 设计每个命令的执行方法(函数或者对象)，一个命令可以有一种执行方法，也可以有好几种。
3. 根据具体的场景，为每个命令加载一种具体的执行方法。
4. 提供给使用者一个下达命令的接口，让它选择使用哪些命令。


## 6. 一个不好的例子
### 6.1 作为命令发起人的 sender 的工作
1. 我现在有三个按钮，我希望点击某个按钮会执行某个命令（进而实现某个功能）。
    ```js
    // 对应点菜的例子，这个人想吃三个菜
    let button1 = document.getElementById('button1');
    let button2 = document.getElementById('button2');
    let button3 = document.getElementById('button3');
    ```
2. 现在要做的是，要给每个按钮都绑定一个命令。我希望有人能提供给我三个命令，分别用来刷新菜单、添加子菜单和删除子菜单。
3. 负责管理命令的人提供了三个命令给我，还提供了一个绑定方法。我只需要这么做就可以实现需求：
    ```js
    // 每个按钮使用一个命令来响应点击事件
    // 对应点菜的例子，这里发生点菜的命令
    setCommand(button1, refreshMenuBarCommand);
    setCommand(button2, addSubMenuCommand);
    setCommand(button3, delSubMenuCommand);
    ```
4. 我只需要知道每个命令是干什么用的，然后直接用就行了。我不用关心命令具体由谁执行，具体怎么执行

### 6.2 负责命令的人的工作
1. 从上面来看，它需要创建三个命令，还要创建 `setCommand` 方法。
2. 定义三个命令
    ```js
    // 负责刷新菜单的命令
    class RefreshCommand {
        // 这里看到，命令类本身是不绑定接受者的，只在实例化的时候才指定接受者。
        // 就好比，菜单上的一个菜本身是不绑定厨师的，只在炒这个菜的时候，才指定一个厨师。
        // 这里定义的是菜单上的菜名指令，也就是类，而不是一个真的点菜指令实例
        constructor (receiver) {
            this.receiver = receiver;
        }

        execute () {
            // 对应点菜的例子，这里调用指定的厨师做 “refresh” 这道菜
            this.receiver.refresh();
        }
    }

    // 负责添加菜单的命令
    class AddCommand {
        constructor (receiver) {
            this.receiver = receiver;
        }

        execute () {
            this.receiver.add();
        }
    }

    // 负责删除菜单的命令
    class DelCommand {
        constructor (receiver) {
            this.receiver = receiver;
        }

        execute () {
            this.receiver.del();
        }
    }
    ```
3. 创建 `setCommand` 方法，用于为 sender 指定具体的命令
    ```js
    // 点菜功能
    const setCommand = (button, command) => {
        button.addEventListener('click', () => {
            command.execute();
        });
    };
    ```

### 6.3 作为命令执行人的 receiver 的工作
1. 现在会发现，上面的三个命令，本身并不会负责具体的命令的执行。具体的执行，还是由其他对象实现
    ```js
    // 对应点菜的例子，这里有两个厨师。厨师 MenuBar 会做 refresh，厨师 SubMenu 会做 add 和 del
    const MenuBar = {
        refresh () {
            console.log('refresh'); // 模拟实际的刷新
        }
    };
    const SubMenu = {
        add (){
            console.log('add'); // 模拟实际的添加
        },
        del (){
            console.log('del'); // 模拟实际的删除
        }
    };
    ```

### 6.4 下达命令
1. 现在要做的，是选择一个 receiver 来实例化一个具体的命令，为 sender 服务
    ```js
    // 对应点菜的例子，创建具体的点菜命令实例，参数指定厨师
    const refreshMenuBarCommand = new RefreshCommand( MenuBar );
    const addSubMenuCommand     = new AddCommand( SubMenu );
    const delSubMenuCommand     = new DelCommand( SubMenu );
    ```

### 6.5 命令和命令执行者实现了解耦
1. 上面的三个命令类都没有指明 receiver，也就是说，任何对象只要实现了对应的方法，都可以用来创建对应的命令。
2. 比如 `MenuBar` 对象因为实现了 `refresh` 方法，所以它可以用来创建 `RefreshCommand` 命令。
3. 如果 `SubMenu` 或者其他对象也实现了 `refresh` 方法，那也一样可以用来创建 `RefreshCommand` 命令。
4. 现在，命令是通用的命令了，`RefreshCommand` 可以执行任何对象的刷新操作。
5. 因此，我们可以维护一个命令库，里面有各种通用的命令。当你希望使用一种命令时，对其进行实例化，传入实际的、可以执行该命令的对象。然后，把这个命令实例绑定到需要命令的对象上即可。


## 7. JavaScript 中的命令模式
1. 命令模式的由来，其实是回调函数的一个面向对象的替代品。
2. JavaScript 作为将函数作为一等对象的语言，跟策略模式一样，命令模式也早已融入到了语言之中。运算块不一定要封装在 `command.execute` 方法中，也可以封装在普通函数中。
3. 函数作为一等对象，本身就可以被四处传递。即使我们依然需要请求 “接收者”，那也未必使用面向对象的方式，闭包可以完成同样的功能。
    ```js
    let button1 = document.getElementById('button1');
    let button2 = document.getElementById('button2');
    let button3 = document.getElementById('button3');

    const setClickCommand = (button, handler) => {
        button.addEventListener('click', () => {
            handler();
        });
    };

    const MenuBar = {
        refresh () {
            console.log('refresh');
        }
    };
    const SubMenu = {
        add (){
            console.log('add');
        },
        del (){
            console.log('del');
        }
    };


    const RefreshCommand = ( receiver ) => {
        return () => {
            receiver.refresh();
        }
    };

    const AddCommand = ( receiver ) => {
        return () => {
            receiver.add();
        }
    };

    const DelCommand = ( receiver ) => {
        return () => {
            receiver.del();
        }
    };


    let refreshMenuBarCommand = RefreshCommand( MenuBar );
    let addSubMenuCommand = AddCommand( SubMenu );
    let delSubMenuCommand = DelCommand( SubMenu );

    setClickCommand( button1, refreshMenuBarCommand );
    setClickCommand( button2, addSubMenuCommand );
    setClickCommand( button3, delSubMenuCommand );
    ```
4. 当然，如果想更明确地表达当前正在使用命令模式，或者除了执行命令之外，将来有可能还要提供撤销命令等操作，那我们最好还是把执行函数改为调用 `execute` 方法。修改部分如下
    ```js
    const setCommand = (button, command) => {
        button.addEventListener('click', () => {
            command.execute();
        });
    };


    const RefreshCommand = ( receiver ) => {
        return {
            execute () {
                receiver.refresh();
            },
        }
    };

    const AddCommand = ( receiver ) => {
        return {
            execute () {
                receiver.add();
            },
        }
    };

    const DelCommand = ( receiver ) => {
        return {
            execute () {
                receiver.del();
            },
        }
    };


    setCommand( button1, refreshMenuBarCommand );
    setCommand( button2, addSubMenuCommand );
    setCommand( button3, delSubMenuCommand );
    ```


## 8. 给执行者传参
1. 因为需求是从使用者发起，经过命令对象传递给执行者，所以给执行者传参就可以有两个节点：
    * 创建命令时传递参数。这样参数就固定在命令里面了，任何使用者使用该命令都是同样的参数；
    * 使用者传参，再通过命令对象转发给执行者。这样可以在运行时传参。
2. 看起来运行时传参更灵活一些。但是感觉上又和命令模式的设计里面有些违背，感觉上一个命令就应该是一个明确的命令，不应该有变化了。
3. 下面 [撤销命令](#撤销命令) 中是在创建命令时传参的。
4. 这里在 [撤销命令](#撤销命令) 中的例子的基础上，改成在运行时传参。只写出改动的部分
    ```js
    const PlusCommand = ( receiver ) => {
        return {
            execute (step) {
                receiver.plus(step);
            },
            undo () {
                receiver.undo();
            },
        }
    };

    const MultiCommand = ( receiver ) => {
        return {
            execute (step) {
                receiver.multi(step);
            },
            undo () {
                receiver.undo();
            },
        }
    };

    const setCommand = (button, command) => {
        button.addEventListener('click', () => {
            // 运行时确定参数值
            let step = Math.ceil(Math.random() * 10);
            console.log('Current step: ' + step);

            command.execute(step);
        });
    };


    let pulsBtn = document.getElementById('button1');
    let multiBtn = document.getElementById('button2');
    let undoBtn = document.getElementById('button3');

    let calculator = new Calculator();

    let plusCommand = PlusCommand( calculator );
    let multiCommand = MultiCommand( calculator );

    setCommand( pulsBtn, plusCommand );
    setCommand( multiBtn, multiCommand );
    ```


## 9. 撤销命令
一个支持多次撤销命令的例子

### 9.1 receiver
```js
// 一个计算器类，支持加和乘的操作，另外支持撤销一步的操作
class Calculator {
    constructor () {
        // 使用一个栈来记录上一次的结果，如果需要撤销操作回到上一次的结果，则出栈
        this.valueStack = [];
        this.value = 0;
    }

    plus ( num ) {
        this.valueStack.push( this.value );
        this.value += num;
        console.log( this.value );
    }

    multi ( num ) {
        this.valueStack.push( this.value );
        this.value *= num;
        console.log(this.value);
    }

    undo () {
        if ( this.valueStack.length ) {
            this.value = this.valueStack.pop();
        }
        console.log( this.value );
    }
}
```

### 9.2 定义命令
定义加法命令和乘法命令，还有设置命令的方法
```js
// step 参数设定固定的加数，每次加的值都是 step
const PlusCommand = ( receiver, step ) => {
    return {
        execute () {
            receiver.plus( step );
        },
        undo () {
            receiver.undo();
        },
    }
};

// step 参数设定固定的乘数，每次乘的值都是 step
const MultiCommand = ( receiver, step ) => {
    return {
        execute () {
            receiver.multi( step );
        },
        undo () {
            receiver.undo();
        },
    }
};

const setCommand = ( button, command ) => {
    button.addEventListener('click', () => {
        command.execute();
    });
};
```

### 9.3 sender 使用命令
```js
let puls10Btn = document.getElementById( 'button1' );
let multi2Btn = document.getElementById( 'button2' );
let undoBtn = document.getElementById( 'button3' );

let calculator = new Calculator();

let plusCommand = PlusCommand( calculator, 10 );
let multiCommand = MultiCommand( calculator, 2 );

setCommand( puls10Btn, plusCommand );
setCommand( multi2Btn, multiCommand );
undoBtn.addEventListener('click', () => {
    plusCommand.undo();
    // 或者 multiCommand.undo()，在本例中两个都是同一个实例方法
});
```


## 10. 命令队列
1. 上面计算器的例子修改一下
    ```js
    async function sleep ( s ) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, s * 1000);
        });
    }

    class Calculator {
        constructor () {
            this.valueStack = [];
            this.value = 0;
        }

        async plus ( num ) {
            await sleep( 1 );
            this.valueStack.push( this.value );
            this.value += num;
            console.log( this.value );
        }

        async multi ( num ) {
            await sleep( 2 );
            this.valueStack.push( this.value );
            this.value *= num;
            console.log( this.value );
        }

        undo () {
            if ( this.valueStack.length ) {
                this.value = this.valueStack.pop();
            }
            console.log( this.value );
        }
    }
    ```
2. 现在假设加法会耗时 1 秒，乘法耗时 2 秒。现在快速的执行了 “加-乘-加” 的命令，期望的结果是 30，但因为在乘法执行之前，第二个加法就执行了，所以实际的结果是 40。
3. 需要维护一个队列，新加的命令不会立刻执行，而实添加进队列，然后按顺序执行
    ```html
    <button id="button1">button1</button>
    <button id="button2">button2</button>
    <button id="button3">button3</button>
    ```
    ```js
    async function sleep (s) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, s * 1000);
        });
    }

    // 这个对象用来管理队列
    const CommandQueue = {
        list: [], // 队列

        isInWhile: false,

        enqueue ( fn ) {
            this.list.push( fn );
        },

        isEmtpy () {
            return this.list.length === 0;
        },

        pop () {
            if ( !this.isEmtpy() ) {
                this.list.pop();
            }
        },

        // 执行队列中的命令
        async next () {
            // 如果当前正在通过 while 执行队列里的命令，则不重复触发 while。
            // 因为此时已经把最新的一个命令加入正在 while 的队列了，依次执行就行了。
            // 如果是初次执行，或者上一轮 while 已经结束现在往清空的队列里添加了一条命令，则重新启动一轮 while。
            if ( this.isInWhile === false ) {
                this.isInWhile = true;
                while ( this.list.length ) {
                    let fn = this.list.shift();
                    await fn();
                }
                this.isInWhile = false;
            }
        }
    };

    class Calculator {
        constructor () {
            this.valueStack = [];
            this.value = 0;
        }

        async plus ( num ) {
            await sleep( 1 );
            this.valueStack.push( this.value );
            this.value += num;
            console.log( this.value );
        }

        async multi ( num ) {
            await sleep( 2 );
            this.valueStack.push( this.value );
            this.value *= num;
            console.log( this.value );
        }

        undo () {
            if ( this.valueStack.length ) {
                this.value = this.valueStack.pop();
            }
            console.log( this.value );
        }
    }


    const PlusCommand = ( receiver, step ) => {
        return {
            execute () {
                // 命令的执行实际上是加入队列
                CommandQueue.enqueue(async () => {
                    await receiver.plus( step );
                });
                // 之后会立刻执行一次 next，但是 next 不一定会执行
                CommandQueue.next();
            },
            undo () {
                // 撤销指令分为两种情况：队列里有命令则撤销队列中排在最后的，否则回到上一个结果值
                if ( CommandQueue.isEmtpy() ) {
                    receiver.undo();
                }
                else {
                    CommandQueue.pop() 
                }
            },
        }
    };


    const MultiCommand = ( receiver, step ) => {
        return {
            execute () {
                CommandQueue.enqueue(async () => {
                    await receiver.multi( step );
                });
                CommandQueue.next();
            },
            undo () {
                if ( CommandQueue.isEmtpy() ) {
                    receiver.undo();
                }
                else {
                    CommandQueue.pop() 
                }
            },
        }
    };

    const setCommand = ( button, command ) => {
        button.addEventListener('click', () => {
            command.execute();
        });
    };


    let puls10Btn = document.getElementById( 'button1' );
    let multi2Btn = document.getElementById( 'button2' );
    let undoBtn = document.getElementById( 'button3' );

    let calculator = new Calculator();

    let plusCommand = PlusCommand( calculator, 10 );
    let multiCommand = MultiCommand( calculator, 2 );

    setCommand( puls10Btn, plusCommand );
    setCommand( multi2Btn, multiCommand );
    undoBtn.addEventListener('click', () => {
        plusCommand.undo();
    });
    ```


## 11. 宏命令
宏命令是一组命令的集合，通过执行宏命令的方式，可以一次执行一批命令
```js
const closeDoorCommand = {
    execute () {
        console.log( '关门' );
    },
};
const openPcCommand = {
    execute () {
        console.log( '开电脑' );
    },
};
const openQQCommand = {
    execute () {
        console.log( '登录QQ' );
    },
};

class MacroCommand {
    constructor () {
        this.commandsList = [];
    }

    add ( command ) {
        this.commandsList.push( command );
        return this;
    }

    execute () {
        this.commandsList.forEach(( command ) => {
            command.execute();
        });
    }
}

let macroCommand = new MacroCommand();

macroCommand
.add(closeDoorCommand)
.add(openPcCommand)
.add(openQQCommand);

macroCommand.execute();
```


## 12. 智能命令与傻瓜命令
1. 上面实现的好几个命令中，有些是接受一个 `receiver` 对象，调用 `receiver` 的方法来实际的执行功能；而有些命令里面直接就进行功能的执行了，不需要另外的对象。
2. 一般来说，命令模式都会在 `command` 对象中保存一个接收者来负责真正执行客户的请求，这种情况下命令对象是 “傻瓜式” 的，它只负责把客户的请求转交给接收者来执行，这种模式的好处是请求发起者和请求接收者之间尽可能地得到了解耦。
3. 但是我们也可以定义一些更 “聪明” 的命令对象，“聪明” 的命令对象可以直接实现请求，这样一来就不再需要接收者的存在，这种 “聪明” 的命令对象也叫作智能命令。
4. 没有接收者的智能命令，退化到和策略模式非常相近，从代码结构上已经无法分辨它们，能分辨的只有它们意图的不同。
    1. 策略模式指向的问题域更小，所有策略对象的目标总是一致的，它们只是达到这个目标的不同手段，它们的内部实现是针对 “算法” 而言的；
    2. 而智能命令模式指向的问题域更广，`command` 对象解决的目标更具发散性。命令模式还可以完成撤销、排队等功能。
    3. 一个是解决一个问题的不同算法，一个是解决不同的问题。


## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)
* [Refactoring.Guru](https://refactoringguru.cn/design-patterns/command)