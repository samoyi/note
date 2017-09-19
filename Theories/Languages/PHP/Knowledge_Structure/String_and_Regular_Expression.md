# String and Regular Expression
* 要在js中用php变量，需要使用`json_encode`
    ```
    var my_var = <?php echo json_encode($my_var); ?>;
    ```


***
## 字符串的格式化
### `trim()` `ltrim()` `rtrim()`
* 无用内容包括：
    * 换行符和回车符（`\n`和`\r`）
    * 水平和垂直制表符（`\t`和`\xoB`）
    * 字符串结束符（`\0`）
    * 空格
* 默认全部删除，第二个可选参数可以指定只删除其中的某些类

### 格式化字符串以便输出显示
#### Inserts HTML line breaks
`nl2br()`在字符串所有新行之前插入HTML换行标记
* 输出时将php字符串中的`\n`转化为`<br>`
* 第二个可选参数如果为`true`，则转化为`<br/>`
* 作为参数的字符串必须使用双引号，因为单引号会严格的将其中的`\n`作为字符来处理。即使使用变量传入该字符串也一样。

#### `printf()`和`sprintf()`
    <mark>不懂</mark> ，没有仔细看

#### Changing the Case of a String
    * `strtoupper()`：Make a string uppercase
    * `strtolower()`：Make a string lowercase
    * `ucfirst()`：Make a string's first character uppercase
    * `ucwords()`：Uppercase the first character of each word in a string

### Formatting Strings for Storage
1. 待存入数据库中的字符串中如果包含以下字符，则数据库会将其解释为控制符而不是单纯的字符：`NUL (ASCII 0)`, `\n`, `\r`, `\`, `'`, `"`, and `Control-Z`
2. 虽然可以手动使用某些函数来对将要存入数据库的字符串进行转义，但实际进行数据库写入时，应当使用数据库指定的转义函数。
3. 对于MySQL数据库，应该使用`mysqli_real_escape_string`或者其面向对象的方法函数。


***
## 数组和字符串互相转化
### `explode()`将字符串分割为数组
```
array explode ( string $delimiter , string $string [, int $limit = PHP_INT_MAX ] )
```
#### delimiter
* If `delimiter` is an empty string, `explode()` will return `FALSE`.
*  If `delimiter` contains a value that is not contained in `string` and a negative `limit` is used, then an empty array will be returned, otherwise an array containing `string` will be returned.

#### limit
* If `limit` is set and positive, the returned array will contain a maximum of `limit` elements with the last element containing the rest of `string`.
    ```
    $str = '1;2;3;4;5;6;7';
    $result = explode(';', $str, 3);
    echo json_encode($result);  // ["1","2","3;4;5;6;7"]
    ```
* If the limit parameter is negative, all components except the last -limit are returned.
    ```
    $str = '1;2;3;4;5;6;7';
    $result = explode(';', $str, -3);
    echo json_encode($result);  // ["1","2","3","4"]
    ```
* If the limit parameter is zero, then this is treated as 1.
    ```
    $str = '1;2;3;4;5;6;7';
    $result = explode(';', $str, 0);
    echo json_encode($result);  // ["1;2;3;4;5;6;7"]
    ```

### `implode()`将数组合并为字符串
```
string implode ( string $glue , array $pieces )
```


***
## 获得字符串局部
### `strtok()`  Tokenize string
```
string strtok ( string $str , string $token )
string strtok ( string $token )
```
1. Only the first call to strtok uses the `str` argument. Every subsequent call to strtok only needs the `token` to use, as it keeps track of where it is in the current string.
2. To start over, or to tokenize a new string you simply call `strtok` with the `str` argument again to initialize it.
3. You may put multiple tokens in the token parameter. The string will be tokenized when any one of the characters in the argument is found.
    ```
    $str = "Hello world. Beautiful day today.";
    echo strtok($str, 'ea'); // 'H'
    echo '<br />';
    echo strtok('ea'); // 'llo world. B'
    echo '<br />';
    echo strtok('ea'); // 'utiful d'
    echo '<br />';
    echo strtok('ea'); // 'y tod'
    echo '<br />';
    echo strtok('ea'); // 'y.'
    ```

### `substr()` Return part of a string
```
string substr ( string $string , int $start [, int $length ] )
```
#### `start`
* If `start` is negative, the returned string will start at the `start`'th character from the end of `string`.
* If `string` is less than `start` characters long, `FALSE` will be returned.

#### `length`
* If length is given and is negative, then that many characters will be omitted from the end of string. If start denotes the position of this truncation or beyond, FALSE will be returned.
    ```
    $str = "Hello world. Beautiful day today.";
    echo substr($str, 3, -5); // 'lo world. Beautiful day t'
    echo json_encode( substr($str, 20, -20) ); // 'false'
    ```
* If length is given and is 0, FALSE or NULL, an empty string will be returned.


***
## 字符串比较
### `strcmp()` Binary safe string comparison
```
int strcmp ( string $str1 , string $str2 )
```
* case sensitive
* Returns < 0 if str1 is less than str2; > 0 if str1 is greater than str2, and 0 if they are equal.
* 也能比较数字
* `strcasecmp()` Binary safe case-insensitive string comparison

