# Date


<!-- TOC -->

- [Date](#date)
    - [The ECMAScript epoch and timestamps](#the-ecmascript-epoch-and-timestamps)
    - [Date Time String Format](#date-time-string-format)
        - [Fields](#fields)
        - [格式要求](#格式要求)
        - [Extended years](#extended-years)
    - [`Date()` constructor](#date-constructor)
        - [数值类型的毫秒时间戳](#数值类型的毫秒时间戳)
        - [字符串类型的 date 时间戳](#字符串类型的-date-时间戳)
        - [Individual date and time component values](#individual-date-and-time-component-values)
    - [Static methods](#static-methods)
        - [`Date.now()`](#datenow)
        - [`Date.parse()`](#dateparse)
        - [`Date.UTC()`](#dateutc)
    - [部分实例方法](#部分实例方法)
        - [`getTime()`](#gettime)
        - [`getTimezoneOffset()`](#gettimezoneoffset)
        - [`toISOString()`](#toisostring)
        - [其他各种转换为字符串的方法](#其他各种转换为字符串的方法)
    - [References](#references)

<!-- /TOC -->


## The ECMAScript epoch and timestamps
1. A JavaScript date is fundamentally specified as the number of **milliseconds** that have elapsed since midnight on January 1, 1970, UTC. 
2. This date and time are not the same as the UNIX epoch (the number of **seconds** that have elapsed since midnight on January 1, 1970, UTC), which is the predominant base value for computer-recorded date and time values.
3. Note: It's important to keep in mind that while the time value at the heart of a `Date` object is UTC, the basic methods to fetch the date and time or its components all work in the local (i.e. host system) time zone and offset.
4. It should be noted that the maximum `Date` is not of the same value as the maximum safe integer (`Number.MAX_SAFE_INTEGER` is 9,007,199,254,740,991). Instead, it is defined in ECMA-262 that a maximum of ±100,000,000 (one hundred million) days relative to January 1, 1970 UTC (that is, April 20, 271821 BCE ~ September 13, 275760 CE) can be represented by the standard `Date` object (equivalent to ±8,640,000,000,000,000 milliseconds).


## Date Time String Format
1. ECMAScript defines a string interchange format for date-times based upon a simplification of the ISO 8601 Extended Format. 
2. The format is as follows: `YYYY-MM-DDTHH:mm:ss.sssZ`，`Z`可以换成表示时区的时间格式。一个例子：`2011-10-10T14:48:00.000+09:00`。
3. `Date` 对象的 `toISOString()` 会返回这种格式的字符串，使用 UTC 时区。

### Fields
Field | Meaning
--|--
`YYYY` | the decimal digits of the year 0000 to 9999 in the Gregorian calendar.
`-` | `-` (hyphen) appears literally twice in the string
`MM` | the month of the year from 01 (January) to 12 (December).
`DD` | the day of the month from 01 to 31.
`T` | `T` appears literally in the string, to indicate the beginning of the time element.
`HH` | the number of complete hours that have passed since midnight as two decimal digits from 00 to 24.
`:` | `:` (colon) appears literally twice in the string.
`mm` | the number of complete minutes since the start of the hour as two decimal digits from 00 to 59.
`ss` | the number of complete seconds since the start of the minute as two decimal digits from 00 to 59.
`.` | `.` (dot) appears literally in the string.
`sss` | the number of complete milliseconds since the start of the second as three decimal digits.
`Z` | the time zone offset specified as "Z" (for UTC) or either "+" or "-" followed by a time expression HH:mm. 也就是说，如果当前的时间字符串表示的 UTC 时间，则就是`Z`；如果要表达例如东八区的北京时间，则应该把`Z`换为`+08:00`

### 格式要求
* 可以像以下这样只有日期
    * `YYYY`
    * `YYYY-MM`
    * `YYYY-MM-DD`
* 也可以在后面加上时间。注意不能漏掉`T`
    * `THH:mm`
    * `THH:mm:ss`
    * `THH:mm:ss.sss`
* 数字必须是十进制
* 默认值
    * If the `MM` or `DD` fields are absent `"01"` is used as the value.
    * If the `HH`, `mm`, or `ss` fields are absent `"00"` is used as the value
    * The value of an absent `sss` field is `"000"`.
    * If the time zone offset is absent, the date-time is interpreted as a local time. 但实际上，在 2019.2，iOS 中如果不指明时区，则会使用 UTC。
* Illegal values (out-of-bounds as well as syntax errors) in a format string means that the format string is not a valid instance of this format. 在 2019.2，PC 和 Android 上并不会很严格，但 iOS 如果不使用标准格式，则不会返回期望的结果。

### Extended years
[不懂](https://www.ecma-international.org/ecma-262/6.0/#sec-extended-years)


## `Date()` constructor
1. Creates a JavaScript `Date` instance that represents a single moment in time in a platform-independent format. 
2. `Date` objects contain a `Number` that represents milliseconds since 1 January 1970 UTC. 表示的格式是基于当地时间，而内部存储的时间戳是基于 UTC 的。
    ```js
    let d = new Date('1970-01-01T00:00:00.000+00:00'); // 传入的是 UTC 时区的 0 点
    // 表示出来的格式，UTC 的 0 点就是东八区的 8 点
    console.log(d); // Thu Jan 01 1970 08:00:00 GMT+0800 (中国标准时间)
    // 但内部时间戳还是基于 UTC 的
    console.log( d.getTime() ); // 0
    ```
3. 如果不传参数，则生成的实例保存的是生成时的日期时间。如果传参数，分为下面的四种情况。

### 数值类型的毫秒时间戳
1. 该参数表示从 January 1, 1970, 00:00:00 UTC (the ECMAScript epoch, equivalent to the UNIX epoch) 以来的毫秒数。忽略闰秒。
2. Keep in mind that most UNIX Timestamp functions are only accurate to the nearest second
    ```js
    let d0 = new Date(0);
    console.log( d0.getMilliseconds() ); // 0
    console.log( d0 ); // Thu Jan 01 1970 08:00:00 GMT+0800 (中国标准时间)

    let d1 = new Date(1);
    console.log( d1.getMilliseconds() ); // 1
    console.log( d1 ); // Thu Jan 01 1970 08:00:00 GMT+0800 (中国标准时间)

    let d999 = new Date(999);
    console.log( d999.getMilliseconds() ); // 999
    console.log( d999 ); // Thu Jan 01 1970 08:00:00 GMT+0800 (中国标准时间) // 并不是四舍五入，而是只去当前的秒数

    let d1000 = new Date(1000);
    console.log( d1000.getMilliseconds() ); // 0
    console.log( d1000 ); // Thu Jan 01 1970 08:00:01 GMT+0800 (中国标准时间) 

    let d1001 = new Date(1001);
    console.log( d1001.getMilliseconds() ); // 1
    console.log( d1001 ); // Thu Jan 01 1970 08:00:01 GMT+0800 (中国标准时间)
    ```

### 字符串类型的 date 时间戳
1. A string value representing a date.
2. Parsing of date strings with the `Date` constructor (and `Date.parse()`, which works the same way) is strongly discouraged due to browser differences and inconsistencies.

### Individual date and time component values
1. `year` 和 `monthIndex` 是必须的，`day`、`hours`、`minutes`、`seconds` 和 `milliseconds` 都是可选的。
2. Any missing fields are given the lowest possible value (1 for `day` and 0 for every other component).
3. `year` 的值如果设置为 0 to 99 map to the years 1900 to 1999. All other values are the actual year
    ```js
    new Date(0, 0)   // Mon Jan 01 1900 00:00:00 GMT+0805 (中国标准时间)
    new Date(99, 0)  // Fri Jan 01 1999 00:00:00 GMT+0800 (中国标准时间)
    new Date(100, 0) // Fri Jan 01 0100 00:00:00 GMT+0805 (中国标准时间)
    ```
4. `hours` 的范围是 0-23，`minutes` 和 `seconds` 的范围是 0-59。
5. 一个值如果超过了它的允许范围会向前进位
    ```js
    // 2020年13月 变成了 2021年1月
    new Date(2020, 12) // Fri Jan 01 2021 00:00:00 GMT+0800 (中国标准时间)

    // 1月32日 变成了 2月1日
    new Date(2020, 0, 32) // Sat Feb 01 2020 00:00:00 GMT+0800 (中国标准时间)

    // 30日24点 变成了 31日0点
    new Date(2020, 0, 30, 24) // Fri Jan 31 2020 00:00:00 GMT+0800 (中国标准时间)

    // 10点60分 变成了 11点
    new Date(2020, 0, 30, 10, 60) // Thu Jan 30 2020 11:00:00 GMT+0800 (中国标准时间)

    // 40分60秒 变成了 41分6秒
    new Date(2020, 0, 30, 10, 40, 66) // Thu Jan 30 2020 10:41:06 GMT+0800 (中国标准时间)

    // 毫秒数上限是 1000，这里超出成了 10 天的毫秒数，所以日期变成了十天后
    new Date(2020, 0, 10, 0, 0, 0, 1000*3600*24*10) // Mon Jan 20 2020 00:00:00 GMT+0800 (中国标准时间)
    ```


## Static methods
### `Date.now()`
1. Returns the numeric value corresponding to the current time—the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC, with leap seconds ignored.
2. `new Date().getTime()` 有同样的返回
    ```js
    Date.now() === new Date().getTime()
    ```

### `Date.parse()`
1. Parses a string representation of a date and returns the number of milliseconds since 1 January, 1970, 00:00:00 UTC, with leap seconds ignored
    ```js
    let stamp = Date.parse('2011-10-10T14:48:00.000+09:00'); // 东九区
    console.log(stamp); // 1318225680000
  
    console.log( new Date(stamp) ); // 本地时区
    // Mon Oct 10 2011 13:48:00 GMT+0800 (中国标准时间)
    ``` 
2. Note: Parsing of strings with `Date.parse` is strongly discouraged due to browser differences and inconsistencies, therefore date strings should be manually parsed.
3. 如果字符串不能解析，会返回 `NaN`。

### `Date.UTC()`
1. 接受日期和时间参数，并将它们作为 UTC 形式，返回对应的距离 January 1, 1970, 00:00:00 UTC 的毫秒数。
2. `Date.UTC()` 是把参数当做 UTC 时间，而 `Date` 构造函数是把参数当做当地时间。比较如下
    ```js
    let params = [1970, 0, 1, 0, 0, 0]; // 同样的参数

    let stampUTC = Date.UTC(...params); // 按照 UTC 解析参数
    let stampBeijing = new Date(...params).getTime(); 
    // Date 按照当地时间（东八区）解析参数，所以 Date 记录下来的时间点是东八区 1 月 1 日 0 点，是 UTC 的前一天 16 点。
    // 也就是说，对于 UTC 来说，这个时间点还没有到 1 月 1 日 0 点，还差 8 个小时。
    // 而 Date 对象内部存储的毫秒数，是基于 UTC 的，所以它会存储一个负数，即 -8 * 3600 * 1000 = -28800000。
    // getTime 返回的也就是这个毫秒数。
    
    console.log( stampUTC ); // 0
    console.log( stampBeijing ); // -28800000
    ```


## 部分实例方法
### `getTime()`
1. The `getTime()` method returns the number of milliseconds since the Unix Epoch.
2. JavaScript uses milliseconds as the unit of measurement, whereas Unix Time is in seconds.
3. `getTime()` always uses UTC for time representation. For example, a client browser in one timezone, `getTime()` will be the same as a client browser in any other timezone.
4. You can use this method to help assign a date and time to another `Date` object. This method is functionally equivalent to the `valueOf()` method.

### `getTimezoneOffset()`
1. 返回当前日期的本地表示与 UTC 表示之间相差的分钟数：$UTC 分钟数 - 本地表示分钟数$
    ```js
    new Date().getTimezoneOffset() // -480  （东八区）
    ```
2. 注意是使用当前日期的本地表示，而和用什么时区生成当前日期没有关系。下面的日期对象是使用东九区格式字符串生成，但我当前还是在东八区
    ```js
    console.log(new Date('2011-10-10T14:48:00.000+09:00').getTimezoneOffset()); // -480
    ```

### `toISOString()`
返回 ISO 8601 Extended Format 字符串，时区总是 UTC。
```js
new Date('2011-10-10T14:48:00.000+09:00').toISOString(); // "2011-10-10T05:48:00.000Z"
```

### 其他各种转换为字符串的方法
```js
console.log( d.toString() );            // Mon Oct 10 2011 13:48:00 GMT+0800 (中国标准时间)
console.log( d.toUTCString() );         // Mon, 10 Oct 2011 05:48:00 GMT
console.log( d.toISOString() );         // 2011-10-10T05:48:00.000Z
console.log( d.toJSON() );              // 2011-10-10T05:48:00.000Z
console.log( d.toLocaleString() );      // 2011/10/10 下午1:48:00

console.log( d.toDateString() );        // Mon Oct 10 2011
console.log( d.toLocaleDateString() );  // 2011/10/10

console.log( d.toTimeString() );        // 13:48:00 GMT+0800 (中国标准时间)
console.log( d.toLocaleTimeString() );  // 下午1:48:00
```


## References
* [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* [ECMAScript 2015 (6th Edition, ECMA-262)](https://www.ecma-international.org/ecma-262/6.0/#sec-date-objects)
