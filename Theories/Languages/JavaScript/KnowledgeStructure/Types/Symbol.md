# Symbol

* Symbol类型的数据是基本类型，
* 与其他基本类型可以通过字面量生成不同，Symbol类型必须通过`Symbol()`函数来生成
* Symbol函数可以接受一个字符串作为参数，表示对Symbol实例的描述。主要是为了在控制台显示，或者转为字符串时，比较容易区分。
* Symbol值不能与其他类型的值进行运算
* Symbol值除了可以转换为字符串值，也可以转换为布尔值 true
* 任何两个Symbol值都不相同
* Symbol 作为属性名，该属性不会出现在`for...in`、`for...of`循环中，也不会被`Object.keys()`、`Object.getOwnPropertyNames()`、`JSON.stringify()`返回。但是，它也不是私有属性，有一个`Object.getOwnPropertySymbols`方法，可以获取指定对象的所有 Symbol 属性名。
