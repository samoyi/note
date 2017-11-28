function LinearProbing(){
    let table = [];

    function djb2HashCode (key){
        let hash = 5381,
            len = key.length;
        for (let i=0; i<len; i++) {
           hash = hash * 33 + key.charCodeAt(i);
        }
        return hash % 1013;
    }


    function ValuePair(key, value){
        this.key = key;
        this.value = value;
        this.toString = function() {
            return '[' + this.key + ' - ' + this.value + ']';
        }
    };


    this.put = function(key, value) {
        let position = djb2HashCode( key );
        while( table[position] !== undefined ){
            position++;
        }
        table[position] = new ValuePair(key, value);;
    };


    this.get = function (key) {
        let position = djb2HashCode( key );
        if( table[position] !== undefined ){
            while( table[position]!==undefined && table[position].key!==key ){
                position++;
            }
            return table[position].value;
        }
        return undefined;
    };


    this.remove = function(key) {
        let position = djb2HashCode( key );
        if( table[position] !== undefined ){
            while( table[position]!==undefined && table[position].key!==key ){
                position++;
            }
            table[position] = undefined;
            return true;
        }
        return false;
    };


    this.print = function() {
        table.forEach(function(item){
            if( item !== undefined ){
                console.log(item.toString());
            }
        });
    };

}


module.exports = LinearProbing;
