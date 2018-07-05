// 有优先级的队列（可以根据优先级插队）


function PriorityQueue(){
	let items = [];

	// 优先级元素构造函数，包括元素值和优先级
	function QueueElement (element, priority){
		this.element = element;
		this.priority = priority;
	}

	this.enqueue = function(element, priority){
		let queueElement = new QueueElement(element, priority);

		if (this.isEmpty()){
			return items.push(queueElement);
		}
		else{
			let added = false;
			for (let i=0; i<items.length; i++){
				if (queueElement.priority > items[i].priority){
					items.splice(i, 0, queueElement);
					added = true;
					return items.length + 1;
				}
			}
			return items.push(queueElement);
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
