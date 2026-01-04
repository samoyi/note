# miscs



## 执行全局包时没有权限
1. 例如在执行全局安装的 `tree-cli` 时，报错如下
    ```sh
    treee : 无法加载文件 C:\Users\我的用户名\AppData\Roaming\npm\treee.ps1，因为在此系统上禁止运行脚本。有关详细信息，请参阅 https:/
    go.microsoft.com/fwlink/?LinkID=135170 中的 about_Execution_Policies。
    所在位置 行:1 字符: 1
    + treee --help
    + ~~~~~
        + CategoryInfo          : SecurityError: (:) []，PSSecurityException
        + FullyQualifiedErrorId : UnauthorizedAccess
    ```
2. 这是由于 PowerShell 的执行策略（Execution Policy）限制造成的。默认情况下 Windows 会阻止运行未签名的脚本（如 treee.ps1）。

### 几种解决方法：
#### 方法 1：临时调整执行策略（推荐）
1. 首先执行以下命令以管理员身份打开 PowerShell
    ```sh
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    ```
2. 此设置只对当前 PowerShell 会话有效，关闭后恢复默认安全设置。

#### 方法 2：永久修改执行策略（谨慎使用）
```sh
# 以管理员身份运行 PowerShell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 方法 3：通过命令前缀绕过限制
```sh
powershell -ExecutionPolicy Bypass -Command "具体要执行的命令"
```
