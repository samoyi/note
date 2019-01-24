# Date

## Overview of Date Objects and Definitions of Abstract Operations
### Date Time String Format
ECMAScript defines a string interchange format for date-times based upon a simplification of the ISO 8601 Extended Format. The format is as follows: `YYYY-MM-DDTHH:mm:ss.sssZ`.(`Z`可以换成表示时区的时间格式)

#### Fields
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

#### 格式要求
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
* Illegal values (out-of-bounds as well as syntax errors) in a format string means that the format string is not a valid instance of this format. 在 2019.2，PC 和 Android 上并不会很严格，但 iOS 如果不适用标准格式，则不会返回期望的结果。

#### Extended years
[不懂](https://www.ecma-international.org/ecma-262/6.0/#sec-extended-years)


## References
* [ECMAScript 2015 (6th Edition, ECMA-262)](https://www.ecma-international.org/ecma-262/6.0/#sec-date-objects)
