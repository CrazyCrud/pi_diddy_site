var Kinectcontroller = {

	SCROLLSPEED: 100,
	MAX_DISTANCE: 4,

	init: function(){
		$(document).on("newDistance", Kinectcontroller.onKinect);
	},

	onKinect: function(event, data){
		var distance = data.closestDistance;
		var height = $(document).height();
		var percentage = distance/MAX_DISTANCE;
		var scrollposition = percentage*height;
		$(document).animate({"scrollTop": scrollposition}, Kinectcontroller.SCROLLSPEED);
	}

};

$(Kinectcontroller.init);