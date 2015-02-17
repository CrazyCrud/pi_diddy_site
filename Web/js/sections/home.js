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
		forward: $(".forward"),
		movingElement: $("#moving-element"),
		qr: $("#generate-qr")
	};

	var init = function(){
		$(document).foundation();
		_elements.body.on({
		    'mousewheel': function(e) {
		        if (e.target.id == 'el'){
		        	return;
		        }
		        e.preventDefault();
		        e.stopPropagation();
		    }
		});
		$(document).on("newDistance", onKinect);
		_elements.back.click(function(event) {
			var stateDOM = $(this).parents("div[class^='state']");
			var currentState = parseInt(stateDOM.attr('class').replace(/state-/i, ""));
			changeToState(currentState - 1);
		});
		_elements.forward.click(function(event) {
			var stateDOM = $(this).parents("div[class^='state']");
			var currentState = parseInt(stateDOM.attr('class').replace(/state-/i, ""));
			changeToState(currentState + 1);
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
		var isInteractive = _elements.index.hasClass('interactive');
		switch(data.section){
			case "CLOSEST":
				if(isInteractive){
					changeToState(4);
				}
				break;
			case "CLOSE":
				if(isInteractive){
					changeToState(3);
				}
				break;
			case "FAR":
				if(isInteractive){
					changeToState(2);
				}
				break;
			case "FAREST":
				if(isInteractive){
					changeToState(1);
				}
				break;
			default:
				noSkeleton();
		}
	},
	changeToState = function(state){
		if(_.isNaN(state) || state < 1){
			return;
		}else{
			if(_elements.index.hasClass('interactive')){
				_elements.index.attr("class", "index interactive" + " change-to-state-" + state);
			}else{
				_elements.index.attr("class", "index" + " change-to-state-" + state);
			}
		}
	},
	clearStates = function(){
		if(_elements.index.hasClass('interactive')){
			_elements.index.attr("class", "index interactive");
		}else{
			_elements.index.attr("class", "index");
		}
	},
	clearTimer = function(){
		if(_resetId > 0){
			window.clearTimeout(_resetId);
			_resetId = -1;
		}
	},
	noSkeleton = function(){
		_.resetId = window.setTimeout(clearStates, _resetTime);
	},
	changeInteractivity = function(){
		if(_elements.index.hasClass('interactive')){
			window.location.href = "index.php";
		}else{
			window.location.href = "index.php?interactive=true";
		}
	};

	return {
		init: init,
		changeToState: changeToState,
		clearStates: clearStates,
		changeInteractivity: changeInteractivity,
		elements: _elements
	};
})();

Home.init();