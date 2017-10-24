function HashTable(){
    let table = [];

    function djb2HashCode (key){
        let hash = 5381,
            len = key.length;
        for (let i=0; i<len; i++) {
           hash = hash * 33 + key.charCodeAt(i);
        }
        return hash % 1013;
    }


    this.put = function(key, value) {
        let position = djb2HashCode( key );
        table[position] = value;
    };


    this.get = function (key) {
        return table[djb2HashCode(key)];
    };


    this.remove = function(key) {
         table[djb2HashCode(key)] = undefined;
    };
}

module.exports = HashTable;
