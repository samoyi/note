function CircularLinkedList() {

    let Node = function(element){
        this.element = element;
        this.next = null;
    };

    let length = 0,
        head = null;

    this.append = function(element){
        let node = new Node(element),
            current = head;

        if (null === head){
            head = node;
        }
        else {
            while(current.next!==head){
                current = current.next;
            }
            current.next = node;
        }
        node.next = head;
        length++;
    };


    this.removeAt = function(position){
        if (position > -1 && position < length){
            let current = head,
                previous = null,
                index = 0;

            if (position){

                while (index++ < position){
                    previous = current;
                    current = current.next;
                }
                previous.next = current.next;
            }
            else {
                while(current.next !== head){
                    current = current.next;
                }
                head = head.next;
                current.next = head;
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
                while(current.next!==head){
                    current = current.next;
                }
                current.next = node;
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
        while(current.next !== head){
            index++;
            if(current.element === element){
                return index;
            }
            current = current.next;
        }
        if( current.element === element ){
            return ++index;
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
            let current = head,
                aEle = [],
                index = 0;
            while(current.next !==head){
                aEle.push(current.element);
                index++;
                current = current.next;
            }
            aEle.push(current.element);

            current = head;
            while(current.next !==head){
                current.element = aEle[index--];
                current = current.next;
            }
            current.element = aEle[0];
        }
    };


    this.toString = function(){
        if(!head) return '';

        let current = head,
            string = head.element;

        while (current.next !== head) {
            current = current.next;
            string += "," + current.element;
        }
        return string.toString();
    };


    this.print = function(){
        console.log( this.toString() );
    };
}


module.exports = CircularLinkedList;
