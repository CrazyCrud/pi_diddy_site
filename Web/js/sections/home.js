var Home = (function(){
	var that = this,
	_maxDistance = 4.0,
	_xRange = [2.2, -2.2],
	_scrollSpeed = 100,
	_resetTime = 3000,
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
			default:
				noSkeleton();
		}
	},
	clearStates = function(){
		_elements.index.attr("class", "index");
	},
	checkForClick = function(){
		if(false){
			clearStates();
		}
	},
	noSkeleton = function(){
		var delay = _.bind(checkForClick);
		_.delay(delay, _resetTime);
	};

	return {
		init: init
	};
})();

Home.init();