
let a = [5, 3, 2, 8, 7, 4, 9, 1, 6];

let oComp = {};

function bubble(a){
    let len = a.length,
        index = len;
    while(index--){
        for(let i=0; i<len-1; i++){
            // console.log(a[i], a[i+1]);
            if(oComp[a[i]]){
                oComp[a[i]].push(a[i+1]);
            }
            else{
                oComp[a[i]] = [];
            }
            if( a[i]>a[i+1] ){
                a.splice(i+1, 0, a.splice(i,1)[0] );
            }
        }
    }
    return a;
}

// bubble(a);
console.log( bubble(a) );

console.log(oComp)
