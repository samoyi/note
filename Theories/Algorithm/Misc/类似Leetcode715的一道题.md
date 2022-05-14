# 类似 Leetcode715  的一道题


<!-- TOC -->

- [类似 Leetcode715  的一道题](#类似-leetcode715--的一道题)
    - [描述](#描述)
    - [实现](#实现)
        - [TS 版本](#ts-版本)
        - [JS 版本](#js-版本)
    - [References](#references)

<!-- /TOC -->


## 描述
* Task: Implement a class named `'RangeList'`
* A pair of integers define a range, for example: `[1, 5)`. This range includes integers: 1, 2, 3, and 4.
* A range list is an aggregate of these ranges: `[1, 5)`, `[10, 11)`, `[100, 201)`


## 实现
参考了官方解法中使用了 Python 的解法，没有使用 TreeSet

### TS 版本
```ts
class RangeList {

    private list: [number, number][];
    
    constructor () {
        // Init range list
        this.list = [];
    }

    private assertRange (range: readonly [number, number]): void {
        if ( !Number.isInteger(range[0]) || !Number.isInteger(range[1]) ) {
            throw new TypeError("Range items must be intergers.");
        }
        if ( range[0] < 0) {
            throw new RangeError("Range items must be non-negative.");
        }
        if ( range[0] > range[1] ) {
            throw new RangeError("Range start must not be larger than range end.");
        }
    }

    /**
     * Get ranges that overlapped with the range given in parameter.
     * @param range - Array of two integers that specify beginning and end of range.
     * @returns     - First and last indexes of overlapped ranges.
     */
    private getOverlappedRanges (range: readonly [number, number]): [number, number] {
        let list = this.list;

        // From left to right, find the first range which overlapped with the one given.
        let i: number = 0;
        for (; i < list.length; i++) {
            if (list[i][1] >= range[0]) {
                break;
            }
        }
        
        // From right to left, find the first range which overlapped with the one given.
        let j: number = list.length - 1;
        for (; j > -1; j--) {
            if (list[j][0] <= range[1]) {
                break;
            }
        }

        /**
         * If no overlapped range, we should insert the range given directly. Here are 3 cases:
         *     If the range should be inserted as head: i is 0, j is -1.
         *     If the range should be inserted as tail: i is list.length, j is list.length-1.
         *     If the range should be inserted between 2 existing ranges, i is the position to be *         inserted. (j === i-1)
         * 
         * In the above 3 cases, j equals i-1.
         */
        return [i, j];
    }

    /**
     * Adds a range to the list
     * @param range - Array of two integers that specify beginning and end of range.
     */
    add(range: readonly [number, number]): void {
        this.assertRange(range);

        let list = this.list;

        // Add first range
        if (list.length === 0) {
            this.list = [[range[0], range[1]]];
            return;
        }

        let [i, j] = this.getOverlappedRanges(range);
        if (i <= j) { // Has overlapped ranges
            // Merge overlapped ranges
            let min: number = Math.min(range[0], list[i][0]);
            let max: number = Math.max(range[1], list[j][1]);
            list.splice(i, j-i+1, [min, max]);
        }
        else if (range[0] < range[1]) { // Not an empty range
            // If no overlapped range, insert the range given 
            list.splice(i, 0, [range[0], range[1]]);
        }
    }

    /**
     * Removes a range from the list
     * @param range - Array of two integers that specify beginning and end of range.
     */
    remove(range: readonly [number, number]): void {
        this.assertRange(range);

        if (range[0] === range[1]) { // Empty range
            return;
        }

        let list = this.list;
        
        let [i, j] = this.getOverlappedRanges(range);
        // remove method will cut part of list[i] and part of list[i], and remove all ranges between
        //     these two.
        // Get the remaining two parts:
        let sliceLeft: [number, number] = [list[i][0], range[0]];
        let sliceRight: [number, number] = [range[1], list[j][1]];

        // Don't insert emtpy slices
        let slices: [number, number][] = [];
        if ( sliceLeft[0] !== sliceLeft[1] ) {
            slices.push(sliceLeft);
        }
        if ( sliceRight[0] !== sliceRight[1] ) {
            slices.push(sliceRight);
        }
        // Remove overlapped ranges and insert non-empty slices
        list.splice(i, j-i+1, ...slices);
    }
    
    /**
     * Prints out the list of list in the range list
     */
    print(): void {
        let res:string = "";
        this.list.forEach((range) => {
            res += `[${range[0]}, ${range[1]}) `;
        });
        console.log(res);
    }
}


// Example run
const rl = new RangeList();
rl.add([1, 5]);
rl.print();
// Should display: [1, 5)
rl.add([10, 20]);
rl.print();
// Should display: [1, 5) [10, 20)
rl.add([20, 20]);
rl.print();
// Should display: [1, 5) [10, 20)
rl.add([20, 21]);
rl.print();
// Should display: [1, 5) [10, 21)
rl.add([2, 4]);
rl.print();
// Should display: [1, 5) [10, 21)
rl.add([3, 8]);
rl.print();
// Should display: [1, 8) [10, 21)
rl.remove([10, 10]);
rl.print();
// Should display: [1, 8) [10, 21)
rl.remove([10, 11]);
rl.print();
// Should display: [1, 8) [11, 21)
rl.remove([15, 17]);
rl.print();
// Should display: [1, 8) [11, 15) [17, 21)
rl.remove([3, 19]);
rl.print();
// Should display: [1, 3) [19, 21)
```

### JS 版本
```js
class RangeList {
    constructor() {
        /**
         * Init range list
         * @private
         */  
        this.list = [];
    }

    /**
     * Adds a range to the list
     * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
     */
    add(range) {
        _assertRange(range);

        let list = this.list;

        // Add first range
        if (list.length === 0) {
            this.list = [[range[0], range[1]]];
            return;
        }

        let [i, j] = _getOverlappedRanges(list, range);
        if (i <= j) { // Has overlapped ranges
            // Merge overlapped ranges
            let min = Math.min(range[0], list[i][0]);
            let max = Math.max(range[1], list[j][1]);
            list.splice(i, j - i + 1, [min, max]);
        }
        else if (range[0] < range[1]) { // Not an empty range
            // If no overlapped range, insert the range given 
            list.splice(i, 0, [range[0], range[1]]);
        }
    }

    /**
     * Removes a range from the list
     * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
     */
    remove(range) {
        _assertRange(range);

        if (range[0] === range[1]) { // Empty range
            return;
        }

        let list = this.list;

        let [i, j] = _getOverlappedRanges(list, range);
        // remove method will cut part of list[i] and part of list[i], and remove all ranges between
        //     these two.
        // Get the remaining two parts:
        let sliceLeft= [list[i][0], range[0]];
        let sliceRight= [range[1], list[j][1]];

        // Don't insert emtpy slices
        let slices = [];
        if (sliceLeft[0] !== sliceLeft[1]) {
            slices.push(sliceLeft);
        }
        if (sliceRight[0] !== sliceRight[1]) {
            slices.push(sliceRight);
        }
        // Remove overlapped ranges and insert non-empty slices
        list.splice(i, j - i + 1, ...slices);
    }

    /**
     * Prints out the list of list in the range list
     */
    print() {
        let res = "";
        this.list.forEach((range) => {
            res += `[${range[0]}, ${range[1]}) `;
        });
        console.log(res);
    }
}


/************************************ PRIVATE METHODS START ***************************************/
/**
 * Assert range type
 * @private
 * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
 */ 
 function _assertRange(range) {
    if (
        !Array.isArray(range)
        || range.length !== 2
        || !Number.isInteger(range[0]) 
        || !Number.isInteger(range[1])
    ) {
        throw new TypeError("Range must be an array of two intergers.");
    }
    if (range[0] < 0) {
        throw new RangeError("Range items must be non-negative.");
    }
    if (range[0] > range[1]) {
        throw new RangeError("Range start must not be larger than range end.");
    }
}

/**
 * Get ranges that overlapped with the range given in parameter.
 * @private
 * @param {Array<range>}     list   - List of range, instance property of RangeList.
 * @param {Array<number>}    range  - Array of two integers that specify beginning and end of range.
 * @returns {Array<number>}         - First and last indexes of overlapped ranges.
 */
function _getOverlappedRanges(list, range) {
    // From left to right, find the first range which overlapped with the one given.
    let i = 0;
    for (; i < list.length; i++) {
        if (list[i][1] >= range[0]) {
            break;
        }
    }

    // From right to left, find the first range which overlapped with the one given.
    let j = list.length - 1;
    for (; j > -1; j--) {
        if (list[j][0] <= range[1]) {
            break;
        }
    }

    /**
     * If no overlapped range, we should insert the range given directly. Here are 3 cases:
     *     If the range should be inserted as head: i is 0, j is -1.
     *     If the range should be inserted as tail: i is list.length, j is list.length-1.
     *     If the range should be inserted between 2 existing ranges, i is the position to be *         inserted. (j === i-1)
     * 
     * In the above 3 cases, j equals i-1.
     */
    return [i, j];
}
/************************************ PRIVATE METHODS END *****************************************/


// Example run
const rl = new RangeList();
rl.add([1, 5]);
rl.print();
// Should display: [1, 5)
rl.add([10, 20]);
rl.print();
// Should display: [1, 5) [10, 20)
rl.add([20, 20]);
rl.print();
// Should display: [1, 5) [10, 20)
rl.add([20, 21]);
rl.print();
// Should display: [1, 5) [10, 21)
rl.add([2, 4]);
rl.print();
// Should display: [1, 5) [10, 21)
rl.add([3, 8]);
rl.print();
// Should display: [1, 8) [10, 21)
rl.remove([10, 10]);
rl.print();
// Should display: [1, 8) [10, 21)
rl.remove([10, 11]);
rl.print();
// Should display: [1, 8) [11, 21)
rl.remove([15, 17]);
rl.print();
// Should display: [1, 8) [11, 15) [17, 21)
rl.remove([3, 19]);
rl.print();
// Should display: [1, 3) [19, 21)
```


## References
