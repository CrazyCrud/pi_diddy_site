var KinectController = (function(){
	var that = this;
	this.sensor = null;
	this.streamImageWidth = 640;
    this.streamImageHeight = 480;
    this.streamImageResolution = streamImageWidth.toString() + "x" + streamImageHeight.toString();
    this.isSensorConnected = false;
    this.engagedUser = null;
    this.configuration = {
    	"interaction" : {
        	"enabled": true,
	    }, 
	    "userviewer" : {
	        "enabled": true,
	        "resolution": "640x480", //320x240, 160x120, 128x96, 80x60
	        "userColors": 
	        	{ 
	        		"engaged": 0xffffffff, "tracked": 0xffffffff 
	        	},
	        "defaultUserColor": 0xffffffff, //RGBA
	    },	 
	    "backgroundRemoval" : {
	        "enabled": false,
	        "resolution": "640x480",
	    },
	    "skeleton" : {
	        "enabled": true,
	    },
	    "sensorStatus" : {
	        "enabled": true,
	    }
    };
	this.users = {
		user1: $("#user-1"),
		user2: $("#user-2"),
		user3: $("#user-3"),
		user4: $("#user-4"),
		user5: $("#user-5"),
		user6: $("#user-6")
	};

	var init = function(){
		Kinect.connect("http://localhost", 8181);
		that.sensor = Kinect.sensor(Kinect.DEFAULT_SENSOR_NAME, function(sensorToConfig, isConnected){
			configError("Is sensor connceted: " + isConnected, null);
		});
		that.sensor.postConfig(that.configuration, configError);
		that.sensor.getConfig(function(configData){
			configError(configData, null);
		});
		that.sensor.addStreamFrameHandler(function(frame){
			configError(frame.stream, null);
			var skeletons = null;
			switch(frame.stream){
				case Kinect.SKELETON_STREAM_NAME:
					//resetUser();
					skeletons = new Array();
					for (var iSkeleton = 0; iSkeleton < frame.skeletons.length; ++iSkeleton) {
		                var skeleton = frame.skeletons[iSkeleton];
		                //skeleton.trackingId;
		                //skeleton.trackingState;
		                //skeleton.position;

		                for (var iJoint = 0; iJoint < skeleton.joints.length; ++iJoint) {
		                    var joint = skeleton.joints[iJoint];
		                    //joint.jointType;
		                    //joint.trackingState;
		                    //joint.position; 
		                }

		                if(skeleton.trackingId > 0){
		                	skeletons.push(parseFloat(skeleton.position.z));
		                }

		                //paintUser(skeleton, iSkeleton + 1);
		                configError(skeleton, null);
		            }
		            if(skeletons.length > 0){
		            	$(document).trigger("newDistances", { skeletons: skeletons});
		            }
		        break;
			}
		});
		that.sensor.addEventHandler(function (event) {
        	switch (event.category) {
		        // Respond to user state changes.
		        case Kinect.USERSTATE_EVENT_CATEGORY:
		            switch (event.eventType ) {
		                // This event signals a change to who the primary interacting user is.
		                case Kinect.PRIMARYUSERCHANGED_EVENT_TYPE:
		                    var oldUser = event.oldValue;
		                    var newUser = event.newValue; // trackingId
		                    break;
		                // This event signals a change to the states of the tracked users.
		                case Kinect.USERSTATECHANGED_EVENT_TYPE:
		                    var id = event.userStates[0].id;
		                    var userState = event.userStates[0].userState; // This is either "tracked" or "engaged".
		                    break;
		            };
		            break;
		        case Kinect.SENSORSTATUS_EVENT_CATEGORY:
		            if ( !event.connected)
		            {
		 
		            }
		            break;
		   		};
       	});
	},
	resetUser = function(){
		$(".active").removeClass('active');
	},
	paintUser = function(skeleton, id){
		/*console.log(that.users);
		if(skeleton.trackingId > 0){
			that.users["user" + id].addClass('active');
			that.users["user" + id].css('-webkit-transform', 'translateY(' + (parseFloat(skeleton.position.z) * 100) + 'px)');
		}else{
			that.users["user" + id].stop();
			that.users["user" + id].css('-webkit-transform', 'translateY(0)');
		}*/
		if(skeleton.trackingId > 0){
			$("body").stop(true, true);
			$("body").animate({"zoom": skeleton.position.z}, 250);
		}
	},
	onUserStatesChanged = function(newUserStates) {
        var newEngagedUser = findEngagedUser(newUserStates);
		updateUserState(newEngagedUser);
    },
    updateUserState = function(newEngagedUser) {
        var hasEngagedUser = that.engagedUser != null;
        var newHasEngagedUser = newEngagedUser != null;

        if(delayedConfigTimeoutId != null) {
            clearTimeout(delayedConfigTimeoutId);
            delayedConfigTimeoutId = null;
        }

        if ((that.isSensorConnected != newIsSensorConnected) || (that.engagedUser != newEngagedUser)) {
            if (newIsSensorConnected) {
                var immediateConfig = {};
                var delayedConfig = {};
                immediateConfig[Kinect.INTERACTION_STREAM_NAME] = { "enabled": true };
                immediateConfig[Kinect.USERVIEWER_STREAM_NAME] = { "resolution": that.streamImageResolution };
                immediateConfig[Kinect.BACKGROUNDREMOVAL_STREAM_NAME] = { "resolution": that.streamImageResolution };

                if (newHasEngagedUser) {
                    immediateConfig[Kinect.BACKGROUNDREMOVAL_STREAM_NAME].enabled = false;
                    immediateConfig[Kinect.BACKGROUNDREMOVAL_STREAM_NAME].trackingId = newEngagedUser;
                    delayedConfig[Kinect.USERVIEWER_STREAM_NAME] = { "enabled": false };
                } else {
                    immediateConfig[Kinect.USERVIEWER_STREAM_NAME].enabled = false;
                    if (hasEngagedUser) {
                        delayedConfig[Kinect.BACKGROUNDREMOVAL_STREAM_NAME] = { "enabled": false };
                    }
                }

                // Perform immediate configuration
                that.sensor.postConfig(immediateConfig, configError);

                // schedule delayed configuration for 2 seconds later
                if (!_.isEmpty(delayedConfig)) {
                    delayedConfigTimeoutId = setTimeout(function () {
                        that.sensor.postConfig(delayedConfig, configError);
                        delayedConfigTimeoutId = null;
                    }, 2000);
                }
            }
        }

        that.isSensorConnected = newIsSensorConnected;
        that.engagedUser = newEngagedUser;
    }
    findEngagedUser = function(userStates) {
        var engagedUserId = null;
        for (var i = 0; i < userStates.length; ++i) {
            var entry = userStates[i];
            if (entry.userState == "engaged") {
                engagedUserId = entry.id;
                break;
            }
        }
        return engagedUserId;
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