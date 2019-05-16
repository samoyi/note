# Composite


## 原理
组合模式将对象组合成树形结构，通过对象的多态性表现，使得用户对单个对象和组合对象的使用具有一致性，下面分别说明。

### 树形结构
树形结构提供了一种遍历树形结构的方案，通过调用组合对象的执行方法，程序会递归调用组合对象下面的叶对象的执行方法，整个对象树只需要一次操作，便能递归执行所有叶对象。

### 多态性
1. 利用对象多态性统一对待组合对象和单个对象，不管是组合对象还是单个对象，只要都拥有一个相同的执行方法，客户端就可以忽略两者的不同，直接执行即可。
2. 在组合模式中，客户将统一地使用组合结构中的所有对象，而不需要关心它究竟是组合对象还是单个对象。往对象树里面添加一个命令的时候，并不关心这个命令是宏命令还是普通子命令，只需确定它是一个命令对象，并且这个命令拥有一个统一的可执行方法，那么这个命令就可以被添加进对象树。


## 实现更强大的宏命令
1. 基本对象可以被组合成更复杂的组合对象，组合对象又可以被组合，这样不断递归下去，这棵树的结构可以支持任意多的复杂度。
2. 在树最终被构造完成之后，让整颗树最终运转起来只需要调用最上层对象的方法。每当对最上层的对象进行一次请求时，实际上是在对整个树进行深度优先的搜索。
3. 而创建组合对象的程序员并不关心这些内在的细节，往这棵树里面添加一些新的节点对象是非常容易的事情，只要保证对象也拥有`execute`方法即可。

```js
const MacroCommand = function(){
    return {
        commandsList: [],
        add (command) {
            this.commandsList.push(command);
            return this;
        },
        execute () {
            for (let i = 0, command; command = this.commandsList[i++];){
                command.execute();
            }
        }
     }
};


const openAcCommand = {
    execute () {
        console.log('打开空调');
    }
};


// 家里的电视和音响是连接在一起的，所以可以用一个宏命令来组合打开电视和打开音响的命令
const openTvCommand = {
    execute () {
        console.log('打开电视');
    },
};
const openSoundCommand = {
    execute () {
        console.log('打开音响');
    },
};
let subMacroCommand1 = MacroCommand().add(openTvCommand).add(openSoundCommand);


// 关门、打开电脑和打登录QQ的命令
const closeDoorCommand = {
    execute () {
          console.log('关门');
    },
};
const openPcCommand = {
    execute () {
        console.log('开电脑');
    },
};
const openQQCommand = {
    execute () {
        console.log('登录QQ');
    },
};
let subMacroCommand2 = MacroCommand().add(closeDoorCommand).add(openPcCommand).add(openQQCommand);


// 把所有的命令组合成一个宏命令
let macroCommand = MacroCommand();
macroCommand.add(openAcCommand).add(subMacroCommand1).add(subMacroCommand2);


document.getElementById('button').onclick = function(){
    macroCommand.execute();
}
```


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


## 抽象类在组合模式中的作用
1. 前面说到，组合模式最大的优点在于可以一致地对待组合对象和基本对象。客户不需要知道当前处理的是宏命令还是普通命令，只要它是一个命令，并且有execute方法，这个命令就可以被添加到树中。
2. 这种透明性带来的便利，在静态类型语言中体现得尤为明显。比如在 Java 中，实现组合模式的关键是`Composite`类和`Leaf`类都必须继承自一个`Compenent`抽象类。这个`Compenent`抽象类既代表组合对象，又代表叶对象，它也能够保证组合对象和叶对象拥有同样名字的方法，从而可以对同一消息都做出反馈。组合对象和叶对象的具体类型被隐藏在`Compenent`抽象类身后。
3. 针对`Compenent`抽象类来编写程序，客户操作的始终是`Compenent`对象，而不用去区分到底是组合对象还是叶对象。所以我们往同一个对象里的`add`方法里，既可以添加组合对象，也可以添加叶对象。
    ```java
    public abstract class Component{
        // add方法，参数为Component类型
        public void add( Component child ){}
        // remove方法，参数为Component类型
        public void remove( Component child ){}
    }

    public class Composite extends Component{
        // add方法，参数为Component类型
        public void add( Component child ){}
        // remove方法，参数为Component类型
        public void remove( Component child ){}
    }

    public class Leaf extends Component{
        // add方法，参数为Component类型
        public void add( Component child ){
            throw new UnsupportedOperationException()    // 叶对象不能再添加子节点
        }
        // remove方法，参数为Component类型
        public void remove( Component child ){
        }
    }

    public class client(){

        public static void main( String args[] ){
            Component root = new Composite();

            Component c1 = new Composite();
            Component c2 = new Composite();

            Component leaf1 = new Leaf();
            Component leaf2 = new Leaf();

            root.add(c1);
            root.add(c2);

            c1.add(leaf1);
            c1.add(leaf2);

            root.remove();
        }
    }
    ```
4. 然而在 JavaScript 这种动态类型语言中，对象的多态性是与生俱来的，也没有编译器去检查变量的类型，所以我们通常不会去模拟一个怪异的抽象类，JavaScript 中实现组合模式的难点在于要保证组合对象和叶对象对象拥有同样的方法，这通常需要用鸭子类型的思想对它们进行接口检查。


## 透明性带来的安全问题
1. 组合模式的透明性使得发起请求的客户不用去顾忌树中组合对象和叶对象的区别，但它们在本质上有是区别的。组合对象可以拥有子节点，叶对象下面就没有子节点， 所以我们也许会发生一些误操作，比如试图往叶对象中添加子节点。例如在上面更强大的宏命令例子中：
    ```js
    console.log(typeof subMacroCommand1.add); // "function"
    console.log(typeof openAcCommand.add);    // "undefined"
    ```
2. 解决方案通常是给叶对象也增加`add`方法，并且在调用这个方法时，抛出一个异常来及时提醒客户
    ```js
    const openTvCommand = {
        execute () {
            console.log( '打开电视' );
        },
        add () {
            throw new Error( '叶对象不能添加子节点' );
        },
    };
    ```


## 引用父对象
有时候我们需要在子节点上保持对父节点的引用，比如当我们删除某个文件的时候，实际上是从这个文件所在的上层文件夹中删除该文件的。
```js
var Folder = function( name ){
    this.name = name;
    this.parent = null;    // 增加this.parent属性
    this.files = [];
};

Folder.prototype.add = function( file ){
    file.parent = this;    // 设置父对象
    this.files.push( file );
};

Folder.prototype.remove = function(){
    if ( !this.parent ){    // 根节点或者树外的游离节点
        return;
    }
    for ( var files = this.parent.files, l = files.length - 1; l >=0; l-- ){
        var file = files[ l ];
        if ( file === this ){
            files.splice( l, 1 );
        }
    }
};
```



## References
* [《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)
