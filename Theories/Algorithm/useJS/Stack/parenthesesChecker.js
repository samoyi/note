'use strict';

const Stack = require('./Stack');


function matches(open, close){
    let opens = "([{",
        closers = ")]}";
    return opens.indexOf(open) === closers.indexOf(close);
}

function parenthesesChecker(symbols){

    // filter all parentheses in symbols, and record their index in symbols
    let aParenthesisIndex = [],
        bIsParenthesis = false;
    let parentheses = [...symbols].filter((char, index)=>{
        bIsParenthesis = '()[]{}'.includes(char);
        if( bIsParenthesis ){
            aParenthesisIndex.push(index);
        }
        return bIsParenthesis;
    }).join('');


    let stack = new Stack(),
        balanced = true,
        index = 0,
        // nTopIndex是栈顶的括号在parentheses中的序号。如果所有括号都匹配，栈会被
        // 清空。如果最终没有清空，则栈顶元素就是首个没有匹配的括号。
        nTopIndex = -1,
        symbol, top;

    while (index < parentheses.length && balanced){
        symbol = parentheses.charAt(index);
        // 正括号推栈，等待匹配的括号出现使其被弹出
        if (symbol==='(' || symbol==='[' || symbol==='{'){
            stack.push(symbol);
            nTopIndex++;
        }
        else { // 反括号
            if (stack.isEmpty()){ // 第一个括号就是反括号
                balanced = false;
            }
            else {
                top = stack.pop();
                nTopIndex--;
                if (!matches(top, symbol)){
                    balanced = false;
                }
            }
        }
        index++;
    }
    if (balanced && stack.isEmpty()){
        return [true, -1, ''];
    }
    return [false, aParenthesisIndex[nTopIndex], stack.peek()];
}

console.log(parenthesesChecker('gs{fs{([we][swe])}(addsf)}')); // [true, -1, ""]
console.log(parenthesesChecker('4444[{(){}')); // [false, 5, "{"]
console.log(parenthesesChecker('2121[343[((544')); // [false, 10, "("]
