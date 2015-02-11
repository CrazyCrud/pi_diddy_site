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
		back: $(".back"),
		movingElement: $("#moving-element")
	};

	var init = function(){
		$(document).on("newDistance", onKinect);
		_elements.back.click(function(event) {
			changeToState(3);
		});
	},
	onKinect = function(event, data){
		console.log(data);
		switch(data.section){
			case "CLOSEST":
				changeToState(4);
				break;
			case "CLOSE":
				changeToState(3);
				break;
			case "FAR":
				changeToState(2);
				break;
			case "FAREST":
				changeToState(1);
				visualizeMovement(data.xPosition);
				break;
			default:
				noSkeleton();
		}
	},
	changeToState = function(state){
		if(_.isNaN(state) || state < 1){
			return;
		}else{
			_elements.index.attr("class", "index");
			_elements.index.addClass('change-to-state-' + state);
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
		init: init,
		changeToState: changeToState,
		clearStates: clearStates,
		elements: _elements
	};
})();

Home.init();