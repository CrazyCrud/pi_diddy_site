var Home = (function(){
	var that = this,
	_maxDistance = 4.0,
	_xRange = [2.2, -2.2],
	_scrollSpeed = 100,
	_resetTime = 5000,
	_resetId = -1,
	_elements = {
		html: $("html"),
		body: $("body"),
		index: $(".index"),
		back: $(".back"),
		movingElement: $("#moving-element"),
		qr: $("#generate-qr")
	};

	var init = function(){
		$(document).foundation();
		$(document).on("newDistance", onKinect);
		_elements.back.click(function(event) {
			changeToState(3);
		});
		_elements.qr.click(function(event) {
			FileWriter.write({
                qr: 1
            });
		});
		_elements.html.click(function(event) {
			clearTimer();
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
	clearTimer = function(){
		if(_resetId > 0){
			window.clearTimeout(_resetId);
			_resetId = -1;
		}
	},
	noSkeleton = function(){
		_.resetId = window.setTimeout(clearStates, _resetTime);
	};

	return {
		init: init,
		changeToState: changeToState,
		clearStates: clearStates,
		elements: _elements
	};
})();

Home.init();