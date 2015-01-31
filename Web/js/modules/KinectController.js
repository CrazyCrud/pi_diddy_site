var KinectController = (function(){
	var that = this;
	this.sensor = null;
	this.elements = {
		html: $("html")
	};

	var init = function(){
		// Kinect.connect("http://localhost", 8181);
		that.sensor = Kinect.sensor();
	},
	configError = function(statusText, errorData) {
        console.log((errorData !== null) ? JSON.stringify(errorData) : statusText);
    };

	return {
		init: init,
		sensor: this.sensor
	};
})();

KinectController.init();