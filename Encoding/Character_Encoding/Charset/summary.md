



## 二进制和十六进制心算转换
```
console.log( 0b100000000.toString(16) );                             // "100"          "1 0000 0000" => 2^8 => 16^2
console.log( 0b10000000000.toString(16) );                           // "400"          "100 0000 0000" => 2^10 => (2^8)*4 => (16^2)*4
console.log( 0b10000000000000000.toString(16) );                     // "10000"        "1 0000 0000 0000 0000" => 2^16 => 16^4
console.log( 0b100000000000000000000.toString(16) );                 // "100000"       "1 0000 0000 0000 0000 0000" => 2^20 => (2^16)*(2^4) => (16^5)
console.log( 0b1000000000000000000000000000000.toString(16) );       // "40000000"     "100 0000 0000 0000 0000 0000 0000 0000" => 2^30 => (2^28)*(2^2) => (16^7)*4
console.log( 0b100000000000000000000000000000000.toString(16) );     // "100000000"    "1 0000 0000 0000 0000 0000 0000 0000 0000" => 2^32 => (16^8)

console.log( 0xA.toString(2) );         // 1010
console.log( 0xF.toString(2) );         // 1111
console.log( 0x10.toString(2) );        // 1 0000                    16
console.log( 0xA0.toString(2) );        // 1010 0000                 10个16 => 1010个10000
console.log( 0xB0.toString(2) );        // 1011 0000                 11个16 => 1011个10000
console.log( 0xA00.toString(2) );       // 1010 0000 0000            10*(16^2) => (2^9)*5 => 2^9左移2位再加2^9
console.log( 0xA000.toString(2) );      // 1010 0000 0000 0000       10*(16^3) => (2^13)*5 => 2^13左移2位再加2^13
console.log( 0xA0000.toString(2) );     // 1010 0000 0000 0000 0000      10*(16^4) => (2^17)*5 => 2^17左移2位再加2^17

console.log( 0x100.toString(10) );        // 256
console.log( 0x1000.toString(10) );       //  4096
console.log( 0x10000.toString(10) );      // 65546
console.log( 0x100000.toString(10) );     // 1048576

```