'use strict';

function Clock(el, fps){

	//private
	
	var id = null,
		t0 = performance.now(),
		tD = 1000 / fps;//delay [ms] between a frame to the next

	function ticks(t){
		id = requestAnimationFrame(ticks);
		if(t - t0 > tD){
			t0 = t;//now becomes past
			var ev = new Event('ticks');
			el.dispatchEvent(ev);//ticks the element
		}
	}
		
	//public
	
	this.start = function(){
		if(!id)
			ticks();
	};

	this.stop = function(){
		if(id){
			cancelAnimationFrame(id);
			id = null;
		}
	};
}