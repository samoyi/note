<!-- vscode-markdown-toc -->
* 1. [TODO](#TODO)
	* 1.1. [激活插件的逻辑](#)
* 2. [Using Commands](#UsingCommands)
	* 2.1. [接收参数并返回结果](#-1)
	* 2.2. [命令的 URI](#URI)
* 3. [Creating new commands](#Creatingnewcommands)
	* 3.1. [Creating a user facing command](#Creatingauserfacingcommand)
		* 3.1.1. [`onCommand`](#onCommand)
	* 3.2. [Controlling when a command shows up in the Command Palette](#ControllingwhenacommandshowsupintheCommandPalette)
	* 3.3. [Enablement of commands](#Enablementofcommands)
	* 3.4. [Using a custom when clause context](#Usingacustomwhenclausecontext)
* 4. [References](#References)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->



##  1. <a name='TODO'></a>TODO
###  1.1. <a name=''></a>激活插件的逻辑
1. 看下面的 `activate` 函数
    ```ts
    // This method is called when your extension is activated
    // Your extension is activated the very first time the command is executed
    export function activate(context: vscode.ExtensionContext) {
        
        vscode.languages.registerHoverProvider(
            'javascript',
            new class implements vscode.HoverProvider {
                provideHover(
                    _document: vscode.TextDocument,
                    _position: vscode.Position,
                    _token: vscode.CancellationToken
                ): vscode.ProviderResult<vscode.Hover> {
                    const commentCommandUri = vscode.Uri.parse(`command:editor.action.addCommentLine`);
                    const contents = new vscode.MarkdownString(`[Add a comment](${commentCommandUri})`);

                    // command URIs如果想在Markdown 内容中生效, 你必须设置`isTrusted`。
                    // 当创建可信的Markdown 字符, 请合理地清理所有的输入内容
                    // 以便你期望的命令command URIs生效
                    contents.isTrusted = true;

                    return new vscode.Hover(contents);
                }
            }()
        );


        // The command has been defined in the package.json file
        // Now provide the implementation of the command with registerCommand
        // The commandId parameter must match the command field in package.json
        let disposable = vscode.commands.registerCommand('myExtension.sayHello', () => {

        });


        context.subscriptions.push(disposable);
    }
    ```
2. 必须要随便注册一个自定义的命令（这里是 `myExtension.sayHello`）才能激活插件，进而 `activate` 函数被调用。但是，这命令的注册却是在 `activate` 里面的，这不是循环激活了吗


##  2. <a name='UsingCommands'></a>Using Commands
1. `Ctrl+Shift+P` 之后，输入命令会触发某种行为。命令有 VS Code 内置的，也有插件定义的。
2. 除了用户在命令窗口中输入命令以外，插件中使用 `vscode.commands.executeCommand` API 也可以调用已有的命令。
3. 在下面插件的例子中，定义了一个 `commentLine` 函数，这个函数在调用时会注释当前行的代码。注释当前行是 VS Code 内置命令，所以直接在 `commentLine` 函数中调用即可
    ```ts
    import * as vscode from 'vscode';

    function commentLine() {
        vscode.commands.executeCommand('editor.action.addCommentLine');
    }
    ```

###  2.1. <a name='-1'></a>接收参数并返回结果
TODO

###  2.2. <a name='URI'></a>命令的 URI
1. 用户除了可以手动输入命令来执行外，插件也可以把命令显示为链接的形式，让用户直接使用鼠标点击即可执行。这可以通过给文字来添加命令的 URI 来实现。
2. 命令的 URI 头部的协议是 `command` 后面跟着命令的名称，例如上面注释当前行的命令，它的命令 URI 是 `command:editor.action.addCommentLine`。
3. 下面的例子，我们实现了一个功能，让用户在光标停在一行代码上时，出现一个提示框，上面有个带命令 URI 的文字 `Add comment`，点击该文字后就会注释掉当前编辑光标所在的那行
    ```ts
    export function activate(context: vscode.ExtensionContext) {
        vscode.languages.registerHoverProvider(
            'javascript',
            new class implements vscode.HoverProvider {
                provideHover(
                    _document: vscode.TextDocument,
                    _position: vscode.Position,
                    _token: vscode.CancellationToken
                ): vscode.ProviderResult<vscode.Hover> {
                    const commentCommandUri = vscode.Uri.parse(`command:editor.action.addCommentLine`);
                    const contents = new vscode.MarkdownString(`[Add a comment](${commentCommandUri})`);

                    // command URIs如果想在Markdown 内容中生效, 你必须设置 `isTrusted`。
                    // 当创建可信的 Markdown 字符, 请合理地清理所有的输入内容
                    // 以便你期望的命令 command URI 生效
                    contents.isTrusted = true;

                    return new vscode.Hover(contents);
                }
            }()
        );

        let disposable = vscode.commands.registerCommand('myExtension.sayHello', () => {

        });

        context.subscriptions.push(disposable);
    }
    ```
4. 此时要给命令传参的话，参数要 encode 进 URI 里面
    ```ts
    export function activate(context: vscode.ExtensionContext) {
        vscode.languages.registerHoverProvider(
            'javascript',
            new class implements vscode.HoverProvider {
                provideHover(
                    document: vscode.TextDocument,
                    _position: vscode.Position,
                    _token: vscode.CancellationToken
                ): vscode.ProviderResult<vscode.Hover> {
                    const args = [{ resourceUri: document.uri }];
                    const commentCommandUri = vscode.Uri.parse(
                        `command:git.stage?${encodeURIComponent(JSON.stringify(args))}`
                    );
                    const contents = new vscode.MarkdownString(`[Stage file](${commentCommandUri})`);
                    contents.isTrusted = true;
                    return new vscode.Hover(contents);
                }
            }()
        );


        // The command has been defined in the package.json file
        // Now provide the implementation of the command with registerCommand
        // The commandId parameter must match the command field in package.json
        let disposable = vscode.commands.registerCommand('myExtension.sayHello', () => {

        });


        context.subscriptions.push(disposable);
    }
    ```


##  3. <a name='Creatingnewcommands'></a>Creating new commands
###  3.1. <a name='Creatingauserfacingcommand'></a>Creating a user facing command
1. 上面已经看到了通过 `vscode.commands.registerCommand` 来注册命令，当执行这个命令是，就会调用第二个参数的回调函数。
2. 但此时用户在使用插件时并不能在命令面板里找到该命令。比如在上面的例子中，用户在命令面板里输入 `myExtension.sayHello` 并不会有该命令。还需要在插件的 `package.json` 中进行注册才行
    ```json
    "contributes": {
        "commands": [
            {
                "command": "myExtension.sayHello",
                "title": "SayHello"
            }
        ]
    }
    ```
3. 现在，在命令面板里就能找到命令 `SayHello`。
4. 并且，现在用户在命令面板里调用命令 `SayHello` 时，对应的插件就会被激活，`registerCommand` 函数就会把 `myExtension.sayHello` 绑定到对应的处理回调上。TODO，怎么还是循环的感觉？

####  3.1.1. <a name='onCommand'></a>`onCommand`
1. 1.74.0 之前的 VS Code，如果要注册面向用户的命令时，必须要定义带 `onCommand` 的 `activationEvents` 属性
    ```json
    {
    "activationEvents": ["onCommand:myExtension.sayHello"]
    }
    ```
2. 内部命令不需要这样，但下面的非内部命令场景则需要
    * 需要使用命令面板调用
    * 需要快捷键调用
    * 需要通过V S Code UI 调用，比如在编辑器标题栏上触发
    * 意在供其他插件使用时

###  3.2. <a name='ControllingwhenacommandshowsupintheCommandPalette'></a>Controlling when a command shows up in the Command Palette
1. 默认情况下，所有命令面板中出现的命令都可以在 package.json 的 `commands` 部分中配置。不过，有些命令是场景相关的，比如在特定的语言的编辑器中，或者只有用户设置了某些选项时才展示。
2. `menus.commandPalette` 发布内容配置运行你限制命令出现在命令面板的时机。你需要配置命令 ID 和一条 `when` 语句
    ```json
    {
        "contributes": {
            "menus": {
                "commandPalette": [
                    {
                        "command": "myExtension.sayHello",
                        "when": "editorLangId == markdown"
                    }
                ]
            }
        }
    }
    ```
3. 现在 `myExtension.sayHello` 命令只会出现在用户的 Markdown 文件中了。

###  3.3. <a name='Enablementofcommands'></a>Enablement of commands
1. `when` 语句一般用来表示这个命令要在什么类型文件中才会出现，而 `enablement` 属性表示在什么更具体的情况下在可用。
2. 例如，有一个分析 JS 正则表达式的命令，那么就需要通过 `when` 来让它只在 JS 文件中才可用，并进一步通过 `enablement` 来让它只在光标放在正则表达式上面的时候才可用。
3. Last, menus showing commands, like the Command Palette or context menus, implement different ways of dealing with enablement. Editor and explorer context menus render enablement/disablement items while the Command Palette filters them.

###  3.4. <a name='Usingacustomwhenclausecontext'></a>Using a custom when clause context
TODO


##  4. <a name='References'></a>References
* [命令](https://liiked.github.io/VS-Code-Extension-Doc-ZH/#/extension-guides/command)
* [Commands](https://code.visualstudio.com/api/extension-guides/command)
