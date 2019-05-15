# Command
TODO 更详细

## 原理
1. 命令的使用者只需要知道每个命令是干什么用的，然后直接用就行了，不用关心命令具体由谁执行，具体怎么执行
    ```js
    let button1 = document.getElementById( 'button1' );
    let button2 = document.getElementById( 'button2' );
    let button3 = document.getElementById( 'button3' );


    // 为每个按钮绑定一个封装好的命令
    const setCommand = function( button, command ){
        button.onclick = function(){
            command.execute();
        }
    };
    // 每个按钮使用一个命令来响应点击事件
    setCommand( button1, refreshMenuBarCommand );
    setCommand( button2, addSubMenuCommand );
    setCommand( button3, delSubMenuCommand );
    ```
2. 至于上面的三个命令是谁再做以及做了什么，则会封装起来，然后只暴露出来具体的三个命令对象
    ```js
    // 执行命令内部具体操作的对象，每个对象负责执行若干种操作
    // 命令的下达者不用关心是谁在执行某个命令，也不关心它是怎么执行的
    const MenuBar = {
        refresh () {
            console.log( '刷新菜单目录' );
        },
    };
    const SubMenu = {
        add () {
            console.log( '增加子菜单' );
        },
        del () {
            console.log( '删除子菜单' );
        },
    };

    // 定义一些对外的命令类，每个类对应一个命令的具体操作
    class RefreshMenuBarCommand {
        constructor (receiver) {
            this.receiver = receiver;
        }
        execute () {
            this.receiver.refresh();
        }
    }
    class AddSubMenuCommand {
        constructor (receiver) {
            this.receiver = receiver;
        }
        execute () {
            this.receiver.add();
        }
    }
    class DelSubMenuCommand {
        constructor (receiver) {
            this.receiver = receiver;
        }
        execute () {
            this.receiver.del();
        }
    }

    // 实例化每种命令，命令下达者只需要使用这些命令实例即可，不关心内部详情
    const refreshMenuBarCommand = new RefreshMenuBarCommand( MenuBar );
    const addSubMenuCommand = new AddSubMenuCommand( SubMenu );
    const delSubMenuCommand = new DelSubMenuCommand( SubMenu );
    ```


## JavaScript 中的命令模式
1. JavaScript 中可以很简单的实现上面的功能
    ```js
    const MenuBar = {
        refresh () {
            console.log( '刷新菜单目录' );
        },
    };
    const SubMenu = {
        add () {
            console.log( '增加子菜单' );
        },
        del () {
            console.log( '删除子菜单' );
        },
    };

    let button1 = document.getElementById( 'button1' );
    let button2 = document.getElementById( 'button2' );
    let button3 = document.getElementById( 'button3' );

    const setCommand = function( button, fn ){
        button.onclick = function(){
            fn();
        }
    };

    setCommand( button1, MenuBar.refresh );
    setCommand( button2, SubMenu.add );
    setCommand( button3, SubMenu.del );
    ```
2. JavaScript 作为将函数作为一等对象的语言，运算块不一定要封装在`command.execute`方法中，也可以封装在普通函数中。函数作为一等对象，本身就可以被四处传递。


## 宏命令
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

const MacroCommand = function(){
    return {
        commandsList: [],
        add (command) {
            this.commandsList.push( command );
            return this;
        },
        execute () {
            for ( let i = 0, command; command = this.commandsList[i++]; ){
               command.execute();
            }
        }
    }
};

let macroCommand = MacroCommand();

macroCommand
.add(closeDoorCommand)
.add(openPcCommand)
.add(openQQCommand);

macroCommand.execute();
```



## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)