### `strnatcmp()` String comparisons using a "natural order" algorithm
```
$str1 = '10';
$str2 = '2';
echo strcmp($str1, $str2);    //-1
echo '<br/>';
echo strnatcmp($str1, $str2);  //1
```
* case sensitive.
* 也能比较数字
* `strnatcasecmp()`  Case insensitive string comparisons using a "natural order" algorithm

### `strspn()` 一个字符串中连续多少个字符都在另一个字符串中
```
int strspn ( string $subject , string $mask [, int $start [, int $length ]] )
```
* 只有前两个参数的情况下，表示从`subject`的最左端开始数，一直数到出现`mask`中不包括的字符或者到结束
    ```
    $str1 = '1024201';
    $str2 = '2012';
    echo strspn($str1, $str2); // 3    $str1的前三个字符都在$str2中
    ```
* `start`参数指定从什么位置开始数，而不是默认的最左端
    ```
    $str1 = '1024201';
    $str2 = '2012';
    echo strspn($str1, $str2, 2); // 1  只有一个'2'
    ```
* length`参数指定总共数几个字符
    ```
    $str1 = '1024201';
    $str2 = '2012';
    echo strspn($str1, $str2, 4, 2); // 2  '20'
    ```

### 两个字符串中第一个不同字符所在的位置
* 对两个字符串进行异或操作的时候，相同的字符的异或结果是null(“\0”)，所以我们只要找出第一个非null(“\0”)字符
    ```
    $str1 = 'hello world';
    $str2 = 'hello word';
    echo strspn($str1^$str2, "\0"); // 9
    ```
* 针对多字节字符的方法 <mark>不懂</mark>
    ```
    function getCharacterOffsetOfDifference($str1, $str2, $encoding = 'UTF-8'){
        return mb_strlen($str1, $encoding) - mb_strlen(
            mb_strcut(
                $str1,
                strspn($str1 ^ $str2, "\0"),
                mb_strlen($str1, '8bit'),
                $encoding
            ),
            $encoding
        );
    }

    $str1 = '北京欢迎你';
    $str2 = '北京欢迎你丫的';
    echo getCharacterOffsetOfDifference($str1, $str2); // 5
    echo strspn($str1^$str2, "\0"); // 15
    ```

***
## 查询字符串信息
### `strlen()` 函数返回字符串长度
1.数字类型的也会返回长度


***
## 搜索
### strstr()
Find the first occurrence of a string, and returns part of `haystack` string starting from and including the first occurrence of `needle` to the end of `haystack`.
```
string strstr ( string $haystack , mixed $needle [, bool $before_needle =false ])
```
* before_needle: If `TRUE`, `strstr()` returns the part of the `haystack` before the first occurrence of the `needle` (excluding the needle).
* binary safe
* case-sensitive
* case-insensitive `stristr()`
* 如果要搜索的字符串是数字，则搜索匹配此数字对应的ASCII值的字符


### `strrchr()`查找指定字符在字符串中的最后一次出现
Find the last occurrence of a character in a string, and returns the portion of string, or FALSE if needle is not found.
```
string strrchr ( string $haystack , mixed $needle )
```
* 从后往前找
* If needle contains more than one character, only the first is used. This behavior is different from that of strstr().
    ```
    $str = 'hello Shanghai';
    echo strstr($str, 'an'); //anghai
    echo strrchr($str, 'an'); //ai 因为只取了a，而且是从后往前找
    ```
* If `needle` is not a string, it is converted to an integer and applied as the ordinal value of a character.
    ```
    $str = 'hello Shanghai';
    echo strrchr($str, 83); // Shanghai ASCII 83是 'S'
    ```

### `strpos()` Find the position of the first occurrence of a substring in a string

### `strrpos()` Find the position of the last occurrence of a substring in a string


***
## 替换
### `str_replace()` Replace all occurrences of the search string with the replacement string
```
mixed str_replace ( mixed $search , mixed $replace , mixed $subject [, int &$count ] )
```
* If `search` and `replace` are arrays, then` str_replace()` takes a value from each array and uses them to search and replace on `subject`.
* If `replace` has fewer values than `search`, then an empty string is used for the rest of replacement values.
* If `search` is an array and `replace` is a string, then this replacement string is used for every value of `search`.
* If `search` or `replace` are arrays, their elements are processed first to last.
* If `subject` is an array, then the search and replace is performed with every entry of `subject`, and the return value is an array as well.
* If `count` is passed, this will be set to the number of replacements performed.

### `substr_replace()` 把一个子字符串替换为给的字符串
```
mixed substr_replace ( mixed $string , mixed $replacement , mixed $start [, mixed $length ] )
```
* An array of strings can be provided, in which case the replacements will occur on each string in turn. In this case, the `replacement`, `start` and `length` parameters may be provided either as scalar values to be applied to each input string in turn, or as arrays, in which case the corresponding array element will be used for each input string.
* The result string is returned. If string is an array then array is returned.


***
## 复制
### `str_repeat()` 批量复制字符串
```
string str_repeat ( string $input , int $multiplier )
```
* If the multiplier is set to 0, the function will return an empty string.


***
## 正则表达式
<mark>不懂</mark>没看


***
## 其他
### 花括号定界符 （[转载来源](http://www.cnblogs.com/jayleke/archive/2011/11/08/2241609.html)）
#### 简单句法规则
  ```    
  $a = 'flower';
  echo "She received some $as";   // 无效；字母s会被当成有效的变量名组成元素，但是这里的变量是$a
  echo "She received some ${a}s"; // 有效
  echo "She received some {$a}s"; // 有效；推荐的使用方法
  ```
  我们希望表达的是”她收到一些花“，语境中的flower应该采用复数形式（也就是说应该在后面加上S），但是如果不对变量做任何界定的话，就会出现第一个echo的情况。显然我们希望输出的是$a而不是$as。那么我们通常是怎么来处理这个输出的呢？
  ```
  echo "She received some $a"."s";
  echo "She received some ".$a."s";  //
  ```
  这两种习惯性的写法应该没有加花括号的写法简洁明了吧？
  注意：不管{是出现在$前面还是后面，只有两者紧挨着时花括号才会被当成是界定符号。不要在之间加空格，要不然就会被当作普通的花括号处理
  ```
  echo "She received some { $a}s";   // 输出的结果为：She received some { flower}s
  ```

#### 复杂句法规则
    ```  
    echo "有效的写法： {$arr[4][3]}";    // 有效；界定多维数组
    echo "有效的写法： {$arr['foo'][3]}"; // 有效；当在字符串中使用多维数组时，一定要用括号将它括起来
    echo "有效的写法： {$this->width}00"; // 有效；如果不界定的话，就会变成 $this->width00
    echo "有效的写法： {$this->value[3]->name}"; // 有效；该例演示了界定链式调用
    echo "有效的写法： $name: {${$name}}"; // 有效；该例演示的效果实际上是一个可变变量
    echo "有效的写法: {${getName()}}"; // 有效；该例演示了将函数的返回值作为变量名
    echo "有效的下发： {${$this->getName()}}"; // 有效；该例演示了将函数的返回值作为变量名
    ```
    * 注意1：echo "这样写有效吗： {getName()}";输出结果为：'这样写有效吗：{getName()}'。因为里面不含$，所以花括号不会被当作界定符
    * 注意2：echo "这样写有效吗：{$arr[foo][3]}"; 在回答这个问题前我们先来进行一个实验：
    ```
    error_reporting(E_ALL);
    $arr = array('a', 'b', 'c', 'd'=>'e');
    echo "This is $arr[d]"; // 我们发现这样写是没有问题的，那么我们像下面这样写呢？
    echo $arr[d];
    ```
    产生了这样的错误：Notice: Use of undefined constant d - assumed 'd'

    **注意**：采用了未定义的常量d，可能应该为'd'那么如果我们像下面这样修改一下代码的话
    ```
     error_reporting(E_ALL);
     $arr = array('a', 'b', 'c', 'd'=>'e');
     define('f', 'd');
     echo $arr[f];
    ```
    我们发现这次没有问题了。可以看出在字符串中数组的索引不加单引号是没有问题的，但是如果这种写法不是出现在字符串当中就会报错，而对于字符串中{$arr[foo][3]}的解析就是按照非字符串的方式解析的。所以说在字符串当中对数组只加花括号界定而不对索引加单引号的写法是错误的。因为程序会把不加单引号的索引当作是常量来进行解析，这就产生了错误。正确的写法应该是：
    ```
    echo "有效的写法： {$arr['foo'][3]}";
    ```
    * 特别提醒一点：`echo "This is $arr[d]";`这种写法虽然能够被程序解析，但这也仅限于数组是一维数组的情况。严谨的写法应该是：`echo "This is {$arr['d']}";` 我的学生曾经在这一点上和我争论过，他说：既然前面一种写法能出结果，为什么一定要用后面一种写法呢？那么，我们再继续修改一下前面的代码
    ```
     error_reporting(E_ALL);
     $arr = array('a', 'b', 'c',
     'd'=>array('e'=>'f')
     );
     echo "This is $arr[d][e]";
     ```
    这样还能够被正确解析吗？我只想告诉你，加花括号是严谨的必要的。
    * 注意3：
    ```
    error_reporting(E_ALL);
    $arr = array('a', 'b', 'c', 'd');
    echo "This is {$arr[2]}";
    echo "This is {$arr['2']}";
    ```
    执行上面的代码。结果是一样的，为什么会这样呢？我只能告诉你PHP是弱类型语言，至于什么叫弱类型语言我就不在这里多说了。自己去Google一下吧。说了这么多，那么最能体现这些句法规则优势的具体应用在什么地方呢？----SQL语句
    ```
    // 示例一：
    $SQL1 = "select * from table where id={$_GET['id']}";
    // 示例二：
    $SQL2 = "select * from table where id={$this->id}";
    ```
