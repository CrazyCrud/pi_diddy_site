var Animation = {

    ANIMATION_DURATION: 500,

    onScroll: function(){
        var scroll = $(document).scrollTop();
        Animation.animateOnScroll(scroll);
    },

    animateOnScroll: function(scroll){
        for(var i=0; i<Animation.elements.length; i++){
            var element = Animation.elements[i];
            // stop previous animation
            $("#"+element.id).stop(true, true);
            if(element.fromScroll>scroll){
                Animation.setToStart(element);
            }else if(element.toScroll<scroll){
                Animation.setToEnd(element);
            }else{
                Animation.animate(element, scroll);
            }
        }
    },

    setToStart: function(element){
        if(element.frames.length == 0)return;
        $("#"+element.id).css("left", element.frames[0][0]);
        $("#"+element.id).css("top", element.frames[0][1]);
    },

    setToEnd: function(element){
        var length = element.frames.length;
        if(length == 0)return;
        $("#"+element.id).css("left", element.frames[length-1][0]);
        $("#"+element.id).css("top", element.frames[length-1][1]);
    },

    animate: function(element, scroll){
        var frameCount = element.frames.length;
        if(frameCount<2){
            return setToEnd(element);
        }
        // calculate percentage of animation finished
        scroll -= element.fromScroll;
        var to = element.toScroll-element.fromScroll;
        var percentage = scroll/to;
        if(element.animation){
            var pos = element.animation(100*percentage);
            var x = pos[0];
            var y = pos[1];
        }else{
            // calculate percentage of frame finished
            var from = Math.floor(percentage*(frameCount-1));
            var to = from+1;
            var framePercentage = percentage*(frameCount-1)-from;
            // calculate current x and y
            var x = element.frames[from][0]*(1-framePercentage);
            var y = element.frames[from][1]*(1-framePercentage);
            x += element.frames[to][0]*framePercentage;
            y += element.frames[to][1]*framePercentage;
        }
        // animate to currenct position
        $("#"+element.id).animate({
            "left": x,
            "top": y
        }, Animation.ANIMATION_DURATION);
    },

    init: function(){
        $(document).scroll(Animation.onScroll);
        Animation.onScroll();
    }
}

Animation.elements = [
    {
        id: "welcome",
        fromScroll: 0,
        toScroll: 512,
        frames: [
            [120, 120],
            [768, -500]
        ],
        //optional
        /*
        animation: function(scroll){
            return [x, y];
        }
        */
    },
    {
        id: "info",
        fromScroll: 248,
        toScroll: 768,
        frames: [
            [-1024, 768],
            [0, 200],
            [24, 180],
            [-120, 0],
            [-768, -1024]
        ],
        animation: function(scroll){
            var x = Math.pow(scroll-.5, 4);
            var x = -x;
            var x = x+512;
            var y = 180;
            return [x, y];
        }
    }
];

$(Animation.init);