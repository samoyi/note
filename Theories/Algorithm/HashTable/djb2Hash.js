function geneDjb2HashFn(modNum){
   return function (key) {
       let hash = 5381;
       let chars = [...key];
       let len = chars.length;

       for (let i = 0; i < len; i++) {
           hash = hash * 33 + chars[i].codePointAt(0);
       }
       return hash % modNum;
   }
}

module.exports = geneDjb2HashFn;