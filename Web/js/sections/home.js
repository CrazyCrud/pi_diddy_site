var Home = (function(){
	var that = this;
	this.elements = {
		html: $("html")
	};

	var init = function(){
		$(document).on("newDistances", function(event, data){
			data = data.skeletons;
			var shortestDistance = _.min(data),
			numberOfPeople = data.length;
			that.elements.html.html(numberOfPeople + " people in the house and with safe distance of " + shortestDistance);
		});
	};

	return {
		init: init
	};
})();

Home.init();