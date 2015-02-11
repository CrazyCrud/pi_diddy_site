var animation_welcome_timeout = false;
var animation_welcome = function(){
    if(animation_welcome_timeout)clearTimeout(animation_welcome_timeout);
    $("#welcome").removeClass("wiggle-in");
    $("#welcome").removeClass("wiggle-out");

    $("#welcome").addClass("wiggle-in");
    animation_welcome_timeout = setTimeout(function(){
        $("#welcome").removeClass("wiggle-in");
        $("#welcome").addClass("wiggle-out");
        animation_welcome_timeout = setTimeout(function(){
            $("#welcome").removeClass("wiggle-out");
        }, 200);
    }, 200);
};

var animation_previews = function(){

};

var animation_list = function(){

};

var Animation = {

    currentState: "",
    animations: {
        "CLOSEST": function(){},
        "CLOSE": animation_list,
        "FAR": animation_previews,
        "FAREST": animation_welcome
    },

    onKinect: function(event, data){
        var state = data.section;
        if(Animation.currentState != state){
            Animation.onStateChanged(state);
            Animation.currentState = state;
        }
    },

    onStateChanged: function(state){
        Animation.resetAnimations();
        if(Animation.animations[state]){
            Animation.animate(Animation.animations[state]);
        }
    },

    resetAnimations: function(){

    },

    animate: function(animation){
        animation();
    },

    init: function(){
        $(document).on("newDistance", Animation.onKinect);
    }

};

$(Animation.init);