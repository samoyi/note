function ArrayList(){

    let array = [];

    function swap(index1, index2){
        var aux = array[index1];
        array[index1] = array[index2];
        array[index2] = aux;
    };




    this.insert = function(item){
        array.push(item);
    };


    this.toString= function(){
        return array.join();
    };


    this.bubbleSort = function(){
        let len = array.length;
        while(len--){
            for(let i=0; i<len; i++){
                if( array[i]>array[i+1] ){
                    swap(i, i+1);
                }
            }
        }
        return array;
    };


    this.selectionSort = function(){
        let len = array.length,
            indexMin = null;
        for (let i=0; i<len-1; i++){
            indexMin = i;
            for (let j=i+1; j<len; j++){
                if(array[indexMin]>array[j]){
                    indexMin = j;
                }
            }
            if (i !== indexMin){
                swap(i, indexMin);
            }
        }
        return array;
    };


}

module.exports = ArrayList;
