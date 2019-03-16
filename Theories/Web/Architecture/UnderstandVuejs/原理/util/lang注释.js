// 源码版本： 2.5.17

/* @flow */

/**
* Check if a string starts with $ or _
*/
export function isReserved (str: string): boolean {
    // charCodeAt 虽然不能像 codePointAt 那样识别4字节字符，但因为 $ 和 _ 的 Unicode 值并不会出现在4字节字符的
    // 高位范围（0xd800~0xdbff）内，所以只要第一个字节的值是 0x24 或 0x5f，就一定是 $ 或 _
    const c = (str + '').charCodeAt(0)
    return c === 0x24 || c === 0x5F
}

/**
* Define a property.
*/
// 定义可写可配置的访问器属性
export function def (obj: Object, key: string, val: any, enumerable?: boolean) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
}

/**
* Parse simple path.
*/
// 解析一个属性路径，返回一个函数。该函数接收一个对象，并根据解析的属性路径找到对应的属性值。例如：
// let obj = {
//     person: {
//         name: '33',
//     },
// };
// parsePath('person.name')(obj); // '33'
const bailRE = /[^\w.$]/
export function parsePath (path: string): any {
    // 如果 path 中包含数字、大小写字母、`.`或者`$`，则不进行解析
    if (bailRE.test(path)) {
        return
    }
    const segments = path.split('.')
    return function (obj) {
        for (let i = 0; i < segments.length; i++) {
            if (!obj) return
            obj = obj[segments[i]]
        }
        return obj
    }
}
