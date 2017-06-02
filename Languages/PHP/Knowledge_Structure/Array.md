# Array
1. 当在双引号中用单引号引用键时，将引发解析错误。  
    避免这一问题的方法之一是用花括号将整个数组结构括起来
    ```
    print "<p>Monday's soup is {$soups['Monday']}.</p>";
    ```
    花括号也可以用来分开变量起始符和美元符号，或其他字符：
    ```
    print "The total is ${$total}.";
    ```
2. 与JS不同，php空数组的逻辑判断是假
3. PHP 5.4 以降では、関数やメソッドの返す結果を直接配列として扱えるようになりました。 以前は、いったん一次変数に代入しないと配列としては扱えませんでした。
    ```
    function getArray() {
        return array(1, 2, 3);
    }
    // PHP 5.4 ではこのように書けます。
    $secondElement = getArray()[1];
    // 以前は、このようにするか
    $tmp = getArray();
    $secondElement = $tmp[1];
    ```


## 创建数组
### `array()`
* 创建混合数组
    ```
    $arr = array(
        'dog' => 23,
        'cat' => 26,
        'sheep',
        1=>'dog',
        'cat'

    );

    echo $arr[0]; // 'sheep'
    echo $arr[1]; // 'dog'
    echo $arr[2]; // 'cat'
    echo $arr['cat']; // 26
    ```

### 可以直接给数组项赋值来创建数组
但与JS不同，如果只给第五项赋值了，则前四项并不会被undefined替代。该数组只有一项，即第五项。看起来似乎就是一个关联数组。
···
$arr1[4] = '44';
echo json_encode($arr1); // {"4":"44"}

$arr2[] = "aa";
echo json_encode($arr2); // ["aa"]
···

### `range()` Create an array containing a range of elements
1. 可以对数字和字母进行操作
2. 第三个可选参数表示步幅。
3. 三个参数都可以是浮点数
```
echo json_encode( range(4, 9) ); // [4,5,6,7,8,9]
echo json_encode( range(4, 9, 2) ); // [4,6,8]
echo json_encode( range(3.14, 6.28) ); // [3.14,4.14,5.14,6.14]
echo json_encode( range('Y', 'b') ); // ["Y","Z","[","\\","]","^","_","`","a","b"]
```

### 在表单中创建数组
对于同一类别的多个表单输入项，其数据可以统一存入一个数组中。只需要为表单使用诸如`something[]`的语法进行命名即可，然后PHP脚本将获得`$_POST['something']`中的每个选项。


***
## PHP数组的特点
### 关于索引数组
1. PHP中本质上并不区分索引数组和关联数组。所谓的索引数组只不过是key为自然数的关联数组。可以用如下函数判断一个数组是否是形式上的关联数组
    ```
    function isAssoc(array $arr){
        if (array() === $arr) return false;
        return array_keys($arr) !== range(0, count($arr) - 1);
    }
    ```
2. 如果一个数组项有key，则使用该key。如果没有key，则它的key就是一个索引数字，该数字比当前最大的索引数字大1。
    ```
    $a = array(
        'name'=>33,
        'age'=>22,
        6=>666,
        555 // 该数组项的key是7
    );
    echo $a[7]; // 555

    $b = array(
        'name'=>33,
        'age'=>22,
        666 // 该数组项的key是0，因为它是第一个以索引数排序的
    );
    echo $b[0]; //666
    ```

### 相等性
```
$a1 = array('1', '2', '3');
$a2 = array('1', '2', '3');
echo json_encode( $a1 === $a2 ); // true

$a1 = array(0=>'1', 2=>'3', 1=>'2');
echo json_encode( $a1 === $a2 ); // false
echo json_encode( $a1 == $a2 ); // true

$a1 = array('0'=>'1', '2'=>'3', '1'=>'2');
echo json_encode( $a1 == $a2 ); // true
echo json_encode( $a1 === $a2 ); // false

