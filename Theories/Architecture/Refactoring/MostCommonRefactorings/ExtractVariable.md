# Extract Variable

inverse of: *Inline Variable*


## 思想
### 意图与实现分离
1. 看看下面的变量提取
    ```js
    const basePrice = order.quantity * order.itemPrice;
    const quantityDiscount = Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;
    const shipping = Math.min(basePrice * 0.1, 100);
    return basePrice - quantityDiscount + shipping;
    ```
2. 再看实际计算的那一行时（最后一行），我只关心是进行了什么计算，我只需要知道这里计算的意图（intention），我只关心有哪些业务数据参与了计算，我不关心这些业务数据是怎么计算出来的（implementation）。


## Motivation
1. 如果表达式比较复杂，那看起来就很费劲，而且很多时候我们只关心这个表达式的意图，而不关心它的实现
    ```js
    return order.quantity * order.itemPrice -
        Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 +
        Math.min(order.quantity * order.itemPrice * 0.1, 100);
    ```
2. 这时就可以将表达式的结果保存在一个变量里，用变量的名称表现表达式的意图
    ```js
    const basePrice = order.quantity * order.itemPrice;
    const quantityDiscount = Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;
    const shipping = Math.min(basePrice * 0.1, 100);
    return basePrice - quantityDiscount + shipping;
    ```


## Mechanics
1. Ensure that the expression you want to extract does not have side effects.
2. Declare an immutable variable. Set it to a copy of the expression you want to name.
3. Replace the original expression with the new variable.
4. Test.


## Examples
### With a Class
1. 重构前
    ```js
    class Order {
      constructor(aRecord) {
        this._data = aRecord;
      }
      
      get quantity() {return this._data.quantity;}
      
      get itemPrice() {return this._data.itemPrice;}
      
      get price() {
        return this.quantity * this.itemPrice ­-
        Math.max(0, this.quantity ­ 500) * this.itemPrice * 0.05 +
        Math.min(this.quantity * this.itemPrice * 0.1, 100);
      }
    }
    ```
2. In this case, I want to extract the same names, but I realize that the names apply to the `Order` as a whole, not just the calculation of the price. Since they apply to the whole order, I’m inclined to extract the names as methods rather than variables
    ```js
    class Order {
        constructor(aRecord) {
            this._data = aRecord;
        }
        
        get quantity() {return this._data.quantity;}

        get itemPrice() {return this._data.itemPrice;}

        get price() {
            return this.basePrice ­- this.quantityDiscount + this.shipping;
        }
    
        get basePrice() {return this.quantity * this.itemPrice;}

        get quantityDiscount() {return Math.max(0, this.quantity ­ 500) * this.itemPrice;}

        get shipping() {return Math.min(this.basePrice * 0.1, 100);}
    }
    ```
3. This is one of the great benefits of objects — they give you a reasonable amount of context for logic to share other bits of logic and data. For something as simple as this, it doesn’t matter so much, but with a larger class it becomes very useful to call out common hunks of behavior as their own abstractions with their own names to refer to them whenever I’m working with the object.


## References
* [《重构（第2版）》](https://book.douban.com/subject/33400354/)
