# Sieve of Eratosthenes
Finding all prime numbers up to any given limit.

## 基本原理示例
  To find all the prime numbers less than or equal to 30
  ```
  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30
  ```
1. 选出第一个素数2，删掉2的倍数
  ```
  2  3  5  7  9  11  13  15  17  19  21  23  25  27  29
  ```
  * 删掉的第一个数是2*2
  * 在剩下的数里面，2之后的一个数3也是素数（如果不是素数，那就只能是2的倍数，在第一步会被删除）。
2. 选出素数3，删除3的倍数
  ```
  2  3  5  7  11  13  17  19  23  25  29
  ```
  * 删掉的第一个数是3*3（3*2已经在第一步被删了）
  * 在剩下的数里面，3之后的一个数5也是素数（如果不是素数，那就只能是2或3的倍数，在前两步会被删除）。
3. 选出素数5，删除5的倍数
  ```
  2  3  5  7  11  13  17  19  23  29
  ```
  * 删掉的第一个数是5*5（5*2、5*3、5*2*2 已经在前两步被删了）
  * 同理，在剩下的数里面，5之后的一个数也是素数，即7。
4. 选出素数7，删除7的倍数。
5. 发现剩余的数里面没有7的倍数。因为如果有的话，第一个被删除的是7*7，但49已经大于这里的上限30了
6. 同理，也不可能有11及更大的素数的倍数
7. 剩下的数都是素数  

按照上面的算法，实现一个最基本的函数
```js
function SieveOfEratosthenes(nMax){
  let arr = [2],
      index = 0;

  nMax = Math.floor(nMax);

  for( let i=3; i<nMax+1;){
    arr.push( i );
    i+=2; // 直接跳过偶数
  }

  while( arr[index]*arr[index] <= nMax ){
    for( let i=index+1; i<arr.length; i++){
      if( Math.floor(arr[i]/arr[index]) === arr[i]/arr[index] ){
        arr.splice(i, 1); i--;
      }
    }
    index++;
  }
  return arr;
}
```
