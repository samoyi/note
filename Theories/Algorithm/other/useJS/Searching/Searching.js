const {quickSort} = require('../Sorting/Sorting');

 function binarySearch (arr, item) {
    arr = quickSort(arr);
    console.log(arr)

    let nLowIndex = 0;
    let nHighIndex = arr.length - 1;
    let nMidIndex = null;
    let nMidItem = null;

    while (nLowIndex <= nHighIndex) {
        nMidIndex = Math.floor((nLowIndex + nHighIndex) / 2)
        nMidItem = arr[nMidIndex];
        if (item > nMidItem) {
            nLowIndex = nMidIndex + 1;
        } 
        else if (item < nMidItem) {
            nHighIndex = nMidIndex - 1;
        } 
        else {
            return nMidIndex;
        }
    }
    return -1;
};

module.exports = {
    binarySearch,
};