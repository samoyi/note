# Extract Variable


## 思想
### Speration between intention and implementation
1. 看看下面的变量提取
    ```js
    const basePrice = order.quantity * order.itemPrice;
    const quantityDiscount = Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;
    const shipping = Math.min(basePrice * 0.1, 100);
    return basePrice - quantityDiscount + shipping;
    ```
2. 再看实际计算的那一行时（最后一行），我只关心是进行了什么计算，我只需要知道这里计算的 intention，我只关心有哪些业务数据参与了计算，我不关心这些业务数据是怎么计算出来的（implementation）


## Motivation
1. Expressions can become very complex and hard to read. In such situations, local variables may help break the expression down into something more manageable. 
  ```js
  return order.quantity * order.itemPrice -
      Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 +
      Math.min(order.quantity * order.itemPrice * 0.1, 100);
  ```
2. In particular, they give me an ability to name a part of a more complex piece of logic. This
allows me to better understand the purpose of what’s happening.
  ```js
  const basePrice = order.quantity * order.itemPrice;
  const quantityDiscount = Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;
  const shipping = Math.min(basePrice * 0.1, 100);
  return basePrice - quantityDiscount + shipping;
  ```
3. Such variables are also handy for debugging, since they provide an easy hook for a debugger or print statement to capture.
4. If I’m considering Extract Variable, it means I want to add a name to an expression in my code. 
5. Once I’ve decided I want to do that, I also think about the context of that name. If it’s only meaningful within the function I’m working on, then Extract Variable is a good choice — but if it makes sense in a broader context, I’ll consider making the name available in that broader context, usually as a function. If the name is available more widely, then other code can use that expression without having to repeat the expression, leading to less duplication and a better statement of my intent.
6. TODO:  下述的两种处理方法。The downside of promoting the name to a broader context is extra effort. If it’s significantly more effort, I’m likely to leave it till later when I can use **Replace Temp with Query(106)**. But if it’s easy, I like to do it now so the name is immediately available in the code. As a good example of this, if I’m working in a class, then **Extract Function(106)** is very easy to do.


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
