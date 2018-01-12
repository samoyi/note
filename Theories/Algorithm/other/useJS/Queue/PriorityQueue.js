function PriorityQueue(){
	let items = [];

	function QueueElement (element, priority){
		this.element = element;
		this.priority = priority;
	}

	this.enqueue = function(element, priority){
		let queueElement = new QueueElement(element, priority);

		if (this.isEmpty()){
			items.push(queueElement);
		}
		else{
			let added = false;
			for (let i=0; i<items.length; i++){
				if (queueElement.priority > items[i].priority){
					if( i===0 ){
						items.unshift(queueElement);
					}
					else{
						items.splice(i,0,queueElement);
					}
					added = true;
					break;
				}
			}
			if (!added){
				items.push(queueElement);
			}
		}
	};

	this.dequeue = function(){
		return items.shift();
	};

	this.front = function(){
		return items[0];
	};

	this.isEmpty = function(){
		return items.length === 0;
	};

	this.size = function(){
		return items.length;
	};

	this.clear = function(){
		items = [];
	};

	this.priority = function(index){
		return items[index].priority;
	};

	this.print = function(){
		console.log( items.map(item=>item.element).toString() );
	};
}

module.exports = PriorityQueue;
