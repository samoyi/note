// 检查括号是否匹配

'use strict';

const Stack = require('./Stack');

const OPENS = ['(', '[', '{'];
const CLOSERS = [')', ']', '}'];

function matches(open, close){
    let index1 = OPENS.indexOf(open);
    let index2 = CLOSERS.indexOf(close);
    return index1 === index2 && index1 !== -1;
}

function parenthesesChecker(symbols){

    // filter all parentheses in symbols, and record their index in symbols
    let aParenthesisIndex = []; // 每个括号在检测字符串中的 index
    let bIsParenthesis = false;
    let parentheses = [...symbols].filter((char, index)=>{
        bIsParenthesis = [...OPENS, ...CLOSERS].includes(char);
        if( bIsParenthesis ){
            aParenthesisIndex.push(index);
        }
        return bIsParenthesis;
    }).join('');

    let stack = new Stack()
    let balanced = true;
    let index = 0;
    let symbol = null;
    let top = null;
    while (index < parentheses.length && balanced){
        symbol = parentheses[index];
        // 正括号推栈，等待匹配的括号出现使其被弹出
        if (OPENS.includes(symbol)) {
            stack.push(symbol);
        }
        else { // 反括号
            if (stack.isEmpty()){ // 第一个括号就是反括号
                balanced = false;
            }
            else {
                top = stack.pop();
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
    return [false, aParenthesisIndex[stack.size()-1], stack.peek()];
}

console.log(parenthesesChecker('4[(){}')); // [false, 1, "["]
console.log(parenthesesChecker('gs{fs{([we][swe])}(addsf)}')); // [true, -1, ""]
console.log(parenthesesChecker('4444[{(){}')); // [false, 5, "{"]
console.log(parenthesesChecker('2121[343[((544')); // [false, 10, "("]