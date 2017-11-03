

'use strict';

function countDown(node){
    var end= new Date('2017/11/14 00:00:00'),
    timer = setInterval(getRTime, 1000);
    function getRTime(){
        var seconds = end.getTime() - (new Date()).getTime(),
        display = '0天 0小时 0分 0秒';

        if( seconds>0 ){
            var d = Math.floor(seconds/1000/60/60/24),
            h = Math.floor(seconds/1000/60/60%24),
            m = Math.floor(seconds/1000/60%60),
            s = Math.floor(seconds/1000%60);
            display = d +'天 '+ h +'小时 '+ m + '分 '+ s + '秒'
        }
        else{
            clearInterval(timer);
        }

        node.textContent = display;
    }
}
