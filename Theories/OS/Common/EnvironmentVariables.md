# Environment Variables


## What are Environment Variables?
1. Environment variables are global system variables accessible by all the processes/users running under the Operating System (OS), such as Windows, macOS and Linux. 
2. Environment variables are useful to store system-wide values, for examples,
    * `PATH`: the most frequently-used environment variable, which stores a list of directories to search for executable programs.
    * `OS`: the operating system.
    * `COMPUTENAME`, `USERNAME`: stores the computer and current user name.
    * `SystemRoot`: the system root directory.
    * (Windows) `HOMEDRIVE`, `HOMEPATH`: Current user's home directory.


## (Windows) Environment Variables
Environment Variables in Windows are NOT case-sensitive (because the legacy DOS is NOT case-sensitive). They are typically named in uppercase, with words joined with underscore (_), e.g., `JAVA_HOME`.

### Display Environment Variables and their Values
1. To list ALL the environment variables and their values, start a CMD and issue the command `set`.
2. To display a particular variable, use command `set varname`, or `echo %varname%`:
    ```sh
    // Display a particular variable
    set COMPUTERNAME
    COMPUTERNAME=xxxxxx

    // or, use "echo" command with variable name enclosed within a pair of '%'
    echo %COMPUTERNAME%
    COMPUTERNAME=xxxxxx
    ```

### Set/Unset/Change an Environment Variable for the "Current" CMD Session
1. An environment variable set via the `set` command under CMD is a **local** available to the current CMD session only. 
2. To set (or change) a environment variable, use command `set varname=value`. There shall be no spaces before and after the `=` sign. 
3. To unset an environment variable, use `set varname=`, i.e., set it to an empty string.
4. For examples,
    ```sh
    // Set an environment variable called MY_VAR
    set MY_VAR=hello
    
    // Display
    set MY_VAR
    MY_VAR=hello
    
    // Unset an environment variable
    set MY_VAR=
    
    // Display
    set MY_VAR
    Environment variable MY_VAR not defined
    ```

### Using an Environment Variable
To reference a variable in Windows, use `%varname%`. For example, you can use the echo command to print the value of a variable in the form `echo %varname%`
    ```sh
    // Display the PATH environment variable
    echo %PATH%
    PATH=xxxxxxx
    ```

### How to Add or Change an Environment Variable "Permanently"

### `PATH` Environment Variable in Windows
1. When you launch an executable program (with file extension of ".exe", ".bat" or ".com") from the CMD shell, Windows searches for the executable program in the current working directory, followed by all the directories listed in the PATH environment variable. 
2. To list the current PATH, issue command:
    ```sh
    PATH
    PATH=path1;path1;path3;...
    ```

### How to Add a Directory to the PATH in Windows
1. 把一个路径添加到 `PATH` 环境变量中，并不需要先为这个路径字符串建立环境变量，因为这个操作并不需要使用一个变量来引用这个路径。只要直接把路径字符串添加到 `PATH` 的列表中即可。
2. 当然如果我们已经为该路径建立了一个环境变量，那么我们往 `PATH` 列表中添加这个路径时，就可以不添加它的实际路径字符串，而是添加它的环境变量名，也就是上面提到的 `%varname%` 形式。


## References
* [Environment Variables in Windows/macOS/Linux](https://www3.ntu.edu.sg/home/ehchua/programming/howto/Environment_Variables.html)