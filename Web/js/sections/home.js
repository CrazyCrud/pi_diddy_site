var Home = (function(){
	var that = this,
	_maxDistance = 4.0,
	_scrollSpeed = 100,
	_elements = {
		html: $("html"),
		body: $("body"),
		index: $(".index")
	};

	var init = function(){
		$(document).on("newDistance", onKinect);
	},
	onKinect = function(event, data){
		console.log(data);
		clearStates();
		switch(data.section){
			case "CLOSEST":
				_elements.index.addClass('change-to-state-4');
				break;
			case "CLOSE":
				_elements.index.addClass('change-to-state-3');
				break;
			case "FAR":
				_elements.index.addClass('change-to-state-2');
				break;
			case "FAREST":
				_elements.index.addClass('change-to-state-1');
				break;
		}
	},
	clearStates = function(){
		_elements.index.attr("class", "index");
	};

	return {
		init: init
	};
})();

Home.init();