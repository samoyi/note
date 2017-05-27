1. 要将函数作为参数传递时，函数名加双引号
2. 可以把一个函数拆分到两个<?php ?>中
<?php
    foo();//hehe
    function foo()
    {
?>
    hehe
<?php
    }
?>

***
## require() and include()
1. `require()` and `include()` are faster than `require_once()` and `include_once()`
2. PHP does not look at the filename extension on the required file.This means that you can name your file whatever you choose as long as you do not plan to call it directly.
    * One issue to be aware of is that if files ending in `.inc` or some other nonstandard extension are stored in the web document tree and users directly load them in the browser, they will be able to see the code in plain text, including any passwords. It is therefore important to either store included files outside the document tree or use the standard extensions.
3. `require()` is identical to `include()` except upon failure it will also produce a fatal `E_COMPILE_ERROR` level error. In other words, it will halt the script whereas `include()` only emits a warning (`E_WARNING`) which allows the script to continue.
4. 通过设置`php.ini`文件来给服务器所有引入头尾文件
    * Specify `auto_prepend_file string` and `auto_append_file string` in `php.ini`


#### 按引用传递参数
function increment( &$n )
{
    $n++;
}
$num = 6;
increment( $num );
echo $num;//7
如果参数前面不带&，则是按值传递。即，传递了6进去，然后在函数内部$n变成了7，但它是局部变量，全局变量$num依然是6


#### 递归函数比循环慢而且要占用更多内存
递归函数将在内存中创建几个自身的副本，而且将产生多次函数调用的开销

## 函数作用域

#### 内部函数不被提升
```
outer();
function outer()
{
    pub(); // Fatal error: Call to undefined function pub() in E:\lining\WWW\generalTest\test.php on line 7
    function pub()
    {
        echo 223344;
    }
}
```
#### 外部函数执行后，内部函数不再是局部函数
```
function globalFn()  
{  
  function localFn()  
  {  
    echo "local function";  
  }  
}

globalFn();
localFn(); // "local function"
```

## 函数参数
### Type declarations
1. [官方文档](http://php.net/manual/en/functions.arguments.php)
2. 7.0之前只能指定三种类型的参数：
    * Class/interface name
    * self
    * array




## 作为值的函数
与JS的情况并不相同
```
// 普通的函数
function bar(){
	return 2233;
}
var_dump( bar() ); // int(2233)
var_dump( is_object("bar") ); // bool(false)
var_dump( function_exists("bar") ); // bool(true)
```
```
// 作为值的函数
$foo = function(){
	return 2233;
};
var_dump( $foo() ); // int(2233)
var_dump( is_object( $foo ) ); // bool(true)
var_dump( function_exists("$foo") ); // Catchable fatal error: Object of class Closure could not be converted to string
```
