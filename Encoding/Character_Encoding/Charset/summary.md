



## 二进制和十六进制心算转换
```
let p8 = Math.pow(2, 8),
	p10 = Math.pow(2, 10),
	p16 = Math.pow(2, 16),
	p20 = Math.pow(2, 20),
	p30 = Math.pow(2, 30),
	p32 = Math.pow(2, 32);
console.log(p8, p8.toString(2), p8.toString(16));     // 256 "1 00000000" "100"
console.log(p10, p10.toString(2), p10.toString(16));  // 1024 "100 00000000" "400"
console.log(p16, p16.toString(2), p16.toString(16));  // 65536 "1 00000000 00000000" "10000"
console.log(p20, p20.toString(2), p20.toString(16));  // 1048576 "10000 00000000 00000000" "100000"
console.log(p30, p30.toString(2), p30.toString(16));  // 1073741824 "1000000 00000000 00000000 00000000" "40000000"
console.log(p32, p32.toString(2), p32.toString(16));  // 4294967296 "1 00000000 00000000 00000000 00000000" "100000000"
```
