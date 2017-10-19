'use strict';

function Stack(){
	let items = [];

	this.push = function(el){
		items.push( el );
	};

	this.pop = function(){
		return items.pop();
	};

	this.peek = function(){
		return items[items.length-1];
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

	this.print = function(){
	    console.log(items.toString());
	};
}

module.exports = Stack;
