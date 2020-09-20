# HashTable

## 散列表的优势
1. 假设我们要存储大量的映射数据。
2. 因为必须要存储映射，所以不能使用速度快得多的数组结构。
3. 基础的情况下，当我们想要查找一个元素时，只有一个一个的遍历，这时很耗时的。
4. 散列表可以让我们根据一个 key 直接找到它对应的 value，而不需要遍历。通过散列函数，将每个 key 转换为一个数字值，然后就可以使用高效的数组来保存映射。
5. 从很简单 lose lose hash function 可以看出原理：
    ```js
    function loseloseHashCode(key) {
        let hash = 0;                          
        for (let i = 0; i < key.length; i++) { 
            hash += key.charCodeAt(i);         
        }
        let index = hash % 37;
        console.log(key +' => '+ index);
        return index;
    }

    let persons = {
        Gandalf:  'gandalf@email.com',
        John:     'johnsnow@email.com',
        Tyrion:   'tyrion@email.com',
        Aaron:    'aaron@email.com',
        Donnie:   'donnie@email.com',
        Ana:      'ana@email.com',
        Jonathan: 'jonathan@email.com',
        Jamie:    'jamie@email.com',
        Sue:      'sue@email.com',
        Mindy:    'mindy@email.com',
        Paul:     'paul@email.com',
        Nathan:   'nathan@email.com',
    };


    Object.keys(persons).forEach(key => {
        loseloseHashCode(key);
    });

    // Gandalf  => 19
    // John     => 29
    // Tyrion   => 16
    // Aaron    => 16
    // Donnie   => 13
    // Ana      => 13
    // Jonathan => 5
    // Jamie    => 5
    // Sue      => 5
    // Mindy    => 32
    // Paul     => 32
    // Nathan   => 10
    ```
6. 本来数据如果存储在对象`person`中，则每次查找都效率都比较低。现在把所有的 key 都转化为数值，则“字符串-字符串”的映射就变成了“数值-字符串”的映射，因此可以使用数组来保存。
7. 但问题也很明显，就是很多 key 转换为的数值都是相同的。这一方面可以通过使用更好的散列函数来减少重复，但根本上还是要通过彻底的解决冲突的方法来保证不会有冲突。



## 设计思想
说起来好像也没什么，就是把低效的尝试往高效的转换。


## 避免冲突
### Separate Chaining 方法
1. 因为经过 hash 转换后，一个数组位可能对应多个值，那就直接让数组位可以存储多个值。
2. 给每个值再加一个区分属性，让一个数组位的多个值可以彼此区分。
3. 因为每个值要加一个区分属性，其实保存的就不是单独的值，而是值和区分属性两者组成的一个对象。
4. Separate Chaining 方法是在每个数组位保存链表。

### Linear Probing 方法
1. 存储一个值时，如果当前数组位已经有了，就线性的依次查找后面的位置，直到找到一个空位，存储到这个空位。
2. 可以看出来，使用这种方法，也不能存储单独的值，而应该是值和区分属性两者组成的一个对象。这样在读取时，定位到一个数组位时，需要向后逐个检查区分属性的值是否相等。