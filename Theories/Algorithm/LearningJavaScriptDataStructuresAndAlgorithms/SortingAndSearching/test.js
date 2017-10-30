
let array = [5, 3, 2, 8, 7, 4, 9, 1, 6, 0];

// function selectionSort(array){
//     let len = array.length,
//         nMinIndex = null,
//         nMin = null,
//         aMin = [];
//     for(let i=0; i<len-1;){
//         j = 1;
//         nMinIndex = i;
//         nMin = array[nMinIndex];
//         for(let j=1; j<len; j++){
//             if( nMin>array[j] ){
//                 nMinIndex = j;
//                 nMin = array[j];
//             }
//         }
//         aMin.push(array.splice(nMinIndex, 1)[0]);
//
//         len--;
//     }
//     aMin.push(array[0]);
//     return aMin;
// }



var swap = function(index1, index2){
    var aux = array[index1];
    array[index1] = array[index2];
    array[index2] = aux;
};




function selectionSort(){
    var length = array.length,            //{1}
        indexMin;
    for (var i=0; i<length-1; i++){       //{2}
        indexMin = i;                     //{3}
        for (var j=i; j<length; j++){     //{4}
        // Here, i === indexMin and j === i, so in the first if,
        // array[indexMin] === array[j] ? why not set j=i+1 ?
            if(array[indexMin]>array[j]){ //{5}
                indexMin = j;             //{6}
            }
        }
        if (i !== indexMin){              //{7}
            swap(i, indexMin);
        }
    }

    return array;
};


// bubble(a);
console.log( selectionSort(array) );
