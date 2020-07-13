const stackSize = (stack)=>{
  return stack.items.length;
};

class Stack {
  constructor(){
    this.items = [];
  }

  push (el) {
    return this.items.push(el);
  }

  pop () {
    return this.items.pop();
  }

  peek () {
    return this.items[stackSize(this) - 1];
  }

  isEmpty () {
    return stackSize(this) === 0;
  }

  size () {
    return stackSize(this);
  }

  clear () {
    this.items = [];
  }

  print () {
    console.log(this.items.toString());
  }
}

module.exports = Stack