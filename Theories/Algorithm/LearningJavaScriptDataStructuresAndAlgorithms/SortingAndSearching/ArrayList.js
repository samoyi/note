function ArrayList(){

    let array = [];

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
                    array.splice(i+1, 0, array.splice(i,1)[0] );
                }
            }
        }
    };
}
