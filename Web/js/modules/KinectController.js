var KinectController = (function(){
	var that = this,
		_sensor = null,
		_streamImageWidth = 640,
    	_streamImageHeight = 480,
    	_streamImageResolution = _streamImageWidth.toString() + "x" + _streamImageHeight.toString(),
    	_isSensorConnected = false,
    	_engagedUser = null,
    	_primaryUser = null,
    	_frameRate = 200,
    	_distances = ["ClOSEST", "CLOSE", "FAR", "FARTHEST"],
    	_configuration = {
	    	"interaction" : {
	        	"enabled": false,
		    }, 
		    "userviewer" : {
		        "enabled": false,
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
	    },
	    _elements = {

	    };

	var init = function(){
		Kinect.connect("http://localhost", 8181);
		_sensor = Kinect.sensor(Kinect.DEFAULT_SENSOR_NAME, function(sensorToConfig, isConnected){
			configError("Is sensor connceted: " + isConnected, null);
		});
		_sensor.postConfig(_configuration, configError);
		_sensor.getConfig(function(configData){
			configError("Configuration data: " + configData, null);
		});

		var lazySkeletonFrame = _.throttle(onNewSkeletonFrame, _frameRate);

		_sensor.addStreamFrameHandler(function(frame){
			switch(frame.stream){
				case Kinect.SKELETON_STREAM_NAME:
					lazySkeletonFrame(frame);
		        	break;
			}
		});
		_sensor.addEventHandler(function (event) {
        	switch (event.category) {
		        case Kinect.USERSTATE_EVENT_CATEGORY:
		            switch (event.eventType) {
		                case Kinect.PRIMARYUSERCHANGED_EVENT_TYPE:
		                    var oldUser = event.oldValue;
		                    _primaryUser = event.newValue; // trackingId
		                    break;
		                case Kinect.USERSTATECHANGED_EVENT_TYPE:
		                	onUserStatesChanged(event.userStates);
		                    //var id = event.userStates[0].id;
		                    //var userState = event.userStates[0].userState; // This is either "tracked" or "engaged".
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
	onNewSkeletonFrame = function(frame){
		var skeletons = new Array();
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
            configError("Skeleton data: " + skeleton, null);
        }
        notify(skeletons);
	},
	onUserStatesChanged = function(newUserStates) {
        var newEngagedUser = findEngagedUser(newUserStates);
		updateUserState(newEngagedUser);
    },
    updateUserState = function(newEngagedUser) {
        var hasEngagedUser = _engagedUser != null;
        var newHasEngagedUser = newEngagedUser != null;

        if(delayedConfigTimeoutId != null) {
            clearTimeout(delayedConfigTimeoutId);
            delayedConfigTimeoutId = null;
        }
        if (_engagedUser != newEngagedUser) {
            if (_isSensorConnected) {
            	/*
                var immediateConfig = {};
                var delayedConfig = {};
                immediateConfig[Kinect.INTERACTION_STREAM_NAME] = { "enabled": true };
                immediateConfig[Kinect.USERVIEWER_STREAM_NAME] = { "resolution": _streamImageResolution };
                immediateConfig[Kinect.BACKGROUNDREMOVAL_STREAM_NAME] = { "resolution": _streamImageResolution };

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

                _sensor.postConfig(immediateConfig, configError);

                if (!_.isEmpty(delayedConfig)) {
                    delayedConfigTimeoutId = setTimeout(function () {
                        _sensor.postConfig(delayedConfig, configError);
                        delayedConfigTimeoutId = null;
                    }, 2000);
                }
                */
            }
        }

        _engagedUser = newEngagedUser;
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
    notify = function(skeletons){
    	output = {
    		closestDistance: -1,
    		section: -1,
    		numberOfPeople: -1
    	};
    	if(skeletons.length > 0){
    		output.closestDistance = parseFloat(Math.round(_.min(skeletons)));
    		output.section = _distances[output.closestDistance];
    		output.numberOfPeople = skeletons.length;
        }
        $(document).trigger("newDistance", output);
        console.log("Trigger output");
    },
	configError = function(statusText, errorData) {
        console.log((errorData !== null) ? JSON.stringify(errorData) : statusText);
    },
    getSensor = function(){
    	return _sensor;
    };
	return {
		init: init,
		getSensor: getSensor
	};
})()

KinectController.init();