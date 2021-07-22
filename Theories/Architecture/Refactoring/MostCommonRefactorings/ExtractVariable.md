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
### 意图与实现分离
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

### 定义相对值
1. 下面是实现归并排序 `merge` 函数的一个实现
    ```cpp
    void merge(int* arr, int low, int mid, int high) {
        int* left = calloc(mid - low + 1, sizeof(int));
        int* right = calloc(high - mid, sizeof(int));
        if (left == NULL || right == NULL)  {
            printf("Error: calloc failed in merge.\n");
            exit(EXIT_FAILURE);
        }
        
        for (int i=low; i<=mid; i++) {
            left[i-low] = arr[i];
        }
        for (int j=mid+1; j<=high; j++) {
            right[j-mid-1] = arr[j];
        }

        int m = low, n = mid + 1;
        for (int k=low; k<=high; k++) {
            if (m <= mid && n <= high) {
                if (left[m-low] < right[n-mid-1]) {
                    arr[k] = left[m-low];
                    m++;
                }
                else {
                    arr[k] = right[n-mid-1];
                    n++;
                }
            }
            else if (m == mid+1) {
                arr[k] = right[n-mid-1];
                n++;
            }
            else {
                arr[k] = left[m-low];
                m++;
            }
        }    

        free(left);
        free(right);
    }
    ```
2. 在调用两个 `calloc` 函数是，第一个参数的表达式并没有提取变量，这首先就违背了意图与实现分离。应该改成下面的样子
    ```cpp
    int leftSize = mid - low + 1;
    int rightSize = high - mid;

    int* left = calloc(leftSize, sizeof(int));
    int* right = calloc(rightSize, sizeof(int));
    ```
3. 由于没有提取变量，所以在下面复制两个数组的时候，循环体内部的逻辑就显得不够直观
    ```cpp
    for (int i=low; i<=mid; i++) {
        left[i-low] = arr[i];
    }
    ```
    `left` 的索引还是只能使用 `arr` 的索引变量 `low` 来计算，而 `arr` 的索引又不能使用自己的 `low` 来计算。
4. 如果之前提取了变量，则这个循环就变成了
    ```cpp
    for (int i=0; i<leftSize; i++) {
        left[i] = arr[low+i];
    }
    ```
    现在可以很直观的看出来是依次对 `left` 的每一项进行操作，而且也可以直观的看出来是从 `arr` 中的哪些项进行复制。
5. 提取变量后，`left` 就可以使用相对于自己的索引数据，而不是原本的 `arr` 的索引数据。使用相对数据一般都要比使用绝对数据更方便一些。


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
