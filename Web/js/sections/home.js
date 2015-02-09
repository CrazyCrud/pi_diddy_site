var Home = (function(){
	var that = this,
	_maxDistance = 4.0,
	_xRange = [2.2, -2.2],
	_scrollSpeed = 100,
	_resetTime = 5000,
	_elements = {
		html: $("html"),
		body: $("body"),
		index: $(".index"),
		movingElement: $("#moving-element")
	};

	var init = function(){
		$(document).on("newDistance", onKinect);
	},
	onKinect = function(event, data){
		console.log(data);
		switch(data.section){
			case "CLOSEST":
				clearStates();
				_elements.index.addClass('change-to-state-4');
				break;
			case "CLOSE":
				clearStates();
				_elements.inedx.addClass('change-to-state-3');
				break;
			case "FAR":
				clearStates();
				_elements.index.addClass('change-to-state-2');
				break;
			case "FAREST":
				clearStates();
				_elements.index.addClass('change-to-state-1');
				visualizeMovement(data.xPosition);
				break;
			default:
				noSkeleton();
		}
	},
	clearStates = function(){
		_elements.index.attr("class", "index");
	},
	visualizeMovement = function(xPosition){
		var newPosition = (((_elements.index.width(0) / 2) / _xRange[0]) * xPosition) + Math.round(_elements.index.width(0) / 2);
		_elements.movingElement.stop(true);
		_elements.movingElement.animate({
			'left': newPosition + 'px'
			},
			200, function() {
					
		});
	},
	checkForClick = function(){
		if(false){
			clearStates();
		}
	},
	noSkeleton = function(){
		_elements.movingElement.css({
			'left': '-30px'
		});
		var delay = _.bind(checkForClick);
		_.delay(delay, _resetTime);
	};

	return {
		init: init
	};
})();

Home.init();