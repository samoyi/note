// 不用再重新实现集合，直接用 ES6 的 Set
// Operator 类就是直接用 ES6 的 Set 来实现集合的一些操作


function Operator(){

    this.union = function(set1, set2){
        return new Set( [...set1, ...set2] );
    };


    this.intersection = function(set1, set2){
        let intersection = new Set();
        for(let val of set1){
            if(set2.has(val) ){
                intersection.add(val);
            }
        }
        return intersection;
    };


    this.difference = function(set1, set2){
        let difference = new Set();
        for(let val of set1){
            if(!set2.has(val) ){
                difference.add(val);;
            }
        }
        return difference;
    };


    this.subset = function(subset, superset){
        if(subset.size > superset.size) return false;
        return [...subset].every(function(item){
            return superset.has(item);
        });
    }
}

module.exports = Operator;
