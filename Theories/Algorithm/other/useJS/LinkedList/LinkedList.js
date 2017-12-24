function LinkedList() {

    let Node = function(element){
        this.element = element;
        this.next = null;
    };

    let length = 0,
        head = null;

    this.append = function(element){
        let node = new Node(element),
            current = null;

        if (null === head){
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
        if (position > -1 && position < length){
            let current = head,
                previous = null,
                index = 0;

            if (position === 0){
                head = current.next;
            }
            else {
                while (index++ < position){
                    previous = current;
                    current = current.next;
                }
                previous.next = current.next;
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
                node.next = current;
            }
            else{
                node.next = current;
                head = node;
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


    this.reverse = function(){
        if(length>1){
            let previous = head,
                current = head.next,
                next = null;
            previous.next = null;

            while(current){
                next = current.next;
                current.next = previous;
                previous = current;
                current = next;
            }
            head = previous;
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
