// 这个文件构建的散列表演示了基本原理，并不会解决散列值冲突的问题。另外两个文件中分别构
// 建了使用 Separate Chaining 和 Linear Probing 解决散列值冲突的散列表方案

/*
 * 散列算法的作用是尽可能快地在数据结构中找到一个值。在之前的章节中，你已经知道如果要在
 * 数据结构中获得一个值（使用get方法），需要遍历整个数据结构来找到它。如果使用散列函数，
 * 就知道值的具体位置，因此能够快速检索到该值。散列函数的作用是给定一个键值，然后返回值
 * 在表中的地址。
 */

 /*
  * 对于 HashTable 类来说，我们不需要像 ArrayList 类一样从 table 数组中将位置也移除。
  * 由于元素分布于整个数组范围内，一些位置会没有任何元素占据，并默认为 undefined 值。
  * 我们也不能将位置本身从数组中移除（这会改变其他元素的位置），否则，当下次需要获得或
  * 移除一个元素的时候，这个元素会不在我们用散列函数求出的位置上。
  */

 /*
  * 有时候，一些键会有相同的散列值。不同的值在散列表中对应相同位置的时候，我们称其为冲
  * 突。 如果不采取措施，当两个键的散列值相同时，后添加的就会覆盖先添加的。
  * 处理冲突有几种方法：分离链接（Separate Chaining）、线性探查（Linear Probing）和
  * 双散列法。
  */




function HashTable(){
    let table = [];

    function djb2HashCode (key){
        let hash = 5381; // 初始化一个 hash 变量并赋值为一个质数，大多数实现都使用 5381
        let len = key.length;

        key = [...key];
        for (let i=0; i<len; i++) {
           hash = hash * 33 + key.codePointAt(i);
        }
        return hash % 1013; // 与另一个随机质数相除的余数作为散列值。这里选择的指数应该略大于数据总数
    }


    this.put = function(key, value) {
        let position = djb2HashCode( key );
        table[position] = value;
    };


    this.get = function (key) {
        return table[djb2HashCode(key)];
    };


    this.remove = function(key) {
         table[djb2HashCode(key)] = undefined;
    };
}

module.exports = HashTable;
