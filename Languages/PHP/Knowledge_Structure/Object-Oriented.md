[基于可变函数的构造函数传参方法](http://taoyh163.blog.163.com/blog/static/1958035620141371710957/)


***
## 基本概念
### `$this` `self`
* `$this` refers to the instance of the object
* `self` returns to the class itself
* When using static calls, you refer to `self` because you are not-required to have an instance of a class


###  Scope Resolution Operator(`::`)
* A token that allows access to static, constant, and overridden properties or methods of a class.
* [Mannual](http://php.net/manual/en/language.oop5.paamayim-nekudotayim.php#language.oop5.paamayim-nekudotayim)

### Magic constants
* `__CLASS__` The class name. The class name includes the namespace it was declared in (e.g. Foo\\Bar).
* `__METHOD__` The class method name.


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
2. You cannot use the `$this` keyword inside a static method because there may be no object instance to refer to. Instead, use `self` refers to the class
```php
<?php
    class Foo
    {
        static function bar(){
            echo self::baz();
        }
        static private function baz(){
            return 22;
        }
    }
    echo Foo::bar(); // 22
?>
```

### Per-Class Constants
This constant can be used without your needing to instantiate the class
```php
<?php
    class Foo
    {
        const name = 'aaa';
    }
    echo Foo::name; // 'aaa'
?>
```

### `__toString()`
1. If you implement a function called `__toString()` in your class, it will be called when you try to print the class, as in this example:
2. Whatever the `__toString()` function returns will be printed by echo.
***
## Inheritance
### Overriding
1. Overriding attributes or operations in a subclass dose note affect the superclass.
2. The `parent` keyword allows you to call the original version of the operation in the parent class.
```php
<?php
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
?>
```

### Preventing Inheritance and Overriding with `final`
1. When you use this keyword in front of a function declaration, that function cannot be overridden in any subclasses.
```php
<?php
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
?>
```
2. You can also use the `final` keyword to prevent a class from being subclassed at all.
```php
<?php
    final class Foo{}
    // 下面的继承将报错
    class Bar extends Foo{}
?>
```

### Late Static Binding
<mark>不懂</mark>

### Overloading
1. Overloading in PHP provides means to dynamically "create" properties and methods.
2. These dynamic entities are processed via magic methods one can establish in a class for various action types.
3. The overloading methods are invoked when interacting with properties or methods that have not been declared or are not visible in the current scope.

#### Property overloading
Property overloading only works in object context. These magic methods will not be triggered in static context. Therefore these methods should not be declared static.
* `__set()` is run when writing data to inaccessible properties.
* `__get()` is utilized for reading data from inaccessible properties.
* `__isset()` is triggered by calling `isset()` or `empty()` on inaccessible properties.
* `__unset()` is invoked when `unset()` is used on inaccessible properties.

#### Method overloading
All overloading methods must be defined as public.  
None of the arguments of these magic methods can be passed by reference.  
* `__call()` is triggered when invoking inaccessible methods in an object context.
* `__callStatic()` is triggered when invoking inaccessible methods in a static context.

```php
<?php
    class Foo
    {
    	public function fn(){
    		echo 'fn';
    	}

    	public function __call($name, $arguments){
    		echo '__call ' . $name . '. Arguments: ' . implode(', ', $arguments);
    	}

    	public static function __callStatic($name, $arguments){
    		echo '__callStatic ' . $name . '. Arguments: ' . implode(', ', $arguments);
    	}
    }

    $foo = new Foo;

    $foo->fn(); // 'fn'
    $foo->callTest('h', 2, 'o'); // __call callTest. Arguments: h, 2, o
    Foo::callStaticTest('o', 2);  // __callStatic callStaticTest. Arguments: o, 2
?>    
```


***
## Interfaces
1. Object interfaces allow you to create code which specifies which methods a class must implement, without having to define how these methods are handled.
2. All methods declared in an interface must be public; this is the nature of an interface.
3. All methods in the interface must be implemented within a class; failure to do so will result in a fatal error. 如果一个新类继承了一个已经实现了接口的类，则该新类不用再重复实现一遍接口。
4. Classes may implement more than one interface if desired by separating each interface with a comma.
```php
<?php
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
?>
```


***
## Checking Class Type
The `instanceof` keyword allows you to check the type of an object.You can check whether an object is an instance of a particular class, whether it inherits from a class, or whether it implements an interface.
```php
<?php
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
    class Multi1 implements I1, I2
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
    class Multi2 extends Multi1{}

    $multi2 = new Multi2;

    $multi2 instanceof Multi2; // true
    $multi2 instanceof Multi1; // true
    $multi2 instanceof I1; // true
    $multi2 instanceof I2; // true
?>
```


***
## Class Type Hinting
```php
<?php
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
    class Multi1 implements I1, I2
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
    class Multi2 extends Multi1
    {

    }

    $multi1 = new Multi1;
    $multi2 = new Multi2;

    function checkClassType1(Multi1 $class){} // 参数必须是Multi1的实例
    checkClassType1($multi1); // 正常
    checkClassType1($multi2); // 正常
    function checkInterfaceType1(I1 $class){} // 参数必须是实现了I1接口的类的实例
    checkInterfaceType1($multi1); // 正常
    checkInterfaceType1($multi2); // 正常
    function checkInterfaceType2(I2 $class){} // 参数必须是实现了I2接口的类的实例
    checkInterfaceType2($multi1); // 正常
    checkInterfaceType2($multi2); // 正常
    function checkClassType2(Multi2 $class){} // 参数必须是Multi2的实例
    checkClassType2($multi2); // 正常
    // checkClassType2($multi1); // 报错
?>
```


***
## Cloning Objects
<mark>不懂</mark>


***
## Abstract Classes
<mark>不懂</mark>


***
## Autoloading Classes
 1. The `spl_autoload_register()` function registers any number of autoloaders, enabling for classes and interfaces to be automatically loaded if they are currently not defined.
 2. By registering autoloaders, PHP is given a last chance to load the class or interface before it fails with an error.
 ```php
 <?php
    spl_autoload_register(function($classname){
    	if( is_file('class/' .$classname. '.class.php') ){
    		require_once 'class/' .$classname. '.class.php';
    	}
    });
    /*
     * 在还没有所需class的情况下就试图对其实例化的时候，会先执行
     * `spl_autoload_register`参数中的函数。如果这个函数可以加载
     * 需要的class，程序就不会报错
     */
    $foo = new Foo;
?>
```

***
## Iterators and Iteration
<mark>不懂 没看</mark>


***
## Reflection API
通过访问已有类和对象来找到类和对象的结构和内容
```php
<?php

    class Foo{
    	public function call(){
    		echo "call";
    	}
    }

    $foo = new Foo();

    $class0 = new ReflectionClass( 'Foo' );
    $class1 = new ReflectionClass( $foo );


    var_dump( $class0 );
    /*
    	object(ReflectionClass)#2 (1) {
    	  ["name"]=>
    	  string(3) "Foo"
    	}
    */

    print_r( $class0 );
    /*
    	ReflectionClass Object
    	(
    	    [name] => Foo
    	)
    */

    echo($class0);
    /*
    Class [  class Foo ] {
    @@ E:\WWW\temp\test.php 3-7

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
      @@ E:\WWW\temp\test.php 4 - 6
    }
    }
    }
    */

    var_dump( $class0 == $class1 ); // bool(true)

    var_dump( $class0 === $class1 ); // bool(false)

?>
```


## Predefined Classes
[Mannual](http://php.net/manual/en/reserved.classes.php)

### stdClass
空类。但不同于JS中，stdClass并不是对象实例的基类。
```php
<?php
    $object = new StdClass;
?>
```


***
## 其他相关函数
### `class_exists()`
* 检查一个class是否已经被加载
* 该函数的第二个参数默认为`true`，功能是如果检测的类没有被加载，则通过 `__autoload()` 进行加载。但是，因为 `__autoload()` 并不被推荐使用，因此最好明确将该参数设为`false`并手动加载class
