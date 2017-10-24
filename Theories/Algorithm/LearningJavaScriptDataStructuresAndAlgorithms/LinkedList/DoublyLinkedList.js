function LinkedList() {

    let Node = function(element){
        this.element = element;
        this.next = null;
        this.prev = null;
    };

    let length = 0,
        head = null,
        tail = null;

    this.append = function(element){
        var node = new Node(element),
            current = null;

        if (head === null){
            head = node;
            tail = node;
        }
        else {
            tail.next = node;
            node.prev = tail;
            tail = node;
        }
        length++;
    };


    this.removeAt = function(position){
        if (position > -1 && position < length){
            let current = head,
                previous = null,
                index = 0;

            if (position === 0){
                head = current.next;
                if( 1===length){
                    tail = null;
                }
                else{
                    head.prev = null;
                }
            }
            else if(position === length-1){
                current = tail;
                tail = tail.prev;
                tail.next = null;
            }
            else {
                while (index++ < position){
                    previous = current;
                    current = current.next;
                }
                previous.next = current.next;
                current.next.prev = previous;
            }
            length--;
            return current.element;
        }
        else {
            return null;
        }
    };


    this.insert = function(position, element){
        if(position>-1 && position<=length){
            let node = new Node(element),
                current = head,
                previous = null,
                index = 0;

            if(position){
                while( index++ !== position ){
                    previous = current;
                    current = current.next;
                }
                previous.next = node;
                if( current ){
                    current.prev = node
                }
                else{ // 添加到最后
                    tail = node;
                }
                node.prev = previous;
                node.next = current;
            }
            else{
                if(head){
                    node.next = current;
                    current.prev = node;
                    head = node;
                }
                else{
                    head = node;
                    tail = node;
                }
            }
            length++;
            return true;
        }
        else{
            return false;
        }
    };


    this.indexOf = function(element){
        let current = head,
            index = -1;
        while(current){
            index++;
            if(current.element === element){
                return index;
            }
            current = current.next;
        }
        return -1;
    };


    this.remove = function(element){
        return this.removeAt( this.indexOf(element) );
    };


    this.isEmpty = function() {
        return length === 0;
    };


    this.size = function() {
        return length;
    };


    this.getHead = function(){
        return head;
    };


    this.getTail = function(){
        return tail;
    };


    this.reverse = function(){
        if(length>1){
            let current = head,
                aEle = [],
                index = -1;
            while(current){
                aEle.push(current.element);
                index++;
                current = current.next;
            }

            current = head;
            while(current){
                current.element = aEle[index--];
                current = current.next;
            }
        }
    };


    this.toString = function(){
        let current = head,
            string = '';

        while (current) {
            string += "," + current.element;
            current = current.next;
        }
        return string.slice(1);
    };


    this.print = function(){
        console.log( this.toString() );
    };
}


module.exports = LinkedList;
