var Animation = {

    ANIMATION_DURATION: 500,
    MIN: 0,
    MAX: 100,

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
        if(element.animation){
            var pos = element.animation(Animation.MIN);
        }else{
            var length = element.frames.length;
            if(length == 0)return;
            var pos = [
                element.frames[0][0],
                element.frames[0][1]
            ];
        }
        // animate to currenct position
        $("#"+element.id).animate({
            "left": pos[0],
            "top": pos[1]
        }, Animation.ANIMATION_DURATION);
    },

    setToEnd: function(element){
        if(element.animation){
            var pos = element.animation(Animation.MAX);
        }else{
            var length = element.frames.length;
            if(length == 0)return;
            var pos = [
                element.frames[length-1][0],
                element.frames[length-1][1]
            ];
        }
        // animate to currenct position
        $("#"+element.id).animate({
            "left": pos[0],
            "top": pos[1]
        }, Animation.ANIMATION_DURATION);
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
            var pos = element.animation(Animation.MAX*percentage);
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
};

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
            var x = -0.0016768 *Math.pow(scroll-50, 4)+24;
            if(scroll > 60){
                var y = -0.334*Math.pow(scroll-60, 2)+180;
            }else{
                var y = 0.334*Math.pow(scroll-60, 2)+180;
            }
            return [x, y];
        }
    }
];

$(Animation.init);