$arr1 = array('a', 'b', 'c');
$arr2 = array("0"=>'a', "1"=>'b', "2"=>'c');
echo json_encode($arr1); // ["a","b","c"]
echo json_encode($arr2); // ["a","b","c"]
```


***
## 遍历方法
### `foreach()`
* 遍历索引数组 `foreach( $arr as $value){}`
* 遍历关联数组 `foreach( $arr as $key=>$value){}`
* 关联数组也可以使用第一种遍历的方法来进行只针对值得操作

### 指针操作方法
* #### `current()`
Return the current element in an array

* #### `each()`  
Return the current key and value pair from an array and advance the array cursor

* #### `next()`  
Advance the internal array pointer of an array, and returns the array value in the next place that's pointed to by the internal array pointer, or `FALSE` if there are no more elements.

* #### `prev()`
Rewind the internal array pointer and returns the array value in the previous place that's pointed to by the internal array pointer, or FALSE if there are no more elements.

* #### `reset()`
Set the internal pointer of an array to its first element, and returns the value of the first array element, or FALSE if the array is empty.

* #### `end()`
Set the internal pointer of an array to its last element and returns the value of the last element or FALSE for empty array.

    ```
    $arr = array('11', '22', '33', '44');

    echo current($arr); // 11
    echo json_encode( each($arr) ); // {"1":"11","value":"11","0":0,"key":0}
    echo current($arr); // 22
    echo next($arr); // 33
    echo current($arr); // 33
    echo prev($arr); // 22
    echo current($arr); // 22
    echo reset($arr); // 11
    echo current($arr); // 11
    echo end($arr); // 44
    echo current($arr); // 44
    ```

### `list` language construct  将索引数组元素的值分别赋给单独的变量
1. `list()` only works on numerical arrays and assumes the numerical indices start at 0.
    ```
    $date = array('Thursday', 23, 'October');
    list($weekday, $day, $month) = $date;
    echo $weekday; // 'Thursday'
    echo $day; // 23
    echo $month; // 'October'
    ```
* 当使用`list()`时，传入的变量可以少于数组元素，也可以用空值的方式忽略某个元素，但不能传入多于数组项的变量
    ```
    $date = array('Thursday', 23, 'October');

    list (, , $month) = $date;
    echo $month; // 'October'

    list($weekday, $day) = $date;
    echo $weekday; // 'Thursday'
    echo $day; // 23

    list($weekday, $day, $month, $hour) = $date; // 报错
    ```
* In PHP 5, `list()` assigns the values starting with the right-most parameter. In PHP 7, `list()` starts with the left-most parameter.
* Modification of the array during `list()` execution (e.g. using list($a, $b) = $b) results in undefined behavior.


### array_walk()   Apply a user supplied function to every member of an array
```
bool array_walk ( array &$array , callable $callback [, mixed $userdata = NULL ] )
```
`array_walk()` is not affected by the internal array pointer of `array`.
#### `callback`
* Typically, `callback` takes on two parameters. The `array` parameter's value being the first, and the key/index second.
* If callback needs to be working with the actual values of the array, specify the first parameter of callback as a reference. Then, any changes made to those elements will be made in the original array itself.

#### `userdata`
If the optional `userdata` parameter is supplied, it will be passed as the third parameter to the `callback`.

```
$arr = array(0,1,2);
function callback( &$value, $key, $data ){
    $value = $value + $data;
}
array_walk($arr, "callback", 3);
echo json_encode($arr); // [3,4,5]
```


***
## 查询数组
### `count()`   Count all elements in an array, or something in an object
```
int count ( mixed $array_or_countable [, int $mode = COUNT_NORMAL ] )
```
* If the optional `mode` parameter is set to `COUNT_RECURSIVE` (or 1), `count()` will recursively count the array. This is particularly useful for counting all the elements of a multidimensional array. `count()` 识别不了无限递归。

### `array_count_values()` 统计每个值在数组中出现的次数
```
$arr = array(8, 9, 9, 10, 8, 10, 8, 9, 10, 8, 9);
print_r( array_count_values($arr) );
// Array
// (
//     [8] => 4
//     [9] => 4
//     [10] => 3
// )
```

### `in_array()` Checks if a value exists in an array
```
bool in_array ( mixed $needle , array $haystack [, bool $strict = FALSE ] )
```
* Searches haystack for needle using loose comparison unless strict is set.

###  `array_key_exists()` Checks if the given key or index exists in the array
```
bool array_key_exists ( mixed $key , array $array )
```

### `array_search()` Searches the array for a given value and returns the first corresponding key if successful
```
mixed array_search ( mixed $needle , array $haystack [, bool $strict = false ] )
```

### `array_keys()` Return all the keys or a subset of the keys of an array
```
array array_keys ( array $array [, mixed $search_value = null [, bool $strict = false ]] )
```
#### `search_value`
If specified, then only keys containing these values are returned.
#### `strict`
Determines if strict comparison should be used during the search.

### `array_values()` Return all the values of an array


***
## 排序
* 都会改变原数组。
* 返回值为表示是否成功的布尔值

### `sort()` 和 `rsort()` 对数组进行升序和降序排序
1. 对于数字和纯数字字符串为值的数组，按照自然顺序排序
2. 对于其他字符串数组，按照程序顺序
3. 在默认情况下，`sort()`会让数字会排到字符串后面
3. 第二个可选参数可以改变排序规则
    * SORT_REGULAR（默认） - compare items normally (don't change types)
    * SORT_NUMERIC - compare items numerically
    * SORT_STRING - compare items as strings
    * SORT_LOCALE_STRING - compare items as strings, based on the current locale. It uses the locale, which can be changed using setlocale()
    * SORT_NATURAL - compare items as strings using "natural ordering" like `natsort()`
    * SORT_FLAG_CASE - can be combined (bitwise OR) with SORT_STRING or SORT_NATURAL to sort strings case-insensitively

### `natsort()` 和 `natcasesort()` 按照自然顺序进行排序

### `asort()` 和 `arsort()` 在维持键值关系的情况下，根据值对关联数组进行排序。
1.程序顺序。
2.如果对索引数组使用该方法，在输出的时候可以看到顺序发生了变化，但因为键值关心没变，所以访问的时候还是老样子

### `ksort()` 和 `krsort()` 在维持键值关系的情况下，根据键对关联数组进行排序。
1.程序顺序。
2.同样，如果对索引数组使用该函数，也只是改变打印出来的顺序。

### `usort()` Sort an array by values using a user-defined comparison function
```
bool usort ( array &$array , callable $value_compare_func )
```
* This function assigns new keys to the elements in `array`. It will remove any existing keys that may have been assigned, rather than just reordering the keys.
#### `value_compare_func`
* The comparison function must return an integer less than, equal to, or greater than zero if the first argument is considered to be respectively less than, equal to, or greater than the second.
* Before PHP 7.0.0 this integer had to be in the range from -2147483648 to 2147483647.
```
$user1 = array('foo', 23);
$user2 = array('bar', 17);
$user3 = array('baz', 27);
$user4 = array('qux', 32);
$user = array($user1, $user2, $user3, $user4);
usort($user, function($u1, $u2){
    return $u1[1] - $u2[1]; //   按照年龄从小到大排序
});
echo $user[0][1]; // 17
```

### `uasort()` Sort an array with a user-defined comparison function and maintain index association
```
bool uasort ( array &$array , callable $value_compare_func )
```
$user1 = array('foo', 23);
$user2 = array('bar', 17);
$user3 = array('baz', 27);
$user4 = array('qux', 32);
$user = array($user1, $user2, $user3, $user4);
uasort($user, function($u1, $u2){
    return $u1[1] - $u2[1]; //   按照年龄从小到大排序
});
print_r($user); // 17的排到了最前面
echo $user[0][1]; // 23 但键值关系不会改变

### `uksort()` Sort an array by keys using a user-defined comparison function
```
$user1 = array('foo', 23);
$user2 = array('bar', 17);
$user3 = array('baz', 27);
$user4 = array('qux', 32);
$user5 = array('quux', 15);
$user = array(
    'first'=>$user1,
    'second'=>$user2,
    'third'=>$user3,
    'fourth'=>$user4,
    'fifth'=>$user5);
uksort($user, function($k1, $k2){
    return $k1<$k2 ? -1 : 1; //   按照键名排序
});
print_r($user); // 'fifth'排到了最前面
echo $user['first'][0]; // 'foo' 但键值关系不会改变
```

### `shuffle()` 随机顺序重组数组

### `array_reverse()` Return an array with elements in reverse order



***
## 向索引数组添加项
### 中括号语法
* 可以使用索引号来添加到（或者覆盖）具体的项
    ```
    $list[3] = 'pears';
    ```
* 也可以不添加索引，则按照既定的顺序添加项
    ```
    $list[ ] = 'pears';
    ```
* 如果添加索引并且索引数大到了让数组项有了空缺，则该项真的是空缺，没有东西。
* 该方法也可以创建数组

### `array_push()`
* 如果只需要在尾部增加一个数组项，最好使用中括号语法，因为它没有调用函数的开销
* Returns the new number of elements in the array.

### `array_unshift()`
Returns the new number of elements in the array.


***
## 从数组删除项
### unset()
* 这个函数能够用来删除变量以及释放它所占用的内存。
* 与JS中的`delete`仅仅是删掉数组项的值不同，`unset()`是直接删掉数组项。
* 删除索引数组时，如果删的不是最后一项，被删项之后的项的索引并不会依次减一，所以就变成了关联数组

### `array_pop()` Pop the element off the end of array
* Returns the last value of array.
* This function will reset the array pointer of the input array after use.

### `array_shift()`  Shift an element off the beginning of array
* Returns the shifted value
* This function will reset the array pointer of the input array after use.
* 与`unset()`，会重拍索引数组的索引

### `array_splice()` Remove a portion of the array and replace it with something else
```
array array_splice ( array &$input , int $offset [, int $length = count($input) [, mixed $replacement = array() ]] )
```
* If `offset` is negative then it starts that far from the end of the `input` array.
* If `length` is specified and is negative then the end of the removed portion will be that many elements from the end of the array.
* If `length` is specified and is zero, no elements will be removed.

替换数组项
一. array_splice()
arrayarray_splice ( array&$input , int$offset [, int$length = count($input) [, mixed$replacement = array() ]] )


清空数组
$array = array();


合并数组
array_merge()函数
关联数组还可以用“+”或“+=”

反转数组键值
array_flip() 函数




数组和字符串互相转化——————————
一.explode()将字符串分割为数组。
1.第一个参数是用何种字符分割，第二个参数是待分割字符串。
2.还有第三个可选参数limit
If limit is set and positive, the returned array will contain a maximum of limit elements with the last element containing the rest of string.
If the limit parameter is negative, all components except the last -limit are returned.
If the limit parameter is zero, then this is treated as 1.

二.implode()和join()将数组合并为字符串
1.第一个参数是拼接字符，第二个参数是数组


用关联数组转化为多个变量————————————
int extract ( array &$array [, int $flags = EXTR_OVERWRITE [, string $prefix = NULL ]] )
1. 第二个可选参数用来指定，如果舒祖建生成的变量和已有变量冲突该如何处理。
