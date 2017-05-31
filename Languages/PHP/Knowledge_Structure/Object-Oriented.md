[基于可变函数的构造函数传参方法](http://taoyh163.blog.163.com/blog/static/1958035620141371710957/)


***
## 基本概念
###  Scope Resolution Operator(::)
* A token that allows access to static, constant, and overridden properties or methods of a class.
* [Mannual](http://php.net/manual/en/language.oop5.paamayim-nekudotayim.php#language.oop5.paamayim-nekudotayim)


***
## Attributes and Operations
### Constructors
1. Most classes have a special type of operation called a `constructor`.A constructor is called when an object is created, and it also normally performs useful initialization tasks such as setting attributes to sensible starting values or creating other objects needed by this object.
2. A constructor is declared in the same way as other operations, but has the special name `__construct()`

### Destructors
1. The opposite of a constructor is a `destructor`.They allow you to have some functionality that will be executed just before a class is destroyed, which will occur automatically when all references to a class have been unset or fallen out of scope.
2. Similar to the way constructors are named, the destructor for a class must be named `__destruct()`.
3. Destructors cannot take parameters.

### Encapsulation
1. 应对类的属性进行封装，仅在必要的时候使用`__get()`和`__set()`进行访问和设置。对于设置了private或者protected的属性和方法，在读写时默认调用这两个方法
2. 方法前不写access modifiers则默认是`public`，属性前不写access modifiers则报错。

### Static Methods
1. Static methods can be called without instantiating the class
2. You cannot use the `this` keyword inside a static method because there may be no object instance to refer to.
    ```
    class Foo
    {
        static function bar(){
            echo 22;
        }
    }
    echo Foo::bar(); // 22
    ```


***
## Inheritance
### Overriding
1. Overriding attributes or operations in a subclass dose note affect the superclass.
2. The `parent` keyword allows you to call the original version of the operation in the parent class.
    ```
    class Foo
    {
        public function fooMethod(){
            return 'foo';
        }
    }
    class Bar extends Foo
    {
        public function fooMethod(){
            return 'bar';
        }
        public function barMethod(){
            return parent::fooMethod();
        }
    }
    $bar = new Bar;
    echo $bar->fooMethod(); // bar
    echo $bar->barMethod(); // foo
    ```

### Preventing Inheritance and Overriding with `final`
1. When you use this keyword in front of a function declaration, that function cannot be overridden in any subclasses.
    ```
    class Foo
    {
        final function fooMethod(){
            return 'foo';
        }
    }
    class Bar extends Foo
    {
        // 如果重载会报错
        // public function fooMethod(){
        // 	return 'bar';
        // }
        public function barMethod(){
            return parent::fooMethod();
        }
    }
    $bar = new Bar;
    echo $bar->fooMethod(); // foo
    echo $bar->barMethod(); // foo
    ```
2. You can also use the `final` keyword to prevent a class from being subclassed at all.
    ```
    final class Foo{}
    // 下面的继承将报错
    class Bar extends Foo{}
    ```


***
## Interfaces
1. Object interfaces allow you to create code which specifies which methods a class must implement, without having to define how these methods are handled.
2. All methods declared in an interface must be public; this is the nature of an interface.
3. All methods in the interface must be implemented within a class; failure to do so will result in a fatal error.
4. Classes may implement more than one interface if desired by separating each interface with a comma.
```
interface I1
{
    function foo();
    function bar();
}
interface I2
{
    function baz();
    function qux();
}
class Multi implements I1, I2
{
    function foo(){
        echo 'foo';
    }
    function bar(){
        echo 'bar';
    }
    function baz(){
        echo 'baz';
    }
    function qux(){
        echo 'qux';
    }
}
```













使用`__call()`重载方法
class Foo{
    function __call($name,$arguments)
    {
        echo "I'm $name!";
    }
}
$foo = new Foo();
$foo->doStuff(); // I'm doStuff!
$foo->fancy_stuff(); // I'm fancy_stuff!
1. 类中不能定义传递给$name的方法。这个例子里，Foo类中不能定义doStuff和fancy_stuff


__CLASS__ 引用当前类名
__METHOD__引用当前方法名



__toString方法
当尝试打印该类时，会调用该方法。该方法必须要返回一个字符串
class Foo
{
 private $bar = 22;
 public function __toString()
 {
  return '33';
 }
}

$foo = new Foo();
echo $foo; // 33;




声明对象属性时不能使用变量等以及不能计算赋值的原因
They are defined by using one of the keywords public, protected, or private, followed by a normal variable declaration. This declaration may include an initialization, but this initialization must be a constant value--that is, it must be able to be evaluated at compile time and must not depend on run-time information in order to be evaluated.
如果一定要使用变量的话，可以如下
class Foo
{
    public function __construct()
    {
        $this->bar = $this->name;
    }
    public $name = 'aaa';
}


Per-Class 常量
不用初始化一个类就可以使用在类中定义的Per-Class常量
class Foo
{
    const name = 'aaa';
}
echo Foo::name; // 'aaa'













Object Interfaces————————————————
1. Object interfaces allow you to create code which specifies which methods a class must implement, without having to define how these methods are handled.
2. Interfaces can be extended like classes using the extends operator.
3. The class implementing the interface must use the exact same method signatures as are defined in the interface. Not doing so will result in a fatal error.
4. It's possible for interfaces to have constants. Interface constants works exactly like class constants except they cannot be overridden by a class/interface that inherits them.

不懂。接口具体有什么用


延迟静态绑定 late static binding————————————
不懂




克隆对象——————————————————
$b = clone $a;
1. $b会继承$a所有的属性和方法
2. 如果在$a的类总定义了 __clone()方法，在进行克隆行为的时候会触发该方


抽象类————————————————————
不懂


__autoload()函数 自动加载类文件—————————

function __autoload( $classname )
{
    include_once( "$classname.class.php" );
}
$foo = new Foo(); // 不会报错，因为会先自动加载 Foo.class.php 文件

 在初始化一个未经声明类时，会先自动调用该函数。



迭代和迭代器————————————————————————

一. 可以使用foreach迭代对象
$class = new MyClass();
foreach($class as $key => $value) {
    print "$key => $value\n";
}


二. Iterator（迭代器）接口
不懂



Reflection API
通过访问已有类和对象来找到类和对象的结构和内容
class Foo
{
 public function call()
 {
  echo "call";
 }
}

$foo = new Foo();

$class0 = new ReflectionClass( 'Foo' );
$class1 = new ReflectionClass( $foo );


var_dump( $class0 );
var_dump( $class1 );
var_dump( $class0 == $class1 );
echo $class0;

/* 以上四行打印下面的

 Class [  class Foo ] {
  @@ F:\Wj\wamp\www\PathTest\test.php 6-12

  - Constants [0] {
  }

  - Static properties [0] {
  }

  - Static methods [0] {
  }

  - Properties [0] {
  }

  - Methods [1] {
    Method [  public method call ] {
      @@ F:\Wj\wamp\www\PathTest\test.php 8 - 11
    }
  }
}
*/


Predefined Classes ——————————————————
http://php.net/manual/en/reserved.classes.php

stdClass
1. 空类。但不同于JS中，stdClass并不是对象实例的基类。
$object = new StdClass;




判断函数————————————————

class_exists() 检查一个class是否已经被加载
该函数的第二个参数默认为true，功能是如果检测的类没有被加载，则通过 __autoload() 进行加载。但是，因为 __autoload() 并不被推荐使用，因此最好明确将该参数设为false并手动加载class
