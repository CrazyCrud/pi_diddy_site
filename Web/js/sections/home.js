var Home = (function(){
	var that = this;
	_elements = {
		html: $("html")
	};

	var init = function(){
		$(document).on("newDistance", function(event, data){
			data.closestDistance;
			data.numberOfPeople;
			data.section;
			switch(data.section){
				case "CLOSEST":
					break;
				case "ClOSE":
					break;
				case "FAR":
					break;
				case "FAREST":
					break;
				case -1:
					break;
			}
		});
	};

	return {
		init: init
	};
})();

Home.init();