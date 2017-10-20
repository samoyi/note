function LinkedList() {

    let Node = function(element){
        this.element = element;
        this.next = null;
    };

    let length = 0;
    let head = null;

    this.append = function(element){
        var node = new Node(element),
            current;

        if (head === null){
            head = node;
        }
        else {
            current = head;
            while(current.next!==null){
                current = current.next;
            }
            current.next = node;
        }
        length++;
    };

    this.removeAt = function(position){
        //检查越界值
        if (position > -1 && position < length){ // {1}
            let current = head, // {2}
                previous, // {3}
                index = 0; // {4}

            //移除第一项
            if (position === 0){ // {5}
                head = current.next;
            }
            else {
                while (index++ < position){ // {6}
                    previous = current;     // {7}
                    current = current.next; // {8}
                }

                //将previous与current的下一项链接起来：跳过current，从而移除它
                previous.next = current.next; // {9}
            }

            length--; // {10}

            return current.element;

        }
        else {
            return null; // {11}
        }
    };

    this.insert = function(position, element){};
    this.remove = function(element){};
    this.indexOf = function(element){};
    this.isEmpty = function() {};
    this.size = function() {};
    this.toString = function(){};
    this.print = function(){};
}